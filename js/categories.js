// ============================================================
// 📁 categories.js — Carga y gestión de categorías
// ============================================================
// Versión unificada: funciona en todos los modos (all/category/search)
// ============================================================

console.log("📁 categories.js cargando...");

// ============================================================
// 🔹 CARGAR CATEGORÍAS DESDE API
// ============================================================
async function cargarCategories() {
  console.log("📂 Cargando categorías...");
  
  try {
    const res = await fetch(`${CONFIG.apiURL}categories.php`);
    const data = await res.json();
    
    if (data.status !== 'ok') {
      console.error('❌ Error en respuesta de categorías:', data);
      return;
    }
    
    console.log(`✅ ${data.categorias?.length || 0} categorías recibidas`);
    renderCategories(data.categorias || []);
    
  } catch (e) {
    console.error('❌ Error cargarCategories:', e);
  }
}

// ============================================================
// 🔹 RENDERIZAR CATEGORÍAS EN EL DOM
// ============================================================
function renderCategories(list) {
  const container = document.getElementById('categories-container');
  
  if (!container) {
    console.warn('⚠️ No se encontró #categories-container');
    return;
  }

  container.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay categorías.</p>';
    return;
  }

  // ============================================================
  // 🟢 BOTÓN "ALL PRODUCTS" - Volver a ver todos los productos
  // ============================================================
  const allBtn = document.createElement('button');
  allBtn.className = 'category-btn';
  allBtn.textContent = 'All Products';
  allBtn.id = 'cat-all';
  
  // Marcar como activo si no hay filtros
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('cat') && !urlParams.has('multi')) {
    allBtn.classList.add('active');
  }
  
  allBtn.addEventListener('click', () => resetToAllProducts());
  container.appendChild(allBtn);

  // ============================================================
  // 📂 BOTONES DE CATEGORÍAS
  // ============================================================
  list.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat.nombre;
    btn.dataset.id = cat.id;
    btn.id = `cat-${cat.id}`;
    
    // Marcar como activo si coincide con URL
    if (urlParams.get('cat') === String(cat.id)) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => selectCategory(cat.id));
    container.appendChild(btn);
  });

  console.log(`✅ ${list.length} categorías renderizadas`);
}

// ============================================================
// 🔹 RESETEAR A "ALL PRODUCTS" (sin filtros)
// ============================================================
function resetToAllProducts() {
  console.log("🔄 Reseteando a modo 'All Products'...");
  
  // Cambiar modo global
  window.CURRENT_MODE = "all";
  window.productsPage = 1;
  
  // Limpiar URL
  window.history.pushState({}, '', window.location.pathname);
  
  // Actualizar UI de categorías
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('cat-all')?.classList.add('active');
  
  // Limpiar subcategorías
  const subContainer = document.getElementById('subcategories-container');
  if (subContainer) subContainer.innerHTML = '';
  
  // Limpiar grid
  const grid = document.getElementById('products-container');
  if (grid) grid.innerHTML = '<div class="col-12 text-center py-5"><i class="zmdi zmdi-spinner zmdi-hc-spin fs-40"></i></div>';
  
  // Mostrar botón "Cargar más"
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'inline-block';
  }
  
  // Re-vincular botón "Cargar más" para modo ALL
  if (typeof window.bindLoadMoreForAll === 'function') {
    window.bindLoadMoreForAll();
  }
  
  // Cargar productos generales
  if (typeof window.cargarProducts === 'function') {
    window.cargarProducts(1, 20, false);
  }
  
  console.log("✅ Modo 'All Products' activado");
}

// ============================================================
// 🔹 SELECCIONAR UNA CATEGORÍA
// ============================================================
async function selectCategory(categoryId) {
  console.log(`📂 Seleccionando categoría: ${categoryId}`);
  
  if (!categoryId || parseInt(categoryId) <= 0) {
    console.warn('⚠️ categoryId inválido:', categoryId);
    return;
  }

  // Cambiar modo global
  window.CURRENT_MODE = "category";
  window.SELECTED_CATEGORY_ID = categoryId;
  
  // Actualizar UI de categorías
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`cat-${categoryId}`)?.classList.add('active');
  
  // ✅ Llamar a productsByCategories.js para manejar todo
  // (carga de subcategorías, productos y actualización de URL)
  if (window.onCategoryClick && typeof window.onCategoryClick === 'function') {
    window.onCategoryClick(categoryId, true); // true = actualizar URL
  } else {
    console.warn('⚠️ onCategoryClick no disponible');
  }
  
  console.log(`✅ Categoría ${categoryId} seleccionada`);
}

// ============================================================
// 🔹 CARGAR SUBCATEGORÍAS
// ============================================================
async function cargarSubcategorias(categoryId) {
  const container = document.getElementById('subcategories-container');
  if (!container) return;

  try {
    const res = await fetch(`${CONFIG.apiURL}subcategories.php?category_id=${categoryId}`);
    const data = await res.json();

    container.innerHTML = '';

    if (data.subcategorias && data.subcategorias.length > 0) {
      data.subcategorias.forEach(sub => {
        const tag = document.createElement('span');
        tag.className = 'subcategory-tag';
        tag.textContent = sub.name_subcategory;
        tag.dataset.id = sub.id;
        tag.addEventListener('click', () => {
          tag.classList.toggle('active');
          // Esto lo debe manejar productsByCategories.js
          if (window.onSubcategoryClick && typeof window.onSubcategoryClick === 'function') {
            window.onSubcategoryClick(categoryId, sub.id, true);
          }
        });
        container.appendChild(tag);
      });
      
      console.log(`✅ ${data.subcategorias.length} subcategorías cargadas`);
    }
  } catch (e) {
    console.error('❌ Error cargando subcategorías:', e);
  }
}

// ============================================================
// 🚀 INICIALIZACIÓN
// ============================================================
function initCategories() {
  console.log("📂 Inicializando categories.js...");
  cargarCategories();
}

// Inicializar inmediatamente si el DOM está listo, sino esperar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategories);
} else {
  // DOM ya está listo, ejecutar inmediatamente
  setTimeout(initCategories, 100);
}

// Exportar funciones globalmente
window.cargarCategories = cargarCategories;
window.selectCategory = selectCategory;
window.resetToAllProducts = resetToAllProducts;

console.log("✅ categories.js cargado correctamente");