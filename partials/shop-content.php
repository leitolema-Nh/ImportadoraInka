<?php
/**
 * ============================================================================
 * shop-content.php - Catálogo (rediseño móvil primero)
 * ============================================================================
 * Estructura:
 *   1. Pestañas de categorías (sticky) + botón "Todas" que abre la hoja
 *   2. Chips de subcategorías de la categoría activa
 *   3. Barra: conteo de resultados · compartir · ordenar · filtros
 *   4. Cuadrícula de productos (2 columnas en móvil)
 *   5. Hojas inferiores: categorías y filtros
 * Estilos: css/shop-v2.css · Lógica: js/modules/shop.module.js
 * ============================================================================ */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
?>

<body class="animsition shop-page">

<div class="shopx">

    <!-- Migas: solo escritorio -->
    <div class="container shopx-crumbs">
        <a href="<?= $base ?>pages/index.php">Inicio</a>
        <i class="fa fa-angle-right" aria-hidden="true"></i>
        <span>Catálogo</span>
    </div>

    <!-- 1. PESTAÑAS DE CATEGORÍAS -->
    <nav class="shopx-tabs" aria-label="Categorías">
        <div class="container shopx-tabs__inner">
            <button type="button" id="open-cats-btn" class="shopx-tabs__all" aria-haspopup="dialog" aria-controls="cats-sheet" aria-label="Ver todas las categorías">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect></svg>
            </button>
            <div id="categories-container" class="shopx-tabs__scroll">
                <span class="shopx-tabs__loading">Cargando categorías…</span>
            </div>
        </div>
    </nav>

    <!-- 2. SUBCATEGORÍAS DE LA CATEGORÍA ACTIVA -->
    <div class="container">
        <div id="subcategories-container" class="shopx-subs" aria-label="Subcategorías" hidden></div>
    </div>

    <!-- 3. BARRA DE RESULTADOS -->
    <div class="container shopx-toolbar">
        <span id="results-count" class="shopx-count" aria-live="polite"></span>
        <div class="shopx-toolbar__actions">
            <button type="button" id="share-btn" class="shopx-tool" aria-label="Compartir este catálogo">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"></circle><circle cx="18" cy="6" r="2.5"></circle><circle cx="18" cy="18" r="2.5"></circle><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8"></path></svg>
                <span class="shopx-tool__label shopx-tool__label--wide">Compartir</span>
            </button>
            <label class="shopx-tool shopx-sort">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M7 20l-3-3M17 20V4M17 4l3 3"></path></svg>
                <span class="sr-only">Ordenar por</span>
                <select id="sort-select">
                    <option value="recent">Recientes</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="name">Nombre A–Z</option>
                </select>
            </label>
            <button type="button" id="toggle-filters-btn" class="shopx-tool" aria-haspopup="dialog" aria-controls="filters-sheet">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M7 12h10M10 17h4"></path></svg>
                <span class="shopx-tool__label">Filtros</span>
                <span id="filters-badge" class="shopx-badge" hidden></span>
            </button>
        </div>
    </div>

    <!-- 4. PRODUCTOS -->
    <section class="container shopx-products">
        <div id="products-container" class="shopx-grid">
            <div class="col-12 text-center py-5">
                <i class="zmdi zmdi-spinner zmdi-hc-spin zmdi-hc-3x mb-3"></i>
                <p class="text-muted small">Cargando productos…</p>
            </div>
        </div>

        <div class="shopx-more">
            <button type="button" id="load-more" class="shopx-more__btn" style="display: none;">
                Cargar más productos
            </button>
        </div>
    </section>

</div>

<!-- 5. HOJAS INFERIORES -->
<div id="shopx-backdrop" class="shopx-backdrop" hidden></div>

<!-- Hoja: categorías y subcategorías -->
<section id="cats-sheet" class="shopx-sheet" role="dialog" aria-modal="true" aria-labelledby="cats-sheet-title" hidden>
    <div class="shopx-sheet__handle" aria-hidden="true"><span></span></div>
    <header class="shopx-sheet__head">
        <h2 id="cats-sheet-title">Categorías</h2>
        <button type="button" class="shopx-sheet__close" data-close-sheet aria-label="Cerrar">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
        </button>
    </header>
    <div id="cats-sheet-list" class="shopx-sheet__body shopx-catlist"></div>
</section>

<!-- Hoja: filtros y orden -->
<section id="filters-sheet" class="shopx-sheet" role="dialog" aria-modal="true" aria-labelledby="filters-sheet-title" hidden>
    <div class="shopx-sheet__handle" aria-hidden="true"><span></span></div>
    <header class="shopx-sheet__head">
        <h2 id="filters-sheet-title">Filtros</h2>
        <button type="button" id="close-filters-btn" class="shopx-sheet__close" data-close-sheet aria-label="Cerrar">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
        </button>
    </header>

    <div class="shopx-sheet__body shopx-filters">

        <div class="shopx-fgroup">
            <h3>Ordenar por</h3>
            <div id="filter-sort" class="shopx-chips"></div>
        </div>

        <div class="shopx-fgroup">
            <h3>Precio por unidad</h3>
            <div id="filter-price" class="shopx-chips shopx-chips--grid"></div>
        </div>

        <div id="filter-subs-group" class="shopx-fgroup" hidden>
            <h3>Subcategoría <span id="filter-subs-cat"></span></h3>
            <div id="filter-subs" class="shopx-chips"></div>
        </div>

        <div class="shopx-fgroup">
            <h3><label for="search-input">Buscar en esta vista</label></h3>
            <div class="shopx-search">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
                <input type="search" id="search-input" class="search-input" placeholder="Código o nombre" autocomplete="off">
            </div>
        </div>

        <label class="shopx-switch">
            <span>Solo productos con foto</span>
            <input type="checkbox" id="filter-photo">
        </label>

    </div>

    <footer class="shopx-sheet__foot">
        <button type="button" id="clear-filters-btn" class="shopx-btn shopx-btn--ghost">Limpiar</button>
        <button type="button" id="apply-filters-btn" class="shopx-btn shopx-btn--solid" data-close-sheet>Ver resultados</button>
    </footer>
</section>

</body>
