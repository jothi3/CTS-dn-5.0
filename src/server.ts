import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { testDbConnection } from './config/db';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Test MySQL connection on startup
testDbConnection();

// EJS View Engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// CORS & Static assets
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Preserve raw request body for Razorpay Webhook signature verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nexus_med_default_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

// Route Mounting
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', paymentRoutes);
app.use('/', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Nexus Med Server running at http://localhost:${PORT}`);
});
