// Orders Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');
const { requireAdmin } = require('../middleware/auth');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Get all orders with filtering (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, date_from, date_to, limit } = req.query;
    let sql = `SELECT o.*, p.name AS product_name, p.unit, p.category 
               FROM orders o JOIN products p ON p.id=o.product_id WHERE 1=1`;
    const params = [];
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    if (date_from) {
      sql += ' AND DATE(o.created_at) >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      sql += ' AND DATE(o.created_at) <= ?';
      params.push(date_to);
    }
    
    sql += ' ORDER BY o.id DESC';
    
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const orders = await query(sql, params);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get single order (Admin only)
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await query(
      `SELECT o.*, p.name AS product_name, p.unit, p.category 
       FROM orders o JOIN products p ON p.id=o.product_id WHERE o.id = ?`,
      [id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(orders[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { buyer_name, phone, delivery_address, product_id, qty } = req.body;
    
    // Get product details
    const products = await query('SELECT name, price FROM products WHERE id=?', [product_id]);
    if (products.length === 0) {
      return res.status(400).json({ message: 'Invalid product' });
    }
    
    const price = products[0].price;
    const productName = products[0].name;
    const total = Number(price) * Number(qty);
    const traceId = uuidv4();
    
    // Create order
    const result = await query(
      'INSERT INTO orders (buyer_name,phone,delivery_address,product_id,qty,total,status,trace_id) VALUES (?,?,?,?,?,?,\'NEW\',?)',
      [buyer_name, phone, delivery_address || '', product_id, qty, total, traceId]
    );
    
    // Update stock
    await query('UPDATE products SET stock=GREATEST(stock-?,0) WHERE id=?', [qty, product_id]);
    
    // Generate QR Code
    const qrData = {
      orderId: result.insertId,
      traceId: traceId,
      product: productName,
      qty: qty,
      buyer: buyer_name,
      school: 'Baan Maehoyngoen School',
      verifyUrl: `${req.protocol}://${req.get('host')}/api/trace/${traceId}`
    };
    
    const qrUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    
    res.status(201).json({
      id: result.insertId,
      total,
      traceId,
      qrCode: qrUrl,
      verifyUrl: qrData.verifyUrl
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await query('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
