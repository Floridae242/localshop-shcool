# API Directory Structure

## 📁 โครงสร้างโฟลเดอร์ API

```
api/
├── index.js                 # Main API router
├── middleware/              # Middleware functions
│   ├── auth.js             # Authentication middleware
│   └── database.js         # Database connection & helpers
├── routes/                 # API route modules
│   ├── products.js         # Products CRUD operations
│   ├── orders.js           # Orders management
│   ├── media.js            # Media/Album management
│   ├── search.js           # Search functionality
│   ├── analytics.js        # Statistics & analytics
│   ├── system.js           # System health & info
│   ├── trace.js            # QR traceability
│   └── export.js           # CSV export functions
└── README.md               # This file
```

## 🔧 การใช้งาน

### Main Router (`index.js`)
- รวม routes ทั้งหมดเข้าด้วยกัน
- Mount กับ `/api` path ใน app.js

### Middleware (`middleware/`)
- **auth.js**: ตรวจสอบ admin authentication
- **database.js**: จัดการ database connection และ query helpers

### Routes (`routes/`)
แต่ละไฟล์จัดการ API endpoints ตามหมวดหมู่:

#### Products (`products.js`)
- `GET /api/products` - ดึงสินค้าทั้งหมด
- `GET /api/products/:id` - ดึงสินค้าเฉพาะ
- `GET /api/products/categories` - ดึงหมวดหมู่
- `POST /api/products` - สร้างสินค้าใหม่ (Admin)
- `PUT /api/products/:id` - แก้ไขสินค้า (Admin)
- `DELETE /api/products/:id` - ลบสินค้า (Admin)

#### Orders (`orders.js`)
- `GET /api/orders` - ดึงคำสั่งซื้อ (Admin)
- `GET /api/orders/:id` - ดึงคำสั่งซื้อเฉพาะ (Admin)
- `POST /api/orders` - สร้างคำสั่งซื้อใหม่
- `PUT /api/orders/:id/status` - อัพเดทสถานะ (Admin)

#### Media (`media.js`)
- `GET /api/media` - ดึงสื่อ/อัลบั้ม
- `GET /api/media/:id` - ดึงสื่อเฉพาะ
- `POST /api/media` - สร้างสื่อใหม่ (Admin)
- `PUT /api/media/:id` - แก้ไขสื่อ (Admin)
- `DELETE /api/media/:id` - ลบสื่อ (Admin)

#### Search (`search.js`)
- `GET /api/search?q=query&type=products` - ค้นหาสินค้า
- `GET /api/search?q=query&type=orders` - ค้นหาคำสั่งซื้อ

#### Analytics (`analytics.js`)
- `GET /api/analytics/stats` - สถิติระบบ (Admin)
- `GET /api/analytics/dashboard` - ข้อมูล Dashboard (Admin)
- `GET /api/analytics/sales` - วิเคราะห์ยอดขาย (Admin)
- `GET /api/analytics/products` - วิเคราะห์สินค้า (Admin)

#### System (`system.js`)
- `GET /api` - ข้อมูล API
- `GET /api/health` - ตรวจสอบสถานะระบบ

#### Trace (`trace.js`)
- `GET /api/trace/:traceId` - ตรวจสอบย้อนกลับ QR Code

#### Export (`export.js`)
- `GET /api/export/products.csv` - Export สินค้า (Admin)
- `GET /api/export/orders.csv` - Export คำสั่งซื้อ (Admin)

## 🚀 การเพิ่ม Route ใหม่

1. สร้างไฟล์ใหม่ใน `routes/` เช่น `newfeature.js`
2. ใช้โครงสร้างเดียวกัน:
   ```javascript
   const express = require('express');
   const router = express.Router();
   const { query } = require('../middleware/database');
   const { requireAdmin } = require('../middleware/auth');
   
   // Routes here
   
   module.exports = router;
   ```
3. เพิ่มใน `api/index.js`:
   ```javascript
   const newFeatureRoutes = require('./routes/newfeature');
   router.use('/newfeature', newFeatureRoutes);
   ```

## 🔐 Authentication

ใช้ `requireAdmin` middleware สำหรับ endpoints ที่ต้องการ admin:
```javascript
router.get('/admin-only', requireAdmin, async (req, res) => {
  // Admin only code
});
```

## 🗄️ Database

ใช้ `query` helper จาก `database.js`:
```javascript
const { query } = require('../middleware/database');

// Simple query
const results = await query('SELECT * FROM products');

// Query with parameters
const results = await query('SELECT * FROM products WHERE id = ?', [id]);
```

## 📝 Error Handling

ใช้ try-catch และส่ง error response:
```javascript
try {
  const results = await query('SELECT * FROM products');
  res.json(results);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ message: 'Error message' });
}
```

## 🧪 Testing

ทดสอบ API ได้ที่ `http://localhost:3000/test-api.html`

---

**Built with ❤️ for sustainable education**


