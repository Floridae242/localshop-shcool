# AgriLink School Model - Wireframes

## Mobile Wireframes (Primary)

### 1. Home Page (index.html)
```
📱 Mobile Layout (320-768px)
┌─────────────────────────┐
│ [☰] LocalShop     [🛒] │ ← Navigation Bar
├─────────────────────────┤
│   🏫 School Farm Hub   │ ← Hero Section
│  โปร่งใส ง่าย เชื่อมชุมชน │
│                         │
│ [ดูผลผลิต] [สั่งซื้อ]    │ ← CTA Buttons
├─────────────────────────┤
│     📸 อัลบั้มกิจกรรม     │ ← Album Section
├─────────────────────────┤
│ [🌱][🍄][🐸]           │ ← Image Grid
│ [🥬][🥒][🥚]           │   3 columns
│                         │
├─────────────────────────┤
│ © 2025 LocalShop       │ ← Footer
└─────────────────────────┘
```

### 2. Products Page (products.html)
```
📱 Mobile Layout
┌─────────────────────────┐
│ [←] ผลผลิตของเรา        │ ← Header + Back
├─────────────────────────┤
│ 🔍 [ค้นหา...      ] [⚙] │ ← Search + Filter
├─────────────────────────┤
│ ┌─────────────────────┐ │ ← Product Card
│ │ 🍄 [Product Image]  │ │
│ │ เห็ดนางฟ้าออร์แกนิค  │ │
│ │ 60 บาท/กก          │ │
│ │ คงเหลือ: 15 กก      │ │
│ │     [สั่งซื้อ]       │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ ┌─────────────────────┐ │ ← Repeat for more
│ │ 🐸 [Product Image]  │ │   products
│ │ กบเลี้ยงจากบ่อธรรมชาติ │ │
│ │ 120 บาท/กก         │ │
│ │ คงเหลือ: 8 กก       │ │
│ │     [สั่งซื้อ]       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### 3. Order Form (order.html)
```
📱 Mobile Layout
┌─────────────────────────┐
│ [←] สั่งซื้อสินค้า       │ ← Header
├─────────────────────────┤
│ ชื่อผู้ซื้อ *            │
│ [________________]      │ ← Input Fields
│                         │
│ เบอร์โทรศัพท์ *         │
│ [________________]      │
│                         │
│ เลือกสินค้า *           │
│ [▼ เห็ดนางฟ้าออร์แกนิค ] │ ← Dropdown
│                         │
│ จำนวน *                │
│ [___] กก                │ ← Quantity + Unit
│                         │
├─────────────────────────┤
│ 💰 ราคารวม: 120 บาท    │ ← Price Display
├─────────────────────────┤
│     [ยืนยันคำสั่งซื้อ]    │ ← Submit Button
│                         │   (Large, Green)
└─────────────────────────┘
```

### 4. Order Success Page
```
📱 Mobile Layout
┌─────────────────────────┐
│ ✅ สั่งซื้อสำเร็จ!       │ ← Success Header
├─────────────────────────┤
│ เลขที่คำสั่งซื้อ: #123  │ ← Order Details
│ สินค้า: เห็ดนางฟ้า 2 กก │
│ ราคา: 120 บาท          │
│ วันที่: 30/09/2025     │
├─────────────────────────┤
│ 📱 QR Code ตรวจสอบ     │ ← QR Section
│ ┌─────────────────────┐ │
│ │ ████ ████ ████ ████ │ │ QR Code Image
│ │ ████ ████ ████ ████ │ │
│ │ ████ ████ ████ ████ │ │
│ └─────────────────────┘ │
│                         │
│ [💾 บันทึก QR] [📤 แชร์] │ ← Action Buttons
├─────────────────────────┤
│ 📞 ติดต่อสอบถาม:       │ ← Contact Info
│ ครูมาลี: 089-xxx-xxxx  │
└─────────────────────────┘
```

---

## Desktop Wireframes (1024px+)

### 1. Dashboard (dashboard.html) - Admin View
```
💻 Desktop Layout
┌─────────────────────────────────────────────────────────────┐
│ LocalShop Dashboard              [ออกจากระบบ] │ ← Top Bar
├─────────────────────────────────────────────────────────────┤
│ 📊 สรุปวันนี้                                               │ ← Stats Row
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                           │
│ │ 🆕  │ │ 💰  │ │ 📦  │ │ ✅  │                           │
│ │  5  │ │ 890 │ │ 12  │ │ 15  │                           │
│ │Order│ │Bath │ │Stock│ │Done │                           │
│ └─────┘ └─────┘ └─────┘ └─────┘                           │
├─────────────────────────────────────────────────────────────┤
│ จัดการสินค้า                    [➕ เพิ่มสินค้า] [📥 CSV]  │ ← Products Section
│ ┌────┬─────────────┬─────┬─────┬─────────┬──────────────┐  │
│ │ ID │ ชื่อสินค้า    │ราคา │หน่วย│ คงเหลือ │ การดำเนินการ │  │
│ ├────┼─────────────┼─────┼─────┼─────────┼──────────────┤  │
│ │ 1  │ เห็ดนางฟ้า   │ 60  │ กก  │   15    │ [✏️] [🗑️]   │  │
│ │ 2  │ กบออร์แกนิค  │ 120 │ กก  │    8    │ [✏️] [🗑️]   │  │
│ └────┴─────────────┴─────┴─────┴─────────┴──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ คำสั่งซื้อใหม่                                  [📥 Export]  │ ← Orders Section
│ ┌────┬─────────┬───────────┬─────────┬─────────┬─────────┐  │
│ │ ID │ ลูกค้า   │ สินค้า     │ จำนวน   │ ยอดรวม  │ สถานะ   │  │
│ ├────┼─────────┼───────────┼─────────┼─────────┼─────────┤  │
│ │ 15 │ คุณสมใจ  │ เห็ดนางฟ้า │ 2 กก    │ 120 บาท│ [CONFIRM]│  │
│ │ 16 │ คุณมาลี  │ ผักกาดขาว  │ 5 มัด   │ 125 บาท│ [CONFIRM]│  │
│ └────┴─────────┴───────────┴─────────┴─────────┴─────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Navigation Component
```
Mobile: Hamburger Menu
├── Home (/)
├── Products (/products.html)  
├── Order (/order.html)
├── About (/about.html)
└── Dashboard (/dashboard.html) *admin only

Desktop: Horizontal Menu Bar
```

### Product Card Component
```
┌─────────────────────┐
│ [Product Image]     │ ← 16:9 Aspect Ratio
│ Product Name        │ ← Bold, 18px
│ Price + Unit        │ ← Green, 16px  
│ Stock Info          │ ← Gray, 14px
│   [Order Button]    │ ← Full width, Primary color
└─────────────────────┘
```

### Form Components
```
Input Field:
┌─────────────────────┐
│ Label *             │ ← Required indicator
│ [_____________]     │ ← Large touch target (48px)
│ Helper text         │ ← Small, gray
└─────────────────────┘

Button Styles:
Primary: [Green Background, White Text, Large]
Secondary: [White Background, Green Border]  
Danger: [Red Background, White Text]
```

### Responsive Breakpoints
```
📱 Mobile: 320px - 767px (Stack vertically)
💻 Tablet: 768px - 1023px (2 column layout)
🖥️ Desktop: 1024px+ (Multi-column layout)
```

---

## Accessibility Considerations

### Mobile Usability
- **Touch Targets**: Minimum 44px x 44px
- **Font Size**: 16px+ for readability
- **Contrast**: WCAG AA compliant (4.5:1 ratio)
- **Navigation**: Thumb-friendly positioning

### Thai Language Support
- **Fonts**: Support Thai Unicode correctly
- **Text Length**: Account for longer Thai text
- **Cultural UX**: Right-to-left number input for Thai users
- **Local Patterns**: Follow Thai mobile app conventions