// ============================================================
// ✅ productsByCategories.js — versión final optimizada 2025
// Controla el filtrado por categorías y subcategorías con
// paginación, URL dinámica y coordinación con otros modos.
// ============================================================

(() => {
  console.log("✅ productsByCategories.js inicializado");

  // ============================================================
  // 🔹 VARIABLES GLOBALES
  // ============================================================
  let currentCategory = null;
  let selectedSubcategories = new Set();
  let subcategoryMap = {};
  let currentPage = 1;
  let totalPages = 1;

  // ============================================================
  // 🔹 BOTÓN "CARGAR MÁS"
  // ============================================================
  function bindLoadMoreForCategory() {
    const btn = document.getElementById("load-more");
    if (!btn) return;

    console.log("🔗 bindLoadMoreForCategory: Vinculando para modo CATEGORY...");

    // Remover listener anterior si existe
    if (btn._categoryClickHandler) {
      btn.removeEventListener("click", btn._categoryClickHandler);
    }

    // Crear nuevo handler
    btn._categoryClickHandler = () => {
      console.log(`🖱️ Click 'Cargar más' (modo: ${window.CURRENT_MODE}, cat: ${currentCategory})`);
      
      if (window.CURRENT_MODE !== "category") {
        console.log(`⏩ Ignorado por productsByCategories (modo ${window.CURRENT_MODE})`);
        return;
      }
      
      if (currentPage < totalPages) {
        currentPage++;
        console.log(`🔄 Cargando página ${currentPage} de categoría ${currentCategory}`);
        cargarProductosFiltrados(true);
      }
    };

    btn.addEventListener("click", btn._categoryClickHandler);
    console.log("✅ Botón vinculado para modo CATEGORY");
  }

  // ============================================================
  // 🔹 CARGAR PRODUCTOS FILTRADOS
  // ============================================================
  async function cargarProductosFiltrados(append = false) {
    if (!currentCategory) {
      console.warn("⚠️ No hay categoría seleccionada");
      return;
    }

    // ✅ Construir parámetros de subcategorías (formato: subcategory_ids[]=1&subcategory_ids[]=2)
    const subs = [...selectedSubcategories].map(id => `subcategory_ids[]=${id}`).join("&");
    const url = `${CONFIG.apiURL}productsByCategories.php?category_id=${currentCategory}&page=${currentPage}&limit=20${subs ? '&' + subs : ''}`;

    console.log(`📡 Cargando productos filtrados: cat=${currentCategory}, page=${currentPage}, subcats=[${[...selectedSubcategories].join('-')}]`);

    try {
      const res = await fetch(url);
      const text = await res.text();
      
      if (!text.trim().startsWith("{")) {
        throw new Error("Respuesta no válida (no JSON)");
      }
      
      const data = JSON.parse(text);
      
      if (data.status !== "ok") {
        throw new Error("Respuesta con error");
      }

      totalPages = data.total_paginas || 1;
      console.log(`📦 Categoría ${currentCategory} → ${data.total} productos, página ${currentPage}/${totalPages}`);

      // Render de productos
      if (helpers?.renderProducts) {
        helpers.renderProducts(data.productos || [], append);
      }

      // Mostrar/ocultar botón "Cargar más"
      const loadMoreBtn = document.getElementById("load-more");
      if (loadMoreBtn) {
        loadMoreBtn.style.display = (currentPage >= totalPages) ? "none" : "inline-block";
        console.log(`🔘 Botón 'Cargar más': ${currentPage >= totalPages ? 'oculto' : 'visible'}`);
      }

    } catch (e) {
      console.error("❌ Error cargando productos filtrados:", e);
      const container = document.getElementById("products-container");
      if (container) {
        container.innerHTML = `<div class="col-12 text-center text-danger py-4">Error cargando productos filtrados.</div>`;
      }
    }
  }

  // ============================================================
  // 🔹 CARGAR SUBCATEGORÍAS (función auxiliar)
  // ============================================================
  async function cargarSubcategorias(categoryId) {
    const container = document.getElementById('subcategories-container');
    
    if (!container) {
      console.warn('⚠️ No existe #subcategories-container');
      return;
    }

    console.log(`📑 Cargando subcategorías para categoría ${categoryId}...`);

    try {
      const res = await fetch(`${CONFIG.apiURL}subcategories.php?category_id=${categoryId}`);
      const data = await res.json();

      container.innerHTML = '';
      subcategoryMap = {};

      if (!data.subcategorias || data.subcategorias.length === 0) {
        console.log(`ℹ️ No hay subcategorías para categoría ${categoryId}`);
        return;
      }

      // Crear tags de subcategorías
      data.subcategorias.forEach(sub => {
        subcategoryMap[sub.id] = sub.name_subcategory;
        
        const tag = document.createElement('span');
        tag.className = 'subcategory-tag';
        tag.textContent = sub.name_subcategory;
        tag.dataset.id = sub.id;
        
        // Evento click en subcategoría
        tag.addEventListener('click', () => {
          onSubcategoryClick(categoryId, sub.id, true);
        });
        
        container.appendChild(tag);
      });
      
      console.log(`✅ ${data.subcategorias.length} subcategorías cargadas para categoría ${categoryId}`);
      
    } catch (e) {
      console.error('❌ Error cargando subcategorías:', e);
      container.innerHTML = `<span class="text-danger">Error al cargar subcategorías.</span>`;
    }
  }

  // ============================================================
  // 🔹 CLIC EN CATEGORÍA (llamado desde categories.js)
  // ============================================================
  async function onCategoryClick(catId, updateUrl = true) {
    console.log(`📂 onCategoryClick: categoría ${catId}`);
    
    window.CURRENT_MODE = "category";
    window.SELECTED_CATEGORY_ID = catId;
    currentCategory = catId;
    selectedSubcategories.clear();
    currentPage = 1;

    // ✅ Actualizar URL
    if (updateUrl) {
      const newUrl = `${window.location.pathname}?cat=${catId}`;
      window.history.pushState({ cat: catId }, '', newUrl);
      console.log(`🔗 URL actualizada: cat=${catId}`);
    }

    // ✅ CARGAR SUBCATEGORÍAS PRIMERO
    await cargarSubcategorias(catId);

    // Limpiar subcategorías visuales activas
    const subContainer = document.getElementById("subcategories-container");
    if (subContainer) {
      subContainer.querySelectorAll('.subcategory-tag').forEach(tag => {
        tag.classList.remove('active');
      });
    }

    // Cargar productos de la categoría
    await cargarProductosFiltrados(false);

    // Vincular botón "Cargar más"
    bindLoadMoreForCategory();
  }

  // ============================================================
  // 🔹 CLIC EN SUBCATEGORÍA
  // ============================================================
  function onSubcategoryClick(catId, subcatId, updateUrl = true) {
    console.log(`📑 onSubcategoryClick: cat=${catId}, subcat=${subcatId}`);
    
    if (selectedSubcategories.has(subcatId)) {
      selectedSubcategories.delete(subcatId);
      console.log(`➖ Subcategoría ${subcatId} removida`);
    } else {
      selectedSubcategories.add(subcatId);
      console.log(`➕ Subcategoría ${subcatId} agregada`);
    }

    // Actualizar UI
    const tag = document.querySelector(`.subcategory-tag[data-id="${subcatId}"]`);
    if (tag) {
      tag.classList.toggle("active");
    }

    // ✅ Actualizar URL con subcategorías
    if (updateUrl) {
      updateSubcatsInUrl();
    }

    // Resetear paginación y recargar
    currentPage = 1;
    cargarProductosFiltrados(false);
  }

  // ============================================================
  // 🔹 ACTUALIZAR URL CON SUBCATEGORÍAS
  // ============================================================
  function updateSubcatsInUrl() {
    const ids = [...selectedSubcategories];
    const params = new URLSearchParams();
    
    if (currentCategory) {
      params.set('cat', currentCategory);
    }
    
    if (ids.length > 0) {
      // ✅ Usar guión (-) como separador en lugar de coma
      // Resultado: ?cat=2&subcat=206-204-205 (limpio y sin encoding)
      params.set('subcat', ids.join('-'));
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ cat: currentCategory, subcat: ids }, '', newUrl);
    
    console.log(`🔗 URL actualizada: cat=${currentCategory}, subcat=${ids.join('-')}`);
  }

  // ============================================================
  // 🚀 INICIALIZACIÓN AL CARGAR
  // ============================================================
  window.addEventListener("load", () => {
    console.log("🚀 productsByCategories.js: Verificando URL...");
    
    // Si hay parámetro 'cat' en URL, activar modo categoría
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    const subcatParam = urlParams.get('subcat');
    
    if (catParam) {
      console.log(`📂 Parámetro 'cat' detectado: ${catParam}`);
      currentCategory = parseInt(catParam);
      
      // ✅ Restaurar subcategorías si existen en URL
      // Soporta tanto guión (-) como coma (,) para retrocompatibilidad
      if (subcatParam) {
        const separator = subcatParam.includes('-') ? '-' : ',';
        const subcatIds = subcatParam.split(separator)
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));
        
        console.log(`📑 Parámetros 'subcat' detectados: ${subcatIds.join(separator)}`);
        subcatIds.forEach(id => selectedSubcategories.add(id));
      }
      
      setTimeout(() => {
        // Primero marcar la categoría como activa
        const catBtn = document.getElementById(`cat-${catParam}`);
        if (catBtn) {
          document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
          catBtn.classList.add('active');
        }
        
        // Cargar subcategorías
        cargarSubcategorias(catParam).then(() => {
          // Marcar subcategorías como activas si están en el set
          selectedSubcategories.forEach(subcatId => {
            const tag = document.querySelector(`.subcategory-tag[data-id="${subcatId}"]`);
            if (tag) {
              tag.classList.add('active');
            }
          });
          
          // Cargar productos con los filtros aplicados
          window.CURRENT_MODE = "category";
          cargarProductosFiltrados(false);
          bindLoadMoreForCategory();
        });
      }, 500);
    }
  });

  // ============================================================
  // 🌐 EXPORTAR FUNCIONES GLOBALMENTE
  // ============================================================
  window.onCategoryClick = onCategoryClick;
  window.onSubcategoryClick = onSubcategoryClick;
  window.cargarProductosFiltrados = cargarProductosFiltrados;
  window.bindLoadMoreForCategory = bindLoadMoreForCategory;
  window.updateSubcatsInUrl = updateSubcatsInUrl;
  window.cargarSubcategoriasForCategory = cargarSubcategorias;

  console.log("✅ productsByCategories.js listo");

})();