# AgriLink School Model - User Flow

## 1. Parent/Guardian Journey (Customer Flow)

### Primary Purchase Flow
```
🏠 HOME PAGE
├── 👀 View School Album
├── 📖 Read About School Farm
└── 🛒 Browse Products
    │
    ▼
🛍️ PRODUCTS PAGE
├── 🔍 Filter by Category
├── 👁️ View Product Details
└── ➕ Add to Order
    │
    ▼
📝 ORDER FORM
├── ✏️ Fill Contact Info
├── 🔢 Select Quantity
├── 💰 View Total Price
└── ✅ Confirm Order
    │
    ▼
🎉 SUCCESS PAGE
├── 📋 Order Confirmation
├── 📱 QR Code for Verification
├── 💾 Save/Share QR Code
└── 📞 Contact Info if Needed
```

### Quality Verification Flow
```
📱 QR Code Scan
    │
    ▼
🔍 VERIFICATION PAGE
├── ✅ Product Authenticity
├── 🏫 School Information
├── 📅 Harvest Date
├── 🧪 Safety Certification
└── 👨‍🌾 Farmer/Student Details
```

---

## 2. Teacher/Admin Journey (Management Flow)

### Daily Management Flow
```
🔐 LOGIN to Dashboard
    │
    ▼
📊 DASHBOARD HOME
├── 📈 Today's Summary
├── 🆕 New Orders Alert
├── 📦 Low Stock Warning
└── 💰 Revenue Overview
    │
    ▼ (Choose Action)
    │
📦 INVENTORY MANAGEMENT  
├── ➕ Add New Product
├── ✏️ Edit Product Info
├── 🔢 Update Stock Level
└── 🗑️ Remove Product
    │
📝 ORDER MANAGEMENT
├── 👀 View New Orders
├── ☎️ Contact Customers  
├── ✅ Confirm Orders
├── ❌ Cancel if Needed
└── 📋 Update Order Status
    │
📊 REPORTING & EXPORT
├── 📈 View Sales Reports
├── 💾 Download CSV Files
├── 📧 Send to Principal
└── 🔄 Backup Data
```

### Product Addition Flow
```
➕ ADD PRODUCT
├── 📝 Enter Product Name
├── 🏷️ Select Category
├── 💰 Set Price & Unit
├── 🔢 Add Stock Quantity
├── 📸 Upload Product Photo
└── ✅ Save Product
    │
    ▼
🔄 AUTO PUBLISH
├── ✅ Live on Website
├── 📢 Notify Customers
└── 📊 Track in Dashboard
```

---

## 3. Student Helper Journey (Engagement Flow)

### Content Creation Flow
```
📸 FARM PHOTOGRAPHY
├── 🌱 Capture Farm Activities  
├── 🍅 Photo Product Harvest
├── 👨‍🌾 Document Process
└── 📱 Share with Teacher
    │
    ▼
📝 CONTENT UPDATE
├── ✏️ Write Descriptions
├── 🎯 Tag Products
├── 📅 Add Dates
└── 🌐 Publish to Website
```

---

## 4. Error & Edge Case Flows

### Out of Stock Scenario
```
🛍️ Customer Selects Product
    │
    ▼
⚠️ STOCK CHECK
├── ❌ Out of Stock
│   ├── 📧 Suggest Alternatives
│   ├── 📝 Join Waiting List
│   └── 🔔 Get Restock Notification
│
└── ✅ Available
    └── Continue to Order
```

### Technical Issues Flow  
```
📱 User Action
    │
    ▼
⚠️ ERROR DETECTED
├── 🔄 Auto-Retry (Network)
├── 📝 Simple Error Message
├── 🆘 Contact Support Info
└── 🔙 Return to Previous Step
```

---

## 5. Success Metrics & KPIs

### Customer Journey Metrics
- **Conversion Rate**: Visit → Purchase
- **Time to Order**: From landing → confirmation
- **QR Scan Rate**: Verification usage
- **Return Customer Rate**: Repeat purchases

### Teacher Efficiency Metrics
- **Order Processing Time**: New → Confirmed
- **Inventory Update Frequency**: Daily updates
- **Export Usage**: CSV downloads per week
- **Error Rate**: Failed operations

### Overall System Health
- **Uptime**: 99%+ availability
- **Mobile Usage**: 80%+ mobile traffic
- **User Satisfaction**: 4.5+ rating
- **School Revenue**: 20%+ increase

---

## 6. Integration Touchpoints

### External Systems
```
🌐 LocalShop Website
├── 📧 LINE Notify Integration
├── 📊 Google Sheets Export
├── 💳 Mobile Banking Links
└── 📱 QR Code Verification
```

### Communication Flow
```
📱 Customer Places Order
    │
    ▼
📧 LINE Notify to Teacher
    │
    ▼
✅ Teacher Confirms
    │
    ▼
📱 Customer Notification
    │
    ▼
🤝 Pickup/Delivery Arranged
```