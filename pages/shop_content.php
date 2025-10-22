<?php
// pages/shop_content.php
?>

<section class="bg0 p-t-23 p-b-140">
  <div class="container">

    <!-- 🔍 Buscador -->
    <div class="search-bar mb-4">
      <input 
        type="text" 
        id="search-input" 
        class="form-control" 
        placeholder="Buscar productos por nombre o código..." />
    </div>

    <!-- 📂 Categorías -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="ltext-103 cl5">CATEGORÍAS</h3>
      <button id="show-all-btn" class="btn btn-primary">Mostrar todos</button>
    </div>

    <div id="category-container" class="mb-4"></div>

    <!-- 🔽 Botón Filtrar por Subcategoría -->
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

<!-- 🪄 Modal Detalle de Producto -->
<div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="productModalLabel">Detalle del producto</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <img id="modal-image" src="" class="img-fluid mb-3" alt="Producto">
            <div id="modal-thumbnails" class="d-flex flex-wrap gap-2"></div>
          </div>
          <div class="col-md-6">
            <h4 id="modal-title"></h4>
            <p id="modal-description"></p>
            <ul class="list-unstyled">
              <li><strong>Código:</strong> <span id="modal-code"></span></li>
              <li><strong>Categoría:</strong> <span id="modal-category"></span></li>
              <li><strong>Cantidad:</strong> <span id="modal-quantity"></span></li>
              <li><strong>Unidad:</strong> <span id="modal-unit"></span></li>
            </ul>
            <h5>Precios:</h5>
            <ul class="list-unstyled">
              <li>General: <span id="modal-precio-general"></span></li>
              <li>Mayor: <span id="modal-precio-mayor"></span></li>
              <li>Docena: <span id="modal-precio-docena"></span></li>
            </ul>
            <button class="btn btn-outline-danger mt-3"><i class="zmdi zmdi-favorite-outline"></i> Añadir a favoritos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
