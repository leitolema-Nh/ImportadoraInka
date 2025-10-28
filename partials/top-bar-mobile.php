<?php
/**
 * ==============================================================
 *  TOP BAR MOBILE - Solo HTML
 * ==============================================================
 *  Solo estructura HTML
 *  Los eventos se manejan en header.module.js
 * ==============================================================
 */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
?>

<!-- Logo movil -->
<div class="logo-mobile">
  <a href="<?= $base ?>pages/index.php">
    <img src="<?= $base ?>images/logowebImka.png" alt="Importadora Inka" />
  </a>
</div>

<!-- Iconos derecha -->
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