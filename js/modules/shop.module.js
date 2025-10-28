// ============================================================================
// 🛍️ shop.module.js - Módulo del Catálogo (CON MANAGERS - VERSION FINAL)
// ============================================================================
// Consolida: categories.js, subcategories.js, products.js, 
//            productsByCategories.js, scrollCategories.js
// ✅ FIXES: URLs compartibles, botón cargar más, subcategorías en URL
// ============================================================================

console.log('🛍️ shop.module.js cargando...');

export class ShopModule {
    constructor() {
        console.log('🏗️ ShopModule: Inicializando...');
        
        // ✅ Usar managers
        this.DOM = window.DOMManager;
        this.Events = window.EventManager;
        
        // ============================================
        // 📊 ESTADO DEL MÓDULO
        // ============================================
        this.state = {
            currentMode: 'all',              // all | category | search
            currentCategory: null,            // ID de categoría activa
            selectedSubcategories: new Set(), // IDs de subcategorías activas
            currentPage: 1,                   // Página actual
            totalPages: 1,                    // Total de páginas
            isLoading: false,                 // Flag de carga
            searchQuery: ''                   // Query de búsqueda activa
        };

        // ============================================
        // 🎯 ELEMENTOS DOM (cacheados con DOMManager)
        // ============================================
        this.dom = {};

        // ============================================
        // ⚙️ CONFIGURACIÓN
        // ============================================
        this.config = {
            productsPerPage: 20,
            scrollAmount: 200
        };
    }

    // ============================================================================
    // 🚀 INICIALIZACIÓN
    // ============================================================================
    
    init() {
        console.log('🚀 ShopModule: Iniciando...');
        
        // Cachear elementos DOM
        this.cacheElements();
        
        // Verificar elementos críticos
        if (!this.dom.productsContainer) {
            console.error('❌ #products-container no encontrado');
            return;
        }

        // Inicializar componentes
        this.loadCategories();
        this.loadProducts();
        this.setupScrollButtons();
        this.setupLoadMoreButton();
        this.setupSearchInput();
        this.setupShareButton();
        this.checkUrlParams();
        
        // Exportar funciones globales para compatibilidad
        this.exportGlobalFunctions();
        
        console.log('✅ ShopModule inicializado correctamente');
    }

    // ============================================================================
    // 📦 CACHEAR ELEMENTOS DOM
    // ============================================================================
    
    cacheElements() {
        console.log('📦 Cacheando elementos DOM...');
        
        this.dom = {
            productsContainer: this.DOM.getById('products-container'),
            categoriesContainer: this.DOM.getById('categories-container'),
            subcategoriesContainer: this.DOM.getById('subcategories-container'),
            loadMoreBtn: this.DOM.getById('load-more'),
            searchInput: this.DOM.getById('search-input'),
            shareBtn: this.DOM.getById('share-btn')
        };

        console.log('✅ Elementos cacheados:', {
            products: !!this.dom.productsContainer,
            categories: !!this.dom.categoriesContainer,
            subcategories: !!this.dom.subcategoriesContainer,
            loadMore: !!this.dom.loadMoreBtn,
            search: !!this.dom.searchInput,
            share: !!this.dom.shareBtn
        });
    }

    // ============================================================================
    // 📂 CARGAR CATEGORÍAS
    // ============================================================================
    
    async loadCategories() {
        if (!this.dom.categoriesContainer) {
            console.warn('⚠️ Contenedor de categorías no encontrado');
            return;
        }

        console.log('📂 Cargando categorías...');

        try {
            const data = await window.helpers.fetchJSON('categories.php');
            
            if (!data || !Array.isArray(data.categorias)) {
                throw new Error('Datos de categorías inválidos');
            }

            this.renderCategories(data.categorias);
            
        } catch (err) {
            console.error('❌ Error cargando categorías:', err);
            this.dom.categoriesContainer.innerHTML = 
                '<p class="text-danger small">Error al cargar categorías</p>';
        }
    }

    renderCategories(categories) {
        // ✅ Botón "All Products" al inicio
        const allProductsBtn = `
            <button class="category-btn active" 
                    data-category-id="all"
                    data-category-name="All Products">
                All Products
            </button>
        `;
        
        const categoriesHtml = categories.map(cat => `
            <button class="category-btn" 
                    data-category-id="${cat.id}"
                    data-category-name="${window.helpers.escapeHtml(cat.nombre)}">
                ${window.helpers.escapeHtml(cat.nombre)}
            </button>
        `).join('');

        this.dom.categoriesContainer.innerHTML = allProductsBtn + categoriesHtml;

        // ✅ Vincular eventos con EventManager (delegación)
        this.Events.delegate(
            '#categories-container',
            '.category-btn',
            'click',
            (e) => this.handleCategoryClick(e)
        );

        console.log(`✅ ${categories.length + 1} categorías renderizadas (+ All Products)`);
    }

    // ============================================================================
    // 🎯 MANEJAR CLICK EN CATEGORÍA
    // ============================================================================
    
    handleCategoryClick(e) {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;

        const categoryId = btn.getAttribute('data-category-id');
        const categoryName = btn.getAttribute('data-category-name');

        console.log('📂 Categoría seleccionada:', categoryId, categoryName);

        // ✅ Remover activo de todas las categorías
        this.DOM.getAll('.category-btn').forEach(b => b.classList.remove('active'));
        
        // ✅ Activar botón clickeado
        btn.classList.add('active');

        // ✅ CASO ESPECIAL: "All Products"
        if (categoryId === 'all') {
            console.log('🌐 Mostrando todos los productos');
            
            this.state.currentCategory = null;
            this.state.currentMode = 'all';
            this.state.selectedSubcategories.clear();
            
            // Limpiar subcategorías
            this.clearSubcategories();
            
            // Limpiar input de búsqueda si existe
            if (window.searchModule && window.searchModule.dom.internalInput) {
                window.searchModule.dom.internalInput.value = '';
                window.searchModule.state.internalQuery = '';
            }
            
            // Cargar todos los productos
            this.loadProducts();
            
            // ✅ Limpiar TODOS los parámetros de filtros y búsqueda
            window.helpers.updateUrlParams({
                cat: null,
                subcat: null,
                q: null,
                multi: null,  // ✅ Limpiar búsqueda global
                page: null
            });
            
            return;
        }

        // ✅ CATEGORÍA NORMAL
        this.state.currentCategory = categoryId;
        this.state.currentMode = 'category';
        
        // Limpiar subcategorías seleccionadas
        this.state.selectedSubcategories.clear();
        
        // Limpiar input de búsqueda
        if (window.searchModule && window.searchModule.dom.internalInput) {
            window.searchModule.dom.internalInput.value = '';
            window.searchModule.state.internalQuery = '';
        }
        
        this.loadSubcategories(categoryId);
        this.loadProductsByCategory(categoryId);
        
        // ✅ Actualizar URL solo con categoría (limpiar búsquedas)
        window.helpers.updateUrlParams({
            cat: categoryId,
            subcat: null,
            q: null,
            multi: null,  // ✅ Limpiar búsqueda global
            page: null
        });
    }

    // ============================================================================
    // 📑 CARGAR SUBCATEGORÍAS
    // ============================================================================
    
    async loadSubcategories(categoryId) {
        if (!this.dom.subcategoriesContainer) return Promise.resolve();

        console.log('📑 Cargando subcategorías para categoría:', categoryId);

        try {
            // ✅ CORREGIDO: category_id (con underscore)
            const data = await window.helpers.fetchJSON(`subcategories.php?category_id=${categoryId}`);
            
            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            this.renderSubcategories(data.subcategorias || []);
            return Promise.resolve();
            
        } catch (err) {
            console.error('❌ Error cargando subcategorías:', err);
            this.dom.subcategoriesContainer.innerHTML = 
                '<p class="text-danger small">Error al cargar subcategorías</p>';
            return Promise.reject(err);
        }
    }

    renderSubcategories(subcategories) {
        if (subcategories.length === 0) {
            this.dom.subcategoriesContainer.innerHTML = 
                '<p class="text-muted small text-center py-2">Sin subcategorías</p>';
            return;
        }

        // ✅ CORREGIDO: Usar name_subcategory (como lo devuelve la API)
        const html = subcategories.map(sub => `
            <button class="subcategory-tag" 
                    data-subcategory-id="${sub.id}"
                    data-subcategory-name="${window.helpers.escapeHtml(sub.name_subcategory)}">
                ${window.helpers.escapeHtml(sub.name_subcategory)}
            </button>
        `).join('');

        this.dom.subcategoriesContainer.innerHTML = html;

        // ✅ Vincular eventos con EventManager (delegación)
        this.Events.delegate(
            '#subcategories-container',
            '.subcategory-tag',
            'click',
            (e) => this.handleSubcategoryClick(e)
        );

        console.log(`✅ ${subcategories.length} subcategorías renderizadas`);
    }

    clearSubcategories() {
        if (this.dom.subcategoriesContainer) {
            this.dom.subcategoriesContainer.innerHTML = 
                '<p class="text-muted small text-center py-3">Selecciona una categoría</p>';
        }
        this.state.selectedSubcategories.clear();
    }

    // ============================================================================
    // 🎯 MANEJAR CLICK EN SUBCATEGORÍA
    // ============================================================================
    
    handleSubcategoryClick(e) {
        const btn = e.target.closest('.subcategory-tag');
        if (!btn) return;

        const subId = btn.getAttribute('data-subcategory-id');
        const subName = btn.getAttribute('data-subcategory-name');
        
        // Toggle selección
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            this.state.selectedSubcategories.add(subId);
            console.log(`➕ Subcategoría agregada: ${subName} (ID: ${subId})`);
        } else {
            this.state.selectedSubcategories.delete(subId);
            console.log(`➖ Subcategoría removida: ${subName} (ID: ${subId})`);
        }

        console.log('📑 Subcategorías activas:', Array.from(this.state.selectedSubcategories));

        // ✅ Actualizar URL con subcategorías
        this.updateUrlWithSubcategories();
        
        // Recargar productos con filtro
        this.loadProductsByCategory(this.state.currentCategory);
    }

    // ============================================================================
    // 🔗 ACTUALIZAR URL CON SUBCATEGORÍAS
    // ============================================================================
    
    updateUrlWithSubcategories() {
        const subIds = Array.from(this.state.selectedSubcategories);
        
        if (subIds.length > 0) {
            // ✅ CORREGIDO: Usar guiones (-) en lugar de comas (,)
            // Formato: ?cat=6&subcat=269-258-211
            window.helpers.updateUrlParams({
                subcat: subIds.join('-')
            });
            console.log('🔗 URL actualizada con subcategorías:', subIds.join('-'));
        } else {
            // ✅ Si no hay subcategorías, remover parámetro
            window.helpers.updateUrlParams({
                subcat: null
            });
            console.log('🔗 Subcategorías removidas de URL');
        }
    }

    // ============================================================================
    // 📦 CARGAR PRODUCTOS (MODO: ALL)
    // ============================================================================
    
    async loadProducts(page = 1, append = false) {
        if (this.state.isLoading) {
            console.log('⏳ Ya hay una carga en progreso...');
            return;
        }

        console.log(`📦 Cargando productos (modo: all, página: ${page})...`);

        this.state.isLoading = true;
        this.state.currentPage = page;
        this.state.currentMode = 'all';
        
        // ✅ Actualizar botón inmediatamente (deshabilitar)
        this.updateLoadMoreButton();

        try {
            const url = `products.php?page=${page}&limit=${this.config.productsPerPage}`;
            const data = await window.helpers.fetchJSON(url);

            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            const productos = data.productos || [];
            this.state.totalPages = data.total_paginas || 1;

            console.log(`📊 Respuesta: ${productos.length} productos, página ${page}/${this.state.totalPages}`);

            // Renderizar productos usando helpers
            window.helpers.renderProducts(productos, append);

            // ✅ CRÍTICO: Establecer isLoading = false ANTES de actualizar botón
            this.state.isLoading = false;
            this.updateLoadMoreButton();

            console.log(`✅ ${productos.length} productos cargados (página ${page}/${this.state.totalPages})`);

        } catch (err) {
            console.error('❌ Error cargando productos:', err);
            this.showError('Error al cargar productos');
            
            // ✅ CRÍTICO: isLoading = false en caso de error
            this.state.isLoading = false;
            this.updateLoadMoreButton();
        }
    }

    // ============================================================================
    // 📂 CARGAR PRODUCTOS POR CATEGORÍA
    // ============================================================================
    
    async loadProductsByCategory(categoryId, page = 1, append = false) {
        if (this.state.isLoading) {
            console.log('⏳ Ya hay una carga en progreso...');
            return;
        }

        console.log(`📂 Cargando productos de categoría ${categoryId} (página: ${page})...`);

        this.state.isLoading = true;
        this.state.currentPage = page;
        this.state.currentMode = 'category';
        
        // ✅ Actualizar botón inmediatamente (deshabilitar)
        this.updateLoadMoreButton();

        try {
            // ✅ CORREGIDO: category_id (con underscore)
            let url = `productsByCategories.php?category_id=${categoryId}&page=${page}&limit=${this.config.productsPerPage}`;

            // Agregar subcategorías si están seleccionadas
            if (this.state.selectedSubcategories.size > 0) {
                const subIds = Array.from(this.state.selectedSubcategories);
                
                // ✅ Enviar como array en formato query string
                subIds.forEach(id => {
                    url += `&subcategory_ids[]=${id}`;
                });
            }

            console.log('📡 URL:', url);

            const data = await window.helpers.fetchJSON(url);

            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            const productos = data.productos || [];
            this.state.totalPages = data.total_paginas || 1;

            console.log(`📊 Respuesta: ${productos.length} productos, página ${page}/${this.state.totalPages}`);

            window.helpers.renderProducts(productos, append);
            
            // ✅ CRÍTICO: Establecer isLoading = false ANTES de actualizar botón
            this.state.isLoading = false;
            this.updateLoadMoreButton();

            console.log(`✅ ${productos.length} productos de categoría cargados (total: ${data.total})`);

        } catch (err) {
            console.error('❌ Error cargando productos por categoría:', err);
            this.showError('Error al cargar productos');
            
            // ✅ CRÍTICO: isLoading = false en caso de error
            this.state.isLoading = false;
            this.updateLoadMoreButton();
        }
    }

    // ============================================================================
    // 📄 BOTÓN "CARGAR MÁS"
    // ============================================================================
    
    setupLoadMoreButton() {
        if (!this.dom.loadMoreBtn) {
            console.warn('⚠️ Botón "Cargar más" no encontrado');
            return;
        }

        // ✅ Usar EventManager
        this.Events.on(this.dom.loadMoreBtn, 'click', () => {
            console.log('📄 Click en "Cargar más"');

            const nextPage = this.state.currentPage + 1;

            // ✅ Si hay búsqueda activa, delegar a searchModule
            if (this.state.currentMode === 'search') {
                console.log('🔍 Modo búsqueda activo, delegando a searchModule');
                if (window.searchModule && window.searchModule.state.internalQuery) {
                    window.searchModule.searchInternal(
                        window.searchModule.state.internalQuery,
                        nextPage,
                        true
                    );
                }
                return;
            }

            // ✅ Modo categoría
            if (this.state.currentMode === 'category') {
                this.loadProductsByCategory(this.state.currentCategory, nextPage, true);
                return;
            }

            // ✅ Modo normal (todos los productos)
            this.loadProducts(nextPage, true);
        });

        console.log('✅ Botón "Cargar más" configurado');
    }

    updateLoadMoreButton() {
        if (!this.dom.loadMoreBtn) {
            console.warn('⚠️ Botón "Cargar más" no encontrado en updateLoadMoreButton');
            return;
        }

        console.log('🔄 Actualizando botón "Cargar más":', {
            paginaActual: this.state.currentPage,
            totalPaginas: this.state.totalPages,
            isLoading: this.state.isLoading,
            hayMasPaginas: this.state.currentPage < this.state.totalPages
        });

        // ✅ Mostrar si hay más páginas
        if (this.state.currentPage < this.state.totalPages) {
            this.dom.loadMoreBtn.style.display = 'inline-block';
            this.dom.loadMoreBtn.disabled = this.state.isLoading;
            
            console.log(`✅ Botón "Cargar más" visible (${this.state.isLoading ? 'deshabilitado' : 'habilitado'})`);
        } else {
            this.dom.loadMoreBtn.style.display = 'none';
            
            console.log('ℹ️ No hay más páginas, ocultando botón');
        }
    }

    // ============================================================================
    // 🎠 BOTONES DE SCROLL (Categorías y Subcategorías)
    // ============================================================================
    
    setupScrollButtons() {
        console.log('🎠 Configurando botones de scroll...');

        // ✅ Usar delegación de eventos con EventManager
        this.Events.delegate(
            'body',
            '.scroll-btn',
            'click',
            (e) => {
                const btn = e.target.closest('.scroll-btn');
                if (!btn) return;

                const direction = parseInt(btn.getAttribute('data-direction') || '1');
                const target = btn.getAttribute('data-target');

                if (target === 'categories') {
                    this.scrollCategories(direction);
                } else if (target === 'subcategories') {
                    this.scrollSubcategories(direction);
                }
            }
        );

        console.log('✅ Botones de scroll configurados');
    }

    scrollCategories(direction) {
        if (!this.dom.categoriesContainer) return;
        
        this.dom.categoriesContainer.scrollBy({
            left: direction * this.config.scrollAmount,
            behavior: 'smooth'
        });
        
        console.log(`🎠 Scroll categorías: ${direction > 0 ? 'derecha' : 'izquierda'}`);
    }

    scrollSubcategories(direction) {
        if (!this.dom.subcategoriesContainer) return;
        
        this.dom.subcategoriesContainer.scrollBy({
            left: direction * this.config.scrollAmount,
            behavior: 'smooth'
        });
        
        console.log(`🎠 Scroll subcategorías: ${direction > 0 ? 'derecha' : 'izquierda'}`);
    }

    // ============================================================================
    // 🔍 INPUT DE BÚSQUEDA
    // ============================================================================
    
    setupSearchInput() {
        if (!this.dom.searchInput) {
            console.warn('⚠️ Input de búsqueda no encontrado');
            return;
        }

        // ✅ DESACTIVADO: search.module.js maneja la búsqueda interna ahora
        console.log('ℹ️ setupSearchInput desactivado (manejado por search.module.js)');
        return;

        /* CÓDIGO LEGACY DESACTIVADO
        let searchTimeout;

        this.Events.on(this.dom.searchInput, 'input', (e) => {
            clearTimeout(searchTimeout);
            
            const query = e.target.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    console.log('🔍 Búsqueda en grid:', query);
                    this.searchInGrid(query);
                } else if (query.length === 0) {
                    // Restaurar vista según el estado actual
                    if (this.state.currentMode === 'category' && this.state.currentCategory) {
                        this.loadProductsByCategory(this.state.currentCategory);
                    } else {
                        this.loadProducts();
                    }
                }
            }, 500);
        });

        console.log('✅ Input de búsqueda configurado');
        */
    }

    async searchInGrid(query, page = 1, append = false) {
        if (this.state.isLoading) return;

        console.log(`🔍 Buscando "${query}" (página: ${page})...`);

        this.state.isLoading = true;
        this.state.currentPage = page;
        this.state.currentMode = 'search';
        this.state.searchQuery = query;
        
        this.updateLoadMoreButton();

        try {
            let url = `products.php?q=${encodeURIComponent(query)}&page=${page}&limit=${this.config.productsPerPage}`;

            // Si hay categoría activa, agregar filtro
            if (this.state.currentCategory) {
                url += `&category_id=${this.state.currentCategory}`;
            }

            const data = await window.helpers.fetchJSON(url);

            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            const productos = data.productos || [];
            this.state.totalPages = data.total_paginas || 1;

            window.helpers.renderProducts(productos, append);
            
            this.state.isLoading = false;
            this.updateLoadMoreButton();

            console.log(`✅ ${productos.length} productos encontrados`);

        } catch (err) {
            console.error('❌ Error en búsqueda:', err);
            this.showError('Error en la búsqueda');
            
            this.state.isLoading = false;
            this.updateLoadMoreButton();
        }
    }

    // ============================================================================
    // 🔗 BOTÓN COMPARTIR
    // ============================================================================
    
    setupShareButton() {
        if (!this.dom.shareBtn) {
            console.warn('⚠️ Botón de compartir no encontrado');
            return;
        }

        this.Events.on(this.dom.shareBtn, 'click', () => {
            console.log('📤 Compartir catálogo');
            
            // ✅ Obtener URL actual (con filtros)
            const url = window.location.href;
            const title = 'Catálogo de Productos - Importadora Inka';
            
            // Mostrar qué se está compartiendo
            if (this.state.currentCategory) {
                const categoryBtn = this.DOM.get('.category-btn.active');
                const categoryName = categoryBtn ? categoryBtn.textContent.trim() : 'Categoría';
                const subcatCount = this.state.selectedSubcategories.size;
                
                let message = `Compartiendo: ${categoryName}`;
                if (subcatCount > 0) {
                    message += ` (${subcatCount} subcategoría${subcatCount > 1 ? 's' : ''})`;
                }
                console.log(message);
            }

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: 'Mira estos productos',
                    url: url
                }).then(() => {
                    console.log('✅ Compartido exitosamente');
                }).catch((err) => {
                    console.log('❌ Error compartiendo:', err);
                    this.fallbackShare(url);
                });
            } else {
                this.fallbackShare(url);
            }
        });

        console.log('✅ Botón de compartir configurado');
    }

    fallbackShare(url) {
        navigator.clipboard.writeText(url).then(() => {
            if (window.swal) {
                swal("¡Copiado!", "El enlace se copió al portapapeles", "success");
            } else {
                alert('✅ Enlace copiado al portapapeles:\n' + url);
            }
        }).catch(() => {
            prompt('Copia este enlace:', url);
        });
    }

    // ============================================================================
    // 🔗 RESTAURAR ESTADO DESDE URL (AL CARGAR LA PÁGINA)
    // ============================================================================
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        const subcatParam = urlParams.get('subcat');

        if (catParam) {
            console.log('🔄 Detectado parámetro cat en URL:', catParam);
            
            // Esperar a que las categorías se carguen
            setTimeout(() => {
                const categoryBtn = this.DOM.get(`[data-category-id="${catParam}"]`);
                if (categoryBtn) {
                    console.log('✅ Categoría encontrada, activando...');
                    
                    // Remover active de All Products
                    const allBtn = this.DOM.get('[data-category-id="all"]');
                    if (allBtn) allBtn.classList.remove('active');
                    
                    // Activar categoría visualmente
                    categoryBtn.classList.add('active');
                    this.state.currentCategory = catParam;
                    this.state.currentMode = 'category';
                    
                    // Cargar subcategorías de esta categoría
                    this.loadSubcategories(catParam).then(() => {
                        // Si hay subcategorías en URL, activarlas
                        if (subcatParam) {
                            this.restoreSubcategoriesFromUrl(subcatParam);
                        } else {
                            // Sin subcategorías, cargar todos los productos de la categoría
                            this.loadProductsByCategory(catParam);
                        }
                    });
                } else {
                    console.warn('⚠️ Categoría no encontrada:', catParam);
                }
            }, 500);
        } else {
            // ✅ Sin parámetros, asegurar que "All Products" esté activo
            console.log('ℹ️ Sin parámetros URL, mostrando todos los productos');
            setTimeout(() => {
                const allBtn = this.DOM.get('[data-category-id="all"]');
                if (allBtn && !allBtn.classList.contains('active')) {
                    allBtn.classList.add('active');
                }
            }, 500);
        }
    }

    // ============================================================================
    // 🔄 RESTAURAR SUBCATEGORÍAS DESDE URL
    // ============================================================================
    
    async restoreSubcategoriesFromUrl(subcatParam) {
        // ✅ CORREGIDO: Convertir "269-258-211" → ["269", "258", "211"]
        const subIds = subcatParam.split('-').map(id => id.trim()).filter(id => id);
        
        console.log('🔄 Restaurando subcategorías desde URL:', subIds);

        // Esperar un poco a que las subcategorías se rendericen
        setTimeout(() => {
            subIds.forEach(subId => {
                // Buscar el botón de subcategoría y activarlo
                const subBtn = this.DOM.get(`[data-subcategory-id="${subId}"]`);
                if (subBtn) {
                    subBtn.classList.add('active');
                    this.state.selectedSubcategories.add(subId);
                    console.log('✅ Subcategoría restaurada:', subId);
                } else {
                    console.warn('⚠️ Subcategoría no encontrada:', subId);
                }
            });

            // Cargar productos con el filtro restaurado
            if (this.state.selectedSubcategories.size > 0) {
                console.log('📦 Cargando productos con filtro restaurado...');
                this.loadProductsByCategory(this.state.currentCategory);
            }
        }, 300);
    }

    // ============================================================================
    // 🌐 EXPORTAR FUNCIONES GLOBALES (Compatibilidad)
    // ============================================================================
    
    exportGlobalFunctions() {
        // Para compatibilidad con código legacy
        window.scrollCategories = (direction) => this.scrollCategories(direction);
        window.scrollSubcategories = (direction) => this.scrollSubcategories(direction);
        
        // Exportar instancia
        window.shopModule = this;
        
        console.log('✅ Funciones globales exportadas');
    }

    // ============================================================================
    // 🚨 MANEJO DE ERRORES
    // ============================================================================
    
    showError(message) {
        if (this.dom.productsContainer) {
            this.dom.productsContainer.innerHTML = `
                <div class="col-12 text-center text-danger py-5">
                    <i class="zmdi zmdi-alert-circle zmdi-hc-4x mb-3"></i>
                    <h5>${message}</h5>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// ============================================================================
// 🌐 EXPORTAR
// ============================================================================

export default ShopModule;

console.log('✅ shop.module.js cargado correctamente');