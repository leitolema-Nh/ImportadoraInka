/**
 * ============================================================
 * INIT.JS - Punto de Entrada Único
 * ============================================================
 * ✅ Orquesta la carga e inicialización de todos los módulos
 * ✅ Se ejecuta DESPUÉS de que el DOM está listo
 * ✅ Carga scripts en el orden correcto
 * ============================================================
 */

(function() {
  'use strict';

  console.log('🚀 Iniciando aplicación Importadora INKA...');

  // ========================================
  // CONFIGURACIÓN DE SCRIPTS
  // ========================================
  const SCRIPTS = {
    // Vendor (dependencias - jQuery y Bootstrap deben ir primero)
    vendor: [
      'vendor/jquery/jquery-3.2.1.min.js',
      'vendor/bootstrap/js/popper.min.js',
      'vendor/bootstrap/js/bootstrap.min.js',
      'vendor/animsition/js/animsition.min.js',
      'vendor/select2/select2.min.js',
      'vendor/daterangepicker/moment.min.js',
      'vendor/daterangepicker/daterangepicker.js',
      'vendor/slick/slick.min.js',
      'vendor/MagnificPopup/jquery.magnific-popup.min.js',
      'vendor/isotope/isotope.pkgd.min.js',
      'vendor/sweetalert/sweetalert.min.js',
      'vendor/perfect-scrollbar/perfect-scrollbar.min.js'
    ],

    // Site (lógica del sitio)
    site: [
      'js/slick-custom.js',
      'js/main.js'
    ],

    // Modules (ORDEN IMPORTANTE: SearchModule primero)
    modules: [
      'js/modules/search.module.js',  // ✅ PRIMERO: SearchModule
      'js/modules/header.module.js',  // ✅ SEGUNDO: HeaderModule (depende de SearchModule)
      'js/modules/footer.module.js'   // ✅ TERCERO: FooterModule
    ],

    // Features (funcionalidades específicas)
    features: [
      'js/categories.js',
      'js/products.js',
      'js/productsByCategories.js',
      'js/subcategories.js',
      'js/shopModal.js',
      'js/share.js',
      'js/shopCodeFilter.js'
    ]
  };

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  async function init() {
    try {
      // Esperar a que DOMManager, EventManager y ScriptLoader estén listos
      await waitForDependencies();

      console.log('📦 Cargando scripts vendor...');
      await window.ScriptLoader.loadSequence(
        SCRIPTS.vendor, 
        window.CONFIG.baseURL
      );

      console.log('📦 Cargando scripts del sitio...');
      await window.ScriptLoader.loadSequence(
        SCRIPTS.site, 
        window.CONFIG.baseURL
      );

      console.log('📦 Cargando módulos...');
      await window.ScriptLoader.loadSequence(
        SCRIPTS.modules, 
        window.CONFIG.baseURL
      );

      console.log('📦 Cargando features...');
      await window.ScriptLoader.loadSequence(
        SCRIPTS.features, 
        window.CONFIG.baseURL
      );

      // Inicializar módulos
      console.log('🔧 Inicializando módulos...');
      initModules();

      console.log('✅ Aplicación inicializada correctamente');

    } catch (error) {
      console.error('❌ Error durante la inicialización:', error);
    }
  }

  // ========================================
  // ESPERAR DEPENDENCIAS
  // ========================================
  function waitForDependencies() {
    return new Promise((resolve) => {
      const check = () => {
        if (window.DOMManager && window.EventManager && window.ScriptLoader && window.CONFIG) {
          console.log('✅ Core dependencies listas');
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  // ========================================
  // INICIALIZAR MÓDULOS
  // ========================================
  function initModules() {
    // SearchModule - PRIMERO
    if (window.SearchModule) {
      console.log('🔍 Inicializando SearchModule...');
      window.SearchModule.init();
    } else {
      console.warn('⚠️ SearchModule no disponible');
    }

    // Header - SEGUNDO (después de SearchModule)
    if (window.HeaderModule) {
      console.log('📄 Inicializando HeaderModule...');
      window.HeaderModule.init();
    } else {
      console.warn('⚠️ HeaderModule no disponible');
    }

    // Footer
    if (window.FooterModule) {
      console.log('🦶 Inicializando FooterModule...');
      window.FooterModule.init();
    } else {
      console.warn('⚠️ FooterModule no disponible');
    }

    // Detectar página actual e inicializar funcionalidad específica
    const page = detectPage();
    
    if (page === 'shop') {
      initShopPage();
    } else if (page === 'home') {
      initHomePage();
    }
  }

  // ========================================
  // DETECTAR PÁGINA ACTUAL
  // ========================================
  function detectPage() {
    const path = window.location.pathname;
    
    if (path.includes('shop.php')) return 'shop';
    if (path.includes('index.php') || path === '/') return 'home';
    if (path.includes('about.php')) return 'about';
    if (path.includes('contacto.php')) return 'contact';
    
    return 'unknown';
  }

  // ========================================
  // INICIALIZAR PÁGINA SHOP
  // ========================================
  function initShopPage() {
    console.log('🛍️ Inicializando página Shop...');
    
    // Botón de filtros
    const filterBtn = window.DOMManager.get('.js-show-filter');
    const filterPanel = window.DOMManager.getById('filterPanel');
    
    if (filterBtn && filterPanel) {
      window.EventManager.on(filterBtn, 'click', () => {
        filterPanel.classList.toggle('dis-none');
      });
    }

    // Input de refinamiento
    const refineInput = window.DOMManager.getById('refineInput');
    if (refineInput) {
      window.EventManager.on(refineInput, 'input', (e) => {
        const term = e.target.value.toLowerCase();
        const products = window.DOMManager.getAll('#products-container .block2');
        
        products.forEach(card => {
          const text = card.innerText.toLowerCase();
          card.style.display = text.includes(term) ? '' : 'none';
        });
      });
    }
  }

  // ========================================
  // INICIALIZAR PÁGINA HOME
  // ========================================
  function initHomePage() {
    console.log('🏠 Inicializando página Home...');
    // Lógica específica de home si es necesaria
  }

  // ========================================
  // EJECUTAR AL CARGAR DOM
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

console.log('✅ init.js loaded');