const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { Parser } = require('json2csv');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Configuration
const dbConfig = {
  host: functions.config().db?.host || 'localhost',
  user: functions.config().db?.user || 'app',
  password: functions.config().db?.password || 'password',
  database: functions.config().db?.name || 'localshop_school',
  port: functions.config().db?.port || 3306,
  ssl: functions.config().db?.ssl === 'true' ? {
    rejectUnauthorized: false
  } : false
};

let connection;

function getConnection() {
  if (!connection) {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to MySQL database');
      }
    });
  }
  return connection;
}

// Admin authentication middleware
function requireAdmin(req, res, next) {
  const pass = req.headers['x-admin-pass'] || req.query.admin;
  const adminPass = functions.config().app?.admin_pass || 'admin123';
  if (pass === adminPass) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    service: 'AgriLink School API',
    timestamp: new Date().toISOString()
  });
});

// Products endpoints
app.get('/products', (req, res) => {
  const db = getConnection();
  db.query('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(rows);
  });
});

app.post('/products', requireAdmin, (req, res) => {
  const { name, category, price, unit, stock, image_url } = req.body;
  const db = getConnection();
  const query = 'INSERT INTO products (name,category,price,unit,stock,image_url) VALUES (?,?,?,?,?,?)';
  
  db.query(query, [name, category, price, unit, stock, image_url], (err, result) => {
    if (err) {
      console.error('Error creating product:', err);
      return res.status(500).json({ message: 'Error creating product' });
    }
    res.status(201).json({ id: result.insertId });
  });
});

app.put('/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, category, price, unit, stock, image_url } = req.body;
  const db = getConnection();
  const query = 'UPDATE products SET name=?, category=?, price=?, unit=?, stock=?, image_url=? WHERE id=?';
  
  db.query(query, [name, category, price, unit, stock, image_url, id], (err) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.json({ ok: true });
  });
});

app.delete('/products/:id', requireAdmin, (req, res) => {
  const db = getConnection();
  db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product' });
    }
    res.json({ ok: true });
  });
});

// Orders endpoints
app.get('/orders', requireAdmin, (req, res) => {
  const db = getConnection();
  const query = `SELECT o.*, p.name AS product_name, p.unit 
                 FROM orders o JOIN products p ON p.id=o.product_id 
                 ORDER BY o.id DESC`;
  
  db.query(query, (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.json(rows);
  });
});

app.post('/orders', (req, res) => {
  const { buyer_name, phone, product_id, qty } = req.body;
  const db = getConnection();
  
  db.query('SELECT name, price FROM products WHERE id=?', [product_id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(400).json({ message: 'Invalid product' });
    }
    
    const price = rows[0].price;
    const productName = rows[0].name;
    const total = Number(price) * Number(qty);
    const traceId = uuidv4();
    
    const insertQuery = 'INSERT INTO orders (buyer_name,phone,product_id,qty,total,status,trace_id) VALUES (?,?,?,?,?,\'NEW\',?)';
    
    db.query(insertQuery, [buyer_name, phone, product_id, qty, total, traceId], (err2, result) => {
      if (err2) {
        console.error('Error creating order:', err2);
        return res.status(500).json({ message: 'Error creating order' });
      }
      
      // Update stock
      db.query('UPDATE products SET stock=GREATEST(stock-?,0) WHERE id=?', [qty, product_id]);
      
      // Generate QR Code
      const qrData = {
        orderId: result.insertId,
        traceId: traceId,
        product: productName,
        qty: qty,
        buyer: buyer_name,
        school: 'Baan Maehoyngoen School',
        verifyUrl: `https://${req.get('host')}/api/trace/${traceId}`
      };
      
      QRCode.toDataURL(JSON.stringify(qrData), (qrErr, qrUrl) => {
        if (qrErr) console.error('QR generation error:', qrErr);
        res.status(201).json({
          id: result.insertId,
          total,
          traceId,
          qrCode: qrUrl,
          verifyUrl: qrData.verifyUrl
        });
      });
    });
  });
});

app.put('/orders/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const db = getConnection();
  
  db.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id], (err) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json({ message: 'Error updating status' });
    }
    res.json({ ok: true });
  });
});

// QR Traceability
app.get('/trace/:traceId', (req, res) => {
  const { traceId } = req.params;
  const db = getConnection();
  const query = `SELECT o.*, p.name AS product_name, p.category, p.unit 
                 FROM orders o JOIN products p ON p.id = o.product_id 
                 WHERE o.trace_id = ?`;
                 
  db.query(query, [traceId], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: 'Order not found or invalid trace ID' });
    }
    
    const order = rows[0];
    res.json({
      verified: true,
      school: 'โรงเรียนบ้านแม่ฮ้อยเงิน (Baan Maehoyngoen School)',
      location: 'ดอยสะเก็ด, เชียงใหม่',
      product: {
        name: order.product_name,
        category: order.category,
        quantity: `${order.qty} ${order.unit}`,
        total: `${order.total} บาท`
      },
      buyer: order.buyer_name,
      orderDate: order.created_at,
      status: order.status,
      message: 'ผลผลิตปลอดภัย ตรวจสอบได้ จากโรงเรียนแม่ฮ้อยเงิน'
    });
  });
});

// Media endpoint
app.get('/media', (req, res) => {
  const db = getConnection();
  db.query('SELECT * FROM media ORDER BY id DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching album' });
    }
    res.json(rows);
  });
});

// CSV Export endpoints
app.get('/export/products.csv', requireAdmin, (req, res) => {
  const db = getConnection();
  db.query('SELECT id,name,category,price,unit,stock FROM products', (err, rows) => {
    if (err) {
      return res.status(500).send('Export error');
    }
    
    try {
      const parser = new Parser();
      const csv = parser.parse(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
      res.send(csv);
    } catch (parseErr) {
      console.error('CSV parse error:', parseErr);
      res.status(500).send('CSV generation error');
    }
  });
});

app.get('/export/orders.csv', requireAdmin, (req, res) => {
  const db = getConnection();
  const query = `SELECT o.id,o.buyer_name,o.phone,p.name AS product,o.qty,o.total,o.status,o.created_at
                 FROM orders o JOIN products p ON p.id=o.product_id ORDER BY o.id DESC`;
                 
  db.query(query, (err, rows) => {
    if (err) {
      return res.status(500).send('Export error');
    }
    
    try {
      const parser = new Parser();
      const csv = parser.parse(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
      res.send(csv);
    } catch (parseErr) {
      console.error('CSV parse error:', parseErr);
      res.status(500).send('CSV generation error');
    }
  });
});

// Export the Express API as Firebase Cloud Functions
exports.api = functions.https.onRequest(app);