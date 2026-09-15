import { pool } from '../config/db';
import { Order, OrderItem, CartItem } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class OrderService {
  /**
   * Creates an order, its items, and payment record atomically in MySQL database
   */
  static async createOrderWithPayment(data: {
    userId: number | null;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    totalAmount: number;
    shippingAddress: any;
    cartItems: CartItem[];
  }): Promise<Order> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Insert into orders table
      const [orderResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO orders (user_id, razorpay_order_id, total_amount, status, shipping_address) 
         VALUES (?, ?, ?, 'PAID', ?)`,
        [
          data.userId || null,
          data.razorpayOrderId,
          data.totalAmount,
          JSON.stringify(data.shippingAddress)
        ]
      );

      const orderId = orderResult.insertId;

      // 2. Insert into order_items table
      for (const item of data.cartItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product.id, item.quantity, item.product.price]
        );
      }

      // 3. Insert into payments table
      await connection.execute(
        `INSERT INTO payments (order_id, razorpay_payment_id, razorpay_signature, status, amount) 
         VALUES (?, ?, ?, 'CAPTURED', ?)`,
        [orderId, data.razorpayPaymentId, data.razorpaySignature, data.totalAmount]
      );

      await connection.commit();

      return {
        id: orderId,
        user_id: data.userId,
        razorpay_order_id: data.razorpayOrderId,
        total_amount: data.totalAmount,
        status: 'PAID',
        shipping_address: data.shippingAddress
      };
    } catch (error) {
      await connection.rollback();
      console.error('Database transaction error in createOrderWithPayment:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Fetch order history for a logged-in user
   */
  static async getUserOrders(userId: number): Promise<Order[]> {
    try {
      const [orderRows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );

      const orders: Order[] = [];

      for (const row of orderRows) {
        const [itemRows] = await pool.execute<RowDataPacket[]>(
          `SELECT oi.*, p.name as product_name, p.image_url as product_image 
           FROM order_items oi 
           JOIN products p ON oi.product_id = p.id 
           WHERE oi.order_id = ?`,
          [row.id]
        );

        let parsedAddress = row.shipping_address;
        if (typeof parsedAddress === 'string') {
          try { parsedAddress = JSON.parse(parsedAddress); } catch (e) {}
        }

        orders.push({
          id: row.id,
          user_id: row.user_id,
          razorpay_order_id: row.razorpay_order_id,
          total_amount: Number(row.total_amount),
          status: row.status,
          shipping_address: parsedAddress,
          created_at: row.created_at,
          items: itemRows as OrderItem[]
        });
      }

      return orders;
    } catch (error) {
      console.warn('Error fetching user orders from MySQL:', error);
      return [];
    }
  }

  /**
   * Get single order details by order ID
   */
  static async getOrderDetails(orderId: number, userId?: number): Promise<Order | null> {
    try {
      let sql = 'SELECT * FROM orders WHERE id = ?';
      const params: any[] = [orderId];

      if (userId) {
        sql += ' AND user_id = ?';
        params.push(userId);
      }

      const [rows] = await pool.execute<RowDataPacket[]>(sql, params);
      if (rows.length === 0) return null;

      const row = rows[0];

      const [itemRows] = await pool.execute<RowDataPacket[]>(
        `SELECT oi.*, p.name as product_name, p.image_url as product_image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [row.id]
      );

      let parsedAddress = row.shipping_address;
      if (typeof parsedAddress === 'string') {
        try { parsedAddress = JSON.parse(parsedAddress); } catch (e) {}
      }

      return {
        id: row.id,
        user_id: row.user_id,
        razorpay_order_id: row.razorpay_order_id,
        total_amount: Number(row.total_amount),
        status: row.status,
        shipping_address: parsedAddress,
        created_at: row.created_at,
        items: itemRows as OrderItem[]
      };
    } catch (error) {
      console.warn('Error getting order details:', error);
      return null;
    }
  }
}
