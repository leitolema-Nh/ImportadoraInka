// ===================================================
// 🔧 helpers.js — Utilidades globales INKA
// ===================================================

console.log('🔧 helpers.js cargando...');

// Configuración fallback
window.CONFIG = window.CONFIG || (function() {
  // 1) Si existe <base href> en el HTML, usarla (más confiable)
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

  // 2) Intentar derivar la base desde el src del script actual (document.currentScript)
  var script = document.currentScript || (function() {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();

  if (script && script.src) {
    try {
      var u = new URL(script.src, location.href);
      var pathname = u.pathname.replace(/\/+$/, '');

      // Si el script está en /js/... -> cortar hasta antes de /js/
      var idx = pathname.indexOf('/js/');
      var projectPath = '/';

      if (idx > 0) {
        // hay una carpeta de proyecto antes de /js/
        projectPath = pathname.substring(0, idx + 1); // incluye la barra final
      } else if (idx === 0) {
        // script servido desde la raíz (/js/...), revisar la ruta de la página
        var pageParts = location.pathname.split('/').filter(function(p){ return p; });
        var firstPage = pageParts[0] || '';
        // si la página está en un subfolder razonable, usarlo como carpeta de proyecto
        if (firstPage && firstPage !== 'js' && firstPage !== 'pages' && firstPage !== 'api') {
          projectPath = '/' + firstPage + '/';
        } else {
          projectPath = '/';
        }
      } else {
        // no encontramos /js/ en script.src, intentar tomar el primer segmento del script
        var parts = pathname.split('/').filter(function(p){ return p; });
        if (parts.length > 1) {
          // si script path es /<project>/<something>, tomar <project>
          projectPath = '/' + parts[0] + '/';
        } else {
          projectPath = '/';
        }
      }

      // Preferir la carpeta que aparece en la URL de la página cuando estamos en red local
      var pagePartsForProject = location.pathname.split('/').filter(function(p){ return p; });
      if (pagePartsForProject.length && pagePartsForProject[0] !== 'js' && pagePartsForProject[0] !== projectPath.replace(/\//g, '')) {
        // Si la página vive en /<algo>/... y el script fue pedido desde /js/, usar la carpeta de la página
        var candidate = '/' + pagePartsForProject[0] + '/';
        if (candidate !== projectPath) {
          projectPath = candidate;
        }
      }

      var base = u.origin + projectPath;
      base = base.replace(/([^:]\/)\/+/g, '$1'); // normalizar dobles slashes
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

  // 3) Fallback anterior (pathname / hostname)
  var protocol = location.protocol;
  var host = location.host; // con puerto si aplica
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

/* =========================================================
   🧰 FUNCIONES GLOBALES DE UTILIDAD
   ========================================================= */
window.helpers = {
  
  /**
   * Fetch JSON desde API
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
   * Escapar HTML para prevenir XSS
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
   * Formatear precio
   */
  formatPrice: function(price) {
    var num = parseFloat(price || 0);
    return 'RD$ ' + num.toFixed(2);
  },

  /**
   * 🎨 RENDERIZAR PRODUCTOS EN EL GRID
   * Ahora llama al endpoint PHP que retorna HTML renderizado
   */
  renderProducts: function(items, append) {
    append = append || false;
    
    var container = document.getElementById('products-container');
    
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
      
      // Inicializar Isotope
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
      
      // Vincular eventos
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
   */
  bindProductEvents: function() {
    // Quick View
    document.querySelectorAll('.js-show-modal1').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
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
      link.addEventListener('click', function(e) {
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
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('js-addedwish-b2');
        console.log('❤️ Favorito:', this.getAttribute('data-id'));
      });
    });
  },
  
  /**
   * Actualizar parámetros de URL
   */
  updateUrlParams: function(params) {
    var url = new URL(window.location);
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        if (params[key] === null) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, params[key]);
        }
      }
    }
    window.history.replaceState({}, '', url);
  }
};

/* =========================================================
   🎠 SCROLL DE CATEGORÍAS Y SUBCATEGORÍAS
   ========================================================= */
function scrollSubcategories(direction) {
  var c = document.getElementById('subcategories-container');
  if (!c) return;
  c.scrollBy({ left: direction * (c.clientWidth * 0.8), behavior: 'smooth' });
}

function scrollCategories(direction) {
  direction = direction || 1;
  var c = document.getElementById('categories-container');
  if (!c) return;
  c.scrollBy({ left: direction * 200, behavior: 'smooth' });
}

window.scrollSubcategories = scrollSubcategories;
window.scrollCategories = scrollCategories;

console.log('✅ helpers.js cargado correctamente');