-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2025 at 04:55 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tdp`
--

-- --------------------------------------------------------

--
-- Table structure for table `ads`
--

CREATE TABLE `ads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ads`
--

INSERT INTO `ads` (`id`, `title`, `image`, `createdAt`, `updatedAt`) VALUES
(2, 'Frist Addd', 'http://localhost:8000/public/images/mhb8-listing_1756924271377.jpg', '2025-09-03 18:29:20', '2025-09-03 18:31:11'),
(5, 'Second Addd', 'http://localhost:8000/public/images/image1_1755713431754.jpg', '2025-09-03 18:29:20', '2025-09-03 18:31:11');

-- --------------------------------------------------------

--
-- Table structure for table `articleAds`
--

CREATE TABLE `articleAds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` text NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articleAds`
--

INSERT INTO `articleAds` (`id`, `title`, `image`, `link`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Article Ist Adss', 'http://localhost:8000/public/images/12_1758639397119.jpg', 'www.google.com', 'desc', '2025-09-23 14:56:37', '2025-09-23 15:03:15');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `heroImage` varchar(255) DEFAULT NULL,
  `status` enum('draft','scheduled','published') NOT NULL DEFAULT 'draft',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `publishedAt` datetime DEFAULT NULL,
  `scheduledAt` datetime DEFAULT NULL,
  `readingMinutes` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `seoTitle` varchar(255) DEFAULT NULL,
  `seoDescription` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL,
  `subCategoryId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `slug`, `excerpt`, `label`, `heroImage`, `status`, `content`, `publishedAt`, `scheduledAt`, `readingMinutes`, `categoryId`, `cityId`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`, `newsId`, `subCategoryId`, `userId`) VALUES
(1, 'title 1', 'sliug', 'exerption', 'http://localhost:8000/public/images/Textiles-and-Fashion_1754679764803.jpg', 'http://localhost:8000/public/images/Sustainable_Living_1754679764812.jpg', 'draft', '\"asdfasf\"', '2025-08-25 19:00:00', '2025-08-08 19:03:00', 5, 1, NULL, 'title', 'sdsaf', '2025-08-08 19:02:44', '2025-08-08 19:02:44', 7, NULL, NULL),
(2, 'title1', 'title1', 'exerption', 'http://localhost:8000/public/images/p10_1754835543207.PNG', 'http://localhost:8000/public/images/p8_1754835543214.PNG', 'draft', '\"conetnt hai\"', '2025-08-23 14:16:00', '2025-08-28 14:16:00', 5, 1, 4, 'seo title', 'seo dexcription', '2025-08-10 14:19:03', '2025-08-10 14:19:03', 8, NULL, 1),
(4, 'title1', 'title2', 'exerption', 'http://localhost:8000/public/images/p10_1754835654231.PNG', 'http://localhost:8000/public/images/p8_1754835654239.PNG', 'draft', '\"conetnt hai\"', '2025-08-23 14:16:00', '2025-08-28 14:16:00', 5, 1, 4, 'seo title', 'seo dexcription', '2025-08-10 14:20:54', '2025-08-10 14:20:54', 10, NULL, 1),
(5, 'article 3', 'artile3', 'exerption', 'http://localhost:8000/public/images/p5_1754835926205.PNG', 'http://localhost:8000/public/images/p8_1754835926228.PNG', 'draft', '\"content\"', '2025-08-12 14:25:00', '2025-09-02 14:25:00', 5, 1, 4, 'seo tile', 'seo dexcription', '2025-08-10 14:25:26', '2025-08-10 14:25:26', 11, NULL, 1),
(9, 'Article 4', 'article-4', 'exerption', 'http://localhost:8000/public/images/p7_1754836176580.PNG', 'http://localhost:8000/public/images/p6_1754836176583.PNG', 'draft', '\"content\"', '2025-08-22 14:29:00', '2025-09-06 14:29:00', 6, 1, 4, 'seo tile', 'seo dexcription', '2025-08-10 14:29:36', '2025-08-10 14:29:36', 15, NULL, 1),
(11, 'Article 4', 'article-5', 'exerption', 'http://localhost:8000/public/images/p7_1754836252854.PNG', 'http://localhost:8000/public/images/p6_1754836252858.PNG', 'draft', '\"content\"', '2025-08-22 14:29:00', '2025-09-06 14:29:00', 6, 1, 4, 'seo tile', 'seo dexcription', '2025-08-10 14:30:52', '2025-08-10 14:30:52', NULL, NULL, 1),
(12, '', '', '', NULL, NULL, 'draft', '\"\"', NULL, NULL, NULL, 2, NULL, '', '', '2025-08-15 16:25:35', '2025-08-15 16:25:35', NULL, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `name` varchar(30) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `status`, `cityId`, `color`, `createdAt`, `updatedAt`) VALUES
(1, 'Foodies', 1, 4, NULL, '2025-08-07 18:03:30', '2025-08-19 15:03:21'),
(2, 'News', 1, 5, NULL, '2025-08-07 18:03:30', '2025-08-19 15:03:30'),
(3, 'Entertainment', 0, 4, NULL, '2025-08-14 07:22:05', '2025-08-19 15:03:45'),
(5, 'Sports', 1, NULL, NULL, '2025-08-15 16:05:54', '2025-08-19 15:03:57'),
(6, 'Tech', 1, NULL, NULL, '2025-08-19 15:04:10', '2025-08-19 15:04:10'),
(7, 'Wellness', 1, NULL, NULL, '2025-08-19 15:04:20', '2025-08-19 15:04:20'),
(8, 'Shows', 1, NULL, NULL, '2025-08-19 15:04:29', '2025-08-19 15:04:29'),
(9, 'Shopping', 1, NULL, NULL, '2025-08-19 15:04:29', '2025-08-19 15:04:29'),
(10, 'Life Style', 1, NULL, NULL, '2025-08-19 15:04:29', '2025-08-19 15:04:29');

-- --------------------------------------------------------

--
-- Table structure for table `categoryAds`
--

CREATE TABLE `categoryAds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `link` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoryAds`
--

INSERT INTO `categoryAds` (`id`, `title`, `image`, `createdAt`, `updatedAt`, `link`, `description`) VALUES
(1, 'Category Ads One', 'http://localhost:8000/public/images/12_1758220035914.jpg', '2025-09-17 18:02:52', '2025-09-18 18:41:00', 'undefined', 'This is the description of first ads, this is about to negotiate the workl'),
(3, 'Category Ad 2', 'http://localhost:8000/public/images/12_1758221128145.jpg', '2025-09-18 18:26:13', '2025-09-18 18:45:28', 'undefined', 'undefined');

-- --------------------------------------------------------

--
-- Table structure for table `categoryMainSections`
--

CREATE TABLE `categoryMainSections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `key` enum('first','second','third','fourth') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoryMainSections`
--

INSERT INTO `categoryMainSections` (`id`, `key`, `createdAt`, `updatedAt`, `newsId`, `categoryId`) VALUES
(5, 'first', '2025-09-18 16:16:44', '2025-09-18 16:16:44', 19, 2),
(6, 'second', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 21, 2),
(7, 'third', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 22, 2),
(8, 'fourth', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 23, 2),
(9, 'first', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 43, 3),
(10, 'second', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 50, 3),
(11, 'third', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 51, 3),
(12, 'fourth', '2025-09-18 16:16:45', '2025-09-18 16:16:45', 52, 3);

-- --------------------------------------------------------

--
-- Table structure for table `categoryTrendingNews`
--

CREATE TABLE `categoryTrendingNews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoryTrendingNews`
--

INSERT INTO `categoryTrendingNews` (`id`, `createdAt`, `updatedAt`, `newsId`, `categoryId`) VALUES
(97, '2025-09-18 16:39:14', '2025-09-18 16:39:14', 43, 3),
(98, '2025-09-18 16:39:14', '2025-09-18 16:39:14', 50, 3),
(99, '2025-09-18 16:39:14', '2025-09-18 16:39:14', 51, 3),
(100, '2025-09-18 16:39:14', '2025-09-18 16:39:14', 52, 3),
(120, '2025-09-22 15:06:39', '2025-09-22 15:06:39', 19, 2),
(121, '2025-09-22 15:06:39', '2025-09-22 15:06:39', 21, 2),
(122, '2025-09-22 15:06:39', '2025-09-22 15:06:39', 22, 2),
(123, '2025-09-22 15:06:39', '2025-09-22 15:06:39', 23, 2),
(124, '2025-09-22 15:06:39', '2025-09-22 15:06:39', 30, 2);

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `name` varchar(30) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `comming_soon` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `image`, `comming_soon`, `createdAt`, `updatedAt`) VALUES
(4, 'Dubai', 'http://localhost:8000/public/images/donut_1754588347054.png', NULL, '2025-08-07 17:12:09', '2025-08-19 15:05:50'),
(5, 'Ajman', 'http://localhost:8000/public/images/burger_1754586872491.png', NULL, '2025-08-07 17:14:32', '2025-08-19 15:06:02'),
(6, 'Kuwait', 'http://localhost:8000/public/images/coffee_1754586901502.png', NULL, '2025-08-07 17:15:01', '2025-08-19 15:06:10'),
(8, 'Oman', 'http://localhost:8000/public/images/burger_1755615988301.png', NULL, '2025-08-19 15:06:28', '2025-08-19 15:06:28'),
(9, 'Karachi', 'http://localhost:8000/public/images/1756142647_Gardening_and_Landscaping_1760341113863.jpg', NULL, '2025-10-13 07:38:34', '2025-10-13 07:38:34'),
(10, 'Lahore', 'http://localhost:8000/public/images/1756142647_Gardening_and_Landscaping_1760341154774.jpg', NULL, '2025-10-13 07:39:15', '2025-10-13 07:39:15'),
(11, 'ass', 'http://localhost:8000/public/images/1756142647_Gardening_and_Landscaping_1760341208701.jpg', NULL, '2025-10-13 07:40:09', '2025-10-13 07:40:09'),
(12, 'asd', 'http://localhost:8000/public/images/FILE_1760421734188.jpg', NULL, '2025-10-14 06:02:17', '2025-10-14 06:02:17');

-- --------------------------------------------------------

--
-- Table structure for table `cityCategories`
--

CREATE TABLE `cityCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cityCategories`
--

INSERT INTO `cityCategories` (`id`, `createdAt`, `updatedAt`, `categoryId`, `cityId`) VALUES
(4, '2025-08-15 16:11:14', '2025-08-15 16:11:14', 3, 4),
(5, '2025-08-15 16:11:14', '2025-08-15 16:11:14', 3, 6),
(6, '2025-08-15 16:11:21', '2025-08-15 16:11:21', 2, 5),
(7, '2025-08-15 16:11:21', '2025-08-15 16:11:21', 2, 6),
(8, '2025-08-15 16:13:18', '2025-08-15 16:13:18', 5, 5),
(9, '2025-08-15 16:13:18', '2025-08-15 16:13:18', 5, 6),
(10, '2025-08-15 16:13:29', '2025-08-15 16:13:29', 1, 4),
(11, '2025-08-15 16:13:29', '2025-08-15 16:13:29', 1, 5),
(12, '2025-08-15 16:13:29', '2025-08-15 16:13:29', 1, 6),
(13, '2025-08-19 15:03:45', '2025-08-19 15:03:45', 3, 5),
(14, '2025-08-19 15:03:57', '2025-08-19 15:03:57', 5, 4),
(15, '2025-08-19 15:04:10', '2025-08-19 15:04:10', 6, 4),
(16, '2025-08-19 15:04:10', '2025-08-19 15:04:10', 6, 5),
(17, '2025-08-19 15:04:10', '2025-08-19 15:04:10', 6, 6),
(18, '2025-08-19 15:04:20', '2025-08-19 15:04:20', 7, 4),
(19, '2025-08-19 15:04:20', '2025-08-19 15:04:20', 7, 5),
(20, '2025-08-19 15:04:20', '2025-08-19 15:04:20', 7, 6),
(21, '2025-08-19 15:04:29', '2025-08-19 15:04:29', 8, 4),
(22, '2025-08-19 15:04:29', '2025-08-19 15:04:29', 8, 5),
(23, '2025-08-19 15:04:29', '2025-08-19 15:04:29', 8, 6);

-- --------------------------------------------------------

--
-- Table structure for table `forgetPasswords`
--

CREATE TABLE `forgetPasswords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `OTP` varchar(10) DEFAULT NULL,
  `requestedAt` datetime DEFAULT NULL,
  `expiryAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forgetPasswords`
--

INSERT INTO `forgetPasswords` (`id`, `OTP`, `requestedAt`, `expiryAt`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, '6529', '2025-08-18 15:13:16', '2025-08-18 15:16:16', '2025-08-18 15:13:16', '2025-08-18 15:13:16', 1),
(2, '5639', '2025-08-18 15:13:43', '2025-08-18 15:16:43', '2025-08-18 15:13:43', '2025-08-18 15:13:43', 1),
(3, '0593', '2025-08-18 15:14:09', '2025-08-18 15:17:09', '2025-08-18 15:14:09', '2025-08-18 15:14:09', 1),
(4, '1866', '2025-08-18 15:16:40', '2025-08-18 15:19:40', '2025-08-18 15:16:40', '2025-08-18 15:16:40', 1),
(5, '0580', '2025-08-18 15:19:58', '2025-08-18 15:22:58', '2025-08-18 15:19:58', '2025-08-18 15:19:58', 1),
(6, '6376', '2025-08-18 15:22:23', '2025-08-18 15:25:23', '2025-08-18 15:22:23', '2025-08-18 15:22:23', 1),
(7, '7847', '2025-08-18 15:25:00', '2025-08-18 15:28:00', '2025-08-18 15:25:00', '2025-08-18 15:25:00', 1),
(8, '2179', '2025-09-15 15:06:10', '2025-09-15 15:09:10', '2025-09-15 15:06:10', '2025-09-15 15:06:10', 1);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `title` varchar(255) DEFAULT NULL,
  `slug` text DEFAULT NULL,
  `thumbnail` longtext DEFAULT NULL,
  `status` enum('draft','publish','preview') DEFAULT 'draft',
  `tags` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `subCategoryId` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `template` varchar(255) NOT NULL DEFAULT 'template1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `slug`, `thumbnail`, `status`, `tags`, `seo_title`, `seo_description`, `content`, `createdAt`, `updatedAt`, `categoryId`, `subCategoryId`, `cityId`, `userId`, `template`) VALUES
(19, 'The magic of Disney is landing in Abu Dhabi', NULL, 'http://localhost:8000/public/images/image1_1755713431754.jpg', 'draft', '', '', '', '<p>Get ready for a world of wonder, rides, and unforgettable experiences on Yas Island.<br><br><br></p><p>In a move set to redefine entertainment in the region, Disneyland has officially announced plans to open its first theme park in the Middle East – right on Yas Island in Abu Dhabi. Known for its world-class attractions like Ferrari World and Warner Bros. World, Yas Island will soon add another crown jewel to its entertainment lineup. Known for its world-class attractions like Ferrari World and WIndia and exploring opportunities for enhanced cooperation between the two countries.</p><p><br></p><p><br></p><p><br></p>', '2025-08-15 16:34:58', '2025-09-09 03:20:20', 2, 2, 5, 1, 'template1');
INSERT INTO `news` (`id`, `title`, `slug`, `thumbnail`, `status`, `tags`, `seo_title`, `seo_description`, `content`, `createdAt`, `updatedAt`, `categoryId`, `subCategoryId`, `cityId`, `userId`, `template`) VALUES
;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `status` enum('approved','pending','reject') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `name`, `slug`, `location`, `content`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'About Us', 'about-us', 'Header', '<div style=\"border: 2px solid #e60000; padding: 25px; border-radius: 8px; background: #fff5f5;\">\n  <h2 style=\"color: #e60000; text-align: center;\">ℹ️ About Us</h2>\n\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    <strong style=\"color:#e60000;\">The Dubai News</strong> is your trusted digital platform dedicated to \n    bringing the latest updates, breaking headlines, and in-depth coverage from Dubai and beyond.  \n    We believe in the power of quality journalism — to inform, inspire, and connect people worldwide.\n  </p>\n\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    Our mission is simple yet impactful: \n    <span style=\"color:#e60000; font-weight:bold;\">to deliver accurate, unbiased, and timely news \n    that matters most to you.</span>\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">🌍 What We Cover</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><span style=\"color:#e60000;\">Local Dubai News</span> – events, developments, and stories shaping the city</li>\n    <li><span style=\"color:#e60000;\">Business & Economy</span> – insights into UAE’s growing financial landscape</li>\n    <li><span style=\"color:#e60000;\">Technology & Innovation</span> – updates from one of the world’s fastest-evolving hubs</li>\n    <li><span style=\"color:#e60000;\">Lifestyle & Culture</span> – the vibrant traditions and modern lifestyle of Dubai</li>\n    <li><span style=\"color:#e60000;\">Sports & Entertainment</span> – highlights, features, and exclusive coverage</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">🤝 Why Choose Us?</h3>\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    With a dedicated team of passionate journalists and content creators, \n    <strong>The Dubai News</strong> ensures that every story is researched, verified, and delivered with credibility.  \n    Whether you’re a local resident, business professional, or global reader, we bring Dubai closer to you.\n  </p>\n\n  <p style=\"text-align:center; font-size: 16px; font-weight: bold; color: #e60000; margin-top: 25px;\">\n    Stay informed. Stay connected. Stay with <strong>The Dubai News</strong>.\n  </p>\n</div>\n', 'approved', '2025-08-27 17:44:39', '2025-08-27 18:28:36'),
(4, 'Contact us', 'contact-us', 'Header', '<div style=\"border: 2px solid #e60000; padding: 25px; border-radius: 8px; background: #fff5f5;\">\n  <h2 style=\"color: #e60000; text-align: center;\">📞 Contact Us</h2>\n\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    We’d love to hear from you! Whether you have a question, feedback, or a news tip to share,  \n    the team at <strong style=\"color:#e60000;\">The Dubai News</strong> is always ready to connect.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">📬 Get in Touch</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><strong style=\"color:#e60000;\">Email:</strong> support@thedubainews.com</li>\n    <li><strong style=\"color:#e60000;\">Phone:</strong> +971 50 123 4567</li>\n    <li><strong style=\"color:#e60000;\">Address:</strong> Office #123, Business Center, Dubai, UAE</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">📝 Send Us a Message</h3>\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    Simply fill out the form below and our team will get back to you as soon as possible.\n  </p>\n\n  <div style=\"text-align: center; margin-top: 20px;\">\n    <input type=\"text\" placeholder=\"Your Name\" style=\"padding: 10px; width: 60%; border: 1px solid #e60000; border-radius: 5px; margin-bottom: 10px;\"><br>\n    <input type=\"email\" placeholder=\"Your Email\" style=\"padding: 10px; width: 60%; border: 1px solid #e60000; border-radius: 5px; margin-bottom: 10px;\"><br>\n    <textarea placeholder=\"Your Message\" style=\"padding: 10px; width: 60%; height: 100px; border: 1px solid #e60000; border-radius: 5px; margin-bottom: 10px;\"></textarea><br>\n    <button style=\"background:#e60000; color:#fff; padding: 10px 25px; border: none; border-radius: 5px; cursor:pointer;\">\n      Send Message\n    </button>\n  </div>\n\n  <p style=\"text-align: center; font-size: 13px; margin-top: 15px; color: #555;\">\n    📢 Our team is available Monday to Friday, 9:00 AM – 6:00 PM (GST).\n  </p>\n</div>\n', 'approved', '2025-08-27 16:47:33', '2025-08-27 18:28:47'),
(5, 'News letter', 'news-letter', 'Header', '<div style=\"border: 2px solid #e60000; padding: 20px; border-radius: 8px; background: #fff5f5;\">\n  <h2 style=\"color: #e60000; text-align: center;\">📩 Subscribe to Our Newsletter</h2>\n  \n  <p style=\"font-size: 16px; line-height: 1.6;\">\n    Stay informed with the <strong style=\"color:#e60000;\">The Dubai News</strong> newsletter — your trusted source for the latest \n    updates, breaking headlines, and in-depth stories from Dubai and around the globe. \n  </p>\n\n  <p style=\"font-size: 16px; line-height: 1.6;\">\n    By joining our newsletter, you’ll receive carefully curated news covering:\n  </p>\n  \n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><span style=\"color:#e60000;\">Top Headlines</span> – never miss the stories that matter most</li>\n    <li><span style=\"color:#e60000;\">Business & Economy</span> – insights into Dubai’s growing market</li>\n    <li><span style=\"color:#e60000;\">Lifestyle & Travel</span> – discover the beauty and culture of the UAE</li>\n    <li><span style=\"color:#e60000;\">Technology & Innovation</span> – stay ahead with the latest trends</li>\n    <li><span style=\"color:#e60000;\">Sports & Entertainment</span> – highlights, features, and exclusive coverage</li>\n  </ul>\n  \n  <p style=\"font-size: 16px; line-height: 1.6;\">\n    <strong style=\"color:#e60000;\">Be part of our growing community today!</strong><br>\n    Simply enter your email address and get news straight to your inbox — fast, reliable, and engaging. \n  </p>\n  \n  <div style=\"text-align: center; margin-top: 20px;\">\n    <input type=\"email\" placeholder=\"Enter your email\" style=\"padding: 10px; width: 60%; border: 1px solid #e60000; border-radius: 5px;\">\n    <button style=\"background:#e60000; color:#fff; padding: 10px 20px; border: none; border-radius: 5px; cursor:pointer; margin-left: 10px;\">\n      Subscribe\n    </button>\n  </div>\n  \n  <p style=\"text-align: center; font-size: 13px; margin-top: 15px; color: #555;\">\n    🔒 We respect your privacy. No spam. Unsubscribe anytime.\n  </p>\n</div>\n', 'approved', '2025-08-27 16:47:48', '2025-08-27 16:47:48'),
(8, 'Enterprises', 'enterprises', 'Header', '<p>Hello this is content</p>', 'approved', '2025-08-27 18:26:04', '2025-08-27 18:26:04'),
(9, 'Terms and Conditions', 'terms-and-conditions', 'Header', '<div style=\"border: 2px solid #e60000; padding: 25px; border-radius: 8px; background: #fff5f5;\">\n  <h2 style=\"color: #e60000; text-align: center;\">📜 Terms & Conditions</h2>\n\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    Welcome to <strong style=\"color:#e60000;\">The Dubai News</strong>. By accessing or using our website, \n    you agree to comply with and be bound by the following Terms & Conditions.  \n    Please read them carefully before using our services.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">1. Acceptance of Terms</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    By accessing or using our website, you confirm that you accept these Terms & Conditions.  \n    If you do not agree, you must not use our platform.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">2. Use of Content</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    All articles, news reports, images, and other content published on \n    <strong>The Dubai News</strong> are for informational purposes only.  \n    Reproduction, distribution, or modification without prior written consent is prohibited.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">3. User Responsibilities</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li>You agree not to misuse or abuse the website in any way.</li>\n    <li>You must not post offensive, defamatory, or unlawful material.</li>\n    <li>You are responsible for maintaining the confidentiality of your account details.</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">4. Third-Party Links</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    Our website may contain links to third-party websites.  \n    <strong style=\"color:#e60000;\">The Dubai News</strong> is not responsible for the content or privacy practices of these external sites.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">5. Limitation of Liability</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    While we strive to provide accurate and reliable information,  \n    <strong>The Dubai News</strong> does not guarantee the completeness or accuracy of the content.  \n    We shall not be held liable for any direct or indirect damages resulting from the use of our services.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">6. Changes to Terms</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    <strong>The Dubai News</strong> reserves the right to update or modify these Terms & Conditions at any time.  \n    Continued use of the site means you accept any changes.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">7. Contact Us</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    If you have any questions about these Terms & Conditions,  \n    please contact us at <a href=\"mailto:support@thedubainews.com\" style=\"color:#e60000;\">support@thedubainews.com</a>.\n  </p>\n\n  <p style=\"text-align:center; font-size: 14px; margin-top: 25px; color:#555;\">\n    ✅ Last updated: January 2025\n  </p>\n</div>\n', 'approved', '2025-08-27 18:45:15', '2025-08-27 18:45:15'),
(10, 'Media kit', 'media-kit', 'Header', '<div style=\"border: 2px solid #e60000; padding: 25px; border-radius: 8px; background: #fff5f5;\">\n  <h2 style=\"color: #e60000; text-align: center;\">🎯 Media Kit – The Dubai News</h2>\n\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    Welcome to the official <strong style=\"color:#e60000;\">Media Kit</strong> of <strong>The Dubai News</strong>.  \n    Here, you’ll find key information about our brand, audience, and advertising opportunities.  \n    We are proud to be one of Dubai’s growing digital news platforms, delivering trusted journalism worldwide.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">📌 About The Dubai News</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    <strong>The Dubai News</strong> covers breaking news, business, lifestyle, culture, and technology —  \n    keeping readers informed with accuracy and speed. Our platform is built on credibility and engagement.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">👥 Audience Overview</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><strong style=\"color:#e60000;\">Monthly Readers:</strong> 500K+ active visitors</li>\n    <li><strong style=\"color:#e60000;\">Geographic Reach:</strong> Dubai, UAE, GCC, and international readers</li>\n    <li><strong style=\"color:#e60000;\">Demographics:</strong> Business professionals, entrepreneurs, students, and travelers</li>\n    <li><strong style=\"color:#e60000;\">Platforms:</strong> Website, Mobile, Social Media</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">📢 Advertising Opportunities</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><strong style=\"color:#e60000;\">Display Ads:</strong> Banner placements across web & mobile</li>\n    <li><strong style=\"color:#e60000;\">Sponsored Content:</strong> Custom articles, features & promotions</li>\n    <li><strong style=\"color:#e60000;\">Newsletter Sponsorships:</strong> Reach thousands of engaged subscribers</li>\n    <li><strong style=\"color:#e60000;\">Social Media Campaigns:</strong> Leverage our reach on Facebook, Instagram, and Twitter</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">🎨 Brand Assets</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    Download our official logos, media assets, and brand guidelines below:\n  </p>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><a href=\"#\" style=\"color:#e60000;\">🔗 Logo Pack (PNG, SVG)</a></li>\n    <li><a href=\"#\" style=\"color:#e60000;\">🔗 Brand Guidelines (PDF)</a></li>\n    <li><a href=\"#\" style=\"color:#e60000;\">🔗 Media Images (High-Resolution)</a></li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">📞 Contact for Media Inquiries</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    For partnerships, collaborations, or press inquiries, please contact:\n  </p>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li><strong>Email:</strong> media@thedubainews.com</li>\n    <li><strong>Phone:</strong> +971 50 987 6543</li>\n  </ul>\n\n  <p style=\"text-align:center; font-size: 16px; font-weight: bold; color: #e60000; margin-top: 25px;\">\n    Partner with <strong>The Dubai News</strong> and grow your brand with us.\n  </p>\n</div>\n', 'approved', '2025-08-27 18:49:18', '2025-08-27 18:49:18'),
(11, 'Privacy and policy', 'privacy-and-policy', 'Header', '<div style=\"border: 2px solid #e60000; padding: 25px; border-radius: 8px; background: #fff5f5;\">\n  <h2 style=\"color: #e60000; text-align: center;\">🔒 Privacy Policy</h2>\n\n  <p style=\"font-size: 16px; line-height: 1.7;\">\n    At <strong style=\"color:#e60000;\">The Dubai News</strong>, we respect your privacy and are committed \n    to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard \n    your data when you access our website and services.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">1. Information We Collect</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li>Personal details such as name, email, and phone number (when voluntarily provided).</li>\n    <li>Non-personal information such as browser type, device, and IP address.</li>\n    <li>Subscription details when you sign up for our newsletter.</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">2. How We Use Your Information</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li>To provide accurate news and updates tailored to your interests.</li>\n    <li>To send newsletters, alerts, and promotional content (if subscribed).</li>\n    <li>To improve website functionality and user experience.</li>\n    <li>To respond to inquiries and provide customer support.</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">3. Sharing of Information</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    <strong>The Dubai News</strong> does not sell, trade, or rent personal information to third parties.  \n    However, we may share limited data with trusted partners for analytics, marketing, or legal compliance.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">4. Cookies & Tracking</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    We use cookies to enhance your browsing experience, analyze traffic, and personalize content.  \n    You can disable cookies in your browser settings, but some features may not function properly.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">5. Data Security</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    We implement security measures to protect your personal data.  \n    While we strive to safeguard your information, no online transmission is 100% secure.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">6. Your Rights</h3>\n  <ul style=\"font-size: 15px; line-height: 1.8;\">\n    <li>Request access to the personal data we hold about you.</li>\n    <li>Request corrections or deletion of your data.</li>\n    <li>Unsubscribe from our newsletter at any time.</li>\n  </ul>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">7. Changes to This Policy</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    We may update this Privacy Policy from time to time.  \n    Any changes will be posted on this page with an updated date.\n  </p>\n\n  <h3 style=\"color:#e60000; margin-top:20px;\">8. Contact Us</h3>\n  <p style=\"font-size: 15px; line-height: 1.7;\">\n    If you have questions or concerns about this Privacy Policy,  \n    please contact us at:  \n    <a href=\"mailto:privacy@thedubainews.com\" style=\"color:#e60000;\">privacy@thedubainews.com</a>\n  </p>\n\n  <p style=\"text-align:center; font-size: 14px; margin-top: 25px; color:#555;\">\n    ✅ Last updated: January 2025\n  </p>\n</div>\n', 'approved', '2025-08-27 18:50:26', '2025-08-27 18:50:26');

-- --------------------------------------------------------

--
-- Table structure for table `pinArticles`
--

CREATE TABLE `pinArticles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `key` enum('main','left','right') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pinArticles`
--

INSERT INTO `pinArticles` (`id`, `key`, `createdAt`, `updatedAt`, `newsId`) VALUES
(1, 'main', '2025-09-03 15:24:35', '2025-09-15 15:36:19', 50),
(2, 'left', '2025-09-03 15:24:35', '2025-09-15 15:36:19', 43),
(3, 'right', '2025-09-03 15:24:35', '2025-09-15 15:36:19', 21);

-- --------------------------------------------------------

--
-- Table structure for table `subCategories`
--

CREATE TABLE `subCategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `name` varchar(30) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subCategories`
--

INSERT INTO `subCategories` (`id`, `name`, `status`, `createdAt`, `updatedAt`, `categoryId`, `color`) VALUES
(2, 'News', 1, '2025-08-08 20:29:05', '2025-08-19 15:04:59', 2, NULL),
(3, 'Reviews', 1, '2025-08-08 20:29:05', '2025-08-19 15:05:07', 2, NULL),
(4, 'Guide', 1, '2025-08-10 15:26:51', '2025-08-19 15:13:03', 2, NULL),
(6, 'Esports', 1, '2025-08-19 15:05:27', '2025-08-19 15:05:27', 2, NULL),
(7, 'Tech', 1, '2025-08-19 15:12:58', '2025-08-19 15:12:58', 2, NULL),
(8, 'Music', 1, '2025-08-08 20:29:05', '2025-08-19 15:05:07', 2, NULL),
(9, 'Industry', 1, '2025-08-08 20:29:05', '2025-08-19 15:05:07', 2, NULL),
(10, 'Tourism', 1, '2025-08-08 20:29:05', '2025-08-19 15:05:07', 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subCategoryAds`
--

CREATE TABLE `subCategoryAds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` text NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subCategoryAds`
--

INSERT INTO `subCategoryAds` (`id`, `title`, `image`, `link`, `description`, `createdAt`, `updatedAt`) VALUES
(2, 'This is first ad', 'http://localhost:8000/public/images/12_1758297646364.jpg', 'www.facebook.com', 'This is desc', '2025-09-19 16:00:46', '2025-09-19 16:00:46'),
(3, 'Second Ads', 'http://localhost:8000/public/images/12_1758299999542.jpg', 'www.google.com', 'This is some descirption of the second ads . Its look better for the cause of good.', '2025-09-19 16:39:59', '2025-09-19 16:39:59');

-- --------------------------------------------------------

--
-- Table structure for table `subCategoryMainNews`
--

CREATE TABLE `subCategoryMainNews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `key` enum('first','second','third') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL,
  `subCategoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subCategoryMainNews`
--

INSERT INTO `subCategoryMainNews` (`id`, `key`, `createdAt`, `updatedAt`, `newsId`, `subCategoryId`) VALUES
(1, 'first', '2025-09-19 15:50:06', '2025-09-19 15:50:06', 19, 2),
(2, 'second', '2025-09-19 15:50:06', '2025-09-19 15:51:28', 22, 2),
(3, 'third', '2025-09-19 15:50:06', '2025-09-19 15:51:28', 23, 2),
(4, 'first', '2025-09-19 15:50:06', '2025-09-19 15:51:28', 50, 10),
(5, 'second', '2025-09-19 15:50:06', '2025-09-19 15:51:28', 43, 10),
(6, 'third', '2025-09-19 15:50:06', '2025-09-19 15:50:06', 52, 10);

-- --------------------------------------------------------

--
-- Table structure for table `topPickArticles`
--

CREATE TABLE `topPickArticles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `key` enum('topPicks','foodies','eyeout','budget') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topPickArticles`
--

INSERT INTO `topPickArticles` (`id`, `key`, `createdAt`, `updatedAt`, `newsId`) VALUES
(15, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', NULL),
(16, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 19),
(17, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 21),
(18, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 22),
(19, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 23),
(20, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 30),
(21, 'topPicks', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 31),
(22, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 21),
(23, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 19),
(24, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', NULL),
(25, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 32),
(26, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 31),
(27, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 30),
(28, 'foodies', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 23),
(29, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', NULL),
(30, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 19),
(31, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 21),
(32, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 22),
(33, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 23),
(34, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 30),
(35, 'eyeout', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 31),
(36, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 21),
(37, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 19),
(38, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', NULL),
(39, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 23),
(40, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 30),
(41, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 31),
(42, 'budget', '2025-09-06 04:57:49', '2025-09-06 04:57:49', 32);

-- --------------------------------------------------------

--
-- Table structure for table `trendingArticles`
--

CREATE TABLE `trendingArticles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `key` enum('main','left','right','leftSide') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trendingArticles`
--

INSERT INTO `trendingArticles` (`id`, `key`, `createdAt`, `updatedAt`, `newsId`) VALUES
(1, 'main', '2025-09-03 16:47:56', '2025-09-03 17:03:56', 32),
(2, 'left', '2025-09-03 16:47:56', '2025-09-03 17:03:56', 31),
(3, 'right', '2025-09-03 16:47:56', '2025-09-03 17:03:56', 30),
(4, 'leftSide', '2025-09-03 16:47:56', '2025-09-03 17:03:56', 23);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `name` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `stripeCustomerId` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `profile_image`, `role`, `email`, `password`, `stripeCustomerId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'http://localhost:8000/public\\images\\coffee_1755441642429.png', 'admin', 'admin@admin.com', '$2a$10$ISjH4fwRedp6kgheF4pZ.OETHJojhQrzuSJuVqx6In3mDvwAv4HMW', 'asdfsa', 1, '2025-08-07 17:38:04', '2025-09-15 15:06:18'),
(2, 'Writer', 'http://localhost:8000/public\\images\\gig_pic_1755286174648.webp', 'writer', 'writer@admin.com', '$2a$10$/CTXmv.ODH0AQC0Go4XGkepx0umbKDTfy7p6q19Tqf/7KMc4B/K3S', 'asdfsa', 1, '2025-08-07 17:38:04', '2025-08-15 19:29:34'),
(8, 'Writer 07', 'http://localhost:8000/public\\images\\coffee_1755286192079.png', 'writer', 'wrtier07@gmail.com', NULL, NULL, 1, '2025-08-14 11:40:43', '2025-08-15 19:29:52'),
(9, 'Writer 08', 'http://localhost:8000/public\\images\\taco_1755286477568.png', 'writer', 'writer08@gmail.com', NULL, NULL, 1, '2025-08-14 11:41:56', '2025-08-15 19:34:37'),
(11, 'Writer 05', 'http://localhost:8000/public\\images\\coffee_1755441453588.png', 'writer', 'writer05@gmail.com', '$2a$10$Owo9KS.Srzl.xQdcEN9DPel6803g6a0xnbDQ/r/H.6D.mHylvm/si', NULL, 1, '2025-08-15 19:25:50', '2025-08-17 14:37:33');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`),
  `description` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `description`, `video`, `title`, `createdAt`, `updatedAt`) VALUES
(2, 'Uploaded video file', 'http://localhost:8000/public/images/loader_1759163022056.mp4', 'Video_1759162554711', '2025-09-29 16:15:54', '2025-09-29 16:23:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ads`
--
ALTER TABLE `ads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `image` (`image`);

--
-- Indexes for table `articleAds`
--
ALTER TABLE `articleAds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `image` (`image`),
  ADD UNIQUE KEY `link` (`link`) USING HASH,
  ADD UNIQUE KEY `description` (`description`) USING HASH;

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `newsId` (`newsId`),
  ADD KEY `subCategoryId` (`subCategoryId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categoryAds`
--
ALTER TABLE `categoryAds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `image` (`image`);

--
-- Indexes for table `categoryMainSections`
--
ALTER TABLE `categoryMainSections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`);

--
-- Indexes for table `categoryTrendingNews`
--
ALTER TABLE `categoryTrendingNews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cityCategories`
--
ALTER TABLE `cityCategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `cityId` (`cityId`);

--
-- Indexes for table `forgetPasswords`
--
ALTER TABLE `forgetPasswords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `cityId` (`cityId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pinArticles`
--
ALTER TABLE `pinArticles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`);

--
-- Indexes for table `subCategories`
--
ALTER TABLE `subCategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `subCategoryAds`
--
ALTER TABLE `subCategoryAds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `image` (`image`),
  ADD UNIQUE KEY `link` (`link`) USING HASH,
  ADD UNIQUE KEY `description` (`description`) USING HASH;

--
-- Indexes for table `subCategoryMainNews`
--
ALTER TABLE `subCategoryMainNews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`),
  ADD KEY `subCategoryId` (`subCategoryId`);

--
-- Indexes for table `topPickArticles`
--
ALTER TABLE `topPickArticles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`);

--
-- Indexes for table `trendingArticles`
--
ALTER TABLE `trendingArticles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newsId` (`newsId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ads`
--
ALTER TABLE `ads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `articleAds`
--
ALTER TABLE `articleAds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `categoryAds`
--
ALTER TABLE `categoryAds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categoryMainSections`
--
ALTER TABLE `categoryMainSections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `categoryTrendingNews`
--
ALTER TABLE `categoryTrendingNews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `cityCategories`
--
ALTER TABLE `cityCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `forgetPasswords`
--
ALTER TABLE `forgetPasswords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `pinArticles`
--
ALTER TABLE `pinArticles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subCategories`
--
ALTER TABLE `subCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `subCategoryAds`
--
ALTER TABLE `subCategoryAds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subCategoryMainNews`
--
ALTER TABLE `subCategoryMainNews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `topPickArticles`
--
ALTER TABLE `topPickArticles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `trendingArticles`
--
ALTER TABLE `trendingArticles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`id`), AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articlesIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `articlesIbfk2` FOREIGN KEY (`subCategoryId`) REFERENCES `subCategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `articlesIbfk3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categoryMainSections`
--
ALTER TABLE `categoryMainSections`
  ADD CONSTRAINT `categoryMainSectionsIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categoryTrendingNews`
--
ALTER TABLE `categoryTrendingNews`
  ADD CONSTRAINT `categoryTrendingNewsIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cityCategories`
--
ALTER TABLE `cityCategories`
  ADD CONSTRAINT `cityCategoriesIbfk1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `cityCategoriesIbfk2` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `forgetPasswords`
--
ALTER TABLE `forgetPasswords`
  ADD CONSTRAINT `forgetPasswordsIbfk1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `newsIbfk1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `newsIbfk2` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `newsIbfk3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pinArticles`
--
ALTER TABLE `pinArticles`
  ADD CONSTRAINT `pinArticlesIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `subCategories`
--
ALTER TABLE `subCategories`
  ADD CONSTRAINT `subCategoriesIbfk1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `subCategoryMainNews`
--
ALTER TABLE `subCategoryMainNews`
  ADD CONSTRAINT `subCategoryMainNewsIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subCategoryMainNewsIbfk2` FOREIGN KEY (`subCategoryId`) REFERENCES `subCategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `topPickArticles`
--
ALTER TABLE `topPickArticles`
  ADD CONSTRAINT `topPickArticlesIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `trendingArticles`
--
ALTER TABLE `trendingArticles`
  ADD CONSTRAINT `trendingArticlesIbfk1` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
