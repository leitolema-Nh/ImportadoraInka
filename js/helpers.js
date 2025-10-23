// ===================================================
// ✅ helpers.js — utilidades globales INKA
// ===================================================

console.log('🔧 helpers.js cargando...');

// Configuración fallback si CONFIG no existe
window.CONFIG = window.CONFIG || (function() {
  var protocol = window.location.protocol;
  var host = window.location.host;
  var pathname = window.location.pathname;
  
  // Detectar base URL
  var base = protocol + '//' + host + '/';
  
  // Si estamos en localhost con carpeta
  if (host.indexOf('localhost') !== -1) {
    var parts = pathname.split('/').filter(function(p) { return p; });
    if (parts.length > 0 && parts[0] !== 'pages') {
      base = protocol + '//' + host + '/' + parts[0] + '/';
    }
  }
  
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
    var url = (window.CONFIG.apiURL || '/api/') + endpoint;
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
   * Normalizar URL de imagen
   */
  normalizeImageUrl: function(raw) {
    try {
      if (!raw || raw === 'null' || raw === 'undefined') {
        return (window.CONFIG.imagesPath || '/images/') + 'default.jpg';
      }
      
      // Si ya es URL completa
      if (/^https?:\/\//i.test(raw)) return raw;
      
      // Limpiar ruta
      var cleaned = raw.replace(/\\/g, '/').replace(/^\/+/, '');
      
      // Si ya tiene files/ o images/
      if (/^files\//i.test(cleaned) || /^images\//i.test(cleaned)) {
        return window.CONFIG.baseURL + cleaned;
      }
      
      // Por defecto asumir que está en files/
      return window.CONFIG.baseURL + 'files/' + cleaned;
      
    } catch (e) {
      console.warn('normalizeImageUrl error:', e);
      return (window.CONFIG.imagesPath || '/images/') + 'default.jpg';
    }
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
   */
  renderProducts: function(items, append) {
    append = append || false;
    
    var container = document.getElementById('products-container');
    
    if (!container) {
      console.error('❌ #products-container no encontrado');
      return;
    }

    console.log('🎨 Renderizando ' + (items ? items.length : 0) + ' productos (append: ' + append + ')');

    // Limpiar contenedor si no es append
    if (!append) {
      container.innerHTML = '';
    }

    // Validar que hay productos
    if (!Array.isArray(items) || items.length === 0) {
      if (!append) {
        container.innerHTML = 
          '<div class="col-12 text-center py-5">' +
          '<i class="fa fa-inbox fa-4x text-muted mb-3"></i>' +
          '<h4 class="text-muted">No se encontraron productos</h4>' +
          '</div>';
      }
      console.log('⚠️ No hay productos para renderizar');
      return;
    }

    // Crear fragment para mejor performance
    var fragment = document.createDocumentFragment();
    
    for (var i = 0; i < items.length; i++) {
      var producto = items[i];
      
      var div = document.createElement('div');
      div.className = 'col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item';
      
      // Normalizar imagen
      var imgUrl = helpers.normalizeImageUrl(producto.imagen);
      
      // Formatear precios
      var precioGeneral = parseFloat(producto.precio_general || 0).toFixed(2);
      var precioMayor = parseFloat(producto.precio_mayor || 0).toFixed(2);
      var precioDocena = parseFloat(producto.precio_docena || 0).toFixed(2);
      
      // Escapar texto
      var descripcion = helpers.escapeHtml(producto.descripcion || 'Sin descripción');
      var codigo = helpers.escapeHtml(producto.codigo || '');
      var tipoProducto = helpers.escapeHtml(producto.tipoProducto || '');
      
      // HTML de la tarjeta
      div.innerHTML = 
        '<div class="block2">' +
          '<div class="block2-pic hov-img0">' +
            '<img src="' + imgUrl + '" alt="' + descripcion + '" ' +
                 'onerror="this.src=\'' + CONFIG.imagesPath + 'default.jpg\'">' +
            (codigo ? '<span class="codigo-overlay">' + codigo + '</span>' : '') +
          '</div>' +
          '<div class="block2-txt flex-w flex-t p-t-14">' +
            '<div class="block2-txt-child1 flex-col-l">' +
              (tipoProducto ? '<span class="stext-105 cl3 mb-2">' + tipoProducto + '</span>' : '') +
              '<a href="#" class="stext-104 cl4 hov-cl1 trans-04 js-name-detail p-b-6" ' +
                 'data-id="' + producto.id + '">' +
                descripcion +
              '</a>' +
              '<div class="price-box mt-2">' +
                '<span class="stext-105 cl3">' +
                  '<strong>General:</strong> RD$ ' + precioGeneral +
                '</span>' +
                (precioMayor > 0 ? 
                  '<span class="stext-105 cl3">' +
                    '<strong>Mayor:</strong> RD$ ' + precioMayor +
                  '</span>' : '') +
                (precioDocena > 0 ? 
                  '<span class="stext-105 cl3">' +
                    '<strong>Docena:</strong> RD$ ' + precioDocena +
                  '</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="block2-txt-child2 flex-r p-t-3">' +
              '<a href="#" class="btn-addwish-b2 dis-block pos-relative js-addwish-b2" ' +
                 'data-id="' + producto.id + '" title="Ver detalles">' +
                '<i class="zmdi zmdi-eye"></i>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      
      fragment.appendChild(div);
    }
    
    // Agregar todo al DOM de una vez
    container.appendChild(fragment);
    
    console.log('✅ ' + items.length + ' productos renderizados correctamente');
    
    // Inicializar Isotope si está disponible (con delay para asegurar que el DOM esté listo)
    setTimeout(function() {
      if (window.$ && $.fn.isotope) {
        try {
          var $container = $(container);
          
          // Si ya está inicializado, solo recarga
          if ($container.data('isotope')) {
            $container.isotope('reloadItems').isotope();
            console.log('✅ Isotope recargado');
          } else {
            // Primera inicialización
            $container.isotope({
              itemSelector: '.isotope-item',
              layoutMode: 'fitRows',
              percentPosition: true
            });
            console.log('✅ Isotope inicializado');
          }
        } catch (e) {
          console.warn('⚠️ Isotope no pudo inicializarse:', e.message);
        }
      }
    }, 100);
    
    // Agregar event listeners a los botones de ver detalles
    setTimeout(function() {
      var buttons = document.querySelectorAll('.js-addwish-b2, .js-name-detail');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
          e.preventDefault();
          var productId = this.getAttribute('data-id');
          if (productId && typeof window.openProductModal === 'function') {
            window.openProductModal(productId);
          } else {
            console.log('Ver producto:', productId);
          }
        });
      }
    }, 100);
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