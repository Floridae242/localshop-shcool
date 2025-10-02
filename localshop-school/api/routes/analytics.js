// Analytics Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');
const { requireAdmin } = require('../middleware/auth');

// Get system statistics (legacy path)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = {};
    
    // Get total products
    const productsResult = await query('SELECT COUNT(*) as total FROM products');
    stats.totalProducts = productsResult[0].total;
    
    // Get total orders
    const ordersResult = await query('SELECT COUNT(*) as total FROM orders');
    stats.totalOrders = ordersResult[0].total;
    
    // Get revenue
    const revenueResult = await query('SELECT SUM(total) as revenue FROM orders WHERE status = "CONFIRMED"');
    stats.totalRevenue = revenueResult[0].revenue || 0;
    
    // Get low stock items
    const lowStockResult = await query('SELECT COUNT(*) as low_stock FROM products WHERE stock < 10');
    stats.lowStockItems = lowStockResult[0].low_stock;
    
    // Get recent orders (last 7 days)
    const recentOrdersResult = await query('SELECT COUNT(*) as recent_orders FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    stats.recentOrders = recentOrdersResult[0].recent_orders;
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Get dashboard summary (legacy path)
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const summary = {};
    
    // Get today's orders
    const todayResult = await query('SELECT COUNT(*) as count, SUM(total) as revenue FROM orders WHERE DATE(created_at) = CURDATE()');
    summary.todayOrders = todayResult[0].count;
    summary.todayRevenue = todayResult[0].revenue || 0;
    
    // Get pending orders
    const pendingResult = await query('SELECT COUNT(*) as count FROM orders WHERE status = "NEW"');
    summary.pendingOrders = pendingResult[0].count;
    
    // Get out of stock products
    const outOfStockResult = await query('SELECT COUNT(*) as count FROM products WHERE stock = 0');
    summary.outOfStock = outOfStockResult[0].count;
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get sales analytics
router.get('/sales', requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const sales = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
        FROM orders 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND status = 'CONFIRMED'
        GROUP BY DATE(created_at)
        ORDER BY date DESC`,
      [parseInt(period)]
    );
    
    res.json(sales);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Analytics error' });
  }
});

// Get product performance analytics
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const products = await query(
      `SELECT 
        p.name,
        p.category,
        COUNT(o.id) as orders,
        SUM(o.qty) as total_qty,
        SUM(o.total) as revenue
        FROM products p
        LEFT JOIN orders o ON p.id = o.product_id AND o.status = 'CONFIRMED'
        GROUP BY p.id, p.name, p.category
        ORDER BY revenue DESC`
    );
    
    res.json(products);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Analytics error' });
  }
});

module.exports = router;
