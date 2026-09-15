import { pool } from '../config/db';
import { Product } from '../types';
import { RowDataPacket } from 'mysql2';

// Hardcoded fallback data in case database is empty or connection is offline
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'med-001',
    name: 'NexusPar 650 Fast-Relief',
    brand: 'Nexus Health Pharma',
    category: 'pain-relief',
    description: 'Effective symptomatic treatment for mild to moderate pain, headache, muscle soreness, and high fever reduction.',
    dosage: '650 mg',
    pack_size: '15 Tablets Strip',
    price: 38,
    original_price: 50,
    stock_count: 150,
    requires_rx: false,
    rating: 4.8,
    reviews_count: 342,
    active_ingredient: 'Paracetamol / Acetaminophen (650mg)',
    usage_instructions: 'Take 1 tablet every 6 hours after food as required. Do not exceed 4 tablets in 24 hours.',
    side_effects: 'Mild nausea, rare allergic rash',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    badge: 'BESTSELLER'
  },
  {
    id: 'med-002',
    name: 'Amoxil-CV 625 Triple Care',
    brand: 'Nexus Specialty RX',
    category: 'antibiotics',
    description: 'Broad-spectrum antibiotic prescription medicine for respiratory tract infections, sinus, and ear infections.',
    dosage: '500mg Amoxicillin + 125mg Clavulanate',
    pack_size: '10 Tablets Strip',
    price: 210,
    original_price: 260,
    stock_count: 45,
    requires_rx: true,
    rating: 4.9,
    reviews_count: 189,
    active_ingredient: 'Amoxicillin Trihydrate & Potassium Clavulanate',
    usage_instructions: 'Take strictly as prescribed by a licensed physician with meals twice daily.',
    side_effects: 'Mild diarrhea, stomach discomfort',
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    badge: 'RX REQUIRED'
  },
  {
    id: 'med-003',
    name: 'NexusVite Active Immunity C+Zinc',
    brand: 'Nexus Nutrition',
    category: 'vitamins',
    description: 'Effervescent antioxidant daily health supplement for robust cellular defense, collagen synthesis, and stamina.',
    dosage: '1000mg Vit C + 10mg Zinc',
    pack_size: '20 Effervescent Tablets',
    price: 299,
    original_price: 399,
    stock_count: 220,
    requires_rx: false,
    rating: 4.7,
    reviews_count: 512,
    active_ingredient: 'L-Ascorbic Acid & Zinc Sulphate',
    usage_instructions: 'Dissolve 1 tablet in a glass of 200ml fresh cold water daily morning.',
    side_effects: 'None noted when taken as directed',
    image_url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80',
    badge: '25% OFF'
  },
  {
    id: 'med-004',
    name: 'GlucoGuard SR 500',
    brand: 'Nexus Endocrine Care',
    category: 'diabetes-cardiac',
    description: 'Sustained-release antihyperglycemic oral medication for Type-2 Diabetes management and glycemic stability.',
    dosage: '500 mg',
    pack_size: '15 Sustained Release Tablets',
    price: 65,
    original_price: 80,
    stock_count: 95,
    requires_rx: true,
    rating: 4.6,
    reviews_count: 140,
    active_ingredient: 'Metformin Hydrochloride (500mg SR)',
    usage_instructions: 'Administer with evening meals or as recommended by endocrinologist.',
    side_effects: 'Initial bloating, metabolic equilibrium shift',
    image_url: 'https://images.unsplash.com/photo-1550572017-edd951baa74c?auto=format&fit=crop&w=600&q=80',
    badge: 'RX REQUIRED'
  },
  {
    id: 'med-005',
    name: 'Pantop-D Rapid Gel Caps',
    brand: 'Nexus Gastro Lab',
    category: 'digestive',
    description: 'Dual action proton pump inhibitor + prokinetic for hyperacidity, GERD, acid reflux and heartburn relief.',
    dosage: '40mg Pantoprazole + 30mg Domperidone',
    pack_size: '15 Hard Capsules Strip',
    price: 145,
    original_price: 180,
    stock_count: 80,
    requires_rx: false,
    rating: 4.8,
    reviews_count: 278,
    active_ingredient: 'Pantoprazole Sodium & Domperidone SR',
    usage_instructions: 'Swallow whole 30 minutes before breakfast with water.',
    side_effects: 'Dry mouth, headache',
    image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
    badge: 'FAST ACTION'
  },
  {
    id: 'med-006',
    name: 'DermAClear Antiseptic Cream',
    brand: 'Nexus Skincare Science',
    category: 'personal-care',
    description: 'Soothing dermatological healing ointment for minor cuts, burns, skin abrasions, and topical irritation.',
    dosage: '1% Chlorhexidine + 15% Cetrimide',
    pack_size: '50g Tube',
    price: 120,
    original_price: 150,
    stock_count: 110,
    requires_rx: false,
    rating: 4.9,
    reviews_count: 405,
    active_ingredient: 'Chlorhexidine Gluconate',
    usage_instructions: 'Clean affected skin surface gently and apply a thin layer 2-3 times daily.',
    side_effects: 'Mild local stinging',
    image_url: 'https://images.unsplash.com/photo-1608248597560-8412674e2d3d?auto=format&fit=crop&w=600&q=80',
    badge: 'TOP RATED'
  }
];

export class ProductService {
  static async getAllProducts(query?: string, category?: string): Promise<Product[]> {
    try {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params: any[] = [];

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (query) {
        sql += ' AND (name LIKE ? OR brand LIKE ? OR active_ingredient LIKE ?)';
        const term = `%${query}%`;
        params.push(term, term, term);
      }

      const [rows] = await pool.execute<RowDataPacket[]>(sql, params);
      if (rows.length > 0) {
        return rows.map(r => ({
          ...r,
          price: Number(r.price),
          original_price: r.original_price ? Number(r.original_price) : undefined,
          requires_rx: Boolean(r.requires_rx)
        })) as Product[];
      }
    } catch (e) {
      console.warn('Falling back to static products (DB error/unseeded)');
    }

    // Static fallback matching search criteria
    let result = SAMPLE_PRODUCTS;
    if (category) {
      result = result.filter(p => p.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        (p.active_ingredient && p.active_ingredient.toLowerCase().includes(q))
      );
    }
    return result;
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      if (rows.length > 0) {
        const r = rows[0];
        return {
          ...r,
          price: Number(r.price),
          original_price: r.original_price ? Number(r.original_price) : undefined,
          requires_rx: Boolean(r.requires_rx)
        } as Product;
      }
    } catch (e) {
      console.warn('Falling back to static product lookup');
    }

    return SAMPLE_PRODUCTS.find(p => p.id === id) || null;
  }
}
