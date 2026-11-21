// ============================================================================
// 🚀 init.js - Inicializador Global de la Aplicación
// ============================================================================
// ✅ Módulos globales: search.module.js + productModal.module.js
// ✅ Sistema modular con detección automática de página
// ✅ Mobile First & Responsive
// ============================================================================

console.log('🚀 init.js cargando...');

const GlobalApp = {
    
    // ============================================================================
    // 🎬 INICIALIZACIÓN PRINCIPAL
    // ============================================================================
    
    init() {
        console.log('🎬 GlobalApp: Iniciando aplicación...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },

    start() {
        console.log('✅ DOM listo, iniciando componentes...');
        
        this.initGlobalComponents();
        this.detectPageAndLoadModule();
        
        console.log('✅ GlobalApp inicializado correctamente');
    },

    // ============================================================================
    // 🌐 COMPONENTES GLOBALES
    // ============================================================================
    
    initGlobalComponents() {
        console.log('🌐 Inicializando componentes globales...');
        
        // Header
        this.initMobileMenu();
        this.initSearchOverlay();
        this.initCartIcon();
        
        // Footer
        this.initScrollToTop();
        
        // Módulos globales
        this.loadSearchModule();
        this.loadModalModule();
        
        console.log('✅ Componentes globales inicializados');
    },

    // ============================================================================
    // 📱 MENÚ MÓVIL
    // ============================================================================
    
    initMobileMenu() {
        const hamburger = document.querySelector('.btn-show-menu-mobile');
        const mobileMenu = document.querySelector('.menu-mobile');
        
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('is-active');
                mobileMenu.classList.toggle('show');
            });
            
            console.log('✅ Menú móvil inicializado');
        }
    },

    // ============================================================================
    // 🔍 OVERLAY DE BÚSQUEDA
    // ============================================================================
    
    initSearchOverlay() {
        const searchBtns = document.querySelectorAll('.js-show-search');
        const searchOverlay = document.getElementById('global-search-overlay');
        const closeBtn = document.getElementById('closeGlobalSearch');
        
        if (searchBtns.length > 0 && searchOverlay) {
            // Abrir overlay
            searchBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    searchOverlay.classList.add('active');
                    
                    setTimeout(() => {
                        const input = document.getElementById('globalSearchInput');
                        if (input) input.focus();
                    }, 100);
                });
            });
            
            // Cerrar con botón
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    searchOverlay.classList.remove('active');
                });
            }
            
            // Cerrar con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active');
                }
            });
            
            // Cerrar con click fuera
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                }
            });
            
            console.log('✅ Overlay de búsqueda inicializado');
        }
    },

    // ============================================================================
    // 🛒 CARRITO
    // ============================================================================
    
    initCartIcon() {
        const cartBtn = document.querySelector('.js-show-cart');
        const cartPanel = document.querySelector('.js-panel-cart');
        const closeCart = document.querySelector('.js-hide-cart');
        
        if (cartBtn && cartPanel) {
            cartBtn.addEventListener('click', () => {
                cartPanel.classList.add('show-header-cart');
            });
            
            if (closeCart) {
                closeCart.addEventListener('click', () => {
                    cartPanel.classList.remove('show-header-cart');
                });
            }
            
            console.log('✅ Carrito inicializado');
        }
    },

    // ============================================================================
    // ⬆️ SCROLL TO TOP
    // ============================================================================
    
    initScrollToTop() {
        const btnTop = document.getElementById('myBtn');
        
        if (btnTop) {
            window.addEventListener('scroll', () => {
                btnTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
            });
            
            btnTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            console.log('✅ Scroll to top inicializado');
        }
    },

    // ============================================================================
    // 🔍 MÓDULO DE BÚSQUEDA (GLOBAL)
    // ============================================================================
    
    loadSearchModule() {
        console.log('🔍 Cargando search.module.js globalmente...');
        
        import('./modules/search.module.js')
            .then(module => {
                const SearchModule = module.default || module.SearchModule;
                const search = new SearchModule();
                search.init();
                
                window.searchModule = search;
                
                console.log('✅ search.module.js cargado e inicializado');
            })
            .catch(err => {
                console.error('❌ Error cargando search.module.js:', err);
            });
    },

    // ============================================================================
    // 🎭 MÓDULO DE MODAL (GLOBAL)
    // ============================================================================
    
    loadModalModule() {
        console.log('🎭 Cargando productModal.module.js globalmente...');
        
        import('./modules/productModal.module.js?v=20261122a')
            .then(module => {
                const ModalModule = module.default || module.ModalModule;
                const modal = new ModalModule();
                modal.init();
                
                window.modalModule = modal;
                
                console.log('✅ productModal.module.js cargado e inicializado');
            })
            .catch(err => {
                console.error('❌ Error cargando productModal.module.js:', err);
            });
    },

    // ============================================================================
    // 🎯 DETECCIÓN DE PÁGINA
    // ============================================================================
    
    detectPageAndLoadModule() {
        const body = document.body;
        
        console.log('🔎 Detectando página actual...');
        console.log('   Body classes:', body.className);
        
        if (body.classList.contains('shop-page')) {
            console.log('🛍️ Página detectada: SHOP');
            this.loadShopModule();
            return;
        }
        
        if (body.classList.contains('home-page')) {
            console.log('🏠 Página detectada: HOME');
            this.loadHomeModule();
            return;
        }
        
        if (body.classList.contains('product-page')) {
            console.log('📦 Página detectada: PRODUCT');
            this.loadProductModule();
            return;
        }
        
        console.log('ℹ️ Página sin módulo específico');
    },

    // ============================================================================
    // 🛍️ MÓDULO DE SHOP
    // ============================================================================
    
    loadShopModule() {
        console.log('📦 Cargando shop.module.js...');
        
        import('./modules/shop.module.js?v=20261121c')
            .then(module => {
                const ShopModule = module.default || module.ShopModule;
                const shop = new ShopModule();
                shop.init();
                
                window.shopModule = shop;
                
                console.log('✅ shop.module.js cargado e inicializado');
            })
            .catch(err => {
                console.error('❌ Error cargando shop.module.js:', err);
            });
    },

    // ============================================================================
    // 🏠 MÓDULO DE HOME
    // ============================================================================
    
    loadHomeModule() {
        console.log('📦 Cargando home.module.js...');
        console.log('ℹ️ home.module.js aún no implementado');
    },

    // ============================================================================
    // 📦 MÓDULO DE PRODUCTO
    // ============================================================================
    
    loadProductModule() {
        console.log('📦 Cargando product.module.js...');
        console.log('ℹ️ product.module.js aún no implementado');
    }
};

// ============================================================================
// 🚀 EJECUTAR
// ============================================================================

GlobalApp.init();

console.log('✅ init.js cargado correctamente');