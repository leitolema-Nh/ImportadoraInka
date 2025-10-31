<?php
/**
 * layout_template.php - Estructura HTML Completa
 * ✅ MODIFICADO: Barra negra móvil siempre visible
 */

global $config;
$env = $config['env'];
$paths = $config['paths'];
$base = $paths['baseURL'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <meta name="description" content="<?= htmlspecialchars($pageDescription) ?>">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="<?= $base ?>images/icons/favicon.png" />

  <!-- SCRIPTS DE CONFIGURACIÓN (Pre-carga) -->
  <script src="<?= $base ?>js/config.js.php"></script>
  
  <!-- CORE SCRIPTS -->
  <script src="<?= $base ?>js/core/dom-manager.js"></script>
  <script src="<?= $base ?>js/core/event-manager.js"></script>
  <script src="<?= $base ?>js/core/loader.js"></script>
  
  <!-- HELPERS -->
  <script src="<?= $base ?>js/helpers.js"></script>

  <!-- CSS VENDOR -->
  <link rel="stylesheet" href="<?= $base ?>vendor/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/animate/animate.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/css-hamburgers/hamburgers.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/animsition/css/animsition.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/select2/select2.min.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/slick/slick.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/MagnificPopup/magnific-popup.css">
  <link rel="stylesheet" href="<?= $base ?>vendor/perfect-scrollbar/perfect-scrollbar.css">

  <!-- CSS SITE -->
  <link rel="stylesheet" href="<?= $base ?>fonts/font-awesome-4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="<?= $base ?>fonts/iconic/css/material-design-iconic-font.min.css">
  <link rel="stylesheet" href="<?= $base ?>css/util.css">
  <link rel="stylesheet" href="<?= $base ?>css/main.css">
  <link rel="stylesheet" href="<?= $base ?>css/header.css">
  <link rel="stylesheet" href="<?= $base ?>css/products.css">
  <link rel="stylesheet" href="<?= $base ?>css/search-overlay.css">
  <link rel="stylesheet" href="<?= $base ?>css/top-bar-mobile-styles.css">
  <link rel="stylesheet" href="<?= $base ?>css/categories-sticky-mobile.css">

  <?= $extraHead ?? '' ?>
</head>

<!-- ============================================================================
     ⚠️ CRÍTICO: NO poner <body> aquí
     El archivo de contenido (shop-content.php, home-content.php) 
     debe incluir su propio <body> con las clases correctas
     ============================================================================ -->

  <!-- HEADER -->
  <header class="header-v4">
    
    <!-- TOP BAR DESKTOP -->
    <div class="container-menu-desktop">
      <?php 
      $topbarPath = __DIR__ . '/../partials/topbar.php';
      if (file_exists($topbarPath)) {
          include $topbarPath;
      }
      ?>

      <!-- MENU PRINCIPAL DESKTOP (solo nav desktop) -->
      <div class="wrap-menu-desktop">
        <nav class="limiter-menu-desktop container">
          <!-- Logo -->
          <a href="<?= $base ?>pages/index.php" class="logo">
            <img src="<?= $base ?>images/logowebImka.png" alt="Importadora Inka" />
          </a>

          <!-- Menu Principal -->
          <div class="menu-desktop">
            <ul class="main-menu">
              <li class="<?= $activePage === 'home' ? 'active-menu' : '' ?>">
                <a href="<?= $base ?>pages/index.php">Inicio</a>
              </li>
              <li class="<?= $activePage === 'productos' ? 'active-menu' : '' ?>">
                <a href="<?= $base ?>pages/shop.php">Productos</a>
              </li>
              <li class="<?= $activePage === 'nosotros' ? 'active-menu' : '' ?>">
                <a href="<?= $base ?>pages/about.php">Nosotros</a>
              </li>
              <li class="<?= $activePage === 'contacto' ? 'active-menu' : '' ?>">
                <a href="<?= $base ?>pages/contacto.php">Contacto</a>
              </li>
            </ul>
          </div>

          <!-- Iconos del header -->
          <div class="wrap-icon-header flex-w flex-r-m">
            <div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-search" title="Buscar productos">
              <i class="zmdi zmdi-search"></i>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- ✅ NUEVO: BARRA NEGRA MÓVIL SIEMPRE VISIBLE -->
    <div class="top-bar-mobile-fixed">
      <div class="content-topbar-mobile">
        <div class="left-top-bar">
          Envios en pedidos mayores a RD$1,000
        </div>
      </div>
    </div>

    <!-- ✅ MENU MOBILE (fuera de container-menu-desktop) -->
    <div class="menu-mobile">
      <!-- ✅ MODIFICADO: Top bar movil - Solo botones (Ayuda y Mi Cuenta) -->
      <ul class="topbar-mobile">
        <li>
          <div class="right-top-bar flex-w h-full">
            <a href="<?= $base ?>pages/ayuda.php" class="flex-c-m p-lr-10 trans-04">
              Ayuda & Preguntas
            </a>
            <a href="<?= $base ?>pages/redirect.php" class="flex-c-m p-lr-10 trans-04">
              Mi Cuenta
            </a>
          </div>
        </li>
      </ul>

      <!-- Menu principal movil -->
      <ul class="main-menu-m">
        <li class="<?= $activePage === 'home' ? 'active-menu' : '' ?>">
          <a href="<?= $base ?>pages/index.php">Inicio</a>
        </li>
        <li class="<?= $activePage === 'productos' ? 'active-menu' : '' ?>">
          <a href="<?= $base ?>pages/shop.php">Productos</a>
        </li>
        <li class="<?= $activePage === 'nosotros' ? 'active-menu' : '' ?>">
          <a href="<?= $base ?>pages/about.php">Nosotros</a>
        </li>
        <li class="<?= $activePage === 'contacto' ? 'active-menu' : '' ?>">
          <a href="<?= $base ?>pages/contacto.php">Contacto</a>
        </li>
      </ul>
    </div>

    <!-- ✅ HEADER MOBILE (Hamburger + Logo) -->
    <div class="wrap-header-mobile flex-w flex-sb p-l-15 p-r-15">
      <!-- Logo -->
      <div class="logo-mobile">
        <a href="<?= $base ?>pages/index.php">
          <img src="<?= $base ?>images/logowebImka.png" alt="Importadora Inka" />
        </a>
      </div>

      <!-- Iconos derecha: lupa + hamburger -->
      <div class="header-mobile-right">
        <div class="search-mobile js-show-search" title="Buscar productos">
          <i class="zmdi zmdi-search fs-24"></i>
        </div>

        <div class="btn-show-menu-mobile hamburger hamburger--squeeze">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </div>
      </div>
    </div>

    <!-- ✅ OVERLAY DE BUSQUEDA GLOBAL -->
    <div id="global-search-overlay" class="search-overlay">
      <div class="search-overlay-content">
        <button id="closeGlobalSearch" class="close-search" title="Cerrar">
          <i class="zmdi zmdi-close"></i>
        </button>
        
        <div class="search-form">
          <input 
            id="globalSearchInput" 
            type="text" 
            placeholder="Buscar por codigo o nombre..." 
            autocomplete="off"
          />
          <button id="searchSubmitBtn" type="button">
            <i class="zmdi zmdi-search"></i>
          </button>
        </div>
        
        <div id="searchResultsDropdown" class="search-dropdown"></div>
      </div>
    </div>

  </header>

  <!-- CONTENIDO PRINCIPAL -->
  <main>
    <?= $content ?>
  </main>

  <!-- FOOTER -->
  <?php include __DIR__ . '/../partials/footer.php'; ?>

  <!-- MODAL DE PRODUCTO -->
  <?php 
  $modalPath = __DIR__ . '/../partials/shopModal.php';
  if (file_exists($modalPath)) {
      include $modalPath;
  }
  ?>

  <!-- JQUERY Y PLUGINS -->
  <script src="<?= $base ?>vendor/jquery/jquery-3.2.1.min.js"></script>
  <script src="<?= $base ?>vendor/animsition/js/animsition.min.js"></script>
  <script src="<?= $base ?>vendor/bootstrap/js/popper.js"></script>
  <script src="<?= $base ?>vendor/bootstrap/js/bootstrap.min.js"></script>
  <script src="<?= $base ?>vendor/select2/select2.min.js"></script>
  <script src="<?= $base ?>vendor/daterangepicker/moment.min.js"></script>
  <script src="<?= $base ?>vendor/daterangepicker/daterangepicker.js"></script>
  <script src="<?= $base ?>vendor/slick/slick.min.js"></script>
  <script src="<?= $base ?>js/slick-custom.js"></script>
  <script src="<?= $base ?>vendor/parallax100/parallax100.js"></script>
  <script src="<?= $base ?>vendor/MagnificPopup/jquery.magnific-popup.min.js"></script>
  <script src="<?= $base ?>vendor/isotope/isotope.pkgd.min.js"></script>
  <script src="<?= $base ?>vendor/sweetalert/sweetalert.min.js"></script>
  <script src="<?= $base ?>vendor/perfect-scrollbar/perfect-scrollbar.min.js"></script>

  <!-- MAIN.JS -->
  <script src="<?= $base ?>js/main.js"></script>

  <!-- MÓDULOS GLOBALES -->
  <script src="<?= $base ?>js/modules/header.module.js"></script>
  <script src="<?= $base ?>js/modules/footer.module.js"></script>

  <!-- INIT.JS (último) -->
  <script src="<?= $base ?>js/init.js"></script>

  <?= $extraScripts ?? '' ?>

<!-- ⚠️ Tampoco cerrar </body> aquí, lo cierra shop-content.php -->
</html>