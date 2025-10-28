<?php
/**
 * ==============================================================
 *  HEADER - Menu Principal
 * ==============================================================
 *  Solo HTML - Sin <!DOCTYPE>, sin <head>, sin scripts
 *  Los eventos se manejan en header.module.js
 * ==============================================================
 */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
$activePage = $activePage ?? 'home'; // Definir pagina activa
?>

<!-- MENU DESKTOP -->
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

<!-- MENU MOBILE -->
<div class="menu-mobile">
  <!-- Top bar movil -->
  <ul class="topbar-mobile">
    <li>
      <div class="left-top-bar">
        Envios en pedidos mayores a RD$1,000
      </div>
    </li>
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

<!-- HEADER MOBILE (Hamburger + Logo) -->
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

<!-- OVERLAY DE BUSQUEDA -->
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