// Traceability Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');

// QR Traceability
router.get('/:traceId', async (req, res) => {
  try {
    const { traceId } = req.params;
    const orders = await query(
      `SELECT o.*, p.name AS product_name, p.category, p.unit 
       FROM orders o JOIN products p ON p.id = o.product_id 
       WHERE o.trace_id = ?`,
      [traceId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found or invalid trace ID' });
    }
    
    const order = orders[0];
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
  } catch (error) {
    console.error('Trace error:', error);
    res.status(500).json({ message: 'Trace error' });
  }
});

module.exports = router;


