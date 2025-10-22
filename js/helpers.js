// ===================================================
// ✅ helpers.js — utilidades globales INKA
// ===================================================

console.log('🔧 helpers.js cargando...');

// Configuración fallback si CONFIG no existe
window.CONFIG = window.CONFIG || (() => {
  const b = window.location.origin + "/inka/";
  console.warn('⚠️ CONFIG no encontrado, usando fallback:', b);
  return {
    baseURL: b,
    apiURL: b + "api/",
    imagesPath: b + "images/",
    filesPath: b + "files/"
  };
})();

/* =========================================================
   🧰 FUNCIONES GLOBALES DE UTILIDAD
   ========================================================= */
window.helpers = {
  
  /**
   * Fetch JSON desde API
   */
  fetchJSON: async function (endpoint) {
    try {
      const url = (window.CONFIG.apiURL || "/api/") + endpoint;
      console.log('📡 fetchJSON:', url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("❌ fetchJSON error:", err);
      return null;
    }
  },

  /**
   * Normalizar URL de imagen
   */
  normalizeImageUrl: function (raw) {
    try {
      if (!raw || raw === 'null' || raw === 'undefined') {
        return (window.CONFIG.imagesPath || "/images/") + "default.jpg";
      }
      
      // Si ya es URL completa
      if (/^https?:\/\//i.test(raw)) return raw;
      
      // Limpiar ruta
      const cleaned = raw.replace(/\\/g, "/").replace(/^\/+/, "");
      
      // Si ya tiene files/ o images/
      if (/^files\//i.test(cleaned) || /^images\//i.test(cleaned)) {
        return window.CONFIG.baseURL + cleaned;
      }
      
      // Por defecto asumir que está en files/
      return window.CONFIG.baseURL + "files/" + cleaned;
      
    } catch (e) {
      console.warn("normalizeImageUrl error:", e);
      return (window.CONFIG.imagesPath || "/images/") + "default.jpg";
    }
  },

  /**
   * 🎨 RENDERIZAR PRODUCTOS EN EL GRID
   */
  renderProducts: function (items, append = false) {
    const container = document.getElementById("products-container");
    
    if (!container) {
      console.error('❌ #products-container no encontrado');
      return;
    }

    console.log(`🎨 Renderizando ${items?.length || 0} productos (append: ${append})`);

    // Limpiar contenedor si no es append
    if (!append) {
      container.innerHTML = "";
    }

    // Validar que hay productos
    if (!Array.isArray(items) || items.length === 0) {
      if (!append) {
        container.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fa fa-inbox fa-4x text-muted mb-3"></i>
            <h4 class="text-muted">No se encontraron productos</h4>
          </div>`;
      }
      console.log('⚠️ No hay productos para renderizar');
      return;
    }

    // Crear fragment para mejor performance
    const fragment = document.createDocumentFragment();
    
    items.forEach(producto => {
      const div = document.createElement("div");
      div.className = "col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item";
      
      // Normalizar imagen
      const imgUrl = helpers.normalizeImageUrl(producto.imagen);
      
      // Formatear precios
      const precioGeneral = parseFloat(producto.precio_general || 0).toFixed(2);
      const precioMayor = parseFloat(producto.precio_mayor || 0).toFixed(2);
      const precioDocena = parseFloat(producto.precio_docena || 0).toFixed(2);
      
      // HTML de la tarjeta
      div.innerHTML = `
        <div class="block2">
          <div class="block2-pic hov-img0">
            <img src="${imgUrl}" alt="${producto.descripcion || 'Producto'}" 
                 onerror="this.src='${CONFIG.imagesPath}default.jpg'">
            ${producto.codigo ? `<span class="codigo-overlay">${producto.codigo}</span>` : ''}
          </div>
          
          <div class="block2-txt flex-w flex-t p-t-14">
            <div class="block2-txt-child1 flex-col-l">
              ${producto.tipoProducto ? `<span class="stext-105 cl3 mb-2">${producto.tipoProducto}</span>` : ''}
              <a href="#" class="stext-104 cl4 hov-cl1 trans-04 js-name-detail p-b-6" 
                 data-id="${producto.id}">
                ${producto.descripcion || 'Sin descripción'}
              </a>
              
              <div class="price-box mt-2">
                <span class="stext-105 cl3">
                  <strong>General:</strong> RD$ ${precioGeneral}
                </span>
                ${precioMayor > 0 ? `
                  <span class="stext-105 cl3">
                    <strong>Mayor:</strong> RD$ ${precioMayor}
                  </span>
                ` : ''}
                ${precioDocena > 0 ? `
                  <span class="stext-105 cl3">
                    <strong>Docena:</strong> RD$ ${precioDocena}
                  </span>
                ` : ''}
              </div>
            </div>
            
            <div class="block2-txt-child2 flex-r p-t-3">
              <a href="#" class="btn-addwish-b2 dis-block pos-relative js-addwish-b2" 
                 data-id="${producto.id}" title="Ver detalles">
                <i class="zmdi zmdi-eye"></i>
              </a>
            </div>
          </div>
        </div>
      `;
      
      fragment.appendChild(div);
    });
    
    // Agregar todo al DOM de una vez
    container.appendChild(fragment);
    
    console.log(`✅ ${items.length} productos renderizados correctamente`);
    
    // Inicializar Isotope si está disponible (con delay para asegurar que el DOM esté listo)
    setTimeout(() => {
      if (window.$ && $.fn.isotope) {
        try {
          const $container = $(container);
          
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
    setTimeout(() => {
      document.querySelectorAll('.js-addwish-b2, .js-name-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const productId = btn.dataset.id;
          if (productId && typeof window.openProductModal === 'function') {
            window.openProductModal(productId);
          } else {
            console.log('Ver producto:', productId);
          }
        });
      });
    }, 100);
  },
  
  /**
   * Actualizar parámetros de URL
   */
  updateUrlParams: function(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
      if (params[key] === null) url.searchParams.delete(key);
      else url.searchParams.set(key, params[key]);
    });
    window.history.replaceState({}, '', url);
  }
};

/* =========================================================
   🎠 SCROLL DE CATEGORÍAS Y SUBCATEGORÍAS
   ========================================================= */
function scrollSubcategories(direction) {
  const c = document.getElementById("subcategories-container");
  if (!c) return;
  c.scrollBy({ left: direction * (c.clientWidth * 0.8), behavior: "smooth" });
}

function scrollCategories(direction = 1) {
  const c = document.getElementById("categories-container");
  if (!c) return;
  c.scrollBy({ left: direction * 200, behavior: "smooth" });
}

window.scrollSubcategories = scrollSubcategories;
window.scrollCategories = scrollCategories;

console.log("✅ helpers.js cargado correctamente");