-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2022 at 10:38 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `comp2800`
--
CREATE DATABASE IF NOT EXISTS comp2800;

USE comp2800;

-- --------------------------------------------------------

--
-- Table structure for table `bby_16_coolzones`
--

CREATE TABLE bby_16_coolzones (
  eventid int(11) NOT NULL,
  hostid int(11) NOT NULL,
  czname varchar(30) NOT NULL,
  location varchar(100) NOT NULL,
  startdate datetime NOT NULL,
  enddate datetime NOT NULL,
  description varchar(200),
  latitude Decimal(8,6),
  longitude Decimal(9,6),
  aircon tinyint(4) DEFAULT 0,
  freedrinks tinyint(4) DEFAULT 0,
  waterpark tinyint(4) DEFAULT 0,
  pool tinyint(4) DEFAULT 0,
  outdoors tinyint(4) DEFAULT 0,
  indoors tinyint(4) DEFAULT 0,
  wifi tinyint(4) DEFAULT 0,
  open tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bby_16_coolzones`
--
-- --------------------------------------------------------

--
-- Table structure for table `bby_16_user`
--

CREATE TABLE bby_16_user (
  userID int(11) NOT NULL,
  fname varchar(30) NOT NULL,
  lname varchar(30) NOT NULL,
  email varchar(30) NOT NULL,
  displayName varchar(30) NOT NULL,
  password varchar(30) NOT NULL,
  admin tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bby_16_user`
--

INSERT INTO `bby_16_user` (`userID`, `fname`, `lname`, `email`, `displayName`, `password`, `admin`) VALUES
(1, 'dennis', 'kim', 'dennis@test.com', 'dennis123', 'password123', 0),
(2, 'buck', 'sin', 'buck@sin.com', 'bucksin', 'bucksin', 1),
(3, 'arron', 'ferguson', 'arron@test.com', 'arron123', 'passwordabc', 0),
(4, 'andy', 'tran', 'andy@test.com', 'andy111', 'password', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bby_16_coolzones`
--
ALTER TABLE `bby_16_coolzones`
  ADD PRIMARY KEY (`eventid`),
  ADD KEY `hostid` (`hostid`);

--
-- Indexes for table `bby_16_user`
--
ALTER TABLE `bby_16_user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `displayName` (`displayName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bby_16_coolzones`
--
ALTER TABLE `bby_16_coolzones`
  MODIFY `eventid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bby_16_user`
--
ALTER TABLE `bby_16_user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bby_16_coolzones`
--
ALTER TABLE `bby_16_coolzones`
  ADD CONSTRAINT `bby_16_coolzones_ibfk_1` FOREIGN KEY (`hostid`) REFERENCES `bby_16_user` (`userID`);

CREATE TABLE BBY_16_timeline (
postID int(11) NOT NULL AUTO_INCREMENT,
userID int(11) NOT NULL,
postTime datetime,
title varchar(50),
description varchar(1000),
coolzoneID int(11),
pictures json,
PRIMARY KEY (postID),
FOREIGN KEY (userID) REFERENCES BBY_16_user(userID),
FOREIGN KEY (coolzoneID) REFERENCES BBY_16_coolzones(eventid)
);


INSERT INTO BBY_16_coolzones (eventid, hostid, czname, location, startdate, enddate, description, latitude, longitude, aircon, freedrinks, waterpark, pool, outdoors, wifi)
VALUES (14, 2, "Starbucks", "2929 Barnet Hwy #2600, Coquitlam, BC V3B 5R5", "2022-05-18 9:00:00", "2022-05-18 18:00:00", "Coffee Shop", 49.27757, -122.803093, 1, 1, 0, 0, 0, 1);

INSERT INTO BBY_16_coolzones (eventid, hostid, czname, location, startdate, enddate, description, latitude, longitude, aircon, freedrinks, waterpark, pool, outdoors, wifi)
VALUES (3, 4, "Coquitlam Center", "2929 Barnet Hwy, Coquitlam, BC V3B 5R5", "2022-05-18 8:00:00", "2022-05-18 21:00:00", "Mall", 49.27757, -122.803093, 1, 0, 0, 0, 0, 1);

INSERT INTO BBY_16_timeline (postID, userID, postTime, title, description, coolzoneID, pictures)
VALUES (1, 2, '2022-05-18 10:03:21', "Starbucks on Barnet Now Open as a CoolZone", "Come by and
enjoy our free air con and a free water!", 14, "[\"/img/timelinePhotos/1653069936894-986015475.jpg\", \"/img/timelinePhotos/1653070497296-8549561664.jpg\"]");

INSERT INTO BBY_16_timeline (userID, postTime, title, description, coolzoneID, pictures) 
VALUES (3, '2022-05-18 14:51:12', "Misting station found at Lafarge Lake", "Hey everyone! I found
a new misting station that the city set up at park just across from the picnic tables!", NULL, "[]");

INSERT INTO BBY_16_timeline (userID, postTime, title, description, coolzoneID, pictures) 
VALUES (4, '2022-05-18 9:20:43', "Coquitlam Center Now Open as a CoolZone", "Come by and
enjoy our free air con!", 3, '[\"img/timelinePhotos/post3photo1.png\"]');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

