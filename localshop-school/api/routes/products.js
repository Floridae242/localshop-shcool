// Products Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');
const { requireAdmin } = require('../middleware/auth');

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, in_stock } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      sql += ' AND (name LIKE ? OR name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (in_stock === 'true') {
      sql += ' AND stock > 0';
    }
    
    sql += ' ORDER BY id DESC';
    
    const products = await query(sql, params);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const products = await query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Get product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(categories.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Create product (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, category, price, unit, stock, image_url } = req.body;
    const result = await query(
      'INSERT INTO products (name,category,price,unit,stock,image_url) VALUES (?,?,?,?,?,?)',
      [name, category, price, unit, stock, image_url]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, unit, stock, image_url } = req.body;
    
    await query(
      'UPDATE products SET name=?, category=?, price=?, unit=?, stock=?, image_url=? WHERE id=?',
      [name, category, price, unit, stock, image_url, id]
    );
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id=?', [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;

