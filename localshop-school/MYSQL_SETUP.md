# MySQL Configuration Summary for AgriLink School Model

## การตั้งค่า MySQL ปัจจุบัน ✅

### ข้อมูล MySQL Server
- **Version**: MySQL 8.0.43-0ubuntu0.24.04.2 (Ubuntu)
- **Port**: 3306 (default)
- **Socket**: /var/run/mysqld/mysqld.sock
- **Status**: ✅ Running และเชื่อมต่อได้

### Database และ User
- **Database Name**: `localshop_school`
- **Username**: `app`
- **Password**: `password`
- **Privileges**: ALL PRIVILEGES บน localshop_school.*

### ตาราง (Tables) ที่สร้างแล้ว
1. **products** - รายการผลผลิตของโรงเรียน
2. **orders** - คำสั่งซื้อจากผู้ปกครองและชุมชน
3. **media** - อัลบั้มรูปภาพกิจกรรมโรงเรียน

## การเชื่อมต่อกับ XAMPP

**คำตอบ**: ตอนนี้โปรเจคใช้ **MySQL ของ Ubuntu** ไม่ใช่ XAMPP

### หาก ต้องการใช้ XAMPP แทน:

#### 1. หยุด MySQL ปัจจุบัน
```bash
sudo service mysql stop
```

#### 2. เริ่ม XAMPP MySQL
```bash
sudo /opt/lampp/lampp start mysql
# หรือ
sudo /opt/lampp/bin/mysql.server start
```

#### 3. แก้ไข .env file
```properties
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=    # XAMPP มักไม่มี password
DB_NAME=localshop_school
DB_PORT=3306    # หรือ port ที่ XAMPP ใช้
```

#### 4. สร้าง database ใน XAMPP
```sql
CREATE DATABASE localshop_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 5. Import ข้อมูล
```bash
mysql -u root -p localshop_school < sql/schema.sql
mysql -u root -p localshop_school < sql/seed.sql
```

## ข้อดีของการใช้ MySQL ปัจจุบัน (Ubuntu)

### ✅ ข้อดี
- **เสถียรภาพสูง**: MySQL native ของ Ubuntu
- **ประสิทธิภาพดี**: Optimized สำหรับ production
- **ความปลอดภัย**: User management ที่ดี
- **Memory Usage**: ใช้ RAM น้อยกว่า XAMPP

### ⚠️ ข้อพิจารณา
- **ไม่มี phpMyAdmin**: ต้องใช้ command line หรือ tool อื่น
- **การจัดการซับซ้อน**: ต้องใช้คำสั่ง MySQL มากกว่า

## Tools สำหรับจัดการ MySQL

### 1. Command Line (ใช้อยู่ตอนนี้)
```bash
sudo mysql --defaults-file=/etc/mysql/debian.cnf
```

### 2. MySQL Workbench (GUI)
```bash
sudo apt install mysql-workbench
```

### 3. phpMyAdmin (Web-based)
```bash
sudo apt install phpmyadmin
```

### 4. DBeaver (Cross-platform)
Download จาก: https://dbeaver.io/

## การ Backup และ Restore

### Backup Database
```bash
mysqldump -u app -ppassword localshop_school > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u app -ppassword localshop_school < backup_20250930.sql
```

## สรุป

🎉 **MySQL กำลังทำงานได้ดีแล้ว!**

- ✅ Server เชื่อมต่อสำเร็จ
- ✅ Database มีข้อมูลครบถ้วน  
- ✅ Web Application ทำงานได้
- ✅ API endpoints ตอบสนองได้

ไม่จำเป็นต้องเปลี่ยนเป็น XAMPP เว้นแต่จะต้องการ phpMyAdmin หรือมีเหตุผลเฉพาะ

**URL เข้าใช้งาน**: http://localhost:3000
**Admin Dashboard**: http://localhost:3000/dashboard.html (Password: admin123)