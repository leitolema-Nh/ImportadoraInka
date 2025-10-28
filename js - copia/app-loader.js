/**
 * ============================================================
 * APP-LOADER.JS - Sistema de Carga de Scripts
 * ============================================================
 * Importadora INKA
 * 
 * Este archivo maneja:
 * - Detección automática de baseURL
 * - Creación del objeto CONFIG global
 * - Carga secuencial de todos los scripts
 * - Parches y optimizaciones
 * ============================================================
 */

(function() {
  'use strict';

  console.log('🚀 APP-LOADER iniciando...');

  // ========================================
  // PASO 1: DETECTAR Y CONFIGURAR BASE URL
  // ========================================
  function detectBaseURL() {
    let base = "/";
    const parts = window.location.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("inka");
    
    if (idx >= 0) {
      base = "/" + parts[idx] + "/";
    } else if (parts[0] && parts[0] !== "pages") {
      base = "/" + parts[0] + "/";
    }
    
    return base;
  }

  const baseURL = detectBaseURL();
  console.log('✅ Base URL detectada:', baseURL);

  // ========================================
  // PASO 2: CREAR OBJETO CONFIG GLOBAL
  // ========================================
  window.CONFIG = {
    baseURL: baseURL,
    apiPath: baseURL + "pages/",
    endpoints: {
      categories: 'categories.php',
      subcategories: 'subcategories.php',
      products: 'products.php',
      productsByCategory: 'productsByCategories.php',
      search: 'search.php'
    }
  };
  
  console.log('✅ CONFIG creado:', window.CONFIG);

  // ========================================
  // PASO 3: LISTA DE SCRIPTS A CARGAR
  // ========================================
  const scripts = [
    "vendor/jquery/jquery-3.2.1.min.js",
    "vendor/bootstrap/js/popper.min.js",
    "vendor/bootstrap/js/bootstrap.min.js",
    "vendor/animsition/js/animsition.min.js",
    "vendor/select2/select2.min.js",
    "vendor/daterangepicker/moment.min.js",
    "vendor/daterangepicker/daterangepicker.js",
    "vendor/slick/slick.min.js",
    "js/slick-custom.js",
    "vendor/MagnificPopup/jquery.magnific-popup.min.js",
    "vendor/isotope/isotope.pkgd.min.js",
    "vendor/sweetalert/sweetalert.min.js",
    "vendor/perfect-scrollbar/perfect-scrollbar.min.js",
    "js/helpers.js",
    "js/main.js",
    "js/header.js",
    "js/footer.js",
    "js/categories.js",
    "js/products.js",
    "js/productsByCategories.js",
    "js/subcategories.js",
    "js/shopModal.js",
    "js/search.js",
    "js/share.js",
    "js/shopCodeFilter.js",
    "js/globalSearch.js"
  ];

  // ========================================
  // PASO 4: CARGA SECUENCIAL DE SCRIPTS
  // ========================================
  let currentIndex = 0;
  let loadedCount = 0;
  let errorCount = 0;

  function loadNextScript() {
    if (currentIndex >= scripts.length) {
      console.log('✅ Carga completada:', loadedCount, 'OK,', errorCount, 'errores');
      verificarDependencias();
      aplicarParches();
      configurarLinksFooter();
      return;
    }

    const scriptPath = scripts[currentIndex];
    const fullPath = baseURL + scriptPath;
    
    console.log('📥 [' + (currentIndex + 1) + '/' + scripts.length + '] Cargando:', scriptPath);

    const script = document.createElement("script");
    script.src = fullPath;

    script.onload = function() {
      console.log('  ✅ OK:', scriptPath);
      loadedCount++;
      currentIndex++;
      loadNextScript();
    };

    script.onerror = function() {
      console.error('  ❌ ERROR:', scriptPath, '- URL:', fullPath);
      errorCount++;
      currentIndex++;
      loadNextScript();
    };

    document.body.appendChild(script);
  }

  // ========================================
  // PASO 5: VERIFICAR DEPENDENCIAS CRÍTICAS
  // ========================================
  function verificarDependencias() {
    setTimeout(function() {
      console.log('🔍 Verificación de dependencias:');
      console.log('  - CONFIG:', typeof window.CONFIG !== 'undefined' ? '✅' : '❌');
      console.log('  - helpers:', typeof window.helpers !== 'undefined' ? '✅' : '❌');
      console.log('  - jQuery:', typeof $ !== 'undefined' ? '✅' : '❌');
      
      if (typeof window.helpers === 'undefined') {
        console.error('❌ CRÍTICO: helpers.js no se cargó correctamente');
      }
    }, 500);
  }

  // ========================================
  // PASO 6: APLICAR PARCHES
  // ========================================
  function aplicarParches() {
    console.log('🔧 Aplicando parche de eventos pasivos...');
    
    if (typeof jQuery === 'undefined') {
      console.warn('⚠️ jQuery no está disponible para el parche');
      return;
    }

    const originalOn = jQuery.fn.on;

    jQuery.fn.on = function() {
      const args = Array.prototype.slice.call(arguments);
      const eventName = args[0];

      if (eventName === 'touchstart' || eventName === 'touchmove') {
        if (args.length >= 2 && typeof args[args.length - 1] === 'function') {
          const originalHandler = args[args.length - 1];
          
          args[args.length - 1] = function(e) {
            if (e.originalEvent && typeof e.originalEvent.preventDefault !== 'undefined') {
              try {
                Object.defineProperty(e.originalEvent, 'passive', {
                  get: function() { return true; }
                });
              } catch(err) {
                // Ignorar silenciosamente
              }
            }
            return originalHandler.apply(this, arguments);
          };
        }
      }

      return originalOn.apply(this, args);
    };

    console.log('✅ Parche de eventos pasivos aplicado');
  }

  // ========================================
  // PASO 7: CONFIGURAR LINKS DEL FOOTER
  // ========================================
  function configurarLinksFooter() {
    const links = {
      "footer-link-inicio": "pages/index.php",
      "footer-link-productos": "pages/shop.php",
      "footer-link-nosotros": "pages/about.php",
      "footer-link-contacto": "pages/contacto.php"
    };

    for (const id in links) {
      const element = document.getElementById(id);
      if (element) {
        element.href = baseURL + links[id];
        console.log('🔗 Link configurado:', id, '→', baseURL + links[id]);
      }
    }
  }

  // ========================================
  // INICIAR CARGA CUANDO EL DOM ESTÉ LISTO
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('✅ DOM Ready - Iniciando carga de scripts');
      loadNextScript();
    });
  } else {
    console.log('✅ DOM ya está listo - Iniciando carga de scripts');
    loadNextScript();
  }

  // ========================================
  // VERIFICACIÓN FINAL AL CARGAR TODO
  // ========================================
  window.addEventListener('load', function() {
    console.log('✅ Window load completo');
    console.log('✅ APP-LOADER completado exitosamente');
  });

})();