<?php
/**
 * shop-content.php - Contenido del Catálogo
 */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
?>

<!-- ============================================================================
     🏷️ CRÍTICO: Esta clase permite a init.js detectar la página
     ============================================================================ -->
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

<!-- SECCIÓN PRINCIPAL DEL CATÁLOGO -->
<section class="bg0 p-t-23 p-b-140">
    <div class="container">
        <div class="row">
            
            <!-- PANEL DE FILTROS (Izquierda) -->
            <div class="col-lg-3 col-md-4 col-sm-12 p-b-50">
                
                <!-- Botón para mostrar filtros en móvil -->
                <div class="flex-w flex-l-m filter p-b-25 d-lg-none">
                    <button class="js-show-filter btn btn-outline-dark w-100">
                        <i class="zmdi zmdi-filter-list mr-2"></i>
                        Filtros
                    </button>
                </div>

                <!-- Panel de filtros -->
                <div class="panel-filter p-t-10">
                    
                    <!-- CATEGORÍAS -->
                    <div class="filter-section">
                        <div class="flex-w flex-sb-m p-b-10">
                            <h5 class="mtext-106 cl2 m-b-0">
                                Categorías
                            </h5>
                        </div>

                        <!-- Contenedor de categorías -->
                        <div class="categories-wrapper">
                            <button class="scroll-btn scroll-cat-prev" 
                                    data-direction="-1"
                                    data-target="categories"
                                    aria-label="Scroll categorías izquierda">
                                <i class="zmdi zmdi-chevron-left"></i>
                            </button>
                            
                            <div id="categories-container" class="categories-bar">
                                <div class="text-center py-3">
                                    <i class="zmdi zmdi-spinner zmdi-hc-spin"></i>
                                    <p class="text-muted small mt-2">Cargando categorías...</p>
                                </div>
                            </div>
                            
                            <button class="scroll-btn scroll-cat-next" 
                                    data-direction="1"
                                    data-target="categories"
                                    aria-label="Scroll categorías derecha">
                                <i class="zmdi zmdi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- SUBCATEGORÍAS -->
                    <div class="filter-section mt-4">
                        <div class="flex-w flex-sb-m p-b-10">
                            <h5 class="mtext-106 cl2 m-b-0">
                                Subcategorías
                            </h5>
                        </div>

                        <!-- Contenedor de subcategorías -->
                        <div class="subcategories-wrapper">
                            <button class="scroll-btn scroll-sub-prev" 
                                    data-direction="-1"
                                    data-target="subcategories"
                                    aria-label="Scroll subcategorías izquierda">
                                <i class="zmdi zmdi-chevron-left"></i>
                            </button>
                            
                            <div id="subcategories-container" class="subcategories-bar">
                                <p class="text-muted small text-center py-3">
                                    Selecciona una categoría
                                </p>
                            </div>
                            
                            <button class="scroll-btn scroll-sub-next" 
                                    data-direction="1"
                                    data-target="subcategories"
                                    aria-label="Scroll subcategorías derecha">
                                <i class="zmdi zmdi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- BÚSQUEDA INTERNA -->
                    <div class="filter-section mt-4">
                        <div class="flex-w flex-sb-m p-b-10">
                            <h5 class="mtext-106 cl2 m-b-0">
                                Buscar en catálogo
                            </h5>
                        </div>
                        
                        <div class="search-product">
                            <input 
                                type="text" 
                                id="search-input" 
                                class="form-control" 
                                placeholder="Buscar por código o nombre..."
                                aria-label="Buscar productos"
                            >
                        </div>
                    </div>

                </div>

            </div>

            <!-- GRID DE PRODUCTOS (Derecha) -->
            <div class="col-lg-9 col-md-8 col-sm-12">
                
                <!-- Barra de herramientas superior -->
                <div class="flex-w flex-sb-m p-b-52">
                    <div class="flex-w flex-l-m filter m-r-auto">
                        <span class="stext-106 cl6">
                            Productos
                        </span>
                    </div>

                    <div class="flex-w flex-r-m">
                        <button 
                            id="share-btn" 
                            class="btn btn-outline-dark btn-sm"
                            title="Compartir catálogo">
                            <i class="zmdi zmdi-share mr-1"></i>
                            Compartir
                        </button>
                    </div>
                </div>

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

<!-- ESTILOS -->
<style>
/* Categorías */
.categories-wrapper {
    position: relative;
    overflow: hidden;
}

.categories-bar {
    display: flex;
    gap: 10px;
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
    padding: 10px 20px;
    border: 2px solid #e5e5e5;
    background: white;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
}

.category-btn:hover {
    border-color: #333;
    background: #f8f8f8;
}

.category-btn.active {
    background: #333;
    color: white;
    border-color: #333;
}

/* Subcategorías */
.subcategories-wrapper {
    position: relative;
    overflow: hidden;
}

.subcategories-bar {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding: 10px 0;
    flex-wrap: wrap;
}

.subcategories-bar::-webkit-scrollbar {
    display: none;
}

.subcategory-tag {
    flex-shrink: 0;
    padding: 6px 16px;
    border: 1px solid #e5e5e5;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 13px;
    white-space: nowrap;
}

.subcategory-tag:hover {
    border-color: #333;
    background: #f8f8f8;
}

.subcategory-tag.active {
    background: #333;
    color: white;
    border-color: #333;
}

/* Botones de scroll */
.scroll-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    border: 1px solid #e5e5e5;
    background: white;
    border-radius: 50%;
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

.scroll-cat-prev,
.scroll-sub-prev {
    left: -5px;
}

.scroll-cat-next,
.scroll-sub-next {
    right: -5px;
}

/* Grid de productos */
#products-container {
    min-height: 300px;
}

.isotope-grid {
    display: flex;
    flex-wrap: wrap;
}

.isotope-item {
    margin-bottom: 30px;
}

/* Panel de filtros */
.panel-filter {
    transition: all 0.4s;
}

@media (max-width: 991px) {
    .panel-filter {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 100%;
        background: white;
        z-index: 9999;
        overflow-y: auto;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        padding: 20px;
    }

    .panel-filter.show {
        display: block;
        animation: slideInLeft 0.3s;
    }

    @keyframes slideInLeft {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
}

/* Búsqueda interna */
.search-product input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #e5e5e5;
    border-radius: 25px;
    font-size: 14px;
    transition: all 0.3s;
}

.search-product input:focus {
    outline: none;
    border-color: #333;
}

/* Botón cargar más */
#load-more {
    min-width: 200px;
}

#load-more:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Secciones */
.filter-section {
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
}

.filter-section:last-child {
    border-bottom: none;
}

/* Responsive */
@media (max-width: 576px) {
    .category-btn,
    .subcategory-tag {
        font-size: 12px;
        padding: 8px 16px;
    }

    .scroll-btn {
        width: 25px;
        height: 25px;
        font-size: 12px;
    }
}
</style>