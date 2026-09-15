import { Router } from 'express';
import { PaymentService } from '../services/paymentService';
import { CartService } from '../services/cartService';
import { OrderService } from '../services/orderService';
import { RAZORPAY_KEY_ID } from '../config/razorpay';
import { RequestWithRawBody } from '../types';

const router = Router();

// GET /checkout - Render Checkout View
router.get('/checkout', async (req, res) => {
  const sessionItems = req.session.cartItems || [];
  if (sessionItems.length === 0) {
    return res.redirect('/cart');
  }

  const cartSummary = await CartService.resolveSessionCart(sessionItems, req.session.couponCode);

  res.render('checkout', {
    cartSummary,
    razorpayKeyId: RAZORPAY_KEY_ID,
    user: req.session.user || null
  });
});

/**
 * POST /api/payment/create-order
 * Rest endpoint to create Razorpay Order for current session cart
 */
router.post('/api/payment/create-order', async (req, res) => {
  try {
    const sessionItems = req.session.cartItems || [];
    if (sessionItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add medicines before checkout.'
      });
    }

    const summary = await CartService.resolveSessionCart(sessionItems, req.session.couponCode);
    
    // Create Razorpay Order
    const orderData = await PaymentService.createRazorpayOrder(
      summary.total,
      `nx_rcpt_${Date.now()}`
    );

    res.json({
      success: true,
      data: orderData
    });
  } catch (error: any) {
    console.error('Payment order creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment order creation failed',
      error: error.message
    });
  }
});

/**
 * POST /api/payment/verify
 * REST endpoint to verify Razorpay signature & save order to MySQL
 */
router.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;

    const isValid = PaymentService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay signature verification failed. Transaction invalid.'
      });
    }

    const sessionItems = req.session.cartItems || [];
    const cartSummary = await CartService.resolveSessionCart(sessionItems, req.session.couponCode);

    const completedOrder = await OrderService.createOrderWithPayment({
      userId: req.session.user ? req.session.user.id : null,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      totalAmount: cartSummary.total,
      shippingAddress: shippingAddress || {
        fullName: req.session.user ? req.session.user.name : 'Valued Customer',
        email: req.session.user ? req.session.user.email : 'customer@nexusmed.com',
        phone: '+91 98765 43210',
        address: '123 Healthcare Blvd, Medical Hub',
        city: 'Mumbai',
        pincode: '400001'
      },
      cartItems: cartSummary.items
    });

    // Clear cart upon successful transaction
    req.session.cartItems = [];
    req.session.couponCode = undefined;

    res.json({
      success: true,
      message: 'Payment verified and order placed successfully!',
      order: completedOrder
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment signature',
      error: error.message
    });
  }
});

/**
 * POST /api/payment/webhook
 * Razorpay Webhook endpoint using raw request body for HMAC verification
 */
router.post('/api/payment/webhook', async (req: RequestWithRawBody, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' });
    }

    const rawBody = req.rawBody || req.body;
    if (!rawBody) {
      return res.status(400).json({ success: false, message: 'Raw request body is required for verification' });
    }

    const result = await PaymentService.handleWebhook(rawBody, signature);

    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Webhook signature verification failed' });
    }

    res.json({ success: true, event: result.event });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
