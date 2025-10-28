// js/subcategories.js (Optimizado v2025)
console.log("✅ subcategories.js cargado (v2025)");

let currentCategoryId_internal = null; // referencia interna

/**
 * 📦 Cargar y renderizar subcategorías desde la API
 */
async function loadSubcategoriesForCategory(categoryId) {
  currentCategoryId_internal = categoryId;

  const panel = document.getElementById('filter-panel');
  const toggle = document.getElementById('filter-toggle-btn');

  if (!panel) {
    console.warn("⚠️ No se encontró #filter-panel en el DOM");
    return false;
  }

  // 🧹 Limpiar panel al iniciar carga
  panel.innerHTML = '';

  // ⚙️ Validar categoría
  if (!categoryId || parseInt(categoryId) <= 0) {
    panel.style.display = 'none';
    if (toggle) toggle.style.display = 'none';
    return false;
  }

  // 🔗 Definir API base dinámica
  const API_BASE = (window.CONFIG && CONFIG.apiURL)
    ? CONFIG.apiURL
    : (window.location.origin + "/api/");

  try {
    const url = `${API_BASE}subcategories.php?category_id=${encodeURIComponent(categoryId)}`;
    const res = await fetch(url);
    const text = await res.text();

    // ✅ Intentar convertir la respuesta a JSON (manejo robusto)
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Respuesta no JSON en subcategories.php:", text.slice(0, 250));
      throw new Error("Respuesta inválida (no es JSON)");
    }

    // ✅ Validar formato esperado
    if (data.status !== 'ok' || !Array.isArray(data.subcategorias)) {
      console.error('❌ Estructura inesperada:', data);
      panel.innerHTML = '<p class="text-danger">Error al cargar subcategorías.</p>';
      panel.style.display = 'block';
      if (toggle) toggle.style.display = 'none';
      return false;
    }

    const subs = data.subcategorias;
    if (subs.length === 0) {
      panel.innerHTML = '<p class="text-muted mb-0">No hay subcategorías disponibles.</p>';
      panel.style.display = 'block';
      panel.style.maxHeight = 'none';
      panel.style.overflowY = 'visible';
      if (toggle) toggle.style.display = 'none';
      return false;
    }

    // ✅ Mostrar botón si hay subcategorías
    if (toggle) toggle.style.display = 'inline-block';

    // 📋 Crear checkboxes dinámicos
    const wrapper = document.createElement('div');
    wrapper.className = 'p-2';

    subs.forEach(sub => {
      const id = 'subcb_' + sub.id;
      const div = document.createElement('div');
      div.className = 'form-check mb-1';
      div.innerHTML = `
        <input class="form-check-input subcat-checkbox" type="checkbox" value="${sub.id}" id="${id}">
        <label class="form-check-label" for="${id}">
          ${escapeHtml(sub.name_subcategory || sub.id)}
        </label>
      `;
      wrapper.appendChild(div);
    });

    panel.appendChild(wrapper);

    // 📜 Activar scroll si hay más de 4
    if (subs.length > 4) {
      panel.style.maxHeight = '100px';
      panel.style.overflowY = 'auto';
    } else {
      panel.style.maxHeight = 'none';
      panel.style.overflowY = 'visible';
    }

    // ✅ Evento de filtrado dinámico
    panel.querySelectorAll('.subcat-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(panel.querySelectorAll('.subcat-checkbox:checked')).map(i => i.value);
        const catId = currentCategoryId_internal || window.SELECTED_CATEGORY_ID;
        if (!catId) return;

        // 🔁 Resetear paginador
        if (typeof window.pbcatPage !== "undefined") window.pbcatPage = 1;

        // 📦 Llamar al cargador de productos
        if (typeof cargarProductsByCategory === 'function') {
          cargarProductsByCategory(catId, 1, true, checked);
        } else {
          console.warn('⚠️ cargarProductsByCategory no está disponible para filtrar subcategorías.');
        }
      });
    });

    // 👁️ Ocultar panel por defecto
    panel.style.display = 'none';
    return true;
  } catch (e) {
    console.error('❌ Error loadSubcategoriesForCategory:', e);
    panel.innerHTML = '<p class="text-danger">Error al conectar con el servidor.</p>';
    panel.style.display = 'none';
    if (toggle) toggle.style.display = 'none';
    return false;
  }
}

/**
 * 🪄 Toggle de panel de subcategorías
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('filter-toggle-btn');
  const panel = document.getElementById('filter-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', async () => {
    const currentCatId = window.SELECTED_CATEGORY_ID || currentCategoryId_internal;
    if (!currentCatId) return;

    // Reiniciar carga si cambió de categoría
    if (panel.dataset.lastCatId && panel.dataset.lastCatId !== String(currentCatId)) {
      panel.dataset.loaded = "";
      panel.dataset.lastCatId = String(currentCatId);
    }

    // Cargar si aún no está listo
    if (!panel.dataset.loaded) {
      const loaded = await loadSubcategoriesForCategory(currentCatId);
      if (loaded) {
        panel.dataset.loaded = "true";
        panel.dataset.lastCatId = String(currentCatId);
      }
    }

    // Alternar visibilidad de forma segura
    const isVisible = window.getComputedStyle(panel).display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
  });
});

// 🌐 Alias global por compatibilidad
window.loadSubcategories = loadSubcategoriesForCategory;

/**
 * 🧩 Escapar HTML para evitar XSS
 */
function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}
