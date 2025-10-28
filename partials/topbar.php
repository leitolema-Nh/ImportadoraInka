<?php
/**
 * ==============================================================
 *  TOP BAR - Version Desktop
 * ==============================================================
 *  Solo HTML - Sin logica JavaScript
 *  Los eventos se manejan en header.module.js
 * ==============================================================
 */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
?>

<div class="top-bar">
  <div class="content-topbar flex-sb-m h-full container">
    
    <!-- Left side -->
    <div class="left-top-bar">
      Envios en pedidos mayores a RD$1,000
    </div>

    <!-- Right side -->
    <div class="right-top-bar flex-w h-full">
      <a href="<?= $base ?>pages/ayuda.php" class="flex-c-m trans-04 p-lr-25">
        Ayuda & Preguntas
      </a>

      <a href="<?= $base ?>pages/redirect.php" class="flex-c-m trans-04 p-lr-25">
        Mi Cuenta
      </a>
    </div>

  </div>
</div>