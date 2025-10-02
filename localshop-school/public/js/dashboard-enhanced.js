// Enhanced Dashboard Management System - Ready to Use
let currentSection = 'dashboard';
let products = [];
let orders = [];
let media = [];
let currentProductId = null;
let currentMediaId = null;
let salesChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.requireAuth()) {
        return;
    }

    // Set admin name
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) {
        adminNameEl.textContent = auth.getUsername();
    }

    // Load initial data
    loadDashboardData();
    
    // Set up auto-refresh every 5 minutes
    setInterval(loadDashboardData, 5 * 60 * 1000);

    console.log('🎛️ Enhanced Dashboard loaded successfully!');
});

// Show specific section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(el => {
        el.classList.add('d-none');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }
    
    // Add active class to clicked nav link
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'ภาพรวมระบบ',
        'products': 'จัดการสินค้า',
        'orders': 'จัดการคำสั่งซื้อ',
        'media': 'จัดการสื่อ',
        'analytics': 'รายงานและสถิติ',
        'settings': 'ตั้งค่าระบบ'
    };
    const pageTitleEl = document.getElementById('pageTitle');
    if (pageTitleEl) {
        pageTitleEl.textContent = titles[section] || 'ภาพรวมระบบ';
    }
    
    currentSection = section;
    
    // Load section-specific data
    switch(section) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'media':
            loadMedia();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Load dashboard overview data
async function loadDashboardData() {
    try {
        // Load statistics
        const statsResponse = await auth.authFetch('http://localhost:3000/api/analytics/stats');
        const stats = await statsResponse.json();
        
        const totalProductsEl = document.getElementById('totalProducts');
        const totalOrdersEl = document.getElementById('totalOrders');
        const totalRevenueEl = document.getElementById('totalRevenue');
        const lowStockItemsEl = document.getElementById('lowStockItems');
        
        if (totalProductsEl) totalProductsEl.textContent = stats.totalProducts || 0;
        if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders || 0;
        if (totalRevenueEl) totalRevenueEl.textContent = `฿${(stats.totalRevenue || 0).toLocaleString()}`;
        if (lowStockItemsEl) lowStockItemsEl.textContent = stats.lowStockItems || 0;

        // Load recent orders
        const ordersResponse = await auth.authFetch('http://localhost:3000/api/orders?limit=5');
        const recentOrders = await ordersResponse.json();
        
        const tbody = document.getElementById('recentOrdersTable');
        if (tbody) {
            if (recentOrders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            <i class="fas fa-inbox me-2"></i>ยังไม่มีคำสั่งซื้อ
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = recentOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.buyer_name}</td>
                        <td>${order.product_name}</td>
                        <td>${order.qty} ${order.unit}</td>
                        <td>฿${parseFloat(order.total).toFixed(2)}</td>
                        <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusThai(order.status)}</span></td>
                        <td>${new Date(order.created_at).toLocaleDateString('th-TH')}</td>
                    </tr>
                `).join('');
            }
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    }
}

// Load products
async function loadProducts() {
    try {
        const response = await auth.authFetch('http://localhost:3000/api/products');
        products = await response.json();
        
        const tbody = document.getElementById('productsTable');
        if (tbody) {
            if (products.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center text-muted py-4">
                            <i class="fas fa-inbox me-2"></i>ยังไม่มีสินค้า
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>
                            ${product.image_url ? 
                                `<img src="${product.image_url}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : 
                                '<i class="fas fa-image text-muted"></i>'
                            }
                        </td>
                        <td>${product.name}</td>
                        <td><span class="badge bg-secondary">${product.category}</span></td>
                        <td>฿${parseFloat(product.price).toFixed(2)}</td>
                        <td>${product.unit}</td>
                        <td>
                            <span class="badge ${product.stock < 10 ? 'bg-warning' : product.stock === 0 ? 'bg-danger' : 'bg-success'}">
                                ${product.stock}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-action" onclick="editProduct(${product.id})" title="แก้ไข">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteProduct(${product.id})" title="ลบ">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดสินค้า', 'error');
    }
}

// Load orders
async function loadOrders() {
    try {
        const status = document.getElementById('orderStatusFilter')?.value || '';
        const dateFrom = document.getElementById('dateFrom')?.value || '';
        const dateTo = document.getElementById('dateTo')?.value || '';
        const limit = document.getElementById('orderLimit')?.value || '50';
        
        let url = `http://localhost:3000/api/orders?limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (dateFrom) url += `&date_from=${dateFrom}`;
        if (dateTo) url += `&date_to=${dateTo}`;
        
        const response = await auth.authFetch(url);
        orders = await response.json();
        
        const tbody = document.getElementById('ordersTable');
        if (tbody) {
            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="10" class="text-center text-muted py-4">
                            <i class="fas fa-inbox me-2"></i>ไม่พบคำสั่งซื้อ
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${new Date(order.created_at).toLocaleDateString('th-TH')}</td>
                        <td>${order.buyer_name}</td>
                        <td>${order.phone || '-'}</td>
                        <td>
                            ${order.delivery_address ? 
                                `<span class="text-truncate d-inline-block" style="max-width: 200px;" title="${order.delivery_address}">
                                    ${order.delivery_address.length > 30 ? order.delivery_address.substring(0, 30) + '...' : order.delivery_address}
                                </span>` : 
                                '<span class="text-muted">-</span>'
                            }
                        </td>
                        <td>${order.product_name}</td>
                        <td>${order.qty} ${order.unit}</td>
                        <td>฿${parseFloat(order.total).toFixed(2)}</td>
                        <td>
                            <select class="form-select form-select-sm" onchange="updateOrderStatus(${order.id}, this.value)">
                                <option value="NEW" ${order.status === 'NEW' ? 'selected' : ''}>ใหม่</option>
                                <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>ยืนยันแล้ว</option>
                                <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>ยกเลิก</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-info btn-action" onclick="viewOrderDetails(${order.id})" title="ดูรายละเอียด">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success btn-action" onclick="updateOrderStatus(${order.id}, 'CONFIRMED')" title="ยืนยัน">
                                <i class="fas fa-check"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดคำสั่งซื้อ', 'error');
    }
}

// Load media
async function loadMedia() {
    try {
        const response = await auth.authFetch('http://localhost:3000/api/media');
        media = await response.json();
        
        const grid = document.getElementById('mediaGrid');
        if (grid) {
            if (media.length === 0) {
                grid.innerHTML = `
                    <div class="col-12 text-center text-muted py-4">
                        <i class="fas fa-inbox me-2"></i>ยังไม่มีสื่อ
                    </div>
                `;
            } else {
                grid.innerHTML = media.map(item => `
                    <div class="col-md-4">
                        <div class="card">
                            <img src="${item.url}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                            <div class="card-body">
                                <h6 class="card-title">${item.title}</h6>
                                <p class="card-text small text-muted">${item.caption || ''}</p>
                                <div class="btn-group w-100">
                                    <button class="btn btn-sm btn-outline-primary" onclick="editMedia(${item.id})" title="แก้ไข">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteMedia(${item.id})" title="ลบ">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading media:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดสื่อ', 'error');
    }
}

// Load analytics
async function loadAnalytics() {
    try {
        // Load sales analytics
        const salesResponse = await auth.authFetch('http://localhost:3000/api/analytics/sales');
        const salesData = await salesResponse.json();
        
        // Load product analytics
        const productsResponse = await auth.authFetch('http://localhost:3000/api/analytics/products');
        const productsData = await productsResponse.json();
        
        // Update top products
        const topProductsDiv = document.getElementById('topProducts');
        if (topProductsDiv) {
            topProductsDiv.innerHTML = productsData.slice(0, 5).map((product, index) => `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span>${index + 1}. ${product.name}</span>
                    <span class="badge bg-primary">฿${parseFloat(product.revenue || 0).toFixed(2)}</span>
                </div>
            `).join('');
        }
        
        // Create sales chart
        const ctx = document.getElementById('salesChart');
        if (ctx) {
            // Destroy existing chart
            if (salesChart) {
                salesChart.destroy();
            }
            
            salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: salesData.map(item => new Date(item.date).toLocaleDateString('th-TH')),
                    datasets: [{
                        label: 'ยอดขาย (บาท)',
                        data: salesData.map(item => item.revenue),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                        fill: true,
                        pointBackgroundColor: 'rgb(75, 192, 192)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'วันที่'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            display: true,
                            title: {
                                display: true,
                                text: 'ยอดขาย (บาท)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '฿' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return 'ยอดขาย: ฿' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดรายงาน', 'error');
    }
}

// Product management functions
function showProductForm() {
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');
    if (form) {
        form.classList.remove('d-none');
        if (title) title.textContent = 'เพิ่มสินค้าใหม่';
    }
    currentProductId = null;
    clearProductForm();
}

function cancelProductForm() {
    const form = document.getElementById('productForm');
    if (form) {
        form.classList.add('d-none');
    }
    currentProductId = null;
    clearProductForm();
}

function clearProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = 'Vegetable';
    document.getElementById('productPrice').value = '';
    document.getElementById('productUnit').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productImage').value = '';
}

async function saveProduct() {
    try {
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            unit: document.getElementById('productUnit').value,
            stock: parseInt(document.getElementById('productStock').value),
            image_url: document.getElementById('productImage').value
        };

        if (!productData.name || !productData.price || !productData.stock) {
            showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            return;
        }

        const url = currentProductId ? 
            `http://localhost:3000/api/products/${currentProductId}` : 
            'http://localhost:3000/api/products';
        const method = currentProductId ? 'PUT' : 'POST';

        const response = await auth.authFetch(url, {
            method: method,
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showNotification('บันทึกสินค้าสำเร็จ', 'success');
            cancelProductForm();
            loadProducts();
        } else {
            throw new Error('Failed to save product');
        }

    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('เกิดข้อผิดพลาดในการบันทึกสินค้า', 'error');
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProductId = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image_url || '';
    
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');
    if (form) {
        form.classList.remove('d-none');
        if (title) title.textContent = 'แก้ไขสินค้า';
    }
}

async function deleteProduct(id) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    try {
        const response = await auth.authFetch(`http://localhost:3000/api/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('ลบสินค้าสำเร็จ', 'success');
            loadProducts();
        } else {
            throw new Error('Failed to delete product');
        }

    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('เกิดข้อผิดพลาดในการลบสินค้า', 'error');
    }
}

// Order management functions
async function updateOrderStatus(orderId, status) {
    try {
        const response = await auth.authFetch(`http://localhost:3000/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showNotification('อัพเดทสถานะคำสั่งซื้อสำเร็จ', 'success');
            loadOrders();
        } else {
            throw new Error('Failed to update order status');
        }

    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('เกิดข้อผิดพลาดในการอัพเดทสถานะ', 'error');
    }
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = `
        <div class="modal fade" id="orderModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">รายละเอียดคำสั่งซื้อ #${order.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>ข้อมูลผู้ซื้อ</h6>
                                <p><strong>ชื่อ:</strong> ${order.buyer_name}</p>
                                <p><strong>โทรศัพท์:</strong> ${order.phone || '-'}</p>
                                <p><strong>ที่อยู่จัดส่ง:</strong></p>
                                <div class="bg-light p-2 rounded">
                                    ${order.delivery_address || '<span class="text-muted">ไม่ระบุที่อยู่จัดส่ง</span>'}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6>ข้อมูลสินค้า</h6>
                                <p><strong>สินค้า:</strong> ${order.product_name}</p>
                                <p><strong>จำนวน:</strong> ${order.qty} ${order.unit}</p>
                                <p><strong>ราคา:</strong> ฿${parseFloat(order.total).toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6>สถานะ</h6>
                                <span class="badge ${getStatusBadgeClass(order.status)} fs-6">${getStatusThai(order.status)}</span>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6>วันที่สั่งซื้อ</h6>
                                <p>${new Date(order.created_at).toLocaleString('th-TH')}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('orderModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Show modal
    const modalElement = new bootstrap.Modal(document.getElementById('orderModal'));
    modalElement.show();
}

// Media management functions
function showMediaForm() {
    const form = document.getElementById('mediaForm');
    if (form) {
        form.classList.remove('d-none');
    }
    currentMediaId = null;
    clearMediaForm();
}

function cancelMediaForm() {
    const form = document.getElementById('mediaForm');
    if (form) {
        form.classList.add('d-none');
    }
    currentMediaId = null;
    clearMediaForm();
}

function clearMediaForm() {
    document.getElementById('mediaTitle').value = '';
    document.getElementById('mediaUrl').value = '';
    document.getElementById('mediaCaption').value = '';
}

async function saveMedia() {
    try {
        const mediaData = {
            title: document.getElementById('mediaTitle').value,
            url: document.getElementById('mediaUrl').value,
            caption: document.getElementById('mediaCaption').value
        };

        if (!mediaData.title || !mediaData.url) {
            showNotification('กรุณากรอกชื่อสื่อและ URL', 'warning');
            return;
        }

        const url = currentMediaId ? 
            `http://localhost:3000/api/media/${currentMediaId}` : 
            'http://localhost:3000/api/media';
        const method = currentMediaId ? 'PUT' : 'POST';

        const response = await auth.authFetch(url, {
            method: method,
            body: JSON.stringify(mediaData)
        });

        if (response.ok) {
            showNotification('บันทึกสื่อสำเร็จ', 'success');
            cancelMediaForm();
            loadMedia();
        } else {
            throw new Error('Failed to save media');
        }

    } catch (error) {
        console.error('Error saving media:', error);
        showNotification('เกิดข้อผิดพลาดในการบันทึกสื่อ', 'error');
    }
}

function editMedia(id) {
    const mediaItem = media.find(m => m.id === id);
    if (!mediaItem) return;

    currentMediaId = id;
    document.getElementById('mediaTitle').value = mediaItem.title;
    document.getElementById('mediaUrl').value = mediaItem.url;
    document.getElementById('mediaCaption').value = mediaItem.caption || '';
    
    showMediaForm();
}

async function deleteMedia(id) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสื่อนี้?')) return;

    try {
        const response = await auth.authFetch(`http://localhost:3000/api/media/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('ลบสื่อสำเร็จ', 'success');
            loadMedia();
        } else {
            throw new Error('Failed to delete media');
        }

    } catch (error) {
        console.error('Error deleting media:', error);
        showNotification('เกิดข้อผิดพลาดในการลบสื่อ', 'error');
    }
}

// Utility functions
function getStatusThai(status) {
    const statusMap = {
        'NEW': 'ใหม่',
        'CONFIRMED': 'ยืนยันแล้ว',
        'CANCELLED': 'ยกเลิก'
    };
    return statusMap[status] || status;
}

function getStatusBadgeClass(status) {
    const classMap = {
        'NEW': 'bg-warning',
        'CONFIRMED': 'bg-success',
        'CANCELLED': 'bg-danger'
    };
    return classMap[status] || 'bg-secondary';
}

function showNotification(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 
                     type === 'error' ? 'alert-danger' : 
                     type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show notification`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.getElementById('notificationContainer');
    if (container) {
        container.appendChild(notification);
    } else {
        document.body.appendChild(notification);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Filter functions
function filterOrders() {
    loadOrders();
}

// Export functions
async function exportData() {
    try {
        showNotification('กำลังส่งออกข้อมูลคำสั่งซื้อ...', 'info');
        
        const response = await auth.authFetch('http://localhost:3000/api/export/orders.csv');
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'orders.csv';
            link.click();
            window.URL.revokeObjectURL(url);
    showNotification('ส่งออกข้อมูลคำสั่งซื้อสำเร็จ', 'success');
        } else {
            throw new Error('Failed to export orders data');
        }
        
    } catch (error) {
        console.error('Error exporting orders data:', error);
        showNotification('เกิดข้อผิดพลาดในการส่งออกข้อมูลคำสั่งซื้อ', 'error');
    }
}

async function exportAllData() {
    try {
        showNotification('กำลังส่งออกข้อมูล...', 'info');
        
        // Export products
        const productsResponse = await auth.authFetch('http://localhost:3000/api/export/products.csv');
        if (productsResponse.ok) {
            const productsBlob = await productsResponse.blob();
            const productsUrl = window.URL.createObjectURL(productsBlob);
            const productsLink = document.createElement('a');
            productsLink.href = productsUrl;
            productsLink.download = 'products.csv';
            productsLink.click();
            window.URL.revokeObjectURL(productsUrl);
        }
        
        // Export orders
        const ordersResponse = await auth.authFetch('http://localhost:3000/api/export/orders.csv');
        if (ordersResponse.ok) {
            const ordersBlob = await ordersResponse.blob();
            const ordersUrl = window.URL.createObjectURL(ordersBlob);
            const ordersLink = document.createElement('a');
            ordersLink.href = ordersUrl;
            ordersLink.download = 'orders.csv';
            ordersLink.click();
            window.URL.revokeObjectURL(ordersUrl);
        }
    
    showNotification('ส่งออกข้อมูลทั้งหมดสำเร็จ', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('เกิดข้อผิดพลาดในการส่งออกข้อมูล', 'error');
    }
}

function clearCache() {
    localStorage.clear();
    showNotification('ล้างแคชสำเร็จ', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function resetDatabase() {
    if (confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ตฐานข้อมูล? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
        showNotification('ฟีเจอร์นี้กำลังพัฒนา', 'info');
    }
}

// Refresh data
function refreshData() {
    loadDashboardData();
    if (currentSection === 'products') loadProducts();
    if (currentSection === 'orders') loadOrders();
    if (currentSection === 'media') loadMedia();
    if (currentSection === 'analytics') loadAnalytics();
    showNotification('รีเฟรชข้อมูลสำเร็จ', 'success');
}

// Logout
function logout() {
    if (confirm('คุณแน่ใจหรือไม่ที่จะออกจากระบบ?')) {
        auth.logout();
        window.location.href = 'login.html';
    }
}

// Auto-save form data
function autoSaveForm() {
    const formData = {
        productName: document.getElementById('productName')?.value || '',
        productCategory: document.getElementById('productCategory')?.value || '',
        productPrice: document.getElementById('productPrice')?.value || '',
        productUnit: document.getElementById('productUnit')?.value || '',
        productStock: document.getElementById('productStock')?.value || '',
        productImage: document.getElementById('productImage')?.value || ''
    };
    
    localStorage.setItem('productFormData', JSON.stringify(formData));
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('productFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element && formData[key]) {
                element.value = formData[key];
            }
        });
    }
}

// Add auto-save listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auto-save product form
    ['productName', 'productCategory', 'productPrice', 'productUnit', 'productStock', 'productImage'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', autoSaveForm);
        }
    });
    
    // Load saved form data
    loadSavedFormData();
});

console.log('🚀 Enhanced Dashboard System Ready!');
