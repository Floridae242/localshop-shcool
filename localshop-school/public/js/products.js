// Enhanced Products Management with Perfect UX
let allProducts = [];
let filteredProducts = [];
let currentQRCode = '';
let qrScanner = null;



// Loading states - Global function
window.showLoading = function() {
    document.getElementById('products-grid').innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="loading-spinner me-3"></div>
            <span class="text-muted">กำลังโหลดสินค้า...</span>
        </div>
    `;
}

// Enhanced product loading - Global function
window.loadProducts = async function() {
    try {
        window.showLoading();
        
        // Fetch from API
            const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        
        // Transform data to match expected format
        allProducts = allProducts.map(product => ({
            ...product,
            name_en: product.name_en || product.name,
            category_th: getCategoryThai(product.category),
            description: product.description || `ผลผลิตคุณภาพสูงจากโรงเรียนบ้านแม่ฮ้อยเงิน`,
            harvest_date: product.harvest_date || new Date().toISOString().split('T')[0],
            farmer: product.farmer || 'นักเรียนและครูโรงเรียนบ้านแม่ฮ้อยเงิน',
            qr_code: product.qr_code || `QR${product.id}`,
            nutrients: product.nutrients || 'ปลอดสารเคมี 100%'
        }));
        
        filteredProducts = [...allProducts];
        window.renderProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle text-warning fs-2 mb-3"></i>
                <h4>เกิดข้อผิดพลาดในการโหลดสินค้า</h4>
                <p class="text-muted">ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้</p>
                <button class="btn btn-success mt-3" onclick="window.loadProducts()">
                    <i class="fas fa-redo me-1"></i>ลองใหม่
                </button>
            </div>
        `;
    }
}

// Helper function to get Thai category names
function getCategoryThai(category) {
    const categoryMap = {
        'Mushroom': 'เห็ด',
        'Frog': 'กบ',
        'Vegetable': 'ผัก',
        'Egg': 'ไข่',
        'Fish': 'ปลา',
        'mushroom': 'เห็ด',
        'frog': 'กบ',
        'vegetable': 'ผัก',
        'egg': 'ไข่',
        'fish': 'ปลา',
        'herb': 'สมุนไพร'
    };
    return categoryMap[category] || category;
}

// Filter products by category - Global function
window.filterProducts = function(category) {
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
    
    window.renderProducts();
}

// Render products with enhanced cards - Global function
window.renderProducts = function() {
    const container = document.getElementById('products-grid');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search text-muted fs-2 mb-3"></i>
                <h4>ไม่พบสินค้าในหมวดหมู่นี้</h4>
                <button class="btn btn-outline-success" onclick="window.filterProducts('all')">
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
                            <span class="h4 text-success fw-bold mb-0">฿${parseFloat(product.price).toFixed(2)}</span>
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
                        <button class="btn btn-success" onclick="window.showQRInfo('${product.qr_code}', '${product.name}')" ${product.stock === 0 ? 'disabled' : ''}>
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

// Show QR traceability information - Global function
window.showQRInfo = function(qrCode, productName) {
    console.log('showQRInfo called with:', qrCode, productName);
    
    const product = allProducts.find(p => p.qr_code === qrCode);
    if (!product) {
        console.error('Product not found for QR code:', qrCode);
        return;
    }
    
    currentQRCode = qrCode;
    
    // Create QR code data URL with traceability information
    const qrData = {
        product_id: product.id,
        product_name: product.name,
        product_name_en: product.name_en,
        qr_code: product.qr_code,
        school: 'โรงเรียนบอเมืองน้อกขา',
        traceability: {
            planting_date: new Date(new Date(product.harvest_date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 30 days before harvest
            harvest_date: product.harvest_date,
            farmer: product.farmer,
            category: product.category_th,
            variety: product.name_en,
            growing_method: 'เกษตรอินทรีย์ (Organic)',
            soil_type: 'ดินร่วนปนทราย',
            water_source: 'น้ำฝนและน้ำบาดาล',
            fertilizer: 'ปุ๋ยหมักชีวภาพ',
            pest_control: 'วิธีธรรมชาติ (แมลงศัตรูธรรมชาติ)',
            quality_check: {
                date: product.harvest_date,
                inspector: 'ครูผู้ดูแล',
                result: 'ผ่านมาตรฐาน',
                notes: 'ปลอดสารเคมี 100%'
            },
            storage: {
                temperature: '15-20°C',
                humidity: '85-90%',
                method: 'เก็บในห้องเย็น'
            },
            nutrition_facts: product.nutrients,
            price: product.price,
            unit: product.unit,
            batch_number: `BATCH-${product.id}-${new Date().getFullYear()}`,
            expiry_date: new Date(new Date(product.harvest_date).getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // 7 days after harvest
        },
        contact: {
            school: 'โรงเรียนบอเมืองน้อกขา',
            address: 'ตำบลแม่ฮ้อยเงิน อำเภอแม่แจ่ม จังหวัดเชียงใหม่',
            phone: '053-123456',
            email: 'agrilink@school.ac.th'
        },
        generated_at: new Date().toISOString(),
        version: '1.0'
    };
    
    const qrDataString = JSON.stringify(qrData);
    
    // First, create the HTML structure
    document.getElementById('qr-info').innerHTML = `
        <div class="row">
            <div class="col-lg-4 text-center mb-4">
                <div class="qr-code-container bg-light p-4 rounded shadow-sm">
                    <div id="qr-canvas-container">
                        <div class="spinner-border text-success" role="status">
                            <span class="visually-hidden">กำลังสร้าง QR Code...</span>
                        </div>
                    </div>
                    <p class="mt-3 mb-0 fw-bold text-success">${qrCode}</p>
                    <small class="text-muted">สแกนเพื่อดูข้อมูลย้อนหลังแบบละเอียด</small>
                </div>
            </div>
            <div class="col-lg-8">
                <h5 class="fw-bold mb-3 text-success">${product.name} (${product.name_en})</h5>
                
                <!-- ข้อมูลพื้นฐาน -->
                <div class="row g-3 mb-4">
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
                </div>

                <!-- ข้อมูลย้อนหลัง -->
                <div class="traceability-section">
                    <h6 class="fw-bold text-success mb-3">
                        <i class="fas fa-history me-2"></i>ข้อมูลย้อนหลัง (Traceability)
                    </h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-seedling text-success me-2"></i>วันที่ปลูก</h6>
                                <p class="mb-0">${new Date(qrData.traceability.planting_date).toLocaleDateString('th-TH', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-leaf text-success me-2"></i>วิธีการปลูก</h6>
                                <p class="mb-0">${qrData.traceability.growing_method}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-mountain text-success me-2"></i>ประเภทดิน</h6>
                                <p class="mb-0">${qrData.traceability.soil_type}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-tint text-success me-2"></i>แหล่งน้ำ</h6>
                                <p class="mb-0">${qrData.traceability.water_source}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-recycle text-success me-2"></i>ปุ๋ยที่ใช้</h6>
                                <p class="mb-0">${qrData.traceability.fertilizer}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-bug text-success me-2"></i>การป้องกันศัตรูพืช</h6>
                                <p class="mb-0">${qrData.traceability.pest_control}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-check-circle text-success me-2"></i>การตรวจคุณภาพ</h6>
                                <p class="mb-0">${qrData.traceability.quality_check.result}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-thermometer-half text-success me-2"></i>การเก็บรักษา</h6>
                                <p class="mb-0">${qrData.traceability.storage.temperature} (${qrData.traceability.storage.humidity})</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-barcode text-success me-2"></i>หมายเลขล็อต</h6>
                                <p class="mb-0">${qrData.traceability.batch_number}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card p-3 bg-light rounded">
                                <h6 class="fw-bold"><i class="fas fa-calendar-times text-success me-2"></i>วันหมดอายุ</h6>
                                <p class="mb-0">${new Date(qrData.traceability.expiry_date).toLocaleDateString('th-TH', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ข้อมูลติดต่อ -->
                <div class="contact-section mt-4">
                    <h6 class="fw-bold text-success mb-3">
                        <i class="fas fa-phone me-2"></i>ข้อมูลติดต่อ
                    </h6>
                    <div class="info-card p-3 bg-light rounded">
                        <p class="mb-1"><strong>โรงเรียน:</strong> ${qrData.contact.school}</p>
                        <p class="mb-1"><strong>ที่อยู่:</strong> ${qrData.contact.address}</p>
                        <p class="mb-1"><strong>โทรศัพท์:</strong> ${qrData.contact.phone}</p>
                        <p class="mb-0"><strong>อีเมล:</strong> ${qrData.contact.email}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="alert alert-success mt-4" role="alert">
            <i class="fas fa-shield-alt me-2"></i>
            <strong>รับประกันคุณภาพ:</strong> ผลิตภัณฑ์นี้ปลูกโดยไม่ใช้สารเคมี ผ่านการดูแลโดยครูและนักเรียนของโรงเรียนบอเมืองน้อกขา พร้อมข้อมูลย้อนหลังแบบครบถ้วน
        </div>
    `;
    
    // Show modal first
    const modal = new bootstrap.Modal(document.getElementById('qrModal'));
    modal.show();
    
    // Generate QR Code after modal is shown
    setTimeout(() => {
        console.log('Starting QR Code generation...');
        console.log('QR Data:', qrDataString);
        
        // Check if QRCode library is loaded
        if (typeof qrcode === 'undefined') {
            console.error('QRCode library not loaded');
            document.getElementById('qr-canvas-container').innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    QR Code library ไม่ได้ถูกโหลด กรุณารีเฟรชหน้าเว็บ
                </div>
            `;
            return;
        }
        
        try {
            // Generate QR Code using qrcode-generator library
            const qr = qrcode(0, 'M');
            qr.addData(qrDataString);
            qr.make();
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 200;
            const moduleCount = qr.getModuleCount();
            const cellSize = Math.floor(size / moduleCount);
            const actualSize = cellSize * moduleCount;
            
            canvas.width = actualSize;
            canvas.height = actualSize;
            
            // Fill background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, actualSize, actualSize);
            
            // Draw QR Code
            ctx.fillStyle = '#198754';
            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    if (qr.isDark(row, col)) {
                        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                    }
                }
            }
            
            console.log('QR Code generated successfully');
            // Replace spinner with QR code
            document.getElementById('qr-canvas-container').innerHTML = '';
            document.getElementById('qr-canvas-container').appendChild(canvas);
            canvas.className = 'img-fluid';
            
        } catch (error) {
            console.error('QR Code generation error:', error);
            document.getElementById('qr-canvas-container').innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ไม่สามารถสร้าง QR Code ได้: ${error.message}
                </div>
            `;
        }
    }, 500);
}

// Download QR Code as image - Global function
window.downloadQRCode = function() {
    const canvas = document.querySelector('#qr-canvas-container canvas');
    if (!canvas) {
        alert('ไม่พบ QR Code ที่จะดาวน์โหลด');
        return;
    }
    
    const link = document.createElement('a');
    link.download = `QR_${currentQRCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Open QR Scanner Modal - Global function
window.openQRScanner = function() {
    const modal = new bootstrap.Modal(document.getElementById('qrScannerModal'));
    modal.show();
    
    // Start scanner when modal is shown
    setTimeout(() => {
        window.startQRScanner();
    }, 500);
}

// Start QR Scanner - Global function
window.startQRScanner = function() {
    const qrReader = document.getElementById('qr-reader');
    const qrResult = document.getElementById('qr-result');
    const qrResultText = document.getElementById('qr-result-text');
    
    // Clear previous scanner
    if (qrScanner) {
        qrScanner.clear();
    }
    
    // Clear result
    qrResult.style.display = 'none';
    
    // Initialize scanner
    qrScanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: { width: 250, height: 250 },
        fps: 20,
        aspectRatio: 1.0
    });
    
    qrScanner.render((decodedText, decodedResult) => {
        console.log('QR Code detected:', decodedText);
        
        try {
            // Try to parse as JSON first
            const qrData = JSON.parse(decodedText);
            
            if (qrData.qr_code) {
                // Find product by QR code
                const product = allProducts.find(p => p.qr_code === qrData.qr_code);
                if (product) {
                    qrResult.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>พบข้อมูลผลิตภัณฑ์:</strong> ${product.name}<br>
                            <small>กำลังโหลดข้อมูลย้อนหลังแบบละเอียด...</small>
                        </div>
                    `;
                    qrResult.style.display = 'block';
                    
                    // Stop scanner
                    qrScanner.clear();
                    
                    // Close scanner modal and show product info
                    setTimeout(() => {
                        const scannerModal = bootstrap.Modal.getInstance(document.getElementById('qrScannerModal'));
                        scannerModal.hide();
                        window.showQRInfo(product.qr_code, product.name);
                    }, 1500);
                    
                    return;
                }
            }
        } catch (e) {
            // If not JSON, try to find by QR code string
            const product = allProducts.find(p => p.qr_code === decodedText);
            if (product) {
                qrResult.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        <strong>พบข้อมูลผลิตภัณฑ์:</strong> ${product.name}<br>
                        <small>กำลังโหลดข้อมูลย้อนหลังแบบละเอียด...</small>
                    </div>
                `;
                qrResult.style.display = 'block';
                
                // Stop scanner
                qrScanner.clear();
                
                // Close scanner modal and show product info
                setTimeout(() => {
                    const scannerModal = bootstrap.Modal.getInstance(document.getElementById('qrScannerModal'));
                    scannerModal.hide();
                        window.showQRInfo(product.qr_code, product.name);
                }, 1500);
                
                return;
            }
        }
        
        // If no product found
        qrResultText.textContent = 'ไม่พบข้อมูลผลิตภัณฑ์ที่สแกน กรุณาลองใหม่';
        qrResult.style.display = 'block';
        qrResult.className = 'mt-3';
        qrResult.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <span id="qr-result-text">ไม่พบข้อมูลผลิตภัณฑ์ที่สแกน กรุณาลองใหม่</span>
            </div>
        `;
        
    }, (error) => {
        // Handle scan error
        console.log('QR Scan error:', error);
    });
}

// Stop QR Scanner
function stopQRScanner() {
    if (qrScanner) {
        qrScanner.clear();
        qrScanner = null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    window.loadProducts();
    
    // Add smooth transitions
    document.querySelectorAll('.btn-outline-success').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Handle QR Scanner Modal events
    const qrScannerModal = document.getElementById('qrScannerModal');
    if (qrScannerModal) {
        qrScannerModal.addEventListener('hidden.bs.modal', function() {
            stopQRScanner();
        });
    }
    
    // Check if all required libraries are loaded
    console.log('Checking libraries...');
    console.log('Bootstrap loaded:', typeof bootstrap !== 'undefined');
    console.log('QRCode loaded:', typeof qrcode !== 'undefined');
    console.log('Html5Qrcode loaded:', typeof Html5QrcodeScanner !== 'undefined');
    
    console.log('🌱 Products page loaded successfully!');
});
