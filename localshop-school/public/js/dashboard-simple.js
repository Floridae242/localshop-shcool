// Simple Dashboard Management System
let currentSection = 'dashboard';
let products = [];
let orders = [];

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
    
    console.log('🎛️ Dashboard loaded successfully!');
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
                            <button class="btn btn-sm btn-outline-primary btn-action" onclick="editProduct(${product.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteProduct(${product.id})">
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
        const response = await auth.authFetch('http://localhost:3000/api/orders');
        orders = await response.json();
        
        const tbody = document.getElementById('ordersTable');
        if (tbody) {
            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center text-muted py-4">
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
                            <button class="btn btn-sm btn-outline-info btn-action" onclick="viewOrderDetails(${order.id})">
                                <i class="fas fa-eye"></i>
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
        const media = await response.json();
        
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
                            <img src="${item.url}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <h6 class="card-title">${item.title}</h6>
                                <p class="card-text small text-muted">${item.caption || ''}</p>
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
        const salesResponse = await auth.authFetch('http://localhost:3000/api/analytics/sales');
        const salesData = await salesResponse.json();
        
        const productsResponse = await auth.authFetch('http://localhost:3000/api/analytics/products');
        const productsData = await productsResponse.json();
        
        const topProductsDiv = document.getElementById('topProducts');
        if (topProductsDiv) {
            topProductsDiv.innerHTML = productsData.slice(0, 5).map((product, index) => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${index + 1}. ${product.name}</span>
                    <span class="badge bg-primary">฿${parseFloat(product.revenue || 0).toFixed(2)}</span>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดรายงาน', 'error');
    }
}

// Product management functions
function showProductForm() {
    const form = document.getElementById('productForm');
    if (form) {
        form.classList.remove('d-none');
    }
}

function cancelProductForm() {
    const form = document.getElementById('productForm');
    if (form) {
        form.classList.add('d-none');
    }
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

        const response = await auth.authFetch('http://localhost:3000/api/products', {
            method: 'POST',
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

    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image_url || '';
    
    showProductForm();
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

    alert(`รายละเอียดคำสั่งซื้อ #${order.id}\n\nผู้ซื้อ: ${order.buyer_name}\nโทรศัพท์: ${order.phone || '-'}\nสินค้า: ${order.product_name}\nจำนวน: ${order.qty} ${order.unit}\nราคา: ฿${parseFloat(order.total).toFixed(2)}\nสถานะ: ${getStatusThai(order.status)}\nวันที่: ${new Date(order.created_at).toLocaleString('th-TH')}`);
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
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Export functions
function exportData() {
    window.open('http://localhost:3000/api/export/orders.csv', '_blank');
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
