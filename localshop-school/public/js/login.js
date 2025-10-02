// Admin Login System
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('loginMessage');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'danger');
            return;
        }

        try {
            showMessage('กำลังเข้าสู่ระบบ...', 'info');
            
            // Check admin credentials
            if (username === 'admin' && password === 'admin123') {
                // Store admin session
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('loginTime', new Date().toISOString());
                
                showMessage('เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้า Dashboard...', 'success');
                
                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                showMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'danger');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'danger');
        }
    });

    // Show message function
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type}`;
        messageDiv.classList.remove('d-none');
        
        // Auto hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.classList.add('d-none');
            }, 3000);
        }
    }

    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showMessage('คุณเข้าสู่ระบบอยู่แล้ว กำลังพาไปหน้า Dashboard...', 'info');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    // Add smooth animations
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    console.log('🔐 Login page loaded successfully!');
});


