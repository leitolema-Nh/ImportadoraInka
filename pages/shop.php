<?php
// ============================================================
// 🛍️ shop.php — Catálogo principal de Importadora Inka
// ============================================================
// Estructura optimizada, sin dependencias duplicadas.
// El footer se encarga de cargar todos los JS dinámicamente.
// ============================================================
include_once __DIR__ . '/../partials/header.php';
?>

<!-- ====== CATEGORÍAS ====== -->
<div class="bg0 m-t-23 p-b-20">
  <div class="container">

    <!-- Barra categorías -->
    <div class="categories-wrapper position-relative m-b-20">
      <button class="cat-scroll-btn left" onclick="scrollCategories(-1)">
        <i class="zmdi zmdi-chevron-left"></i>
      </button>

      <div id="categories-container" class="categories-bar"></div>

      <button class="cat-scroll-btn right" onclick="scrollCategories(1)">
        <i class="zmdi zmdi-chevron-right"></i>
      </button>
    </div>

    <!-- Botones Filtrar + Compartir -->
    <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
      
      <!-- Filtrar -->
      <div class="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 js-show-filter me-2">
        <i class="zmdi zmdi-filter-list"></i> Filtrar
      </div>

      <!-- Compartir -->
      <div class="share-buttons d-flex gap-2">
        <button class="btn-share whatsapp" onclick="shareTo('whatsapp')">
          <i class="zmdi zmdi-whatsapp"></i>
        </button>
        <button class="btn-share facebook" onclick="shareTo('facebook')">
          <i class="zmdi zmdi-facebook"></i>
        </button>
        <button class="btn-share twitter" onclick="shareTo('twitter')">
          <i class="zmdi zmdi-twitter"></i>
        </button>
        <button class="btn-share instagram" onclick="shareTo('instagram')">
          <i class="zmdi zmdi-instagram"></i>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ====== SEARCH + FILTER PANEL ====== -->
<div class="bg0">
  <div class="container">

    <!-- Panel Filtros -->
    <div id="filterPanel" class="panel-filter w-full p-t-10 dis-none">
      <div class="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
        <div class="col-12">

          <!-- 🟩 Subcategorías: Slider tipo YouTube -->
          <div class="subcategories-wrapper position-relative m-b-20">
            <button class="subcat-scroll-btn left" onclick="scrollSubcategories(-1)">
              <i class="zmdi zmdi-chevron-left"></i>
            </button>

            <div id="subcategories-container" class="subcategories-bar"></div>

            <button class="subcat-scroll-btn right" onclick="scrollSubcategories(1)">
              <i class="zmdi zmdi-chevron-right"></i>
            </button>
          </div>

          <!-- Filtros activos -->
          <div id="active-filters" class="flex-w m-tb-10"></div>

          <!-- 🔍 Refinar búsqueda dentro de categoría -->
          <div class="refine-search mt-3">
            <label class="stext-106 cl6 d-block mb-2">Refinar dentro de esta categoría</label>
            <div class="bor8 dis-flex p-l-15">
              <button class="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
                <i class="zmdi zmdi-search"></i>
              </button>
              <input
                id="refineInput"
                class="mtext-107 cl2 size-114 plh2 p-r-15"
                type="text"
                placeholder="Buscar dentro de la categoría..."
              >
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- ====== GRID DE PRODUCTOS ====== -->
<section class="bg0 m-t-23 p-b-140 catalog-grid">
  <div class="container">
    <div id="products-container" class="row isotope-grid"></div>

    <!-- Load more -->
    <div class="flex-c-m flex-w w-full p-t-45">
      <button id="load-more" class="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04">
        Cargar más
      </button>
    </div>
  </div>
</section>

<!-- ====== MODAL PRODUCTO ====== -->
<?php include_once __DIR__ . '/../partials/shopModal.php'; ?>

<?php include_once __DIR__ . '/../partials/footer.php'; ?>

<!-- ====== LÓGICA INTERNA ====== -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Mostrar/ocultar panel de filtros
  const filterBtn = document.querySelector('.js-show-filter');
  const filterPanel = document.getElementById('filterPanel');
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', () => {
      filterPanel.classList.toggle('dis-none');
    });
  }

  // Refinar resultados dentro de una categoría activa
  const refineInput = document.getElementById('refineInput');
  if (refineInput) {
    refineInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('#products-container .block2').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }
});
</script>
