# Setup Guide for XAMPP Integration

## 🚀 วิธีการตั้งค่าให้ใช้งานกับ XAMPP

### 1. ติดตั้ง XAMPP (หากยังไม่มี)
```bash
# Download XAMPP สำหรับ Linux
wget https://www.apachefriends.org/xampp-files/7.4.33/xampp-linux-x64-7.4.33-0-installer.run
chmod +x xampp-linux-x64-7.4.33-0-installer.run
sudo ./xampp-linux-x64-7.4.33-0-installer.run
```

### 2. เริ่ม XAMPP Services
```bash
# เริ่ม Apache และ MySQL
sudo /opt/lampp/lampp start

# หรือเริ่มเฉพาะ MySQL
sudo /opt/lampp/lampp start mysql
```

### 3. เข้าถึง phpMyAdmin
- เปิดเบราว์เซอร์ไปที่: http://localhost/phpmyadmin
- หรือ: http://localhost:8080/phpmyadmin (หาก port เปลี่ยน)

### 4. สร้าง Database ใน phpMyAdmin
```sql
CREATE DATABASE localshop_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Import ข้อมูลเข้า XAMPP MySQL

#### วิธีที่ 1: ผ่าน phpMyAdmin
1. เข้า phpMyAdmin
2. เลือก database `localshop_school`
3. คลิก tab "Import"
4. เลือกไฟล์ `sql/schema.sql` แล้วกด "Go"
5. เลือกไฟล์ `sql/seed.sql` แล้วกด "Go"

#### วิธีที่ 2: ผ่าน Command Line
```bash
# หยุด MySQL ปัจจุบัน
sudo service mysql stop

# เริ่ม XAMPP MySQL
sudo /opt/lampp/lampp start mysql

# Import ข้อมูล
/opt/lampp/bin/mysql -u root localshop_school < sql/schema.sql
/opt/lampp/bin/mysql -u root localshop_school < sql/seed.sql
```

### 6. แก้ไข .env file
ใช้การตั้งค่าสำหรับ XAMPP ที่อัปเดตแล้ว:
```properties
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=localshop_school
DB_PORT=3306
```

### 7. เริ่มแอปพลิเคชัน
```bash
node app.js
```

## 🔧 Troubleshooting XAMPP

### หาก MySQL ไม่เริ่มต้น
```bash
# ตรวจสอบ process ที่ใช้ port 3306
sudo lsof -i :3306

# หยุด MySQL อื่นที่อาจทำงานอยู่
sudo service mysql stop
sudo pkill mysqld

# เริ่ม XAMPP ใหม่
sudo /opt/lampp/lampp restart
```

### หาก phpMyAdmin เข้าไม่ได้
```bash
# ตรวจสอบ Apache status
sudo /opt/lampp/lampp status

# เริ่ม Apache
sudo /opt/lampp/lampp start apache
```

### การปรับ Port หาก Conflict
แก้ไขไฟล์ `/opt/lampp/etc/my.cnf`:
```ini
[mysqld]
port = 3307  # เปลี่ยนจาก 3306
```

จากนั้นแก้ .env:
```properties
DB_PORT=3307
```

## 📱 ข้อดีของการใช้ XAMPP

### ✅ ข้อดี
- **phpMyAdmin**: จัดการฐานข้อมูลผ่าน Web UI
- **ใช้งานง่าย**: GUI สำหรับ CRUD operations
- **ความคุ้นเชย**: เหมาะกับ Local Development
- **Apache รวม**: สามารถใช้ Apache แทน Node.js ได้

### ⚠️ ข้อควรระวัง  
- **ความปลอดภัย**: User root ไม่มี password
- **Performance**: อาจใช้ RAM มากกว่า
- **Port Conflict**: อาจชนกับ services อื่น

## 🎯 Steps สำหรับ Production

เมื่อ deploy จริง แนะนำให้:

1. **สร้าง MySQL User เฉพาะ**:
```sql
CREATE USER 'localshop_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON localshop_school.* TO 'localshop_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **เปลี่ยน .env เป็น**:
```properties
DB_USER=localshop_user
DB_PASSWORD=secure_password
```

3. **Backup ข้อมูลสม่ำเสมอ**:
```bash
mysqldump -u root localshop_school > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 📞 หากมีปัญหา

1. **ตรวจสอบ XAMPP Status**:
```bash
sudo /opt/lampp/lampp status
```

2. **ดู Log**:
```bash
tail -f /opt/lampp/logs/mysql_error.log
tail -f /opt/lampp/logs/error_log
```

3. **Test Connection**:
```bash
/opt/lampp/bin/mysql -u root -e "SELECT 'XAMPP MySQL Working!' as status;"
```