// ✅ search.js — búsqueda interna en el catálogo
console.log("✅ search.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const productsContainer = document.getElementById("products-container");
  const loadMoreBtn = document.getElementById("load-more");

  if (!searchInput || !productsContainer) return;

  async function buscarProductos(q) {
    const query = q.trim();
    if (!query) {
      if (window.CURRENT_MODE === "search") {
        console.log("🔄 Volviendo al catálogo general...");
        window.CURRENT_MODE = "all";
        if (typeof cargarProducts === "function") cargarProducts(1, 20, false);
      }
      return;
    }

    if (window.CURRENT_MODE === "category" || window.CURRENT_MODE === "code") {
      console.log("🔕 Búsqueda deshabilitada (modo categoría o código)");
      return;
    }

    window.CURRENT_MODE = "search";
    productsContainer.innerHTML = `
      <div class="text-center py-5 text-muted">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Buscando productos...</p>
      </div>
    `;

    try {
      const url = `${CONFIG.apiURL}search.php?q=${encodeURIComponent(query)}&limit=20`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "ok" || !data.productos.length) {
        productsContainer.innerHTML = `
          <div class="text-center py-5 text-muted">
            Sin resultados para "<strong>${query}</strong>"
          </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
      }

      helpers.renderProducts(data.productos, false);
      if (loadMoreBtn) loadMoreBtn.style.display = "none";

    } catch (e) {
      console.error("❌ Error en búsqueda del catálogo:", e);
      productsContainer.innerHTML = `
        <div class="text-danger text-center py-5">
          Error al realizar la búsqueda.
        </div>
      `;
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
    }
  }

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    buscarProductos(query);
  });
});
