// API Routes Index
const express = require('express');
const router = express.Router();

// Import route modules
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const mediaRoutes = require('./routes/media');
const searchRoutes = require('./routes/search');
const analyticsRoutes = require('./routes/analytics');
const systemRoutes = require('./routes/system');
const traceRoutes = require('./routes/trace');
const exportRoutes = require('./routes/export');

// Mount routes
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/media', mediaRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/trace', traceRoutes);
router.use('/export', exportRoutes);
router.use('/', systemRoutes);

// Legacy routes for backward compatibility
router.use('/stats', analyticsRoutes);
router.use('/dashboard', analyticsRoutes);

module.exports = router;
