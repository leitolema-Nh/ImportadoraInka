// ============================================================================
// 🛍️ shop.module.js - Módulo del Catálogo (rediseño móvil primero)
// ============================================================================
// - Pestañas de categorías + hoja con todas las categorías y subcategorías
// - Chips de subcategorías de la categoría activa
// - Orden, rango de precio y "solo con foto" (hoja de filtros)
// - Conteo de resultados y estado completo en la URL (cat, subcat, sort,
//   precio, foto) para poder compartir la vista
//
// API pública que usan otros módulos (search.module.js):
//   state.currentCategory, state.selectedSubcategories, state.currentMode,
//   state.searchQuery, loadProducts(), loadProductsByCategory()
// ============================================================================

const SORTS = [
    { id: 'recent', label: 'Más recientes' },
    { id: 'price_asc', label: 'Menor precio' },
    { id: 'price_desc', label: 'Mayor precio' },
    { id: 'name', label: 'Nombre A–Z' }
];

// Los precios son enteros, así que los rangos no se solapan
const PRICE_RANGES = [
    { id: '0-100', label: 'Hasta RD$100', max: 100 },
    { id: '101-300', label: 'RD$100 – 300', min: 101, max: 300 },
    { id: '301-500', label: 'RD$300 – 500', min: 301, max: 500 },
    { id: '501-', label: 'Más de RD$500', min: 501 }
];

const TOPBAR_HEIGHT = 32; // barra negra móvil (--sx-topbar-h en shop-v2.css)

export class ShopModule {
    constructor() {
        this.DOM = window.DOMManager;
        this.Events = window.EventManager;

        this.state = {
            currentMode: 'all',               // all | category | search
            currentCategory: null,            // ID de categoría activa (string) o null
            selectedSubcategories: new Set(), // IDs (string) de subcategorías activas
            currentPage: 1,
            totalPages: 1,
            total: null,                      // total de resultados de la vista actual
            isLoading: false,
            searchQuery: '',
            sort: 'recent',
            price: null,                      // id de PRICE_RANGES o null
            onlyPhoto: false,
            openCat: null                     // categoría desplegada en la hoja
        };

        this.categories = [];   // categorías con productos, ordenadas por cantidad
        this.totalAll = 0;
        this.requestId = 0;     // para descartar respuestas viejas
        this.dom = {};

        this.config = {
            productsPerPage: 20,
            scrollAmount: 200
        };
    }

    // ============================================================================
    // 🚀 INICIALIZACIÓN
    // ============================================================================

    async init() {
        this.cacheElements();

        if (!this.dom.productsContainer) {
            console.error('❌ #products-container no encontrado');
            return;
        }

        this.exportGlobalFunctions();
        this.readUrlState();
        this.renderStaticFilters();
        this.bindEvents();
        this.setupHeaderScroll();

        // Con ?multi=… la búsqueda la pinta search.module.js
        const isUrlSearch = new URLSearchParams(window.location.search).has('multi');
        if (isUrlSearch) {
            this.state.currentMode = 'search';
            this.renderCount();
        } else {
            this.load();
        }

        await this.loadCategories();
        this.renderAll();
    }

    cacheElements() {
        const byId = (id) => document.getElementById(id);
        this.dom = {
            productsContainer: byId('products-container'),
            categoriesContainer: byId('categories-container'),
            subcategoriesContainer: byId('subcategories-container'),
            loadMoreBtn: byId('load-more'),
            searchInput: byId('search-input'),
            shareBtn: byId('share-btn'),
            resultsCount: byId('results-count'),
            sortSelect: byId('sort-select'),
            filtersBadge: byId('filters-badge'),
            backdrop: byId('shopx-backdrop'),
            catsSheet: byId('cats-sheet'),
            catsList: byId('cats-sheet-list'),
            filtersSheet: byId('filters-sheet'),
            filterSort: byId('filter-sort'),
            filterPrice: byId('filter-price'),
            filterSubs: byId('filter-subs'),
            filterSubsGroup: byId('filter-subs-group'),
            filterSubsCat: byId('filter-subs-cat'),
            filterPhoto: byId('filter-photo'),
            applyFiltersBtn: byId('apply-filters-btn')
        };
    }

    // ============================================================================
    // 🔗 ESTADO <-> URL
    // ============================================================================

    readUrlState() {
        const p = new URLSearchParams(window.location.search);
        const cat = p.get('cat');
        if (cat && /^\d+$/.test(cat)) {
            this.state.currentCategory = cat;
            this.state.currentMode = 'category';
            (p.get('subcat') || '').split('-').filter((id) => /^\d+$/.test(id))
                .forEach((id) => this.state.selectedSubcategories.add(id));
        }
        const sort = p.get('sort');
        if (SORTS.some((s) => s.id === sort)) this.state.sort = sort;
        const price = p.get('precio');
        if (PRICE_RANGES.some((r) => r.id === price)) this.state.price = price;
        this.state.onlyPhoto = p.get('foto') === '1';
        this.state.openCat = this.state.currentCategory;
    }

    writeUrlState() {
        const s = this.state;
        const subs = Array.from(s.selectedSubcategories);
        window.helpers.updateUrlParams({
            cat: s.currentCategory,
            subcat: subs.length ? subs.join('-') : null,
            sort: s.sort !== 'recent' ? s.sort : null,
            precio: s.price,
            foto: s.onlyPhoto ? '1' : null,
            q: null,
            multi: null,
            page: null
        });
    }

    // ============================================================================
    // 📂 CATEGORÍAS
    // ============================================================================

    async loadCategories() {
        const data = await window.helpers.fetchJSON('categories.php');

        if (!data || !Array.isArray(data.categorias)) {
            if (this.dom.categoriesContainer) {
                this.dom.categoriesContainer.innerHTML =
                    '<span class="shopx-tabs__loading">No se pudieron cargar las categorías</span>';
            }
            return;
        }

        this.totalAll = data.total_productos || 0;
        this.categories = data.categorias
            .map((c) => ({
                id: String(c.id),
                nombre: c.nombre,
                total: c.total || 0,
                subs: (c.subcategorias || [])
                    .filter((s) => s.total > 0)
                    .map((s) => ({ id: String(s.id), nombre: this.prettyName(s.name_subcategory), total: s.total }))
                    .sort((a, b) => b.total - a.total)
            }))
            .filter((c) => c.total > 0)   // las categorías vacías no se muestran
            .sort((a, b) => b.total - a.total);

        // Si la URL trae una categoría que ya no existe o está vacía, volver a "todos"
        if (this.state.currentCategory && !this.getCategory(this.state.currentCategory)) {
            this.state.currentCategory = null;
            this.state.currentMode = 'all';
            this.state.selectedSubcategories.clear();
            this.writeUrlState();
            this.load();
        }
    }

    getCategory(id) {
        return this.categories.find((c) => c.id === String(id)) || null;
    }

    // "PERFUMES SV" -> "Perfumes sv"; los nombres ya escritos con minúsculas se respetan
    prettyName(name) {
        const n = String(name || '').trim();
        if (n && n === n.toUpperCase()) {
            return n.charAt(0) + n.slice(1).toLowerCase();
        }
        return n;
    }

    // ============================================================================
    // 🎨 RENDER
    // ============================================================================

    renderAll() {
        this.renderTabs();
        this.renderSubcategories();
        this.renderCatsSheet();
        this.renderFilterState();
    }

    renderTabs() {
        const box = this.dom.categoriesContainer;
        if (!box) return;
        const esc = window.helpers.escapeHtml;
        const current = this.state.currentCategory;

        const tab = (id, name) => `
            <button type="button" class="shopx-tab category-tab${String(current || 'all') === id ? ' active' : ''}"
                    data-category-id="${id}">${esc(name)}</button>`;

        box.innerHTML = tab('all', 'Todos') + this.categories.map((c) => tab(c.id, c.nombre)).join('');

        const active = box.querySelector('.shopx-tab.active');
        if (active) {
            box.scrollLeft = Math.max(0, active.offsetLeft - (box.clientWidth - active.offsetWidth) / 2);
        }
    }

    subChipsHtml(cat) {
        const esc = window.helpers.escapeHtml;
        const selected = this.state.selectedSubcategories;
        return cat.subs.map((s) => `
            <button type="button" class="shopx-chip${selected.has(s.id) ? ' active' : ''}"
                    data-sub-id="${s.id}" aria-pressed="${selected.has(s.id)}">
                <span>${esc(s.nombre)} <small>${s.total}</small></span>
            </button>`).join('');
    }

    renderSubcategories() {
        const box = this.dom.subcategoriesContainer;
        const cat = this.getCategory(this.state.currentCategory);
        const hasSubs = !!cat && cat.subs.length > 1;

        if (box) {
            box.hidden = !hasSubs;
            box.innerHTML = hasSubs
                ? `<button type="button" class="shopx-chip${this.state.selectedSubcategories.size === 0 ? ' active' : ''}"
                           data-sub-id="all"><span>Todo</span></button>` + this.subChipsHtml(cat)
                : '';
        }

        // Las mismas subcategorías dentro de la hoja de filtros
        if (this.dom.filterSubsGroup) {
            this.dom.filterSubsGroup.hidden = !hasSubs;
            if (hasSubs) {
                this.dom.filterSubsCat.textContent = '· ' + cat.nombre;
                this.dom.filterSubs.innerHTML = this.subChipsHtml(cat);
            }
        }
    }

    renderCatsSheet() {
        const box = this.dom.catsList;
        if (!box) return;
        const esc = window.helpers.escapeHtml;
        const s = this.state;
        const chevron = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>';

        let html = `
            <button type="button" class="shopx-catrow${!s.currentCategory ? ' is-current' : ''}" data-sheet-cat="all">
                <span class="shopx-catrow__name">Todos los productos</span>
                <span class="shopx-catrow__meta">${this.formatNumber(this.totalAll)}</span>
            </button>`;

        this.categories.forEach((c) => {
            const expandable = c.subs.length > 1;
            const open = expandable && s.openCat === c.id;
            const isCurrent = s.currentCategory === c.id;

            html += `
                <button type="button" class="shopx-catrow${isCurrent ? ' is-current' : ''}" data-sheet-cat="${c.id}"
                        ${expandable ? `aria-expanded="${open}"` : ''}>
                    <span class="shopx-catrow__name">${esc(c.nombre)}</span>
                    <span class="shopx-catrow__meta">${this.formatNumber(c.total)}${expandable ? chevron : ''}</span>
                </button>`;

            if (open) {
                const allActive = isCurrent && s.selectedSubcategories.size === 0;
                html += `
                    <div class="shopx-catpanel">
                        <button type="button" class="shopx-chip${allActive ? ' active' : ''}" data-sheet-go="${c.id}">
                            <span>Ver todo</span>
                        </button>
                        ${c.subs.map((sub) => `
                            <button type="button" class="shopx-chip${isCurrent && s.selectedSubcategories.has(sub.id) ? ' active' : ''}"
                                    data-sheet-go="${c.id}" data-sheet-sub="${sub.id}">
                                <span>${esc(sub.nombre)} <small>${sub.total}</small></span>
                            </button>`).join('')}
                    </div>`;
            }
        });

        box.innerHTML = html;
    }

    // Chips de orden y precio (no dependen de los datos)
    renderStaticFilters() {
        if (this.dom.filterSort) {
            this.dom.filterSort.innerHTML = SORTS.map((o) => `
                <button type="button" class="shopx-chip" data-sort="${o.id}"><span>${o.label}</span></button>`).join('');
        }
        if (this.dom.filterPrice) {
            this.dom.filterPrice.innerHTML = PRICE_RANGES.map((r) => `
                <button type="button" class="shopx-chip" data-price="${r.id}"><span>${r.label}</span></button>`).join('');
        }
        this.renderFilterState();
    }

    // Refleja el estado en los controles (chips activos, select, insignia)
    renderFilterState() {
        const s = this.state;
        const mark = (selector, isActive) => {
            document.querySelectorAll(selector).forEach((el) => {
                const active = isActive(el);
                el.classList.toggle('active', active);
                el.setAttribute('aria-pressed', String(active));
            });
        };
        mark('[data-sort]', (el) => el.dataset.sort === s.sort);
        mark('[data-price]', (el) => el.dataset.price === s.price);

        if (this.dom.sortSelect) this.dom.sortSelect.value = s.sort;
        if (this.dom.filterPhoto) this.dom.filterPhoto.checked = s.onlyPhoto;

        const count = s.selectedSubcategories.size + (s.price ? 1 : 0) + (s.onlyPhoto ? 1 : 0);
        if (this.dom.filtersBadge) {
            this.dom.filtersBadge.hidden = count === 0;
            this.dom.filtersBadge.textContent = count;
        }
    }

    renderCount() {
        const s = this.state;
        const hasTotal = s.currentMode !== 'search' && s.total !== null;

        if (this.dom.resultsCount) {
            this.dom.resultsCount.innerHTML = hasTotal
                ? `<strong>${this.formatNumber(s.total)}</strong> ${s.total === 1 ? 'producto' : 'productos'}`
                : (s.currentMode === 'search' ? 'Resultados de búsqueda' : '');
        }
        if (this.dom.applyFiltersBtn) {
            this.dom.applyFiltersBtn.textContent = hasTotal
                ? `Ver ${this.formatNumber(s.total)} ${s.total === 1 ? 'producto' : 'productos'}`
                : 'Ver resultados';
        }
    }

    formatNumber(n) {
        return Number(n || 0).toLocaleString('en-US');
    }

    showSkeleton() {
        const card = `
            <div class="pcard pcard--skeleton" aria-hidden="true">
                <div class="pcard__pic"></div>
                <div class="pcard__body">
                    <span class="pcard__line"></span><span class="pcard__line"></span><span class="pcard__line"></span>
                </div>
            </div>`;
        this.dom.productsContainer.innerHTML = card.repeat(6);
    }

    // ============================================================================
    // 📦 CARGA DE PRODUCTOS
    // ============================================================================

    buildProductsUrl(page) {
        const s = this.state;
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('limit', this.config.productsPerPage);
        if (s.sort !== 'recent') params.set('sort', s.sort);

        const range = PRICE_RANGES.find((r) => r.id === s.price);
        if (range) {
            if (range.min !== undefined) params.set('pmin', range.min);
            if (range.max !== undefined) params.set('pmax', range.max);
        }
        if (s.onlyPhoto) params.set('foto', '1');

        if (!s.currentCategory) {
            return `products.php?${params}`;
        }

        params.set('category_id', s.currentCategory);
        s.selectedSubcategories.forEach((id) => params.append('subcategory_ids[]', id));
        return `productsByCategories.php?${params}`;
    }

    async load(page = 1, append = false) {
        const s = this.state;
        const requestId = ++this.requestId;

        s.isLoading = true;
        s.currentPage = page;
        s.currentMode = s.currentCategory ? 'category' : 'all';
        s.searchQuery = '';
        this.updateLoadMoreButton();
        if (!append) this.showSkeleton();

        const data = await window.helpers.fetchJSON(this.buildProductsUrl(page));

        // Llegó una respuesta de una petición que ya fue reemplazada por otra
        if (requestId !== this.requestId) return;

        s.isLoading = false;

        if (!data || data.status !== 'ok') {
            this.showError('Error al cargar productos');
            this.updateLoadMoreButton();
            return;
        }

        s.totalPages = data.total_paginas || 1;
        s.total = data.total || 0;

        window.helpers.renderProducts(data.productos || [], append);
        this.renderCount();
        this.updateLoadMoreButton();
    }

    // Compatibilidad con search.module.js
    loadProducts(page = 1, append = false) {
        this.state.currentCategory = null;
        return this.load(page, append);
    }

    loadProductsByCategory(categoryId, page = 1, append = false) {
        this.state.currentCategory = categoryId ? String(categoryId) : null;
        return this.load(page, append);
    }

    // ============================================================================
    // 🎯 ACCIONES
    // ============================================================================

    // Cambia de categoría (null = todos) y, opcionalmente, deja subcategorías marcadas
    selectCategory(categoryId, subIds = []) {
        const s = this.state;
        s.currentCategory = categoryId && categoryId !== 'all' ? String(categoryId) : null;
        s.selectedSubcategories = new Set(subIds.map(String));
        s.openCat = s.currentCategory;

        this.clearInternalSearch();
        this.afterFilterChange();
        this.renderTabs();
        this.renderSubcategories();
        this.renderCatsSheet();

        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    toggleSubcategory(subId) {
        const subs = this.state.selectedSubcategories;
        if (subId === 'all') {
            subs.clear();
        } else if (subs.has(subId)) {
            subs.delete(subId);
        } else {
            subs.add(subId);
        }
        this.afterFilterChange();
        this.renderSubcategories();
        this.renderCatsSheet();
    }

    setSort(sort) {
        if (!SORTS.some((o) => o.id === sort) || sort === this.state.sort) return;
        this.state.sort = sort;
        this.afterFilterChange();
    }

    setPrice(priceId) {
        // Tocar el rango activo lo quita
        this.state.price = this.state.price === priceId ? null : priceId;
        this.afterFilterChange();
    }

    clearFilters() {
        const s = this.state;
        s.selectedSubcategories.clear();
        s.price = null;
        s.onlyPhoto = false;
        s.sort = 'recent';
        this.clearInternalSearch();
        this.afterFilterChange();
        this.renderSubcategories();
        this.renderCatsSheet();
    }

    afterFilterChange() {
        this.renderFilterState();
        this.writeUrlState();
        this.load();
    }

    clearInternalSearch() {
        const search = window.searchModule;
        if (search && search.dom && search.dom.internalInput) {
            search.dom.internalInput.value = '';
            search.state.internalQuery = '';
        }
    }

    // ============================================================================
    // 🧩 EVENTOS
    // ============================================================================

    bindEvents() {
        // Un solo listener delegado para todo lo que se renderiza dinámicamente
        document.addEventListener('click', (e) => {
            const hit = (selector) => e.target.closest(selector);
            let el;

            if ((el = hit('.category-tab'))) {
                this.selectCategory(el.dataset.categoryId);
            } else if ((el = hit('#subcategories-container [data-sub-id], #filter-subs [data-sub-id]'))) {
                this.toggleSubcategory(el.dataset.subId);
            } else if ((el = hit('[data-sheet-go]'))) {
                this.selectCategory(el.dataset.sheetGo, el.dataset.sheetSub ? [el.dataset.sheetSub] : []);
                this.closeSheets();
            } else if ((el = hit('[data-sheet-cat]'))) {
                this.handleSheetCategory(el);
            } else if ((el = hit('[data-sort]'))) {
                this.setSort(el.dataset.sort);
            } else if ((el = hit('[data-price]'))) {
                this.setPrice(el.dataset.price);
            } else if (hit('#open-cats-btn')) {
                this.state.openCat = this.state.currentCategory;
                this.renderCatsSheet();
                this.openSheet(this.dom.catsSheet);
            } else if (hit('#toggle-filters-btn')) {
                this.openSheet(this.dom.filtersSheet);
            } else if (hit('#clear-filters-btn')) {
                this.clearFilters();
            } else if (hit('[data-close-sheet]') || hit('#shopx-backdrop')) {
                this.closeSheets();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSheets();
        });

        if (this.dom.sortSelect) {
            this.dom.sortSelect.addEventListener('change', (e) => this.setSort(e.target.value));
        }

        if (this.dom.filterPhoto) {
            this.dom.filterPhoto.addEventListener('change', (e) => {
                this.state.onlyPhoto = e.target.checked;
                this.afterFilterChange();
            });
        }

        if (this.dom.loadMoreBtn) {
            this.dom.loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        if (this.dom.shareBtn) {
            this.dom.shareBtn.addEventListener('click', () => this.share());
        }
    }

    // Fila de la hoja de categorías: despliega sus subcategorías o entra directo
    handleSheetCategory(row) {
        const id = row.dataset.sheetCat;
        const cat = this.getCategory(id);

        if (id === 'all' || !cat || cat.subs.length <= 1) {
            this.selectCategory(id);
            this.closeSheets();
            return;
        }

        this.state.openCat = this.state.openCat === id ? null : id;
        this.renderCatsSheet();
    }

    // ============================================================================
    // 🗂️ HOJAS INFERIORES
    // ============================================================================

    openSheet(sheet) {
        if (!sheet) return;
        this.closeSheets(true);

        this.lastFocus = document.activeElement;
        sheet.hidden = false;
        if (this.dom.backdrop) this.dom.backdrop.hidden = false;
        document.body.classList.add('shopx-lock');

        // Forzar un reflow para que la transición de entrada se ejecute
        void sheet.offsetHeight;
        sheet.classList.add('is-open');
        if (this.dom.backdrop) this.dom.backdrop.classList.add('is-open');

        const closeBtn = sheet.querySelector('.shopx-sheet__close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    closeSheets(immediate = false) {
        const sheets = [this.dom.catsSheet, this.dom.filtersSheet].filter(Boolean);
        const anyOpen = sheets.some((sh) => sh.classList.contains('is-open'));
        if (!anyOpen) return;

        const finish = () => {
            sheets.forEach((sh) => {
                if (!sh.classList.contains('is-open')) sh.hidden = true;
            });
            if (this.dom.backdrop && !this.dom.backdrop.classList.contains('is-open')) {
                this.dom.backdrop.hidden = true;
            }
        };

        sheets.forEach((sh) => sh.classList.remove('is-open'));
        if (this.dom.backdrop) this.dom.backdrop.classList.remove('is-open');
        document.body.classList.remove('shopx-lock');

        if (immediate) {
            finish();
        } else {
            setTimeout(finish, 300);
            if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus({ preventScroll: true });
        }
    }

    // ============================================================================
    // 📄 CARGAR MÁS
    // ============================================================================

    loadMore() {
        const nextPage = this.state.currentPage + 1;

        if (this.state.currentMode === 'search') {
            const search = window.searchModule;
            if (search && search.state.internalQuery) {
                search.searchInternal(search.state.internalQuery, nextPage, true);
            }
            return;
        }

        this.load(nextPage, true);
    }

    updateLoadMoreButton() {
        const btn = this.dom.loadMoreBtn;
        if (!btn) return;

        if (this.state.currentPage < this.state.totalPages) {
            btn.style.display = 'inline-block';
            btn.disabled = this.state.isLoading;
            btn.textContent = this.state.isLoading ? 'Cargando…' : 'Cargar más productos';
        } else {
            btn.style.display = 'none';
        }
    }

    // ============================================================================
    // 📱 CABECERA MÓVIL: la barra negra se va con el scroll y la cabecera sube
    // ============================================================================

    setupHeaderScroll() {
        const root = document.documentElement;
        let last = null;

        // Solo escribe la variable cuando cambia (los primeros 32px de scroll)
        const update = () => {
            const top = Math.max(0, TOPBAR_HEIGHT - window.scrollY);
            if (top !== last) {
                last = top;
                root.style.setProperty('--hdr-top', top + 'px');
            }
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // ============================================================================
    // 🎠 SCROLL DE CATEGORÍAS (compatibilidad)
    // ============================================================================

    scrollCategories(direction) {
        if (!this.dom.categoriesContainer) return;
        this.dom.categoriesContainer.scrollBy({
            left: direction * this.config.scrollAmount,
            behavior: 'smooth'
        });
    }

    scrollSubcategories(direction) {
        if (!this.dom.subcategoriesContainer) return;
        this.dom.subcategoriesContainer.scrollBy({
            left: direction * this.config.scrollAmount,
            behavior: 'smooth'
        });
    }

    // ============================================================================
    // 🔗 COMPARTIR
    // ============================================================================

    share() {
        const url = window.location.href;
        const cat = this.getCategory(this.state.currentCategory);
        const title = cat
            ? `${cat.nombre} - Importadora Inka`
            : 'Catálogo de Productos - Importadora Inka';

        if (navigator.share) {
            navigator.share({ title, text: 'Mira estos productos', url }).catch((err) => {
                // El usuario cerró el diálogo: no es un error
                if (err && err.name !== 'AbortError') this.fallbackShare(url);
            });
        } else {
            this.fallbackShare(url);
        }
    }

    fallbackShare(url) {
        const copied = () => {
            if (window.swal) {
                swal('¡Copiado!', 'El enlace se copió al portapapeles', 'success');
            } else {
                alert('Enlace copiado al portapapeles:\n' + url);
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(copied).catch(() => prompt('Copia este enlace:', url));
        } else {
            prompt('Copia este enlace:', url);
        }
    }

    // ============================================================================
    // 🌐 GLOBALES Y ERRORES
    // ============================================================================

    exportGlobalFunctions() {
        window.scrollCategories = (direction) => this.scrollCategories(direction);
        window.scrollSubcategories = (direction) => this.scrollSubcategories(direction);
        window.shopModule = this;
    }

    showError(message) {
        if (!this.dom.productsContainer) return;
        this.dom.productsContainer.innerHTML = `
            <div class="col-12 text-center text-danger py-5">
                <i class="zmdi zmdi-alert-circle zmdi-hc-4x mb-3"></i>
                <h5>${window.helpers.escapeHtml(message)}</h5>
                <button class="btn btn-primary mt-3" onclick="location.reload()">Reintentar</button>
            </div>`;
    }
}

export default ShopModule;
