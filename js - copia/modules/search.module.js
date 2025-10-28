/**
 * ============================================================
 * SEARCH MODULE - Módulo de Búsqueda Global
 * ============================================================
 * Integra la funcionalidad de globalSearch.js en la arquitectura modular
 * Maneja el overlay de búsqueda del header
 * ============================================================
 */

window.SearchModule = (function() {
  'use strict';

  const DOM = window.DOMManager;
  const Events = window.EventManager;

  // ========================================
  // ELEMENTOS
  // ========================================
  let elements = {};
  let debounceTimer = null;
  let lastQuery = "";
  let abortController = null;

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  function init() {
    console.log('🔍 Inicializando SearchModule...');

    // Cachear elementos
    cacheElements();

    // Verificar elementos críticos
    if (!elements.overlay) {
      console.error('❌ Search overlay no encontrado');
      return false;
    }

    if (!elements.input) {
      console.error('❌ Search input no encontrado');
      return false;
    }

    // Inicializar funcionalidades
    initSearchInput();
    initSearchEvents();
    checkUrlParams();

    console.log('✅ SearchModule inicializado');
    return true;
  }

  // ========================================
  // CACHEAR ELEMENTOS
  // ========================================
  function cacheElements() {
    elements = {
      overlay: DOM.get('#global-search-overlay'),
      input: DOM.get('#globalSearchInput'),
      dropdown: DOM.get('#searchResultsDropdown'),
      closeBtn: DOM.get('#closeGlobalSearch'),
      submitBtn: DOM.get('#searchSubmitBtn'),
      triggers: DOM.getAll('.js-show-search')
    };
  }

  // ========================================
  // INICIALIZAR INPUT DE BÚSQUEDA
  // ========================================
  function initSearchInput() {
    if (!elements.input) return;

    // Input con debounce
    Events.on(elements.input, 'input', (e) => {
      const value = (e.target.value || '').trim();
      
      if (value === '') {
        if (elements.dropdown) elements.dropdown.innerHTML = '';
        lastQuery = '';
        return;
      }
      
      if (value === lastQuery) return;
      
      lastQuery = value;
      clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        if (value.length >= 2) {
          searchOverlay(value);
        }
      }, 300);
    });

    // Enter para buscar
    Events.on(elements.input, 'keydown', (e) => {
      if (e.key === 'Enter') {
        const value = elements.input.value.trim();
        if (value) {
          closeOverlay();
          searchAndShowInGrid(value);
        }
      }
      
      if (e.key === 'Escape') {
        closeOverlay();
      }
    });

    console.log('✓ Input de búsqueda inicializado');
  }

  // ========================================
  // INICIALIZAR EVENTOS
  // ========================================
  function initSearchEvents() {
    // Botón cerrar
    if (elements.closeBtn) {
      Events.on(elements.closeBtn, 'click', closeOverlay);
    }

    // Botón submit
    if (elements.submitBtn) {
      Events.on(elements.submitBtn, 'click', () => {
        const value = elements.input.value.trim();
        if (value) {
          closeOverlay();
          searchAndShowInGrid(value);
        }
      });
    }

    // Click fuera del overlay
    Events.on(elements.overlay, 'click', (e) => {
      if (e.target === elements.overlay) {
        closeOverlay();
      }
    });

    // ESC global
    Events.on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && elements.overlay.classList.contains('active')) {
        closeOverlay();
      }
    });

    console.log('✓ Eventos de búsqueda inicializados');
  }

  // ========================================
  // ABRIR OVERLAY
  // ========================================
  function openOverlay() {
    if (!elements.overlay) return;
    
    elements.overlay.classList.add('active');
    
    setTimeout(() => {
      if (elements.input) {
        elements.input.focus();
      }
    }, 100);
    
    console.log('🔍 Overlay de búsqueda abierto');
  }

  // ========================================
  // CERRAR OVERLAY
  // ========================================
  function closeOverlay() {
    if (!elements.overlay) return;
    
    elements.overlay.classList.remove('active');
    
    if (elements.input) {
      elements.input.value = '';
    }
    
    if (elements.dropdown) {
      elements.dropdown.innerHTML = '';
    }
    
    lastQuery = '';
    
    console.log('🔍 Overlay de búsqueda cerrado');
  }

  // ========================================
  // BUSCAR EN OVERLAY (Autocompletado)
  // ========================================
  async function searchOverlay(query) {
    if (!elements.dropdown) return;

    const api = window.CONFIG?.apiURL || '/api/';
    const url = `${api}globalSearch.php?q=${encodeURIComponent(query)}&limit=20`;

    try {
      console.log('🔍 Buscando en overlay:', query);

      // Cancelar búsqueda anterior
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      const res = await fetch(url, { signal: abortController.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      if (!data || data.status !== 'ok') {
        renderEmpty('No se encontraron resultados');
        return;
      }

      const productos = Array.isArray(data.data?.productos) ? data.data.productos : [];
      
      if (productos.length === 0) {
        renderEmpty('No se encontraron resultados');
        return;
      }

      // Renderizar resultados
      elements.dropdown.innerHTML = productos.map(p => buildResultItem(p, query)).join('') +
        `<div class="search-see-all" id="searchSeeAll">Ver todos los resultados (${productos.length})</div>`;

      // Eventos para items
      elements.dropdown.querySelectorAll('.search-item').forEach(el => {
        el.addEventListener('click', () => {
          const codigo = el.getAttribute('data-codigo') || '';
          if (codigo) {
            closeOverlay();
            searchAndShowInGrid(codigo);
          }
        });
      });

      // Evento "Ver todos"
      const seeAll = DOM.get('#searchSeeAll');
      if (seeAll) {
        Events.on(seeAll, 'click', () => {
          closeOverlay();
          searchAndShowInGrid(query);
        });
      }

      console.log(`✅ ${productos.length} resultados en overlay`);

    } catch (e) {
      if (e.name === 'AbortError') return;
      console.error('❌ Error búsqueda overlay:', e);
      renderEmpty('Error al buscar');
    }
  }

  // ========================================
  // BUSCAR Y MOSTRAR EN GRID
  // ========================================
  async function searchAndShowInGrid(query, page = 1, append = false) {
    const grid = DOM.get('#products-container');
    if (!grid) {
      console.error('❌ Grid de productos no encontrado');
      return;
    }

    try {
      console.log('🔍 Buscando en grid:', query, 'página:', page);
      
      // Loading
      if (!append) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><i class="zmdi zmdi-spinner zmdi-hc-spin fs-40"></i><p class="mt-3">Buscando productos...</p></div>';
      }
      
      // Preparar términos
      const terms = query.split(/[,\s]+/).filter(Boolean).join(',');
      const url = `${window.CONFIG.apiURL}products.php?multi=${encodeURIComponent(terms)}&page=${page}&limit=20`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      if (!data || data.status !== 'ok') {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No se encontraron resultados</div>';
        return;
      }

      const productos = data.productos || [];
      
      if (productos.length === 0 && !append) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No se encontraron productos</div>';
        return;
      }

      // Renderizar productos
      if (window.helpers?.renderProducts) {
        window.helpers.renderProducts(productos, append);
      }

      // Controlar botón "Cargar más"
      const loadMoreBtn = DOM.get('#load-more');
      if (loadMoreBtn) {
        if (data.pagina >= data.total_paginas) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = 'inline-block';
          
          // Remover handler anterior
          if (loadMoreBtn._searchClickHandler) {
            loadMoreBtn.removeEventListener('click', loadMoreBtn._searchClickHandler);
          }
          
          // Crear nuevo handler
          loadMoreBtn._searchClickHandler = () => {
            if (window.CURRENT_MODE === 'search') {
              window.searchPage = (window.searchPage || page) + 1;
              searchAndShowInGrid(query, window.searchPage, true);
            }
          };
          
          loadMoreBtn.addEventListener('click', loadMoreBtn._searchClickHandler);
        }
      }

      // Actualizar estado global
      window.CURRENT_MODE = 'search';
      window.currentSearchQuery = query;
      window.searchPage = page;

      // Actualizar URL
      if (!append) {
        const terms = query.split(/[,\s]+/).filter(Boolean);
        const cleanUrl = terms.join('-');
        const newUrl = `${window.location.pathname}?multi=${encodeURIComponent(cleanUrl)}`;
        window.history.pushState({ search: cleanUrl }, '', newUrl);
      }

      console.log(`✅ ${productos.length} productos mostrados (total: ${data.total}, página ${page}/${data.total_paginas})`);

    } catch (e) {
      console.error('❌ Error en búsqueda:', e);
      grid.innerHTML = '<div class="col-12 text-center text-danger py-5">Error al buscar productos</div>';
    }
  }

  // ========================================
  // VERIFICAR PARÁMETROS URL AL CARGAR
  // ========================================
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const multiParam = urlParams.get('multi');
    
    if (multiParam) {
      console.log('🔄 Parámetro multi detectado en URL:', multiParam);
      setTimeout(() => searchAndShowInGrid(multiParam), 500);
    }
  }

  // ========================================
  // HELPERS
  // ========================================
  function renderEmpty(message) {
    if (!elements.dropdown) return;
    elements.dropdown.innerHTML = `<div class="search-empty">${message || 'Sin resultados'}</div>`;
  }

  function buildResultItem(p, q) {
    const img = p.imagen || '/images/default.jpg';
    const codigo = p.codigo || '';
    const tipo = p.tipoProducto || '';
    const desc = p.descripcion || '';
    const safe = (s) => escapeHtml(String(s || ''));

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

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    init,
    openOverlay,
    closeOverlay,
    searchAndShowInGrid,
    getElements: () => elements
  };

})();

console.log('✅ SearchModule loaded');