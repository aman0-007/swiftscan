import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface ProductRecord {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: string;
  weightOrVolume?: string;
  imageUrl: string;
  description?: string;
}

interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderRecord {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  createdAt: string;
  storeName: string;
  paymentMethod: string;
  items: OrderItemRecord[];
}

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  loyaltyPoints: number;
  memberSince: string;
  password?: string;
}

// In-Memory Database for backend service
const users: UserRecord[] = [
  {
    id: 'usr_shopper',
    email: 'shopper@scanandgo.com',
    name: 'Alex Shopper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    loyaltyPoints: 280,
    memberSince: 'September 2026',
    password: 'hashed_pw_shopper',
  },
  {
    id: 'usr_9842',
    email: 'sarah.miller@swiftscan.co',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    loyaltyPoints: 340,
    memberSince: 'March 2025',
    password: 'swiftpass2026',
  },
  {
    id: 'usr_1001',
    email: 'alex.chen@swiftscan.co',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    loyaltyPoints: 520,
    memberSince: 'January 2025',
    password: 'swiftpass2026',
  },
];

const products: ProductRecord[] = [
  {
    id: 'prod_101',
    barcode: '793573189240',
    name: 'Organic Whole Milk',
    price: 4.89,
    stockQuantity: 42,
    category: 'Dairy & Eggs',
    weightOrVolume: '1 Gallon',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    description: 'Pasture-raised, Grade-A organic whole milk rich in vitamin D.',
  },
  {
    id: 'prod_102',
    barcode: '041220275812',
    name: 'Hass Avocados (4-Pack)',
    price: 3.99,
    stockQuantity: 58,
    category: 'Fresh Produce',
    weightOrVolume: '4 ct',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
    description: 'Ripe and creamy Hass avocados, perfect for salads and guacamole.',
  },
  {
    id: 'prod_103',
    barcode: '011110853198',
    name: 'Artisan San Francisco Sourdough',
    price: 5.49,
    stockQuantity: 19,
    category: 'Bakery',
    weightOrVolume: '24 oz',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
    description: 'Slow fermented naturally leavened sourdough with a crisp crust.',
  },
  {
    id: 'prod_104',
    barcode: '024100112456',
    name: 'Nitro Cold Brew Coffee',
    price: 3.75,
    stockQuantity: 34,
    category: 'Beverages',
    weightOrVolume: '11 fl oz',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    description: 'Silky smooth single-origin Colombian cold brew infused with nitrogen.',
  },
  {
    id: 'prod_105',
    barcode: '048500018324',
    name: 'Honeycrisp Apples',
    price: 2.49,
    stockQuantity: 75,
    category: 'Fresh Produce',
    weightOrVolume: '1 lb',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
    description: 'Crisp, juicy and exceptionally sweet local orchard apples.',
  },
  {
    id: 'prod_106',
    barcode: '071430009210',
    name: 'Greek Whole Milk Yogurt',
    price: 4.25,
    stockQuantity: 28,
    category: 'Dairy & Eggs',
    weightOrVolume: '32 oz',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
    description: 'Thick strained authentic Greek yogurt with live active cultures.',
  },
  {
    id: 'prod_107',
    barcode: '034000004409',
    name: 'Single Origin Dark Chocolate 72%',
    price: 3.99,
    stockQuantity: 60,
    category: 'Snacks & Sweets',
    weightOrVolume: '3.5 oz',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80',
    description: 'Fair trade organic dark chocolate with notes of toasted hazelnut.',
  },
  {
    id: 'prod_108',
    barcode: '070200543219',
    name: 'Extra Virgin Olive Oil',
    price: 11.95,
    stockQuantity: 15,
    category: 'Pantry',
    weightOrVolume: '500 ml',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    description: 'First cold-pressed Mediterranean extra virgin olive oil.',
  },
  // Commonly tested retail item barcodes
  {
    id: 'prod_109',
    barcode: '049000000443',
    name: 'Coca-Cola Original (12 oz Can)',
    price: 1.89,
    stockQuantity: 120,
    category: 'Beverages',
    weightOrVolume: '12 fl oz',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    description: 'Classic crisp and refreshing sparkling cola beverage.',
  },
  {
    id: 'prod_110',
    barcode: '602652171922',
    name: 'KIND Dark Chocolate Nuts & Sea Salt Bar',
    price: 2.29,
    stockQuantity: 90,
    category: 'Snacks & Sweets',
    weightOrVolume: '1.4 oz',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281686?auto=format&fit=crop&w=400&q=80',
    description: 'Whole almonds and peanuts drizzled with dark chocolate and sea salt.',
  },
];

const orders: OrderRecord[] = [
  {
    id: 'ORD-7712-BK',
    userId: 'usr_shopper',
    totalAmount: 14.37,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    storeName: 'SwiftScan Market — Pine & 4th',
    paymentMethod: 'Apple Pay (•••• 4092)',
    items: [
      { productId: 'prod_101', productName: 'Organic Whole Milk', quantity: 1, unitPrice: 4.89 },
      { productId: 'prod_103', productName: 'Artisan San Francisco Sourdough', quantity: 1, unitPrice: 5.49 },
      { productId: 'prod_107', productName: 'Single Origin Dark Chocolate 72%', quantity: 1, unitPrice: 3.99 },
    ],
  },
  {
    id: 'ORD-6540-LP',
    userId: 'usr_shopper',
    totalAmount: 9.88,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    storeName: 'SwiftScan Market — Pine & 4th',
    paymentMethod: 'Visa Debit (•••• 8129)',
    items: [
      { productId: 'prod_102', productName: 'Hass Avocados (4-Pack)', quantity: 1, unitPrice: 3.99 },
      { productId: 'prod_104', productName: 'Nitro Cold Brew Coffee', quantity: 1, unitPrice: 3.75 },
      { productId: 'prod_109', productName: 'Coca-Cola Original (12 oz Can)', quantity: 1, unitPrice: 1.89 },
    ],
  },
  {
    id: 'ORD-9428-SX',
    userId: 'usr_9842',
    totalAmount: 14.37,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    storeName: 'SwiftScan Market — Pine & 4th',
    paymentMethod: 'Apple Pay (•••• 4092)',
    items: [
      { productId: 'prod_101', productName: 'Organic Whole Milk', quantity: 1, unitPrice: 4.89 },
      { productId: 'prod_103', productName: 'Artisan San Francisco Sourdough', quantity: 1, unitPrice: 5.49 },
      { productId: 'prod_107', productName: 'Single Origin Dark Chocolate 72%', quantity: 1, unitPrice: 3.99 },
    ],
  },
  {
    id: 'ORD-8910-QA',
    userId: 'usr_9842',
    totalAmount: 10.23,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    storeName: 'SwiftScan Market — Pine & 4th',
    paymentMethod: 'Visa Debit (•••• 8129)',
    items: [
      { productId: 'prod_102', productName: 'Hass Avocados (4-Pack)', quantity: 1, unitPrice: 3.99 },
      { productId: 'prod_104', productName: 'Nitro Cold Brew Coffee', quantity: 1, unitPrice: 3.75 },
      { productId: 'prod_105', productName: 'Honeycrisp Apples', quantity: 1, unitPrice: 2.49 },
    ],
  },
];

// Helper to extract authenticated user from Bearer token
function getAuthUser(req: Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  // Check if token contains encoded email: swift_jwt_<time>_<base64email>
  try {
    const parts = token.split('_');
    if (parts.length >= 4) {
      const email = Buffer.from(parts[3], 'base64').toString('utf-8');
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) return found;
    }
  } catch {
    // fallback
  }

  // Default to primary active user if valid token exists
  return users[0];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Standard middleware
  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // ==========================================
  // API ROUTES
  // ==========================================

  // 0. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), totalProducts: products.length });
  });

  // 1. POST /api/Auth/login
  app.post('/api/Auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Auto-register new guest user for instant testing
      const newName = cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      user = {
        id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
        email: cleanEmail,
        name: newName,
        loyaltyPoints: 100,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };
      users.push(user);
    }

    const token = `swift_jwt_${Date.now()}_${Buffer.from(cleanEmail).toString('base64')}`;

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        memberSince: user.memberSince,
      },
    });
  });

  // 1b. GET /api/Auth/me
  app.get('/api/Auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized: missing or invalid bearer token' });
      return;
    }
    res.json(user);
  });

  // 2. GET /api/Products
  app.get('/api/Products', (req, res) => {
    const { search, category } = req.query;
    let filtered = products;

    if (typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (typeof category === 'string' && category.trim()) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    res.json(filtered);
  });

  // 2b. GET /api/Products/:barcode
  app.get('/api/Products/:barcode', (req, res) => {
    const barcode = (req.params.barcode || '').trim();
    const product = products.find((p) => p.barcode === barcode);

    if (!product) {
      res.status(404).json({ error: `Product not found for barcode: ${barcode}` });
      return;
    }

    res.json(product);
  });

  // 2c. POST /api/Products (Register / Add new product)
  app.post('/api/Products', (req, res) => {
    const { barcode, name, price, category, weightOrVolume, imageUrl, description, stockQuantity } = req.body || {};

    if (!barcode || !name || price === undefined) {
      res.status(400).json({ error: 'barcode, name, and price are required fields' });
      return;
    }

    const cleanBarcode = String(barcode).trim();
    const existingIndex = products.findIndex((p) => p.barcode === cleanBarcode);

    const newProduct: ProductRecord = {
      id: existingIndex >= 0 ? products[existingIndex].id : `prod_${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: cleanBarcode,
      name: String(name).trim(),
      price: parseFloat(Number(price).toFixed(2)),
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 50,
      category: category || 'Pantry & Groceries',
      weightOrVolume: weightOrVolume || '1 unit',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      description: description || 'In-store scan item',
    };

    if (existingIndex >= 0) {
      products[existingIndex] = newProduct;
    } else {
      products.unshift(newProduct);
    }

    res.status(201).json(newProduct);
  });

  // 3. POST /api/Orders/checkout
  app.post('/api/Orders/checkout', (req, res) => {
    const user = getAuthUser(req);
    const { items, storeName, paymentMethod } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one item' });
      return;
    }

    const itemizedDetails: OrderItemRecord[] = [];

    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = prod ? prod.price : 3.5;
      const productName = prod ? prod.name : 'Scanned Item';

      itemizedDetails.push({
        productId: item.productId,
        productName,
        quantity: qty,
        unitPrice,
      });

      // Update stock
      if (prod && prod.stockQuantity >= qty) {
        prod.stockQuantity -= qty;
      }
    }

    const subtotal = itemizedDetails.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const taxAmount = +(subtotal * 0.0825).toFixed(2);
    const totalAmount = +(subtotal + taxAmount).toFixed(2);

    const newOrder: OrderRecord = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      userId: user?.id || 'usr_guest',
      totalAmount,
      status: 'Completed',
      createdAt: new Date().toISOString(),
      storeName: storeName || 'SwiftScan Market — Pine & 4th',
      paymentMethod: paymentMethod || 'Apple Pay (•••• 4092)',
      items: itemizedDetails,
    };

    orders.unshift(newOrder);

    // Increment user loyalty points (+10 points per dollar spent)
    if (user) {
      user.loyaltyPoints += Math.floor(totalAmount * 10);
    }

    res.status(201).json(newOrder);
  });

  // 4. GET /api/Orders/my-orders
  app.get('/api/Orders/my-orders', (req, res) => {
    const user = getAuthUser(req);
    // Return all orders if no specific user, or filter by user
    const userOrders = user ? orders.filter((o) => o.userId === user.id || o.userId === 'usr_guest') : orders;
    res.json(userOrders);
  });

  // ==========================================
  // VITE DEV MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SwiftScan API Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SwiftScan server:', err);
  process.exit(1);
});
