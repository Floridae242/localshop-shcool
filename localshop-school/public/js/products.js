// Enhanced Products Management with Perfect UX
let allProducts = [];
let filteredProducts = [];

// Sample products for static hosting
const sampleProducts = [
    {
        id: 1,
        name: 'ผักกาดขาว',
        name_en: 'Chinese Cabbage',
        category: 'vegetable',
        category_th: 'ผักใบเขียว',
        unit: 'กิโลกรัม',
        price: 25.00,
        stock: 50,
        image_url: 'img/lettuce.jpg',
        description: 'ผักกาดขาวสด ปลอดสารพิษ เก็บใหม่ทุกเช้า จากแปลงปลูกของโรงเรียน',
        harvest_date: '2025-09-29',
        farmer: 'นักเรียนชั้น ม.3/1',
        qr_code: 'QR001',
        nutrients: 'วิตามิน A, C, K และใยอาหาร'
    },
    {
        id: 2,
        name: 'เห็ดนางฟ้า',
        name_en: 'Oyster Mushroom',
        category: 'vegetable',
        category_th: 'เห็ด',
        unit: 'กิโลกรัม',
        price: 45.00,
        stock: 20,
        image_url: 'img/mushroom.jpg',
        description: 'เห็ดนางฟ้าสด เพาะปลูกในโรงเรือนควบคุมอุณหภูมิ',
        harvest_date: '2025-09-30',
        farmer: 'ครูณัฐพล และนักเรียนชั้น ม.2',
        qr_code: 'QR002',
        nutrients: 'โปรตีน วิตามิน B และแร่ธาตุ'
    },
    {
        id: 3,
        name: 'แตงกวา',
        name_en: 'Cucumber',
        category: 'vegetable',
        category_th: 'ผักผล',
        unit: 'กิโลกรัม',
        price: 20.00,
        stock: 35,
        image_url: 'img/cucumber.jpg',
        description: 'แตงกวาสด กరอบ หวาน ไร้สารเคมี',
        harvest_date: '2025-09-30',
        farmer: 'นักเรียนชั้น ป.6',
        qr_code: 'QR003',
        nutrients: 'น้ำ 95% วิตามิน K และโพแทสเซียม'
    },
    {
        id: 4,
        name: 'มะเขือเทศ',
        name_en: 'Tomato',
        category: 'vegetable',
        category_th: 'ผักผล',
        unit: 'กิโลกรัม',
        price: 30.00,
        stock: 40,
        image_url: 'img/harvest.jpg',
        description: 'มะเขือเทศสีแดงสด หวานฉ่ำ อุดมด้วยไลโคปีน',
        harvest_date: '2025-09-29',
        farmer: 'นักเรียนชั้น ม.1/2',
        qr_code: 'QR004',
        nutrients: 'ไลโคปีน วิตามิน C และโฟเลต'
    },
    {
        id: 5,
        name: 'ใบโหระพา',
        name_en: 'Holy Basil',
        category: 'herb',
        category_th: 'สมุนไพร',
        unit: 'กำ',
        price: 15.00,
        stock: 25,
        image_url: 'img/kale.jpg',
        description: 'ใบโหระพาสด หอม สรรพคุณสูง',
        harvest_date: '2025-09-30',
        farmer: 'ครูสมหญิง',
        qr_code: 'QR005',
        nutrients: 'สารต้านอนุมูลอิสระ และน้ำมันหอมระเหย'
    },
    {
        id: 6,
        name: 'ไข่ปลาดุก',
        name_en: 'Catfish Eggs',
        category: 'fish',
        category_th: 'ผลิตภัณฑ์จากบ่อ',
        unit: 'กิโลกรัม',
        price: 80.00,
        stock: 10,
        image_url: 'img/fish.jpg',
        description: 'ไข่ปลาดุกสด จากบ่อเลี้ยงของโรงเรียน',
        harvest_date: '2025-09-29',
        farmer: 'ครูสมชาย',
        qr_code: 'QR006',
        nutrients: 'โปรตีนสูง โอเมก้า 3'
    }
];

// Loading states
function showLoading() {
    document.getElementById('products-grid').innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="loading-spinner me-3"></div>
            <span class="text-muted">กำลังโหลดสินค้า...</span>
        </div>
    `;
}

// Enhanced product loading
async function loadProducts() {
    try {
        showLoading();
        
        // Try to fetch from API first, fallback to sample data
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                allProducts = await response.json();
            } else {
                throw new Error('API not available');
            }
        } catch (apiError) {
            // Use sample data for static hosting
            allProducts = sampleProducts;
        }
        
        filteredProducts = [...allProducts];
        renderProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle text-warning fs-2 mb-3"></i>
                <h4>เกิดข้อผิดพลาดในการโหลดสินค้า</h4>
                <button class="btn btn-success mt-3" onclick="loadProducts()">
                    <i class="fas fa-redo me-1"></i>ลองใหม่
                </button>
            </div>
        `;
    }
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => product.category === category);
    }
    
    // Update filter button states
    document.querySelectorAll('.btn-outline-success').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderProducts();
}

// Render products with enhanced cards
function renderProducts() {
    const container = document.getElementById('products-grid');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search text-muted fs-2 mb-3"></i>
                <h4>ไม่พบสินค้าในหมวดหมู่นี้</h4>
                <button class="btn btn-outline-success" onclick="filterProducts('all')">
                    <i class="fas fa-th me-1"></i>ดูสินค้าทั้งหมด
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map((product, index) => `
        <div class="col-lg-4 col-md-6" style="animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;">
            <div class="card product-card h-100 position-relative">
                <div class="position-absolute top-0 end-0 m-3 z-3">
                    <span class="badge bg-success">${product.category_th}</span>
                </div>
                <div class="position-absolute top-0 start-0 m-3 z-3">
                    ${product.stock < 10 ? '<span class="badge bg-warning">เหลือน้อย</span>' : ''}
                    ${product.stock === 0 ? '<span class="badge bg-danger">หมด</span>' : ''}
                </div>
                
                <img src="${product.image_url}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${product.name}</h5>
                    <p class="card-text text-muted small mb-2">${product.name_en}</p>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    
                    <div class="row g-2 mb-3 small text-muted">
                        <div class="col-6">
                            <i class="fas fa-calendar-alt me-1"></i>
                            ${new Date(product.harvest_date).toLocaleDateString('th-TH')}
                        </div>
                        <div class="col-6">
                            <i class="fas fa-user me-1"></i>
                            ${product.farmer}
                        </div>
                        <div class="col-12">
                            <i class="fas fa-leaf me-1"></i>
                            ${product.nutrients}
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span class="h4 text-success fw-bold mb-0">฿${product.price.toFixed(2)}</span>
                            <small class="text-muted">/${product.unit}</small>
                        </div>
                        <div class="text-end">
                            <small class="text-muted d-block">คงเหลือ</small>
                            <span class="fw-bold ${product.stock < 10 ? 'text-warning' : 'text-success'}">
                                ${product.stock} ${product.unit}
                            </span>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button class="btn btn-success" onclick="showQRInfo('${product.qr_code}', '${product.name}')" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-qrcode me-1"></i>ดูข้อมูลย้อนกลับ
                        </button>
                        <a href="order.html?product=${product.id}" class="btn btn-outline-success" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart me-1"></i>สั่งซื้อ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show QR traceability information
function showQRInfo(qrCode, productName) {
    const product = allProducts.find(p => p.qr_code === qrCode);
    if (!product) return;
    
    document.getElementById('qr-info').innerHTML = `
        <div class="text-center mb-4">
            <div class="qr-code-placeholder bg-light p-4 rounded">
                <i class="fas fa-qrcode display-4 text-success"></i>
                <p class="mt-2 mb-0 fw-bold">${qrCode}</p>
            </div>
        </div>
        
        <h5 class="fw-bold mb-3">${product.name} (${product.name_en})</h5>
        
        <div class="row g-3">
            <div class="col-md-6">
                <div class="info-card p-3 bg-light rounded">
                    <h6 class="fw-bold"><i class="fas fa-calendar-alt text-success me-2"></i>วันที่เก็บเกี่ยว</h6>
                    <p class="mb-0">${new Date(product.harvest_date).toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="info-card p-3 bg-light rounded">
                    <h6 class="fw-bold"><i class="fas fa-user text-success me-2"></i>ผู้ปลูก</h6>
                    <p class="mb-0">${product.farmer}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="info-card p-3 bg-light rounded">
                    <h6 class="fw-bold"><i class="fas fa-tag text-success me-2"></i>หมวดหมู่</h6>
                    <p class="mb-0">${product.category_th}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="info-card p-3 bg-light rounded">
                    <h6 class="fw-bold"><i class="fas fa-weight text-success me-2"></i>หน่วย</h6>
                    <p class="mb-0">${product.unit}</p>
                </div>
            </div>
            <div class="col-12">
                <div class="info-card p-3 bg-light rounded">
                    <h6 class="fw-bold"><i class="fas fa-leaf text-success me-2"></i>คุณค่าทางโภชนาการ</h6>
                    <p class="mb-0">${product.nutrients}</p>
                </div>
            </div>
            <div class="col-12">
                <div class="info-card p-3 bg-light rounded">
                    <h6 class="fw-bold"><i class="fas fa-info-circle text-success me-2"></i>รายละเอียด</h6>
                    <p class="mb-0">${product.description}</p>
                </div>
            </div>
        </div>
        
        <div class="alert alert-success mt-4" role="alert">
            <i class="fas fa-shield-alt me-2"></i>
            <strong>รับประกันคุณภาพ:</strong> ผลิตภัณฑ์นี้ปลูกโดยไม่ใช้สารเคมี ผ่านการดูแลโดยครูและนักเรียนของโรงเรียนบอเมืองน้อกขา
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('qrModal'));
    modal.show();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Add smooth transitions
    document.querySelectorAll('.btn-outline-success').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    console.log('🌱 Products page loaded successfully!');
});
