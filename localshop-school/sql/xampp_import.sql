-- SQL Export สำหรับ XAMPP/phpMyAdmin
-- โรงเรียนบ้านแม่ฮ้อยเงิน - AgriLink School Model
-- Generated: 2025-09-30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: localshop_school
CREATE DATABASE IF NOT EXISTS `localshop_school` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `localshop_school`;

-- --------------------------------------------------------

-- Table structure for table `products`
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Mushroom','Frog','Vegetable','Egg','Fish') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kg',
  `stock` int NOT NULL DEFAULT '0',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `products`
INSERT INTO `products` (`id`, `name`, `category`, `price`, `unit`, `stock`, `image_url`, `created_at`) VALUES
(1, 'เห็ดนางฟ้าออร์แกนิค (Oyster Mushroom)', 'Mushroom', '60.00', 'kg', 15, 'img/mushroom.jpg', NOW()),
(2, 'กบเลี้ยงจากบ่อธรรมชาติ (Organic Frog)', 'Frog', '120.00', 'kg', 8, 'img/frog.jpg', NOW()),
(3, 'ผักกาดขาวไฮโดรโปนิกส์ (Hydroponic Lettuce)', 'Vegetable', '25.00', 'มัด', 35, 'img/lettuce.jpg', NOW()),
(4, 'คะน้าออร์แกนิค (Organic Kale)', 'Vegetable', '35.00', 'มัด', 28, 'img/kale.jpg', NOW()),
(5, 'แตงกวาโรงเรือน (Greenhouse Cucumber)', 'Vegetable', '40.00', 'kg', 22, 'img/cucumber.jpg', NOW()),
(6, 'ไก่ไข่สด 10 ฟอง (Fresh Chicken Eggs)', 'Egg', '45.00', 'แผง', 18, 'img/eggs.jpg', NOW()),
(7, 'ปลาดุกจากบ่อ (Pond-raised Catfish)', 'Fish', '90.00', 'kg', 12, 'img/fish.jpg', NOW());

-- --------------------------------------------------------

-- Table structure for table `orders`
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` int NOT NULL,
  `qty` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('NEW','CONFIRMED','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'NEW',
  `trace_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_trace_id` (`trace_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `orders`
INSERT INTO `orders` (`id`, `buyer_name`, `phone`, `product_id`, `qty`, `total`, `status`, `trace_id`, `created_at`) VALUES
(1, 'คุณสมใจ ใจดี', '081-234-5678', 1, 2, '120.00', 'CONFIRMED', UUID(), NOW()),
(2, 'ผู้ปกครองนักเรียน ป.4', '089-876-5432', 3, 5, '125.00', 'NEW', UUID(), NOW()),
(3, 'คุณมาลี สายชล', '092-345-6789', 6, 3, '135.00', 'CONFIRMED', UUID(), NOW());

-- --------------------------------------------------------

-- Table structure for table `media`
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `media`
INSERT INTO `media` (`id`, `title`, `url`, `caption`, `created_at`) VALUES
(1, 'โรงเรือนไฮโดรโปนิกส์', 'img/greenhouse.jpg', 'ระบบพ่นน้ำอัตโนมัติ - Smart Farm Technology', NOW()),
(2, 'วันเก็บเกี่ยวผลผลิต', 'img/harvest.jpg', 'นักเรียนเก็บผักใสตอนเช้า - Farm to School', NOW()),
(3, 'บ่อเลี้ยงปลาธรรมชาติ', 'img/pond.jpg', 'ระบบน้ำหมุนเวียน - Sustainable Aquaculture', NOW()),
(4, 'ฟาร์มเห็ดในโรงเรียน', 'img/mushroom.jpg', 'เห็ดนางฟ้าปลอดสาร - Student Project', NOW()),
(5, 'การเลี้ยงกบในบ่อ', 'img/frog.jpg', 'โปรตีนสะอาดจากธรรมชาติ - Clean Protein', NOW()),
(6, 'ไก่ไข่ปลอดโรค', 'img/eggs.jpg', 'ไข่สดทุกวันจากฟาร์มโรงเรียน - Daily Fresh Supply', NOW());

-- Auto increment values
ALTER TABLE `products` AUTO_INCREMENT = 8;
ALTER TABLE `orders` AUTO_INCREMENT = 4;  
ALTER TABLE `media` AUTO_INCREMENT = 7;

COMMIT;