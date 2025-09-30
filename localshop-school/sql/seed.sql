USE localshop_school;

-- Products from AgriLink School Farm
INSERT INTO products (name,category,price,unit,stock,image_url) VALUES
('เห็ดนางฟ้าออร์แกนิค (Oyster Mushroom)', 'Mushroom', 60.00, 'kg', 15, 'img/mushroom.jpg'),
('กบเลี้ยงจากบ่อธรรมชาติ (Organic Frog)', 'Frog', 120.00, 'kg', 8, 'img/frog.jpg'),
('ผักกาดขาวไฮโดรโปนิกส์ (Hydroponic Lettuce)', 'Vegetable', 25.00, 'มัด', 35, 'img/lettuce.jpg'),
('คะน้าออร์แกนิค (Organic Kale)', 'Vegetable', 35.00, 'มัด', 28, 'img/kale.jpg'),
('แตงกวาโรงเรือน (Greenhouse Cucumber)', 'Vegetable', 40.00, 'kg', 22, 'img/cucumber.jpg'),
('ไก่ไข่สด 10 ฟอง (Fresh Chicken Eggs)', 'Egg', 45.00, 'แผง', 18, 'img/eggs.jpg'),
('ปลาดุกจากบ่อ (Pond-raised Catfish)', 'Fish', 90.00, 'kg', 12, 'img/fish.jpg');

-- Sample orders for demonstration
INSERT INTO orders (buyer_name, phone, product_id, qty, total, status) VALUES
('คุณสมใจ ใจดี', '081-234-5678', 1, 2, 120.00, 'CONFIRMED'),
('ผู้ปกครองนักเรียน ป.4', '089-876-5432', 3, 5, 125.00, 'NEW'),
('คุณมาลี สายชล', '092-345-6789', 6, 3, 135.00, 'CONFIRMED');

-- Album/Media from school activities
INSERT INTO media (title,url,caption) VALUES
('โรงเรือนไฮโดรโปนิกส์', 'img/greenhouse.jpg', 'ระบบพ่นน้ำอัตโนมัติ - Smart Farm Technology'),
('วันเก็บเกี่ยวผลผลิต', 'img/harvest.jpg', 'นักเรียนเก็บผักใสตอนเช้า - Farm to School'),
('บ่อเลี้ยงปลาธรรมชาติ', 'img/pond.jpg', 'ระบบน้ำหมุนเวียน - Sustainable Aquaculture'),
('ฟาร์มเห็ดในโรงเรียน', 'img/mushroom.jpg', 'เห็ดนางฟ้าปลอดสาร - Student Project'),
('การเลี้ยงกบในบ่อ', 'img/frog.jpg', 'โปรตีนสะอาดจากธรรมชาติ - Clean Protein'),
('ไก่ไข่ปลอดโรค', 'img/eggs.jpg', 'ไข่สดทุกวันจากฟาร์มโรงเรียน - Daily Fresh Supply');
