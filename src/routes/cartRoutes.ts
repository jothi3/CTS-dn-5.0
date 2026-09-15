import { Router } from 'express';
import { CartService } from '../services/cartService';

const router = Router();

function getSessionCart(req: any) {
  if (!req.session.cartItems) {
    req.session.cartItems = [];
  }
  return req.session.cartItems;
}

// GET /cart - Render Cart View
router.get('/cart', async (req, res) => {
  const sessionItems = getSessionCart(req);
  const cartSummary = await CartService.resolveSessionCart(sessionItems, req.session.couponCode);

  res.render('cart', {
    cartSummary,
    user: req.session.user || null
  });
});

// POST /cart/add
router.post('/cart/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  const sessionItems = getSessionCart(req);
  const existing = sessionItems.find((i: any) => i.productId === productId);

  if (existing) {
    existing.quantity += qty;
  } else {
    sessionItems.push({ productId, quantity: qty });
  }

  req.session.cartItems = sessionItems;

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    const summary = await CartService.resolveSessionCart(sessionItems, req.session.couponCode);
    return res.json({ success: true, cartSummary: summary });
  }

  res.redirect('/cart');
});

// POST /cart/update
router.post('/cart/update', async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  let sessionItems = getSessionCart(req);

  if (qty <= 0) {
    sessionItems = sessionItems.filter((i: any) => i.productId !== productId);
  } else {
    const item = sessionItems.find((i: any) => i.productId === productId);
    if (item) item.quantity = qty;
  }

  req.session.cartItems = sessionItems;

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    const summary = await CartService.resolveSessionCart(sessionItems, req.session.couponCode);
    return res.json({ success: true, cartSummary: summary });
  }

  res.redirect('/cart');
});

// POST /cart/remove
router.post('/cart/remove', async (req, res) => {
  const { productId } = req.body;
  let sessionItems = getSessionCart(req);
  sessionItems = sessionItems.filter((i: any) => i.productId !== productId);
  req.session.cartItems = sessionItems;

  res.redirect('/cart');
});

// POST /cart/apply-coupon
router.post('/cart/apply-coupon', async (req, res) => {
  const { couponCode } = req.body;
  if (couponCode && couponCode.toUpperCase() === 'HEALTH20') {
    req.session.couponCode = 'HEALTH20';
  }
  res.redirect('/cart');
});

export default router;
