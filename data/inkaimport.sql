-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 18-09-2025 a las 20:12:52
-- Versión del servidor: 8.0.31
-- Versión de PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inkaimport`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category_products`
--

DROP TABLE IF EXISTS `category_products`;
CREATE TABLE IF NOT EXISTS `category_products` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name_category` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `containerarrive`
--

DROP TABLE IF EXISTS `containerarrive`;
CREATE TABLE IF NOT EXISTS `containerarrive` (
  `id` int NOT NULL AUTO_INCREMENT,
  `containername` varchar(120) NOT NULL,
  `containerdate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `imagen` varchar(600) DEFAULT NULL,
  `tipoProducto` varchar(200) DEFAULT NULL,
  `descripcion` varchar(400) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `tipoUnidad` varchar(50) DEFAULT NULL,
  `Pv1` decimal(32,0) DEFAULT NULL,
  `Pv2` decimal(32,0) DEFAULT NULL,
  `Pv3` decimal(32,0) DEFAULT NULL,
  `codigosistema` varchar(50) DEFAULT NULL,
  `NroDeCajas` int DEFAULT NULL,
  `containerid` int NOT NULL,
  `prodConfirm` tinyint DEFAULT NULL,
  `imagenant` varchar(600) DEFAULT NULL,
  `Pcompra` decimal(32,0) DEFAULT NULL,
  `fact_id` int DEFAULT NULL,
  `precioConfirm` tinyint NOT NULL DEFAULT '0',
  `regisinsistem` tinyint NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '0',
  `subcategory_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products_locations`
--

DROP TABLE IF EXISTS `products_locations`;
CREATE TABLE IF NOT EXISTS `products_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_location` int DEFAULT NULL,
  `id_product` int DEFAULT NULL,
  `tipo_registro` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '0',
  `cantidad` int DEFAULT NULL,
  `tipoUnidad` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NroDeCajas` int DEFAULT NULL,
  `fechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategory_products`
--

DROP TABLE IF EXISTS `subcategory_products`;
CREATE TABLE IF NOT EXISTS `subcategory_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_subcategory` varchar(200) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
