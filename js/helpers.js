// ===================================================
// 🔧 helpers.js — UTILIDADES GLOBALES (Con Managers)
// ===================================================

console.log('🔧 helpers.js cargando...');

// ============================================
// 🌐 CONFIGURACIÓN GLOBAL (Fallback)
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

  formatPrice: function(price) {
    var num = parseFloat(price || 0);
    return 'RD$ ' + num.toFixed(2);
  },

  updateUrlParams: function(params) {
    var url = new URL(window.location);
    
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          url.searchParams.delete(key);
        } else {
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

  renderProducts: function(items, append) {
    append = append || false;
    
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
      return;
    }

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
      if (append) {
        container.insertAdjacentHTML('beforeend', html);
      } else {
        container.innerHTML = html;
      }
      
      console.log('✅ ' + items.length + ' productos renderizados desde PHP');
      
      setTimeout(function() {
        // Solo los contenedores .isotope-grid usan Isotope; el catálogo nuevo usa CSS grid
        if (window.$ && $.fn.isotope && container.classList.contains('isotope-grid')) {
          try {
            var $container = $(container);
            
            if ($container.data('isotope')) {
              $container.isotope('reloadItems').isotope();
            } else {
              $container.isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true
              });
            }
          } catch (e) {
            console.warn('⚠️ Isotope error:', e.message);
          }
        }
      }, 100);
    })
    .catch(function(err) {
      console.error('❌ Error renderizando productos:', err);
      container.innerHTML = 
        '<div class="col-12 text-center text-danger py-4">' +
        'Error al cargar productos' +
        '</div>';
    });
  },
  
  bindProductEvents: function() {
    console.log('ℹ️ Eventos de productos manejados por productModal.module.js');
  },

  _bindProductEventsLegacy: function() {
    console.log('ℹ️ Eventos de productos manejados por productModal.module.js');
  }
};

console.log('✅ helpers.js cargado correctamente');
console.log('📦 CONFIG:', window.CONFIG);