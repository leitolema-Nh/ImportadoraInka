// ===================================================
// 🔧 helpers.js — UTILIDADES GLOBALES (Con Managers)
// ===================================================

console.log('🔧 helpers.js cargando...');

// ============================================
// 🌍 CONFIGURACIÓN GLOBAL (Fallback)
// ============================================
window.CONFIG = window.CONFIG || (function() {
  var baseTag = document.querySelector('base');
  if (baseTag && baseTag.href) {
    var u = new URL(baseTag.href, location.href);
    var basePath = (u.pathname || '/').replace(/\/?$/, '/');
    return {
      baseURL: u.origin + basePath,
      apiURL: u.origin + basePath + 'api/',
      imagesPath: u.origin + basePath + 'images/',
      filesPath: u.origin + basePath + 'files/'
    };
  }

  var script = document.currentScript || (function() {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();

  if (script && script.src) {
    try {
      var u = new URL(script.src, location.href);
      var pathname = u.pathname.replace(/\/+$/, '');
      var idx = pathname.indexOf('/js/');
      var projectPath = '/';

      if (idx > 0) {
        projectPath = pathname.substring(0, idx + 1);
      } else if (idx === 0) {
        var pageParts = location.pathname.split('/').filter(function(p){ return p; });
        var firstPage = pageParts[0] || '';
        if (firstPage && firstPage !== 'js' && firstPage !== 'pages' && firstPage !== 'api') {
          projectPath = '/' + firstPage + '/';
        } else {
          projectPath = '/';
        }
      } else {
        var parts = pathname.split('/').filter(function(p){ return p; });
        if (parts.length > 1) {
          projectPath = '/' + parts[0] + '/';
        } else {
          projectPath = '/';
        }
      }

      var pagePartsForProject = location.pathname.split('/').filter(function(p){ return p; });
      if (pagePartsForProject.length && pagePartsForProject[0] !== 'js' && pagePartsForProject[0] !== projectPath.replace(/\//g, '')) {
        var candidate = '/' + pagePartsForProject[0] + '/';
        if (candidate !== projectPath) {
          projectPath = candidate;
        }
      }

      var base = u.origin + projectPath;
      base = base.replace(/([^:]\/)\/+/g, '$1');
      return {
        baseURL: base,
        apiURL: base + 'api/',
        imagesPath: base + 'images/',
        filesPath: base + 'files/'
      };
    } catch (e) {
      console.warn('⚠️ helpers.js: error parseando script.src:', e.message);
    }
  }

  var protocol = location.protocol;
  var host = location.host;
  var pathname = location.pathname || '/';
  var parts = pathname.split('/').filter(function(p) { return p; });
  var first = parts[0] || '';

  var hostname = location.hostname;
  var isLocal = /^(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3})$/.test(hostname);

  var projectSegment = '/';
  if (isLocal && first && first !== 'pages' && first !== 'api') {
    projectSegment = '/' + first + '/';
  }

  var base = protocol + '//' + host.replace(/\/$/, '') + projectSegment;
  base = base.replace(/([^:]\/)\/+/g, '$1');

  console.warn('⚠️ CONFIG no encontrado, usando fallback:', base);
  return {
    baseURL: base,
    apiURL: base + 'api/',
    imagesPath: base + 'images/',
    filesPath: base + 'files/'
  };
})();

// ============================================
// 🧰 FUNCIONES GLOBALES
// ============================================
window.helpers = {
  
  /**
   * 📡 Fetch JSON desde API
   * Usado en: shop.php, index.php, product.php, etc.
   */
  fetchJSON: function(endpoint) {
    var url = window.CONFIG.apiURL + endpoint;
    console.log('📡 fetchJSON:', url);
    
    return fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .catch(function(err) {
        console.error('❌ fetchJSON error:', err);
        return null;
      });
  },

  /**
   * 🔒 Escapar HTML para prevenir XSS
   * Usado en: Cualquier lugar que renderice texto del usuario
   */
  escapeHtml: function(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
  },

  /**
   * 💰 Formatear precio
   * Usado en: Todas las vistas de productos (shop, home, product detail)
   */
  formatPrice: function(price) {
    var num = parseFloat(price || 0);
    return 'RD$ ' + num.toFixed(2);
  },

  /**
   * 🔗 Actualizar parámetros de URL sin recargar
   * ✅ CORREGIDO: Usa guiones (-) en lugar de comas para subcategorías
   * ✅ MEJORADO: Limpia cualquier parámetro que se pase como null
   * Usado en: Filtros, paginación, búsqueda
   */
  updateUrlParams: function(params) {
    var url = new URL(window.location);
    
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          // ✅ Eliminar parámetro si es null/undefined/vacío
          url.searchParams.delete(key);
        } else {
          // ✅ Si es el parámetro subcat, reemplazar comas por guiones
          var value = params[key];
          if (key === 'subcat' && typeof value === 'string') {
            value = value.replace(/,/g, '-');
          }
          url.searchParams.set(key, value);
        }
      }
    }
    
    window.history.replaceState({}, '', url);
  },

  /**
   * 🎨 RENDERIZAR PRODUCTOS EN EL GRID
   * ✅ MIGRADO: Usa DOMManager si está disponible
   * Llama al endpoint PHP que retorna HTML renderizado
   */
  renderProducts: function(items, append) {
    append = append || false;
    
    // ✅ LOG: Detectar quién llama a renderProducts
    console.log('🎨 renderProducts llamado:', {
      productos: items?.length || 0,
      append: append,
      stackTrace: new Error().stack.split('\n')[2] // Ver quién llamó
    });
    
    // ✅ Intentar usar DOMManager, fallback a getElementById
    var DOM = window.DOMManager;
    var container = DOM && DOM.getById 
      ? DOM.getById('products-container') 
      : document.getElementById('products-container');
    
    if (!container) {
      console.error('❌ #products-container no encontrado');
      return;
    }

    console.log('🎨 Renderizando ' + (items ? items.length : 0) + ' productos (append: ' + append + ')');

    if (!append) {
      container.innerHTML = '';
    }

    if (!Array.isArray(items) || items.length === 0) {
      if (!append) {
        container.innerHTML = 
          '<div class="col-12 text-center py-5">' +
          '<i class="zmdi zmdi-inbox zmdi-hc-4x text-muted mb-3"></i>' +
          '<h4 class="text-muted">No se encontraron productos</h4>' +
          '</div>';
      }
      console.log('⚠️ No hay productos para renderizar');
      return;
    }

    // ✅ Llamar al endpoint PHP que renderiza el HTML
    fetch(window.CONFIG.apiURL + 'renderProductCard.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productos: items })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function(html) {
      // Insertar HTML en el contenedor
      if (append) {
        container.insertAdjacentHTML('beforeend', html);
      } else {
        container.innerHTML = html;
      }
      
      console.log('✅ ' + items.length + ' productos renderizados desde PHP');
      
      // Inicializar Isotope si está disponible
      setTimeout(function() {
        if (window.$ && $.fn.isotope) {
          try {
            var $container = $(container);
            
            if ($container.data('isotope')) {
              $container.isotope('reloadItems').isotope();
              console.log('✅ Isotope recargado');
            } else {
              $container.isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true
              });
              console.log('✅ Isotope inicializado');
            }
          } catch (e) {
            console.warn('⚠️ Isotope error:', e.message);
          }
        }
      }, 100);
      
      // Vincular eventos a las tarjetas
      setTimeout(function() {
        helpers.bindProductEvents();
      }, 150);
    })
    .catch(function(err) {
      console.error('❌ Error renderizando productos:', err);
      container.innerHTML = 
        '<div class="col-12 text-center text-danger py-4">' +
        'Error al cargar productos' +
        '</div>';
    });
  },
  
  /**
   * 🎯 Vincular eventos a las tarjetas
   * ✅ MIGRADO: Usa EventManager si está disponible, fallback a método tradicional
   */
  bindProductEvents: function() {
    var DOM = window.DOMManager;
    var Events = window.EventManager;
    
    // Si EventManager está disponible, usar delegación
    if (Events && Events.delegate) {
      console.log('🎯 Vinculando eventos con EventManager (delegación)...');
      
      // ✅ Quick View - Delegación de eventos
      Events.delegate(
        '#products-container',
        '.js-show-modal1',
        'click',
        function(e) {
          e.preventDefault();
          var productId = this.getAttribute('data-id');
          if (productId && window.shopModal) {
            helpers.fetchJSON('product.php?id=' + productId)
              .then(function(response) {
                if (response && response.producto) {
                  window.shopModal.open(response.producto);
                }
              });
          }
        }
      );
      
      // ✅ Título del producto - Delegación
      Events.delegate(
        '#products-container',
        '.js-name-detail',
        'click',
        function(e) {
          e.preventDefault();
          var productId = this.getAttribute('data-id');
          if (productId && window.shopModal) {
            helpers.fetchJSON('product.php?id=' + productId)
              .then(function(response) {
                if (response && response.producto) {
                  window.shopModal.open(response.producto);
                }
              });
          }
        }
      );
      
      // ✅ Favoritos - Delegación
      Events.delegate(
        '#products-container',
        '.js-addwish-b2',
        'click',
        function(e) {
          e.preventDefault();
          this.classList.toggle('js-addedwish-b2');
          console.log('❤️ Favorito:', this.getAttribute('data-id'));
        }
      );
      
      console.log('✅ Eventos vinculados con EventManager');
    } else {
      // ❌ Fallback: Método tradicional
      console.log('⚠️ EventManager no disponible, usando método tradicional');
      this._bindProductEventsLegacy();
    }
  },

  /**
   * 🔙 Método legacy para vincular eventos (fallback)
   */
  _bindProductEventsLegacy: function() {
    console.log('🎯 Vinculando eventos (método legacy)...');

    // Quick View
    document.querySelectorAll('.js-show-modal1').forEach(function(btn) {
      // Remover listener anterior si existe
      var newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var productId = this.getAttribute('data-id');
        if (productId && window.shopModal) {
          helpers.fetchJSON('product.php?id=' + productId)
            .then(function(response) {
              if (response && response.producto) {
                window.shopModal.open(response.producto);
              }
            });
        }
      });
    });
    
    // Título del producto
    document.querySelectorAll('.js-name-detail').forEach(function(link) {
      var newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        var productId = this.getAttribute('data-id');
        if (productId && window.shopModal) {
          helpers.fetchJSON('product.php?id=' + productId)
            .then(function(response) {
              if (response && response.producto) {
                window.shopModal.open(response.producto);
              }
            });
        }
      });
    });
    
    // Favoritos
    document.querySelectorAll('.js-addwish-b2').forEach(function(btn) {
      var newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('js-addedwish-b2');
        console.log('❤️ Favorito:', this.getAttribute('data-id'));
      });
    });

    console.log('✅ Eventos vinculados (legacy)');
  }
};

console.log('✅ helpers.js cargado correctamente');
console.log('📦 CONFIG:', window.CONFIG);