// ✅ searchOverlay.js — Overlay global de búsqueda
console.log("✅ searchOverlay.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("searchOverlay");
  const openBtn = document.querySelectorAll(".js-show-search");
  const closeBtn = document.getElementById("closeSearch");
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");
  const form = document.getElementById("searchForm");

  if (!overlay || !input || !dropdown) return;

  // 🔄 Abrir y cerrar overlay
  function openSearch() {
    overlay.classList.add("active");
    input.value = "";
    dropdown.innerHTML = `<div class="text-muted px-3 py-2">Escribe para buscar...</div>`;
    input.focus();
  }
  function closeSearch() {
    overlay.classList.remove("active");
  }

  openBtn.forEach(btn => btn.addEventListener("click", openSearch));
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeSearch(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });

  // 🧠 Búsqueda en vivo
  let lastQuery = "";
  let controller = null;

  async function buscar(q) {
    const query = q.trim();
    if (query === lastQuery) return;
    lastQuery = query;

    if (query.length < 2) {
      dropdown.innerHTML = `<div class="text-muted px-3 py-2">Escribe para buscar...</div>`;
      return;
    }

    dropdown.innerHTML = `<div class="text-muted px-3 py-2">Buscando...</div>`;

    try {
      if (controller) controller.abort();
      controller = new AbortController();
      const res = await fetch(`${CONFIG.apiURL}search.php?q=${encodeURIComponent(query)}&limit=10`, {
        signal: controller.signal
      });
      const data = await res.json();
      if (!data || data.status !== "ok" || !data.productos.length) {
        dropdown.innerHTML = `<div class="text-muted px-3 py-2">Sin resultados para <strong>${query}</strong></div>`;
        return;
      }

      dropdown.innerHTML = data.productos.map(p => `
        <div class="search-item" data-query="${p.codigo}">
          <img src="${p.imagen}" alt="${p.codigo}" class="search-thumb">
          <div class="search-text">
            <div class="line-1 fw-bold">${p.codigo || ""}</div>
            <div class="line-2">${p.descripcion || p.tipoProducto || ""}</div>
          </div>
        </div>`).join("");

      dropdown.querySelectorAll(".search-item").forEach(el => {
        el.addEventListener("click", () => {
          const q = el.dataset.query;
          if (!q) return;
          window.location.href = `${CONFIG.baseURL}pages/shop.php?multi=${encodeURIComponent(q)}`;
        });
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("❌ Error búsqueda:", err);
      dropdown.innerHTML = `<div class="text-danger px-3 py-2">Error en la búsqueda</div>`;
    }
  }

  input.addEventListener("input", e => buscar(e.target.value));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `${CONFIG.baseURL}pages/shop.php?multi=${encodeURIComponent(q)}`;
  });
});
