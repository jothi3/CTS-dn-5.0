import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables.');
}

// Initialize Razorpay SDK instance
export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});
