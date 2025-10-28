// =============================================================
// ✅ products.js — catálogo general del sitio Importadora Inka
// =============================================================
// Versión PRO: con protección de dependencias y carga segura
// Evita fallos si helpers aún no está cargado o si se cambia el orden de scripts.

console.log("📦 products.js cargando...");

window.CURRENT_MODE = "all"; // modo global del catálogo (all/category/search)
window.productsPage = 1;     // control de paginación global

// 🔧 Esperar a que helpers esté disponible antes de ejecutar
async function waitForHelpers() {
  return new Promise(resolve => {
    const check = () => {
      if (window.helpers && window.CONFIG) {
        console.log("✅ Dependencias disponibles (CONFIG + helpers)");
        return resolve(true);
      }
      setTimeout(check, 50); // revisa cada 50ms
    };
    check();
  });
}

// =============================================================
// 📦 Cargar productos del catálogo general (sin categoría activa)
// =============================================================
async function cargarProducts(page = 1, limit = 20, append = false, mode = "all") {
  console.log(`🔄 cargarProducts llamado: page=${page}, append=${append}, mode=${mode}`);
  
  await waitForHelpers(); // 🔐 asegura que helpers esté disponible

  // Si está activo el modo categoría o búsqueda, ignorar carga general
  if (window.CURRENT_MODE === "category") {
    console.log("⏩ Omitiendo carga general (modo categoría activo)");
    return;
  }

  if (window.CURRENT_MODE === "search") {
    console.log("⏩ Omitiendo carga general (modo búsqueda activo)");
    return;
  }

  const grid = document.getElementById("products-container");
  if (!grid) {
    console.warn("⚠️ Grid 'products-container' no encontrado");
    return;
  }

  console.log("✅ Grid encontrado:", grid);

  try {
    const url = `${CONFIG.apiURL}products.php?page=${page}&limit=${limit}`;
    console.log(`📡 Fetching: ${url}`);
    
    const res = await fetch(url);
    console.log(`📥 Response status: ${res.status}`);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    console.log("📦 Data recibida:", data);

    if (data.status !== "ok" || !data.productos) {
      throw new Error("Respuesta inválida de la API");
    }

    console.log(`✅ ${data.productos.length} productos recibidos de ${data.total} totales`);

    // Renderizar productos en el grid
    helpers.renderProducts(data.productos, append);

    // Controlar visibilidad del botón "Cargar más"
    const loadMoreBtn = document.getElementById("load-more");
    if (loadMoreBtn) {
      if (page >= data.total_paginas) {
        loadMoreBtn.style.display = "none";
        console.log("🔒 Botón 'Cargar más' oculto (última página)");
      } else {
        loadMoreBtn.style.display = "inline-block";
        console.log(`✅ Botón "Cargar más" visible (página ${page} de ${data.total_paginas})`);
      }
    }

  } catch (e) {
    console.error("❌ Error cargando productos:", e);
    grid.innerHTML = `<div class="col-12 text-center text-danger py-4">Error cargando productos: ${e.message}</div>`;
  }
}

// =============================================================
// 🔘 Vincular botón "Cargar más" para catálogo general
// =============================================================
function bindLoadMoreForAll() {
  console.log("🔗 bindLoadMoreForAll: Vinculando botón para modo ALL...");
  
  const btn = document.getElementById("load-more");
  if (!btn) {
    console.warn("⚠️ Botón 'load-more' no encontrado");
    return;
  }

  // ⚠️ NO clonar el botón - usar dataset para controlar el modo
  btn.dataset.boundMode = "all";

  // Remover listener anterior si existe
  if (btn._clickHandler) {
    btn.removeEventListener("click", btn._clickHandler);
  }

  // Crear nuevo handler
  btn._clickHandler = () => {
    console.log(`🖱️ Click en "Cargar más" (modo actual: ${window.CURRENT_MODE}, bound: ${btn.dataset.boundMode})`);
    
    if (window.CURRENT_MODE !== "all") {
      console.log(`⏩ Ignorado por products.js (modo actual: ${window.CURRENT_MODE})`);
      return;
    }

    window.productsPage = (window.productsPage || 1) + 1;
    console.log(`📄 Cargando página ${window.productsPage}...`);
    cargarProducts(window.productsPage, 20, true);
  };

  btn.addEventListener("click", btn._clickHandler);
  console.log("✅ Botón vinculado para modo ALL");
}

// =============================================================
// 🚀 Inicialización automática del catálogo
// =============================================================
async function initProducts() {
  console.log("🚀 products.js: Iniciando...");
  
  await waitForHelpers(); // Asegura que helpers existe antes de iniciar
  
  console.log("🔗 Vinculando eventos...");
  bindLoadMoreForAll();   // vincula botón "Cargar más"
  
  // ⚠️ IMPORTANTE: Solo cargar productos si NO hay parámetro multi en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const multiParam = urlParams.get('multi');
  const catParam = urlParams.get('cat');
  
  if (multiParam) {
    console.log("⏩ Parámetro 'multi' detectado, omitiendo carga inicial de productos");
    console.log("   globalSearch.js se encargará de mostrar los resultados");
    window.CURRENT_MODE = "search";
    return;
  }

  if (catParam) {
    console.log("⏩ Parámetro 'cat' detectado, omitiendo carga inicial de productos");
    console.log("   productsByCategories.js se encargará de mostrar los resultados");
    window.CURRENT_MODE = "category";
    return;
  }
  
  console.log("📦 Cargando productos iniciales...");
  window.CURRENT_MODE = "all";
  cargarProducts(1, 20, false);
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initProducts);

// También inicializar en window.load por si DOMContentLoaded ya pasó
window.addEventListener("load", () => {
  console.log("🎬 Window load completo, iniciando products.js...");
  if (window.CURRENT_MODE === "all" && !new URLSearchParams(window.location.search).get('multi')) {
    // Solo inicializar si no se ha hecho ya
    if (!document.querySelector("#products-container .block2")) {
      initProducts();
    }
  }
});

// Exportar por compatibilidad global
window.bindLoadMoreForAll = bindLoadMoreForAll;
window.cargarProducts = cargarProducts;

console.log("✅ products.js cargado correctamente");