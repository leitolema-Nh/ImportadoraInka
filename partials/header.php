<?php
/**
 * ===============================================================
 * HEADER GLOBAL — Importadora INKA (PHP 7 + Bootstrap 4 compatible)
 * ===============================================================
 */

$scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
$segments   = explode('/', trim($scriptPath, '/'));
$rootFolder = $segments[0] ?? '';
$base = $rootFolder ? "/{$rootFolder}/" : '/';

// 🔧 Compatibilidad PHP 7 (sin str_contains)
if (strpos($_SERVER['REQUEST_URI'], '/pages/') !== false) {
    $base = str_replace('/pages', '', $base);
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Importadora Inka - Catálogo</title>

  <!-- META -->
  <meta name="description" content="Catálogo completo de Importadora Inka.">
  <meta property="og:title" content="Importadora Inka - Catálogo" />
  <meta property="og:image" content="<?= $base ?>images/catalogo-preview.jpg" />

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="<?= $base ?>images/icons/favicon.png" />

  <!-- CONFIG -->
  <script src="<?= $base ?>js/config.js.php"></script>
  <script src="<?= $base ?>js/helpers.js"></script>

  <!-- ================= CSS VENDOR (Bootstrap 4 + Plugins) ================= -->
  <link rel="stylesheet" href="<?= $base ?>vendor/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/animate/animate.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/css-hamburgers/hamburgers.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/animsition/css/animsition.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/select2/select2.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/slick/slick.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/MagnificPopup/magnific-popup.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/perfect-scrollbar/perfect-scrollbar.css">

  <!-- ================= CSS SITE ================= -->
  <link rel="stylesheet" href="<?= $base ?>fonts/font-awesome-4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="<?= $base ?>fonts/iconic/css/material-design-iconic-font.min.css">
  <link rel="stylesheet" href="<?= $base ?>css/util.css">
  <link rel="stylesheet" href="<?= $base ?>css/main.css">
  <link rel="stylesheet" href="<?= $base ?>css/header.css">
  <link rel="stylesheet" href="<?= $base ?>css/products.css">
  <link rel="stylesheet" href="<?= $base ?>css/search-overlay.css">

</head>

<body class="animsition">
<header class="header-v4">
  <div class="container-menu-desktop">
    <div class="wrap-menu-desktop">
      <nav class="limiter-menu-desktop container">
        <a href="<?= $base ?>pages/index.php" class="logo">
          <img src="<?= $base ?>images/logowebImka.png" alt="Importadora Inka" />
        </a>

        <div class="menu-desktop">
          <ul class="main-menu">
            <li><a href="<?= $base ?>pages/index.php">Inicio</a></li>
            <li><a href="<?= $base ?>pages/shop.php">Productos</a></li>
            <li><a href="<?= $base ?>pages/about.php">Nosotros</a></li>
            <li><a href="<?= $base ?>pages/contacto.php">Contacto</a></li>
          </ul>
        </div>

        <div class="wrap-icon-header flex-w flex-r-m">
          <div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-search" title="Buscar productos">
            <i class="zmdi zmdi-search"></i>
          </div>
        </div>
      </nav>
    </div>
  </div>

<!-- ===== HEADER MÓVIL (ajustado) ===== -->
<div class="wrap-header-mobile flex-w flex-sb p-l-15 p-r-15">

  <!-- Logo -->
  <div class="logo-mobile">
    <a href="<?= $base ?>pages/index.php">
      <img src="<?= $base ?>images/logowebImka.png" alt="Importadora Inka" />
    </a>
  </div>

  <!-- Grupo derecho: lupa + menú -->
  <div class="header-mobile-right">
    <div class="search-mobile js-show-search" title="Buscar productos">
      <i class="zmdi zmdi-search fs-24"></i>
    </div>

    <div class="btn-show-menu-mobile hamburger hamburger--squeeze">
      <span class="hamburger-box"><span class="hamburger-inner"></span></span>
    </div>
  </div>

</div>


  <div class="menu-mobile">
    <ul class="main-menu-m">
      <li><a href="<?= $base ?>pages/index.php">Inicio</a></li>
      <li><a href="<?= $base ?>pages/shop.php">Productos</a></li>
      <li><a href="<?= $base ?>pages/about.php">Nosotros</a></li>
      <li><a href="<?= $base ?>pages/contacto.php">Contacto</a></li>
    </ul>
  </div>
</header>

<!-- 🔍 OVERLAY DE BÚSQUEDA -->
<div id="global-search-overlay" class="search-overlay">
  <div class="search-overlay-content">
    <button id="closeGlobalSearch" class="close-search" title="Cerrar"><i class="zmdi zmdi-close"></i></button>
    <div class="search-form">
      <input id="globalSearchInput" type="text" placeholder="Buscar por código o nombre..." autocomplete="off"/>
      <button id="searchSubmitBtn" type="button"><i class="zmdi zmdi-search"></i></button>
    </div>
    <div id="searchResultsDropdown" class="search-dropdown"></div>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById("global-search-overlay");
  var openers = document.querySelectorAll(".js-show-search");
  var input = document.getElementById("globalSearchInput");
  var close = document.getElementById("closeGlobalSearch");

  if (!overlay || !input) return;

  openers.forEach(function(btn) {
    btn.addEventListener("click", function() {
      overlay.classList.add("active");
      input.focus();
    });
  });

  close.addEventListener("click", function() {
    overlay.classList.remove("active");
    input.value = "";
  });

  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) overlay.classList.remove("active");
  });

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      var val = input.value.trim();
      if (val) window.location.href = "<?= $base ?>pages/shop.php?multi=" + encodeURIComponent(val);
    }
  });
});
</script>
