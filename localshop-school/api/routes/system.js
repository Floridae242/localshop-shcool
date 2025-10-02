// System Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');

// API Status and Health Check
router.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'AgriLink School API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      media: '/api/media',
      trace: '/api/trace/:traceId',
      stats: '/api/analytics/stats',
      health: '/api/health'
    }
  });
});

// Health Check
router.get('/health', async (req, res) => {
  try {
    await query('SELECT 1 as test');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;


