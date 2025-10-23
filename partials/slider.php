<?php
/**
 * ==============================================================
 *  SLIDER PRINCIPAL - Importadora Inka
 *  Ubicación: /partials/slider.php
 *  Tecnología: SwiperJS (sin jQuery)
 *  Diseño: Overlay oscuro, altura 85vh, transiciones fade
 * ==============================================================
 */

// 🔧 Detectar base URL automáticamente (compatible con config.php)
$scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
$segments   = explode('/', trim($scriptPath, '/'));
$rootFolder = $segments[0] ?? '';
$base = $rootFolder ? "/{$rootFolder}/" : '/';

// Compatibilidad PHP 7 (sin str_contains)
if (strpos($_SERVER['REQUEST_URI'], '/pages/') !== false) {
    $base = str_replace('/pages', '', $base);
}
?>

<!-- ================= HERO SLIDER (SwiperJS) ================= -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

<section class="hero-section">
  <div class="swiper heroSwiper">
    <div class="swiper-wrapper">

      <?php
      // 🔹 Estructura de slides - configurable
      $slides = [
        [
          'img' => 'slider-accesories.png',
          'title' => 'Accesorios de tendencia Importados',
          'desc' => 'Descubre las últimas tendencias en accesorios de belleza.',
          'btn'  => 'Explorar Catálogo',
          'link' => 'shop.php?cat=6'
        ],
        [
          'img' => 'slider-accesoriesnav.png',
          'title' => 'Promociones por Docena',
          'desc' => 'Aprovecha precios especiales en tus productos Navideños al por mayor.',
          'btn'  => 'Ver Ofertas',
          'link' => 'shop.php?cat=10'
        ],
        [
          'img' => 'slider-accesoriescos.png',
          'title' => 'Nuevas Productos 2025',
          'desc' => 'Innovación y elegancia en cada detalle. Dale un toque único a tu estilo.',
          'btn'  => 'Ver Novedades',
          'link' => 'shop.php?cat=3'
        ]
      ];

      foreach ($slides as $s) {
        // Construir ruta completa de la imagen usando base URL
        $imgPath = $base . 'images/' . $s['img'];
        $linkPath = $base . 'pages/' . $s['link'];
        
        echo "
        <div class='swiper-slide' style=\"background-image:url('{$imgPath}')\">
          <div class='overlay-content text-center'>
            <h2 class='text-white mb-3'>{$s['title']}</h2>
            <p class='text-light mb-4'>{$s['desc']}</p>
            <a href='{$linkPath}' class='btn btn-light btn-lg px-4'>{$s['btn']}</a>
          </div>
        </div>";
      }
      ?>

    </div>

    <!-- Pagination + Navigation -->
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</section>

<!-- ================= Swiper JS ================= -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    new Swiper(".heroSwiper", {
      loop: true,
      effect: "fade",
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      speed: 900,
    });
  });
</script>

<style>
/* ================= SLIDER ESTILOS (85vh CON CONTENIDO CENTRADO) ================= */
.hero-section {
  width: 100%;
  height: 85vh; /* altura del slider */
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.hero-section .swiper-slide {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center; /* centra verticalmente */
  justify-content: center; /* centra horizontalmente */
  height: 85vh;
  position: relative;
}

.hero-section .overlay-content {
  background: rgba(0, 0, 0, 0.45);
  padding: 50px 70px;
  border-radius: 20px;
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-section h2 {
  font-weight: 700;
  font-size: 2.8rem;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  color: #f1f1f1;
  margin-bottom: 1.5rem;
}

.swiper-button-next,
.swiper-button-prev {
  color: #fff;
  transition: opacity 0.3s ease;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  opacity: 0.6;
}

.swiper-pagination-bullet {
  background: #fff;
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    height: 85vh;
  }
  
  .hero-section .swiper-slide {
    height: 85vh;
  }
  
  .hero-section .overlay-content {
    padding: 30px 40px;
  }
  
  .hero-section h2 {
    font-size: 2rem;
  }
  
  .hero-section p {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .hero-section {
    height: 85vh;
  }
  
  .hero-section .swiper-slide {
    height: 85vh;
  }
  
  .hero-section .overlay-content {
    padding: 25px 30px;
  }
  
  .hero-section h2 {
    font-size: 1.6rem;
  }
  
  .hero-section p {
    font-size: 0.95rem;
  }
}
</style>