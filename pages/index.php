<?php
/**
 * ===============================================================
 *  INDEX PRINCIPAL - IMPORTADORA INKA
 * ===============================================================
 *  ✅ CORREGIDO: Ahora define $activePage = 'home'
 *  
 *  Este archivo es el punto de entrada de la pagina de inicio.
 *  Solo define los datos de la pagina y delega todo al layout.
 * ===============================================================
 */

// Cargar el sistema de layout
require_once __DIR__ . "/../layout/layout.php";

// ✅ Definir página activa
$activePage = 'home';

// Definir datos de la pagina
$pageTitle = "Importadora Inka - Inicio";
$pageDescription = "Catalogo, promociones y novedades de Importadora Inka.";
$pageContent = __DIR__ . "/../partials/home-content.php";

// Llamar a la funcion de renderizado
renderLayout(
    $pageContent,           // Archivo de contenido
    $pageTitle,            // Titulo de la pagina
    $pageDescription,      // Descripcion meta
    $activePage            // ✅ Página activa
);