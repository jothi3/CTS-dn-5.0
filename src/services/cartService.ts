import { ProductService } from './productService';
import { CartItem } from '../types';

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}

export class CartService {
  static async resolveSessionCart(
    sessionItems: { productId: string; quantity: number }[],
    couponCode?: string
  ): Promise<CartSummary> {
    const items: CartItem[] = [];
    let subtotal = 0;
    let itemCount = 0;

    for (const sItem of sessionItems) {
      const product = await ProductService.getProductById(sItem.productId);
      if (product) {
        items.push({
          product,
          quantity: sItem.quantity
        });
        subtotal += product.price * sItem.quantity;
        itemCount += sItem.quantity;
      }
    }

    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === 'HEALTH20') {
      discount = Math.round(subtotal * 0.20);
    }

    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      items,
      itemCount,
      subtotal,
      discount,
      shipping,
      total,
      couponCode
    };
  }
}
