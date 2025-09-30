require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const { Parser } = require('json2csv');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'localshop_school',
  port: process.env.DB_PORT || 3306
});
connection.connect(err => {
  if (err) { console.error('Error connecting to MySQL:', err); return; }
  console.log('Connected to MySQL successfully');
});

function requireAdmin(req, res, next){
  const pass = req.headers['x-admin-pass'] || req.query.admin;
  if (pass === process.env.ADMIN_PASS) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

app.get('/api', (req,res)=> res.json({ ok:true, service:'LocalShop API' }));

// Products
app.get('/api/products', (req,res)=>{
  connection.query('SELECT * FROM products ORDER BY id DESC', (err,rows)=>{
    if(err){ console.error('Error fetching products:', err); return res.status(500).json({message:'Error fetching products'}); }
    res.json(rows);
  });
});

app.post('/api/products', requireAdmin, (req,res)=>{
  const { name, category, price, unit, stock, image_url } = req.body;
  const q = 'INSERT INTO products (name,category,price,unit,stock,image_url) VALUES (?,?,?,?,?,?)';
  connection.query(q, [name,category,price,unit,stock,image_url], (err, result)=>{
    if(err){ console.error('Error creating product:', err); return res.status(500).json({message:'Error creating product'}); }
    res.status(201).json({ id: result.insertId });
  });
});

app.put('/api/products/:id', requireAdmin, (req,res)=>{
  const { id } = req.params;
  const { name, category, price, unit, stock, image_url } = req.body;
  const q = 'UPDATE products SET name=?, category=?, price=?, unit=?, stock=?, image_url=? WHERE id=?';
  connection.query(q, [name,category,price,unit,stock,image_url,id], (err)=>{
    if(err){ console.error('Error updating product:', err); return res.status(500).json({message:'Error updating product'}); }
    res.json({ ok:true });
  });
});

app.delete('/api/products/:id', requireAdmin, (req,res)=>{
  connection.query('DELETE FROM products WHERE id=?', [req.params.id], (err)=>{
    if(err){ console.error('Error deleting product:', err); return res.status(500).json({message:'Error deleting product'}); }
    res.json({ ok:true });
  });
});

// Orders
app.get('/api/orders', requireAdmin, (req,res)=>{
  const q = `SELECT o.*, p.name AS product_name, p.unit FROM orders o
             JOIN products p ON p.id=o.product_id ORDER BY o.id DESC`;
  connection.query(q, (err,rows)=>{
    if(err){ console.error('Error fetching orders:', err); return res.status(500).json({message:'Error fetching orders'}); }
    res.json(rows);
  });
});

app.post('/api/orders', (req,res)=>{
  const { buyer_name, phone, product_id, qty } = req.body;
  connection.query('SELECT name, price FROM products WHERE id=?', [product_id], (err,rows)=>{
    if(err||rows.length===0){ return res.status(400).json({message:'Invalid product'}); }
    const price = rows[0].price; 
    const productName = rows[0].name;
    const total = Number(price) * Number(qty);
    const traceId = uuidv4();
    const insertQ = 'INSERT INTO orders (buyer_name,phone,product_id,qty,total,status,trace_id) VALUES (?,?,?,?,?,\'NEW\',?)';
    connection.query(insertQ, [buyer_name,phone,product_id,qty,total,traceId], (err2, result)=>{
      if(err2){ console.error('Error creating order:', err2); return res.status(500).json({message:'Error creating order'}); }
      connection.query('UPDATE products SET stock=GREATEST(stock-?,0) WHERE id=?', [qty, product_id]);
      
      // Generate QR Code for traceability
      const qrData = {
        orderId: result.insertId,
        traceId: traceId,
        product: productName,
        qty: qty,
        buyer: buyer_name,
        school: 'Baan Maehoyngoen School',
        verifyUrl: `${req.protocol}://${req.get('host')}/api/trace/${traceId}`
      };
      
      QRCode.toDataURL(JSON.stringify(qrData), (qrErr, qrUrl) => {
        if(qrErr) console.error('QR generation error:', qrErr);
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

app.put('/api/orders/:id/status', requireAdmin, (req,res)=>{
  const { status } = req.body;
  connection.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id], (err)=>{
    if(err){ console.error('Error updating status:', err); return res.status(500).json({message:'Error updating status'}); }
    res.json({ ok:true });
  });
});

// Album
app.get('/api/media', (req,res)=>{
  connection.query('SELECT * FROM media ORDER BY id DESC', (err,rows)=>{
    if(err){ return res.status(500).json({message:'Error fetching album'}); }
    res.json(rows);
  });
});

// QR Traceability
app.get('/api/trace/:traceId', (req, res) => {
  const { traceId } = req.params;
  const q = `SELECT o.*, p.name AS product_name, p.category, p.unit 
             FROM orders o JOIN products p ON p.id = o.product_id 
             WHERE o.trace_id = ?`;
  connection.query(q, [traceId], (err, rows) => {
    if(err || rows.length === 0) {
      return res.status(404).json({message: 'Order not found or invalid trace ID'});
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

// Downloads
app.get('/api/export/products.csv', requireAdmin, (req,res)=>{
  connection.query('SELECT id,name,category,price,unit,stock FROM products', (err,rows)=>{
    if(err){ return res.status(500).send('Export error'); }
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.setHeader('Content-Type','text/csv');
    res.setHeader('Content-Disposition','attachment; filename=\"products.csv\"');
    res.send(csv);
  });
});

app.get('/api/export/orders.csv', requireAdmin, (req,res)=>{
  const q = `SELECT o.id,o.buyer_name,o.phone,p.name AS product,o.qty,o.total,o.status,o.created_at
             FROM orders o JOIN products p ON p.id=o.product_id ORDER BY o.id DESC`;
  connection.query(q, (err,rows)=>{
    if(err){ return res.status(500).send('Export error'); }
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.setHeader('Content-Type','text/csv');
    res.setHeader('Content-Disposition','attachment; filename=\"orders.csv\"');
    res.send(csv);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server listening on port ${port}`));
