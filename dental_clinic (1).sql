-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2025 at 04:23 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dental_clinic`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patientId` int(11) DEFAULT NULL,
  `firstName` varchar(100) NOT NULL,
  `middleName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) NOT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `contactNumber` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `appointmentDate` date NOT NULL,
  `appointmentTime` time NOT NULL,
  `treatmentId` varchar(100) NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `photo` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patientId`, `firstName`, `middleName`, `lastName`, `suffix`, `gender`, `contactNumber`, `email`, `appointmentDate`, `appointmentTime`, `treatmentId`, `status`, `photo`, `createdAt`) VALUES
(18, 9, 'Honeyleth', 'Sante', 'Monteadora', NULL, 'Female', '09999273884', 'monteadora@gmail.com', '2025-06-02', '10:00:00', 'Veneers', 'completed', NULL, '2025-05-29 20:45:42'),
(19, NULL, 'Honeyleth', 'dw', 'sw', 'wd', 'w', 'wdw', 'auza@gmail.com', '2025-06-02', '10:00:00', 'Veneers', 'cancelled', NULL, '2025-05-29 20:46:44'),
(20, NULL, 'Honeyleth', 'Sante', 'Monteadora', NULL, 'Female', '09999273884', 'monteadora@gmail.com', '2025-05-30', '10:00:00', 'Veneers', 'pending', NULL, '2025-05-29 21:14:53'),
(21, NULL, 'Angeline ', 'Opelinia', 'Auza', NULL, 'Female', '09676071606', 'angelineopeliniaauza@gmail.com', '2025-06-02', '12:00:00', 'Restoration', 'pending', NULL, '2025-05-29 21:15:57'),
(22, 15, 'Rachiel', NULL, 'Torrejos', NULL, 'Female', '09676071606', 'Torrejos@gmail.com', '2025-06-02', '13:00:00', 'Restoration', 'completed', NULL, '2025-05-29 21:16:44'),
(23, NULL, 'Cyra Chanille', NULL, 'Linga', NULL, 'Female', '09999273884', 'Linga@gmail.com', '2025-07-02', '13:00:00', 'Veneers', 'confirmed', NULL, '2025-05-29 21:17:31'),
(24, NULL, 'Gwendoline', NULL, 'Octavio', NULL, 'Female', '09676071606', 'Octavio@gmail.com', '2025-06-03', '12:00:00', 'Extraction', 'confirmed', NULL, '2025-05-29 21:18:33'),
(25, 10, 'nljn', 'n n', 'njbk', 'mn', 'nk', '988786', 'gnnn@gmai.com', '2025-05-31', '11:00:00', 'Whitening', 'completed', NULL, '2025-05-29 23:28:30'),
(27, 13, 'Dessa Mae Krism', NULL, 'Cardinez', NULL, 'Female', NULL, 'Cardinez@gmai.com', '2025-06-02', '11:00:00', 'Restoration', 'completed', NULL, '2025-05-29 23:54:35'),
(28, 14, 'John Carlo', NULL, 'Villarosa', NULL, 'Male', '09999273884', 'Villarosa@gmail.com', '2025-06-02', '12:00:00', 'Braces', 'completed', NULL, '2025-05-29 23:55:40'),
(29, NULL, 'Dimple', NULL, 'Baccaro', NULL, 'Female', '097474574', 'Bacarro@gmail.com', '2025-06-02', '12:00:00', 'Dentures', 'cancelled', NULL, '2025-05-29 23:56:33'),
(30, NULL, 'Richie', NULL, 'Dadubo', NULL, 'Male', '09676071606', 'Dadubo@gmail.com', '2025-06-02', '13:00:00', 'Whitening', 'confirmed', NULL, '2025-05-29 23:57:53'),
(31, 12, 'Kyle', NULL, 'Vestal', NULL, 'Male', NULL, 'Vestal@gmail.com', '2025-06-02', '15:00:00', 'Retainers', 'completed', NULL, '2025-05-30 00:00:32'),
(32, NULL, 'HGF', 'DSD', 'DSS', NULL, NULL, NULL, 'monteadora@gmail.com', '2025-06-10', '12:00:00', 'Jacket Crown/Fixed Bridge', 'confirmed', NULL, '2025-05-30 03:00:19');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('Medicine','Supply','Equipment') NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `name`, `category`, `stock`, `createdAt`) VALUES
(1, 'Toothpaste', 'Supply', 3, '2025-05-27 13:17:27'),
(2, 'Anesthetic', 'Medicine', 56, '2025-05-27 13:17:27'),
(3, 'Mouthwash', 'Supply', 35, '2025-05-27 13:17:27'),
(4, 'Latex Gloves', 'Supply', 100, '2025-05-27 13:17:27'),
(5, 'Dental Floss', 'Supply', 60, '2025-05-27 13:17:27'),
(6, 'ww', 'Medicine', 52, '2025-05-27 13:54:35'),
(7, 'Gloves ni pacquiao', 'Equipment', 27, '2025-05-27 14:18:44');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `middleName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) NOT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `contactNumber` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `firstName`, `middleName`, `lastName`, `suffix`, `gender`, `contactNumber`, `email`, `photo`, `createdAt`) VALUES
(9, 'Honeyleth', 'Sante', 'Monteadora', NULL, 'Female', '09999273884', 'monteadora@gmail.com', NULL, '2025-05-29 21:14:20'),
(10, 'nljn', 'n n', 'njbk', 'mn', 'nk', '988786', 'gnnn@gmai.com', NULL, '2025-05-29 23:29:38'),
(11, 'Dessa Mae Krism', NULL, 'Cardinez', NULL, 'Female', NULL, 'Dessa@gmail.com', '1748562099430-hhi.jfif', '2025-05-29 23:43:01'),
(12, 'Kyle', NULL, 'Vestal', NULL, 'Male', NULL, 'Vestal@gmail.com', NULL, '2025-05-30 00:01:03'),
(13, 'Dessa Mae Krism', NULL, 'Cardinez', NULL, 'Female', NULL, 'Cardinez@gmai.com', NULL, '2025-05-30 02:31:40'),
(14, 'John Carlo', NULL, 'Villarosa', NULL, 'Male', '09999273884', 'Villarosa@gmail.com', NULL, '2025-05-30 03:00:43'),
(15, 'Rachiel', NULL, 'Torrejos', NULL, 'Female', '09676071606', 'Torrejos@gmail.com', NULL, '2025-05-30 03:05:26');

-- --------------------------------------------------------

--
-- Table structure for table `patient_history`
--

CREATE TABLE `patient_history` (
  `id` int(11) NOT NULL,
  `patientId` int(11) NOT NULL,
  `appointmentId` int(11) DEFAULT NULL,
  `treatmentDate` date NOT NULL,
  `treatmentTime` time NOT NULL,
  `treatment` varchar(200) NOT NULL,
  `status` enum('completed','cancelled') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_history`
--

INSERT INTO `patient_history` (`id`, `patientId`, `appointmentId`, `treatmentDate`, `treatmentTime`, `treatment`, `status`, `createdAt`) VALUES
(10, 9, 18, '2025-06-02', '10:00:00', 'Veneers', 'completed', '2025-05-29 21:14:20'),
(11, 10, 25, '2025-05-31', '11:00:00', 'Whitening', 'completed', '2025-05-29 23:29:38'),
(12, 10, 25, '2025-05-31', '11:00:00', 'Whitening', 'completed', '2025-05-29 23:31:25'),
(13, 11, 26, '2025-06-02', '10:00:00', 'Braces', 'completed', '2025-05-29 23:43:01'),
(14, 12, 31, '2025-06-02', '15:00:00', 'Retainers', 'completed', '2025-05-30 00:01:03'),
(15, 13, 27, '2025-06-02', '11:00:00', 'Restoration', 'completed', '2025-05-30 02:31:40'),
(16, 14, 28, '2025-06-02', '12:00:00', 'Braces', 'completed', '2025-05-30 03:00:43'),
(17, 15, 22, '2025-06-02', '13:00:00', 'Restoration', 'completed', '2025-05-30 03:05:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patientId` (`patientId`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_history`
--
ALTER TABLE `patient_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patientId` (`patientId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `patient_history`
--
ALTER TABLE `patient_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `patient_history`
--
ALTER TABLE `patient_history`
  ADD CONSTRAINT `patient_history_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
