<?php
/**
 * ==============================================================
 *  SLIDER PRINCIPAL - Importadora Inka
 *  Ubicación: /partials/slider.php
 *  Tecnología: SwiperJS (sin jQuery)
 *  Diseño: Overlay oscuro, altura 85vh, transiciones fade
 * ==============================================================
 */
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
          'img' => '/inka/images/slider-accesories.png',
          'title' => 'Accesorios de tendencia Importados',
          'desc' => 'Descubre las últimas tendencias en accesorios de belleza.',
          'btn'  => 'Explorar Catálogo',
          'link' => 'shop.php'
        ],
        [
          'img' => '/inka/images/slider-accesoriesnav.png',
          'title' => 'Promociones por Docena',
          'desc' => 'Aprovecha precios especiales en tus productos Navideños al por mayor.',
          'btn'  => 'Ver Ofertas',
          'link' => 'shop.php'
        ],
        [
          'img' => '/inka/images/slider-accesoriescos.png',
          'title' => 'Nuevas Productos 2025',
          'desc' => 'Innovación y elegancia en cada detalle. Dale un toque único a tu estilo.',
          'btn'  => 'Ver Novedades',
          'link' => 'shop.php'
        ]
      ];

      foreach ($slides as $s) {
        echo "
        <div class='swiper-slide' style=\"background-image:url('{$s['img']}')\">
          <div class='overlay-content text-center'>
            <h2 class='text-white mb-3'>{$s['title']}</h2>
            <p class='text-light mb-4'>{$s['desc']}</p>
            <a href='{$s['link']}' class='btn btn-light btn-lg px-4'>{$s['btn']}</a>
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
/* ================= SLIDER ESTILOS (PANTALLA COMPLETA) ================= */
.hero-section {
  width: 100%;
  height: 100vh; /* altura completa */
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
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
}

.hero-section .overlay-content {
  background: rgba(0, 0, 0, 0.45);
  padding: 50px 70px;
  border-radius: 20px;
  max-width: 800px;
  text-align: center;
}

.hero-section h2 {
  font-weight: 700;
  font-size: 2.8rem;
}

.hero-section p {
  font-size: 1.2rem;
  color: #f1f1f1;
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
</style>
