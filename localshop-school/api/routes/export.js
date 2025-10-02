// Export Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');
const { requireAdmin } = require('../middleware/auth');
const { Parser } = require('json2csv');

// Export products to CSV
router.get('/products.csv', requireAdmin, async (req, res) => {
  try {
    const products = await query('SELECT id,name,category,price,unit,stock FROM products');
    const parser = new Parser();
    const csv = parser.parse(products);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).send('Export error');
  }
});

// Export orders to CSV
router.get('/orders.csv', requireAdmin, async (req, res) => {
  try {
    const orders = await query(
      `SELECT o.id,o.buyer_name,o.phone,p.name AS product,o.qty,o.total,o.status,o.created_at
       FROM orders o JOIN products p ON p.id=o.product_id ORDER BY o.id DESC`
    );
    
    const parser = new Parser();
    const csv = parser.parse(orders);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).send('Export error');
  }
});

module.exports = router;


