import { Router } from 'express';
import { OrderService } from '../services/orderService';
import { CartService } from '../services/cartService';

const router = Router();

// GET /orders - User Order History Page
router.get('/orders', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const orders = await OrderService.getUserOrders(req.session.user.id);
    const cartSummary = await CartService.resolveSessionCart(req.session.cartItems || []);

    res.render('orders', {
      orders,
      cartSummary,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).send('Error fetching order history');
  }
});

// GET /orders/:id - Single Order View
router.get('/orders/:id', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const orderId = Number(req.params.id);
  if (isNaN(orderId)) {
    return res.status(404).send('Invalid order ID');
  }

  try {
    const order = await OrderService.getOrderDetails(orderId, req.session.user.id);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    const cartSummary = await CartService.resolveSessionCart(req.session.cartItems || []);

    res.render('order-detail', {
      order,
      cartSummary,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).send('Error fetching order details');
  }
});

export default router;
