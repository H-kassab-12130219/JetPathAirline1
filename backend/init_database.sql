-- ===========================
--   ALL TABLES (STRUCTURE)
-- ===========================


-- ---------------------------
-- flights
-- ---------------------------
CREATE TABLE IF NOT EXISTS `flights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arrivalLocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departureLocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `continent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roundTrip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `airlineName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `imgsrc` text COLLATE utf8mb4_unicode_ci,
  `flightType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departureDateTime` datetime DEFAULT NULL,
  `arrivalDateTime` datetime DEFAULT NULL,
  `returnDepartureDateTime` datetime DEFAULT NULL,
  `returnArrivalDateTime` datetime DEFAULT NULL,
  `co2ReductionPercent` int DEFAULT '0',
  `flightId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `flightId` (`flightId`),
  KEY `idx_flightId` (`flightId`),
  KEY `idx_continent` (`continent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------
-- reviews
-- ---------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userMessage` text COLLATE utf8mb4_unicode_ci,
  `stars` int DEFAULT '5',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userid` (`userid`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------
-- support_messages
-- ---------------------------
CREATE TABLE IF NOT EXISTS `support_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','in_progress','resolved','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `adminNotes` text COLLATE utf8mb4_unicode_ci,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------
-- userflights
-- ---------------------------
CREATE TABLE IF NOT EXISTS `userflights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `flightId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pointsEarned` int DEFAULT '0',
  `status` enum('booked','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'booked',
  `completedAt` datetime DEFAULT NULL,
  `tickets` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `bookingDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_flightId` (`flightId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------
-- users
-- ---------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patronymic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employmentStatus` enum('working','not_working','student','retired') COLLATE utf8mb4_unicode_ci DEFAULT 'not_working',
  `workingSince` date DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `flightsBookNumber` int DEFAULT '0',
  `flightsDoneNumber` int DEFAULT '0',
  `flightsCanceledNumber` int DEFAULT '0',
  `flightPrice` decimal(10,2) DEFAULT '0.00',
  `jetPoints` int DEFAULT '0',
  `tierLevel` enum('Silver','Gold','Platinum') COLLATE utf8mb4_unicode_ci DEFAULT 'Silver',
  `loyaltyJoinDate` date DEFAULT (curdate()),
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




-- Flights Table – Full INSERT Code
INSERT INTO `flights` (`id`, `arrivalLocation`, `departureLocation`, `continent`, `roundTrip`, `airlineName`, `price`, `imgsrc`, `flightType`, `departureDateTime`, `arrivalDateTime`, `returnDepartureDateTime`, `returnArrivalDateTime`, `co2ReductionPercent`, `flightId`, `createdAt`, `updatedAt`) VALUES
(1, 'Paris', 'Beirut', 'Europe', 'Round Trip', 'Qatar Airways', 850.00, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a', 'Economy', '2026-1-20 12:12:55', '2026-1-20 16:12:55', '2026-1-30 12:12:55', '2026-1-30 12:12:55', 18, 'MEA-PAR-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(2, 'London', 'Beirut', 'Europe', 'Round Trip', 'JetPath', 780.00, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', 'Economy', '2026-1-23 12:12:55', '2026-1-23 17:12:55', '2026-1-30 12:12:55', '2026-1-30 12:12:55', 22, 'MEA-LON-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(3, 'Rome', 'Beirut', 'Europe', 'Round Trip', 'Middle East Airline', 720.00, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5', 'Economy', '2026-1-27 12:12:55', '2026-1-27 15:12:55', '2026-2-04 12:12:55', '2026-2-04 15:12:55', 12, 'MEA-ROM-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:41:34'),
(4, 'Barcelona', 'Beirut', 'Europe', 'Round Trip', 'Vueling', 690.00, 'https://images.unsplash.com/photo-1583422409516-2895a77efded', 'Economy', '2026-2-04 12:12:55', '2026-2-04 16:12:55', '2026-2-11 12:12:55', '2026-2-11 16:12:55', 19, 'MEA-BAR-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(5, 'Amsterdam', 'Beirut', 'Europe', 'Round Trip', 'JetPath', 710.00, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017', 'Economy', '2026-2-11 12:12:55', '2026-2-11 17:12:55', '2026-2-20 12:12:55', '2026-2-20 02:12:55', 17, 'MEA-AMS-1763028775288', '2026-1-13 10:12:55', '2026-1-17 15:03:46'),
(6, 'Tokyo', 'Beirut', 'Asia', 'Round Trip', 'Turkish Airlines', 1200.00, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', 'Economy', '2026-1-18 12:12:55', '2026-1-19 00:12:55', '2026-1-28 12:12:55', '2026-1-29 00:12:55', 30, 'MEA-TOK-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(7, 'Dubai', 'Beirut', 'Asia', 'Round Trip', 'Emirates', 450.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', 'Economy', '2026-1-16 12:12:55', '2026-1-16 15:12:55', '2026-1-23 12:12:55', '2026-1-23 15:12:55', 26, 'MEA-DUB-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(8, 'Bangkok', 'Beirut', 'Asia', 'Round Trip', 'Qatar Airways', 880.00, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365', 'Economy', '2026-1-25 12:12:55', '2026-1-25 21:12:55', '2026-2-05 12:12:55', '2026-2-05 21:12:55', 28, 'MEA-BAN-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(9, 'Singapore', 'Beirut', 'Asia', 'Round Trip', 'Singapore Airlines', 920.00, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd', 'Economy', '2026-2-01 12:12:55', '2026-2-01 22:12:55', '2026-2-11 12:12:55', '2026-2-11 22:12:55', 29, 'MEA-SIN-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(10, 'Seoul', 'Beirut', 'Asia', 'Round Trip', 'JetPath', 1100.00, 'https://images.unsplash.com/photo-1538485399081-7191377e8241', 'Economy', '2026-2-08 12:12:55', '2026-2-08 23:12:55', '2026-2-18 12:12:55', '2026-2-18 23:12:55', 30, 'MEA-SEO-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:51'),
(11, 'Cairo', 'Beirut', 'Africa', 'Round Trip', 'EgyptAir', 600.00, 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a', 'Economy', '2026-1-15 12:12:55', '2026-1-15 14:12:55', '2026-1-20 12:12:55', '2026-1-20 14:12:55', 16, 'MEA-CAI-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:35'),
(12, 'Cape Town', 'Beirut', 'Africa', 'Round Trip', 'Ethiopian Airlines', 890.00, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99', 'Economy', '2026-1-28 12:12:55', '2026-1-28 20:12:55', '2026-2-08 12:12:55', '2026-2-08 20:12:55', 27, 'MEA-CAP-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:36'),
(13, 'Marrakech', 'Beirut', 'Africa', 'Round Trip', 'Royal Air Maroc', 580.00, 'https://images.unsplash.com/photo-1597211684557-c1cdb5b0ca6e', 'Economy', '2026-1-22 12:12:55', '2026-1-22 18:12:55', '2026-1-29 12:12:55', '2026-1-29 18:12:55', 18, 'MEA-MAR-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:36'),
(14, 'Nairobi', 'Beirut', 'Africa', 'Round Trip', 'JetPath', 750.00, 'https://images.unsplash.com/photo-1611348586804-61bf6c080437', 'Economy', '2026-2-03 12:12:55', '2026-2-03 19:12:55', '2026-2-10 12:12:55', '2026-2-10 19:12:55', 25, 'MEA-NAI-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:53'),
(15, 'Johannesburg', 'Beirut', 'Africa', 'Round Trip', 'South African Airways', 820.00, 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743', 'Economy', '2026-2-13 12:12:55', '2026-2-13 21:12:55', '2026-2-23 12:12:55', '2026-2-23 21:12:55', 26, 'MEA-JOH-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:36'),
(16, 'New York', 'Beirut', 'North America', 'Round Trip', 'Middle East Airline', 1100.00, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', 'Economy', '2026-1-19 12:12:55', '2026-1-20 01:12:55', '2026-1-29 12:12:55', '2026-1-30 01:12:55', 27, 'MEA-NEW-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:36'),
(17, 'Los Angeles', 'Beirut', 'North America', 'Round Trip', 'Qatar Airways', 1050.00, 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da', 'Economy', '2026-1-26 12:12:55', '2026-1-27 04:12:55', '2026-2-06 12:12:55', '2026-2-07 04:12:55', 29, 'MEA-LOS-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:36'),
(18, 'Miami', 'Beirut', 'North America', 'Round Trip', 'JetPath', 950.00, 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f', 'Economy', '2026-2-02 12:12:55', '2026-2-03 02:12:55', '2026-2-12 12:12:55', '2026-2-13 02:12:55', 26, 'MEA-MIA-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:58'),
(19, 'Toronto', 'Beirut', 'North America', 'Round Trip', 'JetPath', 980.00, 'https://images.unsplash.com/photo-1517935706615-2717063c2225', 'Economy', '2026-2-07 12:12:55', '2026-2-08 00:12:55', '2026-2-17 12:12:55', '2026-2-18 00:12:55', 24, 'MEA-TOR-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:55'),
(20, 'Vancouver', 'Beirut', 'North America', 'Round Trip', 'Lufthansa', 1150.00, 'https://images.unsplash.com/photo-1559511260-66a654ae982a', 'Economy', '2026-2-14 12:12:55', '2026-2-15 03:12:55', '2026-2-24 12:12:55', '2026-2-25 03:12:55', 28, 'MEA-VAN-1763028775288', '2026-1-13 10:12:55', '2026-1-18 10:43:36');
