-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: db_web_gama_persada
-- ------------------------------------------------------
-- Server version 9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

SET FOREIGN_KEY_CHECKS = 0;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','test@mail.com','1234','2026-06-13 16:27:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'test','test@mail.com',3,'Sistem ERP Perusahaan',5000000.00,'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500','2026-06-13 16:49:57');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Plugin SEO Premium','Plugin untuk optimasi SEO website secara otomatis.',1000000,'Plugin Web','https://contoh-link-unduh.com/plugin-seo.zip','2026-06-13 09:54:25','image product/yoast-seo-pro.webp'),(2,'Plugin SEO Pro unlimitated','Plugin Pro untuk optimasi SEO website.',10000000,'Plugin Web','https://contoh-link-unduh.com/plugin-seo.zip','2026-06-13 10:05:43','image product/yoast-pro-unlimitade.webp'),(3,'Sistem ERP Perusahaan','Software manajemen perusahaan lengkap.',5000000,'Software','https://link.com/erp.zip','2026-06-13 10:37:48','image product/Software-ERP.jpg'),(4,'Aplikasi Kasir (POS) Pro','Sistem kasir cerdas untuk retail.',2500000,'Software','https://link.com/pos.zip','2026-06-13 10:37:48','image product/Aplikasi Kasir (POS) Pro.webp'),(5,'Source Code Marketplace','Script untuk membuat website seperti Tokopedia.',3500000,'Source Code','https://link.com/marketplace.zip','2026-06-13 10:37:48','image product/Source Code Marketplace.png'),(6,'Plugin Keamanan Web VIP','Proteksi anti-DDoS dan malware tingkat lanjut.',1200000,'Plugin Web','https://link.com/security.zip','2026-06-13 10:37:48','image product/Plugin Keamanan Web VIP.webp'),(7,'Template Admin Dashboard','UI Kit premium untuk backend sistem.',1000000,'Asset Desain','https://link.com/admin-ui.zip','2026-06-13 10:37:48','image product/Template Admin Dashboard.webp'),(8,'Sistem Manajemen Rumah Sakit','Software antrian dan rekam medis lengkap.',8000000,'Software','https://link.com/simrs.zip','2026-06-13 10:37:48','image product/Sistem Manajemen Rumah Sakit.jpg'),(9,'Game Engine Asset Pack','Kumpulan 3D asset untuk membuat game RPG.',1500000,'Asset Game','https://link.com/rpg-asset.zip','2026-06-13 10:37:48','image product/Game Engine Asset Pack.jpg'),(10,'Source Code Aplikasi Ojek Online','Script aplikasi driver dan penumpang (Android/iOS).',7500000,'Source Code','https://link.com/ojol.zip','2026-06-13 10:37:48','image product/Source Code Aplikasi Ojek Online.webp'),(11,'Plugin LMS Premium','Plugin elearning untuk membuat website kursus.',1800000,'Plugin Web','https://link.com/lms.zip','2026-06-13 10:37:48','image product/Plugin LMS Premium.jpg'),(12,'Software Akuntansi Plus','Otomatisasi pembukuan dan laporan pajak.',4000000,'Software','https://link.com/akuntansi.zip','2026-06-13 10:37:48','image product/Software Akuntansi Plus.webp'),(13,'Script Web Undangan Digital','Platform pembuat undangan pernikahan online.',2000000,'Source Code','https://link.com/undangan.zip','2026-06-13 10:37:48','image product/Script Web Undangan Digital.jpg'),(14,'Sistem Absensi Face Recognition','Aplikasi absensi karyawan berbasis wajah.',6000000,'Software','https://link.com/absensi.zip','2026-06-13 10:37:48','image product/Sistem Absensi Face Recognition.png'),(15,'UI/UX Layout Design','Layout lengkap untuk UI/UX.',3500000,'Asset Desain','https://link.com/layoutui.zip','2026-06-22 08:14:17','image product/UI:UX Layout Design.webp');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_web_gama_persada'
--

SET FOREIGN_KEY_CHECKS = 1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-23 13:53:19