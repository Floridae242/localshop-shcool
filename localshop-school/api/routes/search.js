// Search Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');

// Search products or orders
router.get('/', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }
    
    if (type === 'products') {
      const products = await query(
        'SELECT * FROM products WHERE name LIKE ? OR category LIKE ?',
        [`%${q}%`, `%${q}%`]
      );
      res.json(products);
    } else if (type === 'orders') {
      const orders = await query(
        `SELECT o.*, p.name AS product_name FROM orders o 
         JOIN products p ON p.id=o.product_id 
         WHERE o.buyer_name LIKE ? OR o.phone LIKE ?`,
        [`%${q}%`, `%${q}%`]
      );
      res.json(orders);
    } else {
      res.status(400).json({ message: 'Invalid search type' });
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search error' });
  }
});

module.exports = router;


