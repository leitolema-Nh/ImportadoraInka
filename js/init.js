// ============================================================================
// 🚀 init.js - Inicializador Global de la Aplicación (CORREGIDO)
// ============================================================================
// ✅ CAMBIO PRINCIPAL: search.module.js ahora se carga GLOBALMENTE
// ✅ Funciona en index.php, shop.php y cualquier otra página
// ============================================================================

console.log('🚀 init.js cargando...');

const GlobalApp = {
    
    // ============================================================================
    // 🎬 INICIALIZACIÓN PRINCIPAL
    // ============================================================================
    
    init() {
        console.log('🎬 GlobalApp: Iniciando aplicación...');
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.start();
            });
        } else {
            this.start();
        }
    },

    start() {
        console.log('✅ DOM listo, iniciando componentes...');
        
        // Inicializar componentes globales
        this.initGlobalComponents();
        
        // Detectar página y cargar módulo específico
        this.detectPageAndLoadModule();
        
        console.log('✅ GlobalApp inicializado correctamente');
    },

    // ============================================================================
    // 🌐 COMPONENTES GLOBALES (presentes en todas las páginas)
    // ============================================================================
    
    initGlobalComponents() {
        console.log('🌐 Inicializando componentes globales...');
        
        // Componentes del header
        this.initMobileMenu();
        this.initSearchOverlay();
        this.initCartIcon();
        
        // Componentes del footer
        this.initScrollToTop();
        
        // ✅ NUEVO: Cargar módulo de búsqueda globalmente
        this.loadSearchModule();
        
        console.log('✅ Componentes globales inicializados');
    },

    // ============================================
    // 📱 MENÚ MÓVIL
    // ============================================
    
    initMobileMenu() {
        const hamburger = document.querySelector('.btn-show-menu-mobile');
        const mobileMenu = document.querySelector('.menu-mobile');
        
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                console.log('🍔 Toggle menú móvil');
                this.classList.toggle('is-active');
                mobileMenu.classList.toggle('show');
            });
            
            console.log('✅ Menú móvil inicializado');
        }
    },

    // ============================================
    // 🔍 OVERLAY DE BÚSQUEDA
    // ============================================
    
    initSearchOverlay() {
        const searchBtns = document.querySelectorAll('.js-show-search');
        const searchOverlay = document.getElementById('global-search-overlay');
        const closeBtn = document.getElementById('closeGlobalSearch');
        
        if (searchBtns.length > 0 && searchOverlay) {
            searchBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🔍 Abriendo overlay de búsqueda');
                    searchOverlay.classList.add('active');
                    
                    // Focus en input después de abrir
                    setTimeout(() => {
                        const input = document.getElementById('globalSearchInput');
                        if (input) input.focus();
                    }, 100);
                });
            });
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    console.log('❌ Cerrando overlay de búsqueda');
                    searchOverlay.classList.remove('active');
                });
            }
            
            // Cerrar con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active');
                }
            });
            
            // Cerrar al hacer click fuera
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            });
            
            console.log('✅ Overlay de búsqueda inicializado');
        }
    },

    // ============================================
    // 🛒 ICONO DEL CARRITO
    // ============================================
    
    initCartIcon() {
        const cartBtn = document.querySelector('.js-show-cart');
        const cartPanel = document.querySelector('.js-panel-cart');
        const closeCart = document.querySelector('.js-hide-cart');
        
        if (cartBtn && cartPanel) {
            cartBtn.addEventListener('click', () => {
                console.log('🛒 Abriendo carrito');
                cartPanel.classList.add('show-header-cart');
            });
            
            if (closeCart) {
                closeCart.addEventListener('click', () => {
                    console.log('❌ Cerrando carrito');
                    cartPanel.classList.remove('show-header-cart');
                });
            }
            
            console.log('✅ Carrito inicializado');
        }
    },

    // ============================================
    // ⬆️ SCROLL TO TOP
    // ============================================
    
    initScrollToTop() {
        const btnTop = document.getElementById('myBtn');
        
        if (btnTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    btnTop.style.display = 'flex';
                } else {
                    btnTop.style.display = 'none';
                }
            });
            
            btnTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            console.log('✅ Scroll to top inicializado');
        }
    },

    // ============================================================================
    // 🔍 CARGAR MÓDULO DE BÚSQUEDA (GLOBAL)
    // ============================================================================
    
    loadSearchModule() {
        console.log('🔍 Cargando search.module.js globalmente...');
        
        import('./modules/search.module.js')
            .then(module => {
                const SearchModule = module.default || module.SearchModule;
                const search = new SearchModule();
                search.init();
                
                // Guardar referencia global
                window.searchModule = search;
                
                console.log('✅ search.module.js cargado e inicializado globalmente');
            })
            .catch(err => {
                console.error('❌ Error cargando search.module.js:', err);
            });
    },

    // ============================================================================
    // 🎯 DETECCIÓN DE PÁGINA Y CARGA DE MÓDULOS
    // ============================================================================
    
    detectPageAndLoadModule() {
        const body = document.body;
        
        console.log('🔎 Detectando página actual...');
        console.log('   Body classes:', body.className);
        
        // ✅ Página de catálogo (shop.php)
        if (body.classList.contains('shop-page')) {
            console.log('🛍️ Página detectada: SHOP');
            this.loadShopModule();
            return;
        }
        
        // ✅ Página de inicio (index.php)
        if (body.classList.contains('home-page')) {
            console.log('🏠 Página detectada: HOME');
            this.loadHomeModule();
            return;
        }
        
        // ✅ Página de producto individual
        if (body.classList.contains('product-page')) {
            console.log('📦 Página detectada: PRODUCT');
            this.loadProductModule();
            return;
        }
        
        console.log('ℹ️ Página sin módulo específico');
    },

    // ============================================
    // 🛍️ CARGAR MÓDULO DE SHOP
    // ============================================
    
    loadShopModule() {
        console.log('📦 Cargando shop.module.js...');
        
        // ✅ CAMBIO: Ya no carga search.module.js aquí (se carga globalmente)
        import('./modules/shop.module.js')
            .then(module => {
                const ShopModule = module.default || module.ShopModule;
                const shop = new ShopModule();
                shop.init();
                
                // Guardar referencia global
                window.shopModule = shop;
                
                console.log('✅ shop.module.js cargado e inicializado');
            })
            .catch(err => {
                console.error('❌ Error cargando shop.module.js:', err);
            });
    },

    // ============================================
    // 🏠 CARGAR MÓDULO DE HOME
    // ============================================
    
    loadHomeModule() {
        console.log('📦 Cargando home.module.js...');
        
        // TODO: Implementar cuando sea necesario
        console.log('ℹ️ home.module.js aún no implementado');
    },

    // ============================================
    // 📦 CARGAR MÓDULO DE PRODUCTO
    // ============================================
    
    loadProductModule() {
        console.log('📦 Cargando product.module.js...');
        
        // TODO: Implementar cuando sea necesario
        console.log('ℹ️ product.module.js aún no implementado');
    }
};

// ============================================================================
// 🚀 EJECUTAR INICIALIZACIÓN
// ============================================================================

GlobalApp.init();

console.log('✅ init.js cargado correctamente');