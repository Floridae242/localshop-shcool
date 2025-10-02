# AgriLink School Model - API Documentation

## 🚀 API Overview

**Base URL**: `http://localhost:3000/api`  
**Version**: 1.0.0  
**Authentication**: Admin endpoints require `x-admin-pass` header

---

## 📋 API Endpoints

### 🔍 **System & Health**

#### `GET /api`
Get API information and available endpoints
```json
{
  "ok": true,
  "service": "AgriLink School API",
  "version": "1.0.0",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "endpoints": {
    "products": "/api/products",
    "orders": "/api/orders",
    "media": "/api/media",
    "trace": "/api/trace/:traceId",
    "stats": "/api/stats",
    "health": "/api/health"
  }
}
```

#### `GET /api/health`
Check system health and database connection
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

---

### 🛍️ **Products API**

#### `GET /api/products`
Get all products with optional filtering
**Query Parameters:**
- `category` - Filter by category (vegetable, mushroom, etc.)
- `search` - Search in product names
- `in_stock` - Only show products with stock > 0

**Example:**
```
GET /api/products?category=vegetable&in_stock=true
```

#### `GET /api/products/:id`
Get single product by ID
```
GET /api/products/1
```

#### `GET /api/products/categories`
Get all available product categories
```json
["Vegetable", "Mushroom", "Frog", "Egg", "Fish"]
```

#### `POST /api/products` 🔒
Create new product (Admin only)
```json
{
  "name": "ผักกาดขาว",
  "category": "Vegetable",
  "price": 25.00,
  "unit": "กิโลกรัม",
  "stock": 50,
  "image_url": "img/lettuce.jpg"
}
```

#### `PUT /api/products/:id` 🔒
Update product (Admin only)
```json
{
  "name": "ผักกาดขาวอัพเดท",
  "category": "Vegetable",
  "price": 30.00,
  "unit": "กิโลกรัม",
  "stock": 45,
  "image_url": "img/lettuce-new.jpg"
}
```

#### `DELETE /api/products/:id` 🔒
Delete product (Admin only)

---

### 📦 **Orders API**

#### `GET /api/orders` 🔒
Get all orders with optional filtering (Admin only)
**Query Parameters:**
- `status` - Filter by status (NEW, CONFIRMED, CANCELLED)
- `date_from` - Filter from date (YYYY-MM-DD)
- `date_to` - Filter to date (YYYY-MM-DD)
- `limit` - Limit number of results

#### `GET /api/orders/:id` 🔒
Get single order by ID (Admin only)

#### `POST /api/orders`
Create new order
```json
{
  "buyer_name": "คุณสมใจ ใจดี",
  "phone": "0812345678",
  "product_id": 1,
  "qty": 2
}
```

**Response:**
```json
{
  "id": 123,
  "total": 50.00,
  "traceId": "uuid-here",
  "qrCode": "data:image/png;base64...",
  "verifyUrl": "http://localhost:3000/api/trace/uuid-here"
}
```

#### `PUT /api/orders/:id/status` 🔒
Update order status (Admin only)
```json
{
  "status": "CONFIRMED"
}
```

---

### 📸 **Media API**

#### `GET /api/media`
Get all media/album items

#### `POST /api/media` 🔒
Create new media item (Admin only)
```json
{
  "title": "วันเก็บเกี่ยวผลผลิต",
  "url": "img/harvest.jpg",
  "caption": "นักเรียนเก็บผักสดตอนเช้า"
}
```

#### `PUT /api/media/:id` 🔒
Update media item (Admin only)

#### `DELETE /api/media/:id` 🔒
Delete media item (Admin only)

---

### 🔍 **Search API**

#### `GET /api/search`
Search products or orders
**Query Parameters:**
- `q` - Search query (required)
- `type` - Search type: "products" or "orders"

**Examples:**
```
GET /api/search?q=ผัก&type=products
GET /api/search?q=0812345678&type=orders
```

---

### 📊 **Analytics API** 🔒

#### `GET /api/stats`
Get system statistics
```json
{
  "totalProducts": 15,
  "totalOrders": 45,
  "totalRevenue": 2500.00,
  "lowStockItems": 3,
  "recentOrders": 8
}
```

#### `GET /api/dashboard`
Get dashboard summary
```json
{
  "todayOrders": 5,
  "todayRevenue": 300.00,
  "pendingOrders": 2,
  "outOfStock": 1
}
```

#### `GET /api/analytics/sales`
Get sales analytics
**Query Parameters:**
- `period` - Number of days (default: 30)

#### `GET /api/analytics/products`
Get product performance analytics

---

### 🔗 **Traceability API**

#### `GET /api/trace/:traceId`
Verify product traceability via QR code
```json
{
  "verified": true,
  "school": "โรงเรียนบ้านแม่ฮ้อยเงิน (Baan Maehoyngoen School)",
  "location": "ดอยสะเก็ด, เชียงใหม่",
  "product": {
    "name": "ผักกาดขาว",
    "category": "Vegetable",
    "quantity": "2 กิโลกรัม",
    "total": "50 บาท"
  },
  "buyer": "คุณสมใจ ใจดี",
  "orderDate": "2025-01-27T10:30:00.000Z",
  "status": "CONFIRMED",
  "message": "ผลผลิตปลอดภัย ตรวจสอบได้ จากโรงเรียนแม่ฮ้อยเงิน"
}
```

---

### 📥 **Export API** 🔒

#### `GET /api/export/products.csv`
Export products to CSV

#### `GET /api/export/orders.csv`
Export orders to CSV

---

## 🔐 Authentication

Admin endpoints require authentication via header:
```
x-admin-pass: your_admin_password
```

Or via query parameter:
```
GET /api/orders?admin=your_admin_password
```

---

## 📝 Response Format

### Success Response
```json
{
  "ok": true,
  "data": {...}
}
```

### Error Response
```json
{
  "ok": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing

Use the built-in test page:
```
http://localhost:3000/test-api.html
```

Or test with curl:
```bash
# Test health check
curl http://localhost:3000/api/health

# Test products API
curl http://localhost:3000/api/products

# Test with admin authentication
curl -H "x-admin-pass: admin123" http://localhost:3000/api/orders
```

---

## 📊 Rate Limiting

Currently no rate limiting implemented. Consider adding for production use.

---

## 🔧 Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=localshop_school
DB_PORT=3306
ADMIN_PASS=admin123
PORT=3000
```

---

## 📈 Usage Examples

### Frontend Integration
```javascript
// Load products
const products = await fetch('/api/products').then(r => r.json());

// Create order
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    buyer_name: 'คุณสมใจ',
    phone: '0812345678',
    product_id: 1,
    qty: 2
  })
}).then(r => r.json());

// Get statistics (admin)
const stats = await fetch('/api/stats', {
  headers: { 'x-admin-pass': 'admin123' }
}).then(r => r.json());
```

---

**Built with ❤️ for sustainable education**

