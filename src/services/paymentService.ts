import crypto from 'crypto';
import { razorpayInstance, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } from '../config/razorpay';
import { pool } from '../config/db';

export class PaymentService {
  /**
   * Creates a Razorpay order in paise
   */
  static async createRazorpayOrder(amountInRupees: number, receipt?: string) {
    // Convert to paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(amountInRupees * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `nx_rcpt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  }

  /**
   * Verifies payment signature returned by Razorpay Checkout
   */
  static verifyPaymentSignature(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): boolean {
    const body = data.razorpay_order_id + '|' + data.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === data.razorpay_signature;
  }

  /**
   * Verifies and processes Razorpay Webhook using raw request body
   */
  static async handleWebhook(rawBody: string | Buffer, signature: string): Promise<{ success: boolean; event?: string }> {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      throw new Error('RAZORPAY_WEBHOOK_SECRET environment variable is not configured');
    }

    const payload = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isAuthentic) {
      return { success: false };
    }

    const event = JSON.parse(payload);
    const eventType = event.event;

    console.log(`📌 Razorpay Webhook Received: ${eventType}`);

    // Update payment/order status in database based on event type
    try {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const paymentEntity = event.payload.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        const razorpayPaymentId = paymentEntity?.id;

        if (razorpayOrderId) {
          // Update order status to PAID
          await pool.execute(
            'UPDATE orders SET status = "PAID" WHERE razorpay_order_id = ?',
            [razorpayOrderId]
          );

          // Update payment status to CAPTURED
          if (razorpayPaymentId) {
            await pool.execute(
              'UPDATE payments SET status = "CAPTURED" WHERE razorpay_payment_id = ?',
              [razorpayPaymentId]
            );
          }
        }
      } else if (eventType === 'payment.failed') {
        const paymentEntity = event.payload.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;

        if (razorpayOrderId) {
          await pool.execute(
            'UPDATE orders SET status = "FAILED" WHERE razorpay_order_id = ?',
            [razorpayOrderId]
          );
        }
      }
    } catch (dbErr) {
      console.warn('Webhook DB update error (non-fatal):', dbErr);
    }

    return { success: true, event: eventType };
  }
}
