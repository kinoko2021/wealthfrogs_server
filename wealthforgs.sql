CREATE DATABASE  IF NOT EXISTS `wealthfrogs` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `wealthfrogs`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: wealthfrogs
-- ------------------------------------------------------
-- Server version	5.7.37-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `choice`
--

DROP TABLE IF EXISTS `choice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `choice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `stock_id` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `choice`
--

LOCK TABLES `choice` WRITE;
/*!40000 ALTER TABLE `choice` DISABLE KEYS */;
INSERT INTO `choice` VALUES (2,123,'sh600887'),(7,123,'sh600030'),(9,123,'sh601088'),(11,123,'sh600257'),(14,123,'sz002412'),(15,123,'sh600488'),(23,123,'sh605117'),(28,123,'sh688020'),(29,123,'sh688358'),(31,123,'sh600367'),(35,123,'sh600096'),(36,123,'sh600898'),(37,123,'sh601388');
/*!40000 ALTER TABLE `choice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holding`
--

DROP TABLE IF EXISTS `holding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holding` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `stock_id` varchar(45) DEFAULT NULL,
  `payload` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='持仓';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holding`
--

LOCK TABLES `holding` WRITE;
/*!40000 ALTER TABLE `holding` DISABLE KEYS */;
INSERT INTO `holding` VALUES (8,123,'sh600030',400),(9,123,'sz002412',200),(10,123,'sh600257',200),(11,123,'sh600887',400),(12,123,'sh600488',100);
/*!40000 ALTER TABLE `holding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(45) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `stock_id` varchar(45) DEFAULT NULL,
  `direction` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `payload` int(11) DEFAULT NULL,
  `deal` int(11) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('0ec232t7',123,'sh600887',0,4,200,200,36.16,1658218765472),('0w5kptd1',123,'sh600257',0,2,100,0,5.66,1658474789926),('27pxobcq',123,'sh600887',0,2,0,0,36.24,1658471503461),('40bauf3g',123,'sh600257',0,4,200,200,5.29,1658218259018),('4f42k9lc',123,'sh600887',0,2,200,0,36.12,1658452456114),('5zxl3sys',123,'sh600030',1,4,300,300,19.98,1658454740398),('63min9ba',123,'sh600030',0,4,500,500,19.73,1658208476210),('6zmklqsh',123,'sh600030',0,4,200,200,20,1658216022686),('7xsv6v4k',123,'sh601088',0,2,200,0,30.09,1658218987399),('89rka79a',123,'sh600030',1,4,200,200,19.73,1658208618658),('939i2std',123,'sh600488',0,4,100,100,4.41,1658471642164),('ciqrikb1',123,'sh601088',0,2,100,0,28.34,1658473927307),('enzaw2zd',123,'sz002412',0,4,200,200,5.78,1658216743822),('gfbfertg',123,'sh600030',0,4,300,300,19.96,1658218588802),('h2wvd2rf',123,'sh600887',0,4,200,200,36.12,1658451365854),('o4zp1gl9',123,'sh600030',0,4,200,200,19.96,1658214801359),('okszs4qq',123,'sh600030',1,4,300,300,19.73,1658208631001),('v3clb5wi',123,'sh600887',0,2,100,0,36.28,1658472926483);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (123,'123456');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account`
--

DROP TABLE IF EXISTS `user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_account` (
  `id` int(11) NOT NULL,
  `fund` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户资金账户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account`
--

LOCK TABLES `user_account` WRITE;
/*!40000 ALTER TABLE `user_account` DISABLE KEYS */;
INSERT INTO `user_account` VALUES (123,974903);
/*!40000 ALTER TABLE `user_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'wealthfrogs'
--

--
-- Dumping routines for database 'wealthfrogs'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-22 17:10:52
