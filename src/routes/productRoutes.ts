import { Router } from 'express';
import { ProductService } from '../services/productService';
import { CartService } from '../services/cartService';

const router = Router();

// GET / - Home Page
router.get('/', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    const cartSummary = await CartService.resolveSessionCart(req.session.cartItems || []);
    res.render('index', {
      products,
      cartSummary,
      user: req.session.user || null
    });
  } catch (error) {
    res.status(500).send('Error loading home page');
  }
});

// GET /products - Product Catalog
router.get('/products', async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    const products = await ProductService.getAllProducts(query, category);
    const cartSummary = await CartService.resolveSessionCart(req.session.cartItems || []);

    res.render('products', {
      products,
      cartSummary,
      currentCategory: category || 'all',
      searchQuery: query || '',
      user: req.session.user || null
    });
  } catch (error) {
    res.status(500).send('Error loading products catalog');
  }
});

// GET /products/:id - Product Detail View
router.get('/products/:id', async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).render('404', { message: 'Medicine not found' });
    }

    const allProducts = await ProductService.getAllProducts(undefined, product.category);
    const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

    const cartSummary = await CartService.resolveSessionCart(req.session.cartItems || []);

    res.render('product-detail', {
      product,
      relatedProducts,
      cartSummary,
      user: req.session.user || null
    });
  } catch (error) {
    res.status(500).send('Error loading product details');
  }
});

export default router;
