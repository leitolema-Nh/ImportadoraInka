// ============================================================================
// 🔍 search.module.js - Módulo de Búsqueda (GLOBAL + INTERNA)
// ============================================================================
// BÚSQUEDA GLOBAL: Header overlay → Busca en toda la DB → Redirige a shop
// BÚSQUEDA INTERNA: Input catálogo → Filtra productos visibles → En vivo
// ============================================================================

console.log('🔍 search.module.js cargando...');

export class SearchModule {
    constructor() {
        console.log('🏗️ SearchModule: Inicializando...');
        
        // ✅ Usar managers
        this.DOM = window.DOMManager;
        this.Events = window.EventManager;
        
        // ============================================
        // 📊 ESTADO DEL MÓDULO
        // ============================================
        this.state = {
            // Global search
            globalQuery: '',
            globalResults: [],
            isGlobalSearching: false,
            
            // Internal search (catálogo)
            internalQuery: '',
            internalResults: [],
            isInternalSearching: false,
            currentPage: 1,
            totalPages: 1,
            
            // Contexto de búsqueda interna
            activeCategory: null,
            activeSubcategories: []
        };

        // ============================================
        // 🎯 ELEMENTOS DOM
        // ============================================
        this.dom = {
            // Global search (overlay)
            globalOverlay: null,
            globalInput: null,
            globalDropdown: null,
            globalOpenBtns: null,
            globalCloseBtn: null,
            
            // Internal search (catálogo)
            internalInput: null,
            productsContainer: null,
            loadMoreBtn: null
        };

        // ============================================
        // ⚙️ CONFIGURACIÓN
        // ============================================
        this.config = {
            minChars: 2,              // Mínimo de caracteres para buscar
            debounceTime: 300,        // Tiempo de espera antes de buscar
            globalLimit: 10,          // Límite de resultados en overlay
            internalLimit: 20         // Límite de resultados en grid
        };

        // Timers para debounce
        this.timers = {
            global: null,
            internal: null
        };

        // AbortController para cancelar requests
        this.controllers = {
            global: null,
            internal: null
        };
    }

    // ============================================================================
    // 🚀 INICIALIZACIÓN
    // ============================================================================
    
    init() {
        console.log('🚀 SearchModule: Iniciando...');
        
        // Cachear elementos
        this.cacheElements();
        
        // Inicializar búsqueda global (overlay)
        this.initGlobalSearch();
        
        // Inicializar búsqueda interna (catálogo)
        this.initInternalSearch();
        
        // Verificar parámetros URL al cargar
        this.checkUrlParams();
        
        // Exportar para uso global
        window.searchModule = this;
        
        console.log('✅ SearchModule inicializado correctamente');
    }

    // ============================================================================
    // 📦 CACHEAR ELEMENTOS DOM
    // ============================================================================
    
    cacheElements() {
        console.log('📦 Cacheando elementos de búsqueda...');
        
        this.dom = {
            // Global search
            globalOverlay: this.DOM.getById('global-search-overlay'),
            globalInput: this.DOM.getById('globalSearchInput'),
            globalDropdown: this.DOM.getById('searchResultsDropdown'),
            globalOpenBtns: this.DOM.getAll('.js-show-search'),
            globalCloseBtn: this.DOM.getById('closeGlobalSearch'),
            
            // Internal search - Usar método mejorado
            internalInput: this.findInternalInput(),
            productsContainer: this.DOM.getById('products-container'),
            loadMoreBtn: this.DOM.getById('load-more')
        };

        console.log('✅ Elementos cacheados:', {
            globalOverlay: !!this.dom.globalOverlay,
            globalInput: !!this.dom.globalInput,
            globalDropdown: !!this.dom.globalDropdown,
            internalInput: !!this.dom.internalInput,
            productsContainer: !!this.dom.productsContainer
        });
        
        // ✅ Si el input interno no existe, observar
        if (!this.dom.internalInput) {
            console.warn('⚠️ Input de búsqueda interna no encontrado, iniciando observer...');
            this.observeInternalInput();
        }
    }

    // ============================================================================
    // 🌐 BÚSQUEDA GLOBAL (HEADER OVERLAY)
    // ============================================================================
    
    initGlobalSearch() {
        if (!this.dom.globalOverlay || !this.dom.globalInput) {
            console.warn('⚠️ Elementos de búsqueda global no encontrados');
            return;
        }

        console.log('🌐 Inicializando búsqueda global (overlay)...');

        // Botones para abrir overlay
        if (this.dom.globalOpenBtns && this.dom.globalOpenBtns.length > 0) {
            this.dom.globalOpenBtns.forEach(btn => {
                this.Events.on(btn, 'click', (e) => {
                    e.preventDefault();
                    this.openGlobalSearch();
                });
            });
        }

        // Botón para cerrar overlay
        if (this.dom.globalCloseBtn) {
            this.Events.on(this.dom.globalCloseBtn, 'click', () => {
                this.closeGlobalSearch();
            });
        }

        // Cerrar al hacer click fuera
        this.Events.on(this.dom.globalOverlay, 'click', (e) => {
            if (e.target === this.dom.globalOverlay) {
                this.closeGlobalSearch();
            }
        });

        // Input en vivo
        this.Events.on(this.dom.globalInput, 'input', (e) => {
            this.handleGlobalInput(e.target.value);
        });

        // Teclas especiales
        this.Events.on(this.dom.globalInput, 'keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGlobalSearch();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.dom.globalInput.value.trim();
                if (query) {
                    this.executeGlobalSearch(query);
                }
            }
        });

        console.log('✅ Búsqueda global inicializada');
    }

    openGlobalSearch() {
        if (!this.dom.globalOverlay) return;
        
        this.dom.globalOverlay.classList.add('active');
        this.dom.globalInput.value = '';
        this.dom.globalInput.focus();
        
        if (this.dom.globalDropdown) {
            this.dom.globalDropdown.innerHTML = 
                '<div class="search-empty">Escribe para buscar productos...</div>';
        }
        
        console.log('🔍 Overlay de búsqueda global abierto');
    }

    closeGlobalSearch() {
        if (!this.dom.globalOverlay) return;
        
        this.dom.globalOverlay.classList.remove('active');
        this.state.globalQuery = '';
        
        if (this.dom.globalDropdown) {
            this.dom.globalDropdown.innerHTML = '';
        }
        
        console.log('❌ Overlay de búsqueda global cerrado');
    }

    handleGlobalInput(value) {
        const query = value.trim();
        
        // Limpiar timer anterior
        clearTimeout(this.timers.global);
        
        if (query.length < this.config.minChars) {
            if (this.dom.globalDropdown) {
                this.dom.globalDropdown.innerHTML = 
                    '<div class="search-empty">Escribe al menos 2 caracteres...</div>';
            }
            return;
        }

        // Debounce
        this.timers.global = setTimeout(() => {
            this.searchGlobal(query);
        }, this.config.debounceTime);
    }

    async searchGlobal(query) {
        if (this.state.isGlobalSearching) {
            console.log('⏳ Búsqueda global en progreso, cancelando...');
            if (this.controllers.global) {
                this.controllers.global.abort();
            }
        }

        console.log('🔍 Búsqueda global:', query);

        this.state.isGlobalSearching = true;
        this.state.globalQuery = query;
        
        if (this.dom.globalDropdown) {
            this.dom.globalDropdown.innerHTML = 
                '<div class="search-loading"><i class="zmdi zmdi-spinner zmdi-hc-spin"></i> Buscando...</div>';
        }

        try {
            // Crear nuevo AbortController
            this.controllers.global = new AbortController();
            
            // Llamar a globalSearch.php para autocompletado
            const url = `${window.CONFIG.apiURL}globalSearch.php?q=${encodeURIComponent(query)}&limit=${this.config.globalLimit}`;
            
            const response = await fetch(url, {
                signal: this.controllers.global.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            const productos = data.data?.productos || [];
            this.state.globalResults = productos;

            this.renderGlobalResults(productos, query);

            console.log(`✅ ${productos.length} resultados globales encontrados`);

        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('🚫 Búsqueda global cancelada');
                return;
            }
            
            console.error('❌ Error en búsqueda global:', err);
            
            if (this.dom.globalDropdown) {
                this.dom.globalDropdown.innerHTML = 
                    '<div class="search-error">Error al buscar. Intenta de nuevo.</div>';
            }
        } finally {
            this.state.isGlobalSearching = false;
        }
    }

    renderGlobalResults(productos, query) {
        if (!this.dom.globalDropdown) return;

        if (productos.length === 0) {
            this.dom.globalDropdown.innerHTML = 
                `<div class="search-empty">No se encontraron resultados para "<strong>${window.helpers.escapeHtml(query)}</strong>"</div>`;
            return;
        }

        // Renderizar productos
        const html = productos.map(p => this.buildGlobalResultItem(p, query)).join('');
        
        // Agregar botón "Ver todos"
        const seeAllBtn = `
            <div class="search-see-all" data-query="${window.helpers.escapeHtml(query)}">
                Ver todos los resultados (${productos.length}${productos.length >= this.config.globalLimit ? '+' : ''})
            </div>
        `;

        this.dom.globalDropdown.innerHTML = html + seeAllBtn;

        // Vincular eventos a items individuales
        this.dom.globalDropdown.querySelectorAll('.search-item').forEach(item => {
            this.Events.on(item, 'click', () => {
                const codigo = item.getAttribute('data-codigo');
                if (codigo) {
                    this.executeGlobalSearch(codigo);
                }
            });
        });

        // Vincular evento al botón "Ver todos"
        const seeAll = this.dom.globalDropdown.querySelector('.search-see-all');
        if (seeAll) {
            this.Events.on(seeAll, 'click', () => {
                const q = seeAll.getAttribute('data-query');
                if (q) {
                    this.executeGlobalSearch(q);
                }
            });
        }
    }

    buildGlobalResultItem(producto, query) {
        const img = producto.imagen || window.CONFIG.imagesPath + 'default.jpg';
        const codigo = window.helpers.escapeHtml(producto.codigo || '');
        const tipo = window.helpers.escapeHtml(producto.tipoProducto || '');
        const desc = window.helpers.escapeHtml(producto.descripcion || '');

        return `
            <div class="search-item" data-codigo="${codigo}">
                <img class="search-thumb" src="${img}" alt="${codigo}" 
                     onerror="this.src='${window.CONFIG.imagesPath}default.jpg'">
                <div class="search-text">
                    <div class="line-1">
                        <strong>${codigo}</strong>
                        ${tipo ? `<span class="muted">· ${tipo}</span>` : ''}
                    </div>
                    <div class="line-2">${desc}</div>
                </div>
            </div>
        `;
    }

    executeGlobalSearch(query) {
        console.log('🚀 Ejecutando búsqueda global completa:', query);
        
        this.closeGlobalSearch();
        
        // ✅ Usar guiones para separar múltiples términos
        const terms = query.split(/[,\s]+/).filter(Boolean);
        const cleanQuery = terms.join('-');
        
        // Redirigir a shop.php con parámetro multi
        window.location.href = `${window.CONFIG.baseURL}pages/shop.php?multi=${encodeURIComponent(cleanQuery)}`;
    }

    // ============================================================================
    // 🏠 BÚSQUEDA INTERNA (CATÁLOGO)
    // ============================================================================
    
    initInternalSearch() {
        if (!this.dom.internalInput) {
            console.warn('⚠️ Input de búsqueda interna no encontrado');
            
            // ✅ Observar cuando aparezca el input
            this.observeInternalInput();
            return;
        }

        console.log('🏠 Inicializando búsqueda interna (catálogo)...');

        // ✅ CRÍTICO: Remover listeners existentes clonando el elemento
        const oldInput = this.dom.internalInput;
        const newInput = oldInput.cloneNode(true);
        oldInput.parentNode.replaceChild(newInput, oldInput);
        
        // Actualizar referencia
        this.dom.internalInput = newInput;
        
        console.log('🧹 Listeners antiguos removidos, vinculando nuevos eventos');

        // Input en vivo
        this.Events.on(this.dom.internalInput, 'input', (e) => {
            this.handleInternalInput(e.target.value);
        });

        // Tecla Enter
        this.Events.on(this.dom.internalInput, 'keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.dom.internalInput.value.trim();
                if (query) {
                    this.searchInternal(query);
                }
            }
        });

        console.log('✅ Búsqueda interna inicializada (listeners únicos)');
    }
    
    // ✅ MEJORADO: Buscar input interno con múltiples estrategias
    findInternalInput() {
        // Estrategia 1: Por ID específico (MÁS IMPORTANTE)
        let input = document.getElementById('search-input');
        if (input) {
            console.log('✅ Input encontrado por ID: search-input');
            return input;
        }
        
        // Estrategia 2: Por placeholder (EXCLUYENDO el global)
        const inputs = document.querySelectorAll('input[placeholder*="catálogo"], input[placeholder*="Buscar"]');
        for (let inp of inputs) {
            // Excluir el input global
            if (inp.id !== 'globalSearchInput') {
                console.log('✅ Input encontrado por placeholder:', inp.id);
                return inp;
            }
        }
        
        // Estrategia 3: Por clase o contexto
        input = document.querySelector('.search-input:not(#globalSearchInput)') ||
                document.querySelector('#searchInput') ||
                document.querySelector('[name="search"]');
        if (input) {
            console.log('✅ Input encontrado por clase/nombre');
            return input;
        }
        
        // Estrategia 4: Por contexto (dentro de un contenedor específico)
        const sidebar = document.querySelector('.sidebar') || 
                       document.querySelector('.filter-panel') ||
                       document.querySelector('.left-column') ||
                       document.querySelector('[class*="search-product"]');
        if (sidebar) {
            input = sidebar.querySelector('input[type="text"]') ||
                   sidebar.querySelector('input[type="search"]') ||
                   sidebar.querySelector('input.form-control');
            if (input && input.id !== 'globalSearchInput') {
                console.log('✅ Input encontrado en contenedor:', input.id);
                return input;
            }
        }
        
        console.warn('⚠️ Input de búsqueda interna no encontrado con ninguna estrategia');
        return null;
    }
    
    // ✅ NUEVO: Observar aparición del input interno
    observeInternalInput() {
        console.log('👀 Observando aparición del input de búsqueda interna...');
        
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkInput = setInterval(() => {
            attempts++;
            console.log(`🔍 Intento ${attempts}/${maxAttempts} de encontrar input interno...`);
            
            this.dom.internalInput = this.findInternalInput();
            
            if (this.dom.internalInput) {
                console.log('✅ Input de búsqueda interna detectado');
                clearInterval(checkInput);
                this.initInternalSearch();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Input de búsqueda interna no encontrado después de', maxAttempts, 'intentos');
                console.error('📋 Inputs disponibles en la página:');
                document.querySelectorAll('input').forEach((inp, i) => {
                    console.log(`  Input ${i}:`, {
                        id: inp.id,
                        name: inp.name,
                        type: inp.type,
                        placeholder: inp.placeholder,
                        className: inp.className
                    });
                });
                clearInterval(checkInput);
            }
        }, 300);
    }

    handleInternalInput(value) {
        const query = value.trim();
        
        // Limpiar timer anterior
        clearTimeout(this.timers.internal);

        if (query.length === 0) {
            // Si está vacío, restaurar vista según contexto
            if (window.shopModule) {
                if (window.shopModule.state.currentCategory) {
                    window.shopModule.loadProductsByCategory(
                        window.shopModule.state.currentCategory
                    );
                } else {
                    window.shopModule.loadProducts();
                }
            }
            return;
        }

        if (query.length < this.config.minChars) {
            return;
        }

        // Debounce
        this.timers.internal = setTimeout(() => {
            this.searchInternal(query);
        }, this.config.debounceTime);
    }

    async searchInternal(query, page = 1, append = false) {
        if (this.state.isInternalSearching && !append) {
            console.log('⏳ Búsqueda interna en progreso, cancelando...');
            if (this.controllers.internal) {
                this.controllers.internal.abort();
            }
        }

        console.log(`🔍 Búsqueda interna: "${query}" (página: ${page}, append: ${append})`);

        this.state.isInternalSearching = true;
        this.state.internalQuery = query;
        this.state.currentPage = page;

        try {
            // Crear nuevo AbortController
            this.controllers.internal = new AbortController();
            
            let url;
            
            // ✅ CRÍTICO: Si hay categoría activa, usar productsByCategories.php
            if (window.shopModule && window.shopModule.state.currentCategory) {
                const categoryId = window.shopModule.state.currentCategory;
                
                console.log('📂 Búsqueda con filtros activos:', {
                    categoria: categoryId,
                    subcategorias: Array.from(window.shopModule.state.selectedSubcategories)
                });
                
                // Usar productsByCategories.php que respeta filtros
                url = `${window.CONFIG.apiURL}productsByCategories.php?category_id=${categoryId}&page=${page}&limit=${this.config.internalLimit}`;
                
                // Agregar subcategorías si están activas
                if (window.shopModule.state.selectedSubcategories.size > 0) {
                    const subIds = Array.from(window.shopModule.state.selectedSubcategories);
                    subIds.forEach(id => {
                        url += `&subcategory_ids[]=${id}`;
                    });
                }
                
                // ✅ Agregar búsqueda al final (filtrado del lado del servidor)
                url += `&q=${encodeURIComponent(query)}`;
                
            } else {
                // Sin filtros, buscar en toda la DB
                url = `${window.CONFIG.apiURL}products.php?q=${encodeURIComponent(query)}&page=${page}&limit=${this.config.internalLimit}`;
            }

            console.log('📡 URL búsqueda interna:', url);

            const response = await fetch(url, {
                signal: this.controllers.internal.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            const productos = data.productos || [];
            this.state.totalPages = data.total_paginas || 1;
            this.state.internalResults = append 
                ? [...this.state.internalResults, ...productos]
                : productos;

            // Renderizar usando helpers
            window.helpers.renderProducts(productos, append);

            // Actualizar botón "Cargar más"
            this.updateLoadMoreButton();

            // Actualizar modo en shopModule si existe
            if (window.shopModule) {
                window.shopModule.state.currentMode = 'search';
                window.shopModule.state.searchQuery = query;
            }

            console.log(`✅ ${productos.length} resultados internos encontrados (total: ${data.total || productos.length})`);

        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('🚫 Búsqueda interna cancelada');
                return;
            }
            
            console.error('❌ Error en búsqueda interna:', err);
            this.showError('Error al buscar productos');
        } finally {
            this.state.isInternalSearching = false;
        }
    }

    updateLoadMoreButton() {
        if (!this.dom.loadMoreBtn) return;

        if (this.state.currentPage >= this.state.totalPages) {
            this.dom.loadMoreBtn.style.display = 'none';
        } else {
            this.dom.loadMoreBtn.style.display = 'inline-block';
            this.dom.loadMoreBtn.disabled = this.state.isInternalSearching;
        }

        console.log('🔄 Botón "Cargar más" actualizado:', {
            visible: this.state.currentPage < this.state.totalPages,
            disabled: this.state.isInternalSearching
        });
    }

    // ============================================================================
    // 🔗 RESTAURAR DESDE URL
    // ============================================================================
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const multiParam = urlParams.get('multi');

        if (multiParam) {
            console.log('🔄 Detectado parámetro multi en URL:', multiParam);
            
            // Convertir "stitch-peluche" → "stitch peluche"
            const query = multiParam.replace(/-/g, ' ');
            
            // Esperar a que el DOM esté listo
            setTimeout(() => {
                this.searchFromUrl(query);
            }, 500);
        }
    }

    async searchFromUrl(query) {
        console.log('🔍 Ejecutando búsqueda desde URL:', query);

        if (!this.dom.productsContainer) {
            console.error('❌ Contenedor de productos no encontrado');
            return;
        }

        // Mostrar loading
        this.dom.productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="zmdi zmdi-spinner zmdi-hc-spin zmdi-hc-3x mb-3"></i>
                <h5>Buscando productos...</h5>
                <p class="text-muted">Buscando: <strong>${window.helpers.escapeHtml(query)}</strong></p>
            </div>
        `;

        try {
            // Usar globalSearch.php para búsqueda multi-término
            const terms = query.split(/[\s-]+/).filter(Boolean);
            const url = `${window.CONFIG.apiURL}globalSearch.php?multi=${encodeURIComponent(terms.join(','))}&limit=100`;

            console.log('📡 URL:', url);

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (!data || data.status !== 'ok') {
                throw new Error('Respuesta inválida del servidor');
            }

            const productos = data.data?.productos || [];

            if (productos.length === 0) {
                this.dom.productsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="zmdi zmdi-search zmdi-hc-4x text-muted mb-3"></i>
                        <h4>No se encontraron productos</h4>
                        <p class="text-muted">Intenta con otros términos de búsqueda</p>
                    </div>
                `;
                return;
            }

            // Renderizar productos
            window.helpers.renderProducts(productos, false);

            // Ocultar botón "Cargar más" (ya se cargaron todos)
            if (this.dom.loadMoreBtn) {
                this.dom.loadMoreBtn.style.display = 'none';
            }

            console.log(`✅ ${productos.length} productos mostrados desde URL`);

        } catch (err) {
            console.error('❌ Error buscando desde URL:', err);
            this.showError('Error al cargar resultados de búsqueda');
        }
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

export default SearchModule;

console.log('✅ search.module.js cargado correctamente');