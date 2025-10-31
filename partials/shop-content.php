<?php
/**
 * ============================================================================
 * shop-content.php - ESTRUCTURA FINAL CORRECTA
 * ============================================================================
 * ✅ Categorías (75%) + Botones (25%) en la MISMA FILA
 * ✅ Botones apilados verticalmente dentro de la columna del 25%
 * ============================================================================ */

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
     SECCIÓN: CATEGORÍAS (75%) + BOTONES (25%) - MISMA FILA
     ============================================================================ -->
<div class="bg0 p-t-23 p-b-15">
    <div class="container">
        <div class="row align-items-center">
            
            <!-- ========================================
                 COLUMNA IZQUIERDA: CATEGORÍAS (75%)
                 ======================================== -->
            <div class="col-lg-9 col-md-8 col-sm-12">
                <div class="categories-section">
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

            <!-- ========================================
                 COLUMNA DERECHA: BOTONES (25%)
                 ✅ Botones apilados verticalmente
                 ======================================== -->
            <div class="col-lg-3 col-md-4 col-sm-12">
                <div class="d-flex flex-column gap-3 align-items-end">
                    
                    <!-- Botón Compartir -->
                    <button id="share-btn" class="btn-compartir">
                        <i class="zmdi zmdi-share me-1"></i>
                        Compartir
                    </button>
                    
                    <!-- Botón Mostrar Filtros -->
                    <button id="toggle-filters-btn" class="btn-filtrar">
                        <i class="zmdi zmdi-filter-list me-2"></i>
                        <span class="filter-text">MOSTRAR FILTROS</span>
                    </button>
                    
                </div>
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
                 ✅ Se muestra al hacer click en "MOSTRAR FILTROS"
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
     NOTAS IMPORTANTES:
     ============================================================================
     1. Categorías: col-lg-9 (75%)
     2. Botones: col-lg-3 (25%)
     3. Botones apilados con: d-flex flex-column gap-3
     4. align-items-end: alinea botones a la derecha
     ============================================================================ -->