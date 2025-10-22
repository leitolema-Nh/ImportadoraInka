// ✅ globalSearch.js — Búsqueda global en vivo (overlay)
console.log("✅ globalSearch.js activo");

(function () {
  const OVERLAY_ID = "global-search-overlay";
  const INPUT_ID = "globalSearchInput";
  const DROPDOWN_ID = "searchResultsDropdown";

  let overlay, input, dropdown, debounceTimer = null, lastQuery = "";

  function qs(id) { return document.getElementById(id); }

  function openOverlay() {
    overlay?.classList.add("active");
    setTimeout(() => input?.focus(), 50);
  }
  
  function closeOverlay() {
    overlay?.classList.remove("active");
    if (dropdown) dropdown.innerHTML = "";
    if (input) input.value = "";
    lastQuery = "";
  }

  function renderEmpty(message) {
    if (!dropdown) return;
    dropdown.innerHTML = `<div class="search-empty">${message || "Sin resultados"}</div>`;
  }

  function buildResultItem(p, q) {
    const img = p.imagen || (window.helpers?.DEFAULT_IMAGE) || (window.location.origin + "/images/default.jpg");
    const codigo = p.codigo || "";
    const tipo = p.tipoProducto || "";
    const desc = p.descripcion || "";
    const safe = (s) => (window.helpers?.escapeHtml ? window.helpers.escapeHtml(String(s||"")) : String(s||""));

    return `
      <div class="search-item" data-codigo="${safe(codigo)}" data-query="${safe(q)}">
        <img class="search-thumb" src="${img}" alt="${safe(codigo)}" onerror="this.onerror=null;this.src='${img}'">
        <div class="search-text">
          <div class="line-1"><strong>${safe(codigo)}</strong> <span class="muted">· ${safe(tipo)}</span></div>
          <div class="line-2">${safe(desc)}</div>
        </div>
      </div>
    `;
  }

  // 🔍 Buscar productos y mostrarlos en el grid principal
  async function searchAndShowInGrid(query, page = 1, append = false) {
    const grid = document.getElementById("products-container");
    if (!grid) {
      console.error("❌ Grid de productos no encontrado");
      return;
    }

    try {
      console.log("🔍 Buscando en grid:", query, "página:", page);
      
      // Mostrar loading solo si no es append
      if (!append) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><i class="zmdi zmdi-spinner zmdi-hc-spin fs-40"></i><p class="mt-3">Buscando productos...</p></div>';
      }
      
      // Preparar términos de búsqueda
      const terms = query.split(/[,\s]+/).filter(Boolean).join(",");
      const url = `${window.CONFIG.apiURL}products.php?multi=${encodeURIComponent(terms)}&page=${page}&limit=20`;
      
      console.log("📡 URL:", url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      console.log("📦 Datos recibidos:", data);
      
      if (!data || data.status !== "ok") {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No se encontraron resultados</div>';
        return;
      }

      const productos = data.productos || [];
      
      if (productos.length === 0 && !append) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No se encontraron productos</div>';
        return;
      }

      // Renderizar productos usando helpers
      if (window.helpers && window.helpers.renderProducts) {
        window.helpers.renderProducts(productos, append);
      } else {
        // Fallback manual si helpers no está disponible
        const html = productos.map(p => {
          const img = p.imagen || '/images/default.jpg';
          return `
            <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
              <div class="block2 card h-100">
                <div class="block2-pic hov-img0 position-relative card-img-container">
                  <span class="codigo-overlay">${p.codigo || ""}</span>
                  <img src="${img}" alt="${p.descripcion || ""}">
                </div>
                <div class="block2-txt flex-col-l p-3">
                  <span class="badge-subcat">${p.tipoProducto || ""}</span>
                  <h6 class="product-title">${p.descripcion || ""}</h6>
                  <div class="price-box">
                    <div>General: ${p.precio_general || 0}</div>
                    <div>Mayor: ${p.precio_mayor || 0}</div>
                    <div>Docena: ${p.precio_docena || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join("");
        
        if (append) {
          grid.insertAdjacentHTML('beforeend', html);
        } else {
          grid.innerHTML = html;
        }
      }

      // Controlar botón "Cargar más"
      const loadMoreBtn = document.getElementById("load-more");
      if (loadMoreBtn) {
        if (data.pagina >= data.total_paginas) {
          loadMoreBtn.style.display = "none";
        } else {
          loadMoreBtn.style.display = "inline-block";
          
          // Vincular botón para búsqueda
          if (loadMoreBtn._searchClickHandler) {
            loadMoreBtn.removeEventListener("click", loadMoreBtn._searchClickHandler);
          }
          
          loadMoreBtn._searchClickHandler = () => {
            if (window.CURRENT_MODE === "search") {
              window.searchPage = (window.searchPage || page) + 1;
              searchAndShowInGrid(query, window.searchPage, true);
            }
          };
          
          loadMoreBtn.addEventListener("click", loadMoreBtn._searchClickHandler);
        }
      }

      // Cambiar modo global
      window.CURRENT_MODE = "search";
      window.currentSearchQuery = query;
      window.searchPage = page;

      // Actualizar URL sin recargar página (solo si no es append)
      if (!append) {
        // ✅ Usar guión para separar múltiples términos en la URL
        const terms = query.split(/[,\s]+/).filter(Boolean);
        const cleanUrl = terms.join('-'); // Resultado: "stitch-peluche" en lugar de "stitch%2Cpeluche"
        const newUrl = `${window.location.pathname}?multi=${encodeURIComponent(cleanUrl)}`;
        window.history.pushState({ search: cleanUrl }, '', newUrl);
      }

      console.log(`✅ ${productos.length} productos mostrados (total: ${data.total}, página ${page}/${data.total_paginas})`);

    } catch (e) {
      console.error("❌ Error en búsqueda:", e);
      grid.innerHTML = '<div class="col-12 text-center text-danger py-5">Error al buscar productos</div>';
    }
  }

  // 🔎 Buscar en overlay (autocompletado)
  async function buscar(q) {
    const api = (window.CONFIG && window.CONFIG.apiURL) ? window.CONFIG.apiURL : (window.location.origin + "/api/");
    const url = `${api}globalSearch.php?q=${encodeURIComponent(q)}&limit=20`;

    try {
      console.log("🔍 Buscando en overlay:", q);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      console.log("📦 Respuesta overlay:", data);

      if (!data || data.status !== "ok") {
        renderEmpty("No se encontraron resultados");
        return;
      }

      const productos = Array.isArray(data.data?.productos) ? data.data.productos : [];
      
      console.log("✅ Productos en overlay:", productos.length);
      
      if (productos.length === 0) {
        renderEmpty("No se encontraron resultados");
        return;
      }

      dropdown.innerHTML = productos.map(p => buildResultItem(p, q)).join("") +
        `<div class="search-see-all" id="searchSeeAll">Ver todos los resultados (${productos.length})</div>`;

      // Al hacer clic en un item específico, buscar solo ese código
      dropdown.querySelectorAll(".search-item").forEach(el => {
        el.addEventListener("click", () => {
          const codigo = el.getAttribute("data-codigo") || "";
          if (codigo) {
            closeOverlay();
            searchAndShowInGrid(codigo);
          }
        });
      });

      // Al hacer clic en "Ver todos", buscar con el query completo
      const seeAll = document.getElementById("searchSeeAll");
      if (seeAll) {
        seeAll.addEventListener("click", () => {
          closeOverlay();
          searchAndShowInGrid(q);
        });
      }

    } catch (e) {
      console.error("❌ Error globalSearch overlay:", e);
      renderEmpty("Error al buscar");
    }
  }

  function onInput(e) {
    const value = (e.target.value || "").trim();
    console.log("⌨️ Input event:", value);
    
    if (value === "") {
      dropdown.innerHTML = "";
      lastQuery = "";
      return;
    }
    
    if (value === lastQuery) return;
    
    lastQuery = value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (value.length >= 2) {
        buscar(value);
      }
    }, 300);
  }

  function onKey(e) {
    if (e.key === "Escape") {
      closeOverlay();
    }
    if (e.key === "Enter") {
      const value = (input.value || "").trim();
      if (value) {
        closeOverlay();
        searchAndShowInGrid(value);
      }
    }
  }

  function init() {
    overlay = qs(OVERLAY_ID);
    input = qs(INPUT_ID);
    dropdown = qs(DROPDOWN_ID);

    console.log("🔍 Inicializando globalSearch...");
    console.log("   Overlay:", overlay);
    console.log("   Input:", input);
    console.log("   Dropdown:", dropdown);

    if (!overlay || !input || !dropdown) {
      console.warn("⚠️ globalSearch: elementos del overlay no encontrados");
      // Reintentar en 100ms
      setTimeout(init, 100);
      return;
    }

    // Remover listeners antiguos del input si existen
    if (input._inputHandler) {
      input.removeEventListener("input", input._inputHandler);
    }
    if (input._keyHandler) {
      input.removeEventListener("keydown", input._keyHandler);
    }

    // Crear y guardar los handlers
    input._inputHandler = onInput;
    input._keyHandler = onKey;

    input.addEventListener("input", input._inputHandler);
    input.addEventListener("keydown", input._keyHandler);

    const closeBtn = document.getElementById("closeGlobalSearch");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeOverlay);
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
    });

    // NO agregar listeners a .js-show-search porque el header ya lo maneja

    console.log("✅ globalSearch inicializado correctamente");

    // 🔄 Si la URL tiene parámetro multi al cargar, ejecutar búsqueda
    const urlParams = new URLSearchParams(window.location.search);
    const multiParam = urlParams.get('multi');
    if (multiParam) {
      console.log("🔄 Detectado parámetro multi en URL:", multiParam);
      setTimeout(() => searchAndShowInGrid(multiParam), 500);
    }
  }

  // Inicializar inmediatamente si el DOM está listo, sino esperar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exportar función para uso global
  window.searchAndShowInGrid = searchAndShowInGrid;
})();