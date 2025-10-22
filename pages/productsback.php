<?php
// 📄 pages/productos.php
$title = "Catálogo de Productos - Cozastore";

// 📦 Contenido dinámico de esta página
ob_start();
?>

<section class="bg0 p-t-23 p-b-140">
  <div class="container">
    
    <!-- 🔍 Buscador -->
    <div class="search-bar mb-4">
      <input type="text" id="search-input" class="form-control" placeholder="Buscar productos por nombre o código..." />
    </div>

    <!-- 📂 Encabezado Categorías y botón Mostrar todos -->
    <div class="p-b-10 d-flex justify-content-between align-items-center">
      <h3 class="ltext-103 cl5">Categorías</h3>
      <button id="show-all-btn" class="btn btn-primary">Mostrar todos</button>
    </div>

    <!-- 📂 Categorías -->
    <div id="category-container" class="mb-4"></div>

    <!-- 🔽 Botón Filtrar por subcategoría -->
    <div class="text-right mb-3">
      <button id="filter-toggle-btn" class="btn btn-outline-secondary" style="display:none;">
        <i class="zmdi zmdi-filter-list"></i> Filtrar por subcategoría
      </button>
    </div>

    <!-- 🧩 Panel Subcategorías -->
    <div id="filter-panel" class="mb-4"></div>

    <!-- 🛍️ Productos -->
    <div class="row" id="product-grid"></div>

    <!-- 📄 Paginación / Cargar más -->
    <div class="flex-c-m flex-w w-full p-t-45 text-center">
      <button id="load-more" class="btn btn-outline-primary">Cargar más</button>
    </div>
  </div>
</section>

<?php
$content = ob_get_clean();

// ✅ Agregar CSS y JS específicos de esta página
$extraCSS = '
  <link rel="stylesheet" href="/css/products.css">
  <link rel="stylesheet" href="/css/search.css">
';
$extraJS = '
  <script src="/js/config.js"></script>
  <script src="/js/products.js"></script>
  <script src="/js/categories.js"></script>
  <script src="/js/subcategories.js"></script>
  <script src="/js/productsByCategories.js"></script>
  <script src="/js/search.js"></script>
';

// ✅ Renderizar layout global
include __DIR__ . '/../layouts/layout.php';
?>
