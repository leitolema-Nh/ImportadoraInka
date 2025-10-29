<?php
/**
 * ============================================================================
 * shop-content.php - Contenido del Catálogo OPTIMIZADO
 * ============================================================================
 * ✅ Diseño RECTANGULAR (sin border-radius)
 * ✅ Botón "Filtrar" funcional (toggle sidebar)
 * ✅ Responsive: Sidebar oculta en móvil
 * ============================================================================
 */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
?>

<body class="animsition shop-page">

<!-- BREADCRUMB -->
<div class="container">
    <div class="bread-crumb flex-w p-t-30 p-lr-0-lg">
        <a href="<?= $base ?>pages/index.php" class="stext-109 cl8 hov-cl1 trans-04">
            Inicio
            <i class="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
        </a>
        <span class="stext-109 cl4">
            Catálogo
        </span>
    </div>
</div>

<!-- ============================================================================
     BARRA SUPERIOR: CATEGORÍAS + BOTÓN COMPARTIR
     ============================================================================ -->
<div class="bg0 p-t-23 p-b-15">
    <div class="container">
        <div class="row align-items-center">
            
            <!-- CATEGORÍAS CON SCROLL HORIZONTAL -->
            <div class="col-lg-10 col-md-9 col-sm-12">
                <div class="categories-section mb-3">
                    <!-- Título + Subtítulo -->
                    <div class="section-header mb-2">
                        <h5 class="section-title d-inline-block mb-0">Categorías</h5>
                        <span class="section-subtitle text-muted ms-2">— Explora todos nuestros productos y más...!!</span>
                    </div>
                    
                    <!-- Slider de categorías -->
                    <div class="categories-wrapper">
                        <button class="cat-scroll-btn left" onclick="scrollCategories(-1)" aria-label="Scroll izquierda">
                            <i class="zmdi zmdi-chevron-left"></i>
                        </button>
                        
                        <div id="categories-container" class="categories-bar">
                            <div class="text-center py-2">
                                <i class="zmdi zmdi-spinner zmdi-hc-spin"></i>
                                <span class="text-muted small ms-2">Cargando categorías...</span>
                            </div>
                        </div>
                        
                        <button class="cat-scroll-btn right" onclick="scrollCategories(1)" aria-label="Scroll derecha">
                            <i class="zmdi zmdi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- BOTÓN COMPARTIR -->
            <div class="col-lg-2 col-md-3 col-sm-12 text-end">
                <button id="share-btn" class="btn-compartir">
                    <i class="zmdi zmdi-share me-1"></i>
                    Compartir
                </button>
            </div>

        </div>
    </div>
</div>

<!-- ============================================================================
     BOTÓN FILTRAR (Toggle para mostrar/ocultar sidebar)
     ============================================================================ -->
<div class="bg0 p-b-15">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <button id="toggle-filters-btn" class="btn-filtrar">
                    <i class="zmdi zmdi-filter-list me-2"></i>
                    <span class="filter-text">Filtrar</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================================================
     SECCIÓN PRINCIPAL: FILTROS (Izquierda) + PRODUCTOS (Derecha)
     ============================================================================ -->
<section class="bg0 p-t-23 p-b-140">
    <div class="container">
        <div class="row">
            
            <!-- ========================================
                 COLUMNA IZQUIERDA: PANEL DE FILTROS
                 ✅ OCULTA por defecto (clase "d-none")
                 ✅ Se muestra al hacer click en "Filtrar"
                 ======================================== -->
            <div id="filters-column" class="col-lg-3 col-md-4 col-sm-12 p-b-50 d-none">
                
                <div class="panel-filtros sticky-sidebar">
                    
                    <!-- Encabezado del panel -->
                    <div class="filter-header d-flex justify-content-between align-items-center mb-4">
                        <h5 class="filter-title mb-0">Filtros</h5>
                        <button id="close-filters-btn" class="btn-close-filters d-lg-none" aria-label="Cerrar filtros">
                            <i class="zmdi zmdi-close"></i>
                        </button>
                    </div>

                    <!-- SUBCATEGORÍAS -->
                    <div class="filter-section mb-4">
                        <h6 class="filter-subtitle mb-3">Subcategorías</h6>
                        
                        <div class="subcategories-wrapper position-relative">
                            <button class="scroll-btn scroll-sub-prev" onclick="scrollSubcategories(-1)" aria-label="Scroll izquierda">
                                <i class="zmdi zmdi-chevron-left"></i>
                            </button>
                            
                            <div id="subcategories-container" class="subcategories-list">
                                <p class="text-muted small text-center py-3 mb-0">
                                    Selecciona una categoría
                                </p>
                            </div>
                            
                            <button class="scroll-btn scroll-sub-next" onclick="scrollSubcategories(1)" aria-label="Scroll derecha">
                                <i class="zmdi zmdi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- BÚSQUEDA EN CATÁLOGO -->
                    <div class="filter-section">
                        <h6 class="filter-subtitle mb-3">Buscar en catálogo</h6>
                        <div class="search-box position-relative">
                            <input 
                                type="text" 
                                id="search-input" 
                                class="form-control search-input" 
                                placeholder="Buscar por código o nombre..."
                                aria-label="Buscar productos"
                            >
                            <i class="zmdi zmdi-search search-icon"></i>
                        </div>
                    </div>

                </div>

            </div>

            <!-- ========================================
                 COLUMNA DERECHA: GRID DE PRODUCTOS
                 ✅ DINÁMICO: 
                    - col-lg-12 cuando filtros ocultos
                    - col-lg-9 cuando filtros visibles
                 ======================================== -->
            <div id="products-column" class="col-lg-12 col-md-12 col-sm-12">
                
                <!-- CONTENEDOR DE PRODUCTOS -->
                <div id="products-container" class="row isotope-grid">
                    <div class="col-12 text-center py-5">
                        <i class="zmdi zmdi-spinner zmdi-hc-spin zmdi-hc-4x text-primary mb-3"></i>
                        <h5 class="text-muted">Cargando productos...</h5>
                        <p class="text-muted small">Por favor espera un momento</p>
                    </div>
                </div>

                <!-- BOTÓN CARGAR MÁS -->
                <div class="flex-c-m flex-w w-full p-t-45">
                    <button 
                        id="load-more" 
                        class="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
                        style="display: none;">
                        Cargar más productos
                    </button>
                </div>

            </div>

        </div>
    </div>
</section>

</body>

<!-- ============================================================================
     ESTILOS CSS - DISEÑO RECTANGULAR
     ============================================================================ -->
<style>
/* ========================================
   BOTÓN FILTRAR (Rectangular)
   ======================================== */
.btn-filtrar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: 1px solid #e5e5e5;
    background: white;
    color: #333;
    border-radius: 0;  /* Sin redondeo */
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-filtrar:hover {
    background: #f5f5f5;
    border-color: #333;
}

.btn-filtrar.active {
    background: #333;
    color: white;
    border-color: #333;
}

/* ========================================
   BOTÓN COMPARTIR (Rectangular)
   ======================================== */
.btn-compartir {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: 1px solid #e5e5e5;
    background: white;
    color: #333;
    border-radius: 0;  /* Sin redondeo */
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-compartir:hover {
    background: #f5f5f5;
    border-color: #333;
}

/* ========================================
   CATEGORÍAS (Rectangular)
   ======================================== */
.categories-section {
    position: relative;
}

.section-header {
    margin-bottom: 12px;
}

.section-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

.section-subtitle {
    font-size: 14px;
    color: #888;
    font-style: italic;
}

.categories-wrapper {
    position: relative;
    overflow: hidden;
}

.categories-bar {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 10px 0;
}

.categories-bar::-webkit-scrollbar {
    display: none;
}

.category-btn {
    flex-shrink: 0;
    padding: 12px 24px;
    border: 1px solid #e5e5e5;
    background: white;
    border-radius: 0;  /* Sin redondeo */
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    color: #333;
}

.category-btn:hover {
    background: #f5f5f5;
    border-color: #333;
}

.category-btn.active {
    background: #333;
    color: white;
    border-color: #333;
}

.cat-scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border: 1px solid #e5e5e5;
    background: white;
    border-radius: 0;  /* Sin redondeo */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.cat-scroll-btn:hover {
    background: #333;
    color: white;
    border-color: #333;
}

.cat-scroll-btn.left {
    left: 0;
}

.cat-scroll-btn.right {
    right: 0;
}

/* ========================================
   PANEL DE FILTROS
   ======================================== */
.panel-filtros {
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 0;  /* Sin redondeo */
    padding: 20px;
}

.filter-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.filter-subtitle {
    font-size: 14px;
    font-weight: 600;
    color: #555;
}

.filter-section {
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
}

.filter-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.btn-close-filters {
    background: none;
    border: none;
    font-size: 20px;
    color: #333;
    cursor: pointer;
    padding: 5px;
    line-height: 1;
}

.btn-close-filters:hover {
    color: #e74c3c;
}

/* ========================================
   SUBCATEGORÍAS (Rectangular)
   ======================================== */
.subcategories-wrapper {
    position: relative;
}

.subcategories-list {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 10px 0;
    flex-wrap: wrap;
}

.subcategories-list::-webkit-scrollbar {
    display: none;
}

.subcategory-tag {
    flex-shrink: 0;
    padding: 8px 16px;
    border: 1px solid #e5e5e5;
    background: white;
    border-radius: 0;  /* Sin redondeo */
    cursor: pointer;
    transition: all 0.3s;
    font-size: 13px;
    white-space: nowrap;
    color: #333;
}

.subcategory-tag:hover {
    background: #f5f5f5;
    border-color: #333;
}

.subcategory-tag.active {
    background: #333;
    color: white;
    border-color: #333;
}

.scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    border: 1px solid #e5e5e5;
    background: white;
    border-radius: 0;  /* Sin redondeo */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.scroll-btn:hover {
    background: #333;
    color: white;
    border-color: #333;
}

.scroll-sub-prev {
    left: -5px;
}

.scroll-sub-next {
    right: -5px;
}

/* ========================================
   BÚSQUEDA
   ======================================== */
.search-box {
    position: relative;
}

.search-input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid #e5e5e5;
    border-radius: 0;  /* Sin redondeo */
    font-size: 14px;
    transition: all 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: #333;
}

.search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 18px;
    pointer-events: none;
}

/* ========================================
   SIDEBAR STICKY (Desktop)
   ======================================== */
@media (min-width: 992px) {
    .sticky-sidebar {
        position: sticky;
        top: 20px;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
    }
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 991px) {
    #filters-column {
        position: fixed;
        top: 0;
        left: -100%;
        width: 300px;
        max-width: 90vw;
        height: 100%;
        background: white;
        z-index: 9999;
        overflow-y: auto;
        box-shadow: 2px 0 10px rgba(0,0,0,0.2);
        transition: left 0.3s ease;
    }

    #filters-column.show {
        left: 0;
    }

    .panel-filtros {
        height: 100%;
        border: none;
        border-radius: 0;
    }

    .btn-close-filters {
        display: block !important;
    }

    .filters-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
    }

    .filters-overlay.show {
        display: block;
    }
}

@media (max-width: 576px) {
    .btn-filtrar,
    .btn-compartir {
        font-size: 13px;
        padding: 10px 20px;
    }

    .category-btn,
    .subcategory-tag {
        font-size: 12px;
        padding: 8px 14px;
    }

    .section-title {
        font-size: 20px;
    }

    .section-subtitle {
        display: block;
        margin-top: 4px;
    }
}

/* ========================================
   GRID DE PRODUCTOS
   ======================================== */
#products-container {
    min-height: 300px;
}

.isotope-grid {
    display: flex;
    flex-wrap: wrap;
}

/* ========================================
   BOTÓN CARGAR MÁS
   ======================================== */
#load-more {
    border-radius: 0;  /* Sin redondeo */
}

#load-more:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>