/**
 * ============================================================
 * HEADER MODULE - Lógica del Header
 * ============================================================
 * Centraliza toda la funcionalidad del header
 * Delega búsqueda a SearchModule
 * ============================================================
 */

window.HeaderModule = (function() {
  'use strict';

  const DOM = window.DOMManager;
  const Events = window.EventManager;

  // ========================================
  // ELEMENTOS
  // ========================================
  let elements = {};

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  function init() {
    console.log('🔧 Inicializando HeaderModule...');

    // Cachear elementos
    cacheElements();

    // Verificar elementos críticos
    if (!elements.header) {
      console.error('❌ Header no encontrado');
      return false;
    }

    // Inicializar funcionalidades
    initScrollBehavior();
    initMobileMenu();
    initSearchTriggers();
    initActiveLinks();

    console.log('✅ HeaderModule inicializado');
    return true;
  }

  // ========================================
  // CACHEAR ELEMENTOS
  // ========================================
  function cacheElements() {
    elements = {
      header: DOM.get('.header-v4'),
      containerDesktop: DOM.get('.container-menu-desktop'),
      topBar: DOM.get('.top-bar'),
      wrapMenuDesktop: DOM.get('.wrap-menu-desktop'),
      navbar: DOM.get('.limiter-menu-desktop'),
      hamburger: DOM.get('.btn-show-menu-mobile'),
      mobileMenu: DOM.get('.menu-mobile'),
      searchTriggers: DOM.getAll('.js-show-search'),
      // Links del menú (sin .nav-link porque el HTML usa <a> directamente)
      desktopLinks: DOM.getAll('.main-menu > li > a'),
      mobileLinks: DOM.getAll('.main-menu-m > li > a')
    };

    console.log('📦 Elementos cacheados:', {
      header: !!elements.header,
      hamburger: !!elements.hamburger,
      mobileMenu: !!elements.mobileMenu,
      searchTriggers: elements.searchTriggers.length,
      desktopLinks: elements.desktopLinks.length,
      mobileLinks: elements.mobileLinks.length
    });
  }

  // ========================================
  // COMPORTAMIENTO AL SCROLL
  // ========================================
  function initScrollBehavior() {
    if (!elements.header) return;

    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
      const currentScroll = window.pageYOffset;

      // Agregar clase cuando se hace scroll
      if (currentScroll > 50) {
        elements.header.classList.add('navbar-scrolled');
        if (elements.containerDesktop) {
          elements.containerDesktop.classList.add('fix-menu-desktop');
        }
      } else {
        elements.header.classList.remove('navbar-scrolled');
        if (elements.containerDesktop) {
          elements.containerDesktop.classList.remove('fix-menu-desktop');
        }
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    Events.on(window, 'scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    console.log('✓ Scroll behavior inicializado');
  }

  // ========================================
  // MENÚ MÓVIL
  // ========================================
  function initMobileMenu() {
    if (!elements.hamburger || !elements.mobileMenu) {
      console.warn('⚠️ Elementos de menú móvil no encontrados');
      return;
    }

    // Toggle hamburger
    Events.on(elements.hamburger, 'click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
    });

    // Cerrar al hacer click en un link
    elements.mobileLinks.forEach(link => {
      Events.on(link, 'click', () => {
        closeMobileMenu();
      });
    });

    // Cerrar al redimensionar a desktop
    Events.on(window, 'resize', () => {
      if (window.innerWidth >= 992) {
        closeMobileMenu();
      }
    });

    console.log('✓ Menú móvil inicializado');
  }

  function toggleMobileMenu() {
    elements.hamburger.classList.toggle('is-active');
    
    if (elements.hamburger.classList.contains('is-active')) {
      // Usar slideDown effect
      elements.mobileMenu.style.display = 'block';
      // Trigger reflow
      elements.mobileMenu.offsetHeight;
      elements.mobileMenu.style.opacity = '1';
    } else {
      elements.mobileMenu.style.opacity = '0';
      setTimeout(() => {
        elements.mobileMenu.style.display = 'none';
      }, 300);
    }
    
    console.log('🍔 Menú móvil toggled:', elements.hamburger.classList.contains('is-active'));
  }

  function closeMobileMenu() {
    elements.hamburger.classList.remove('is-active');
    elements.mobileMenu.style.opacity = '0';
    setTimeout(() => {
      elements.mobileMenu.style.display = 'none';
    }, 300);
  }

  // ========================================
  // TRIGGERS DE BÚSQUEDA
  // ========================================
  function initSearchTriggers() {
    if (elements.searchTriggers.length === 0) {
      console.warn('⚠️ No se encontraron triggers de búsqueda');
      return;
    }

    // Vincular triggers al SearchModule
    elements.searchTriggers.forEach(trigger => {
      Events.on(trigger, 'click', (e) => {
        e.preventDefault();
        
        // Delegar a SearchModule si existe
        if (window.SearchModule && typeof window.SearchModule.openOverlay === 'function') {
          window.SearchModule.openOverlay();
        } else {
          console.warn('⚠️ SearchModule no disponible');
        }
      });
    });

    console.log(`✓ ${elements.searchTriggers.length} triggers de búsqueda vinculados`);
  }

  // ========================================
  // LINKS ACTIVOS
  // ========================================
  function initActiveLinks() {
    const allLinks = [...elements.desktopLinks, ...elements.mobileLinks];
    
    if (allLinks.length === 0) {
      console.warn('⚠️ No se encontraron links del menú');
      return;
    }

    const currentPath = window.location.pathname;
    let activeCount = 0;

    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href && currentPath.includes(href.replace('/pages/', '').replace('.php', ''))) {
        // Marcar el link como activo
        link.classList.add('active');
        
        // Marcar el <li> padre como activo
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.classList.add('active-menu');
        }
        
        activeCount++;
      }
    });

    console.log(`✓ ${activeCount} links activos marcados`);
  }

  // ========================================
  // FUNCIONES PÚBLICAS
  // ========================================
  function getElements() {
    return elements;
  }

  function refreshActiveLinks() {
    // Limpiar activos anteriores
    [...elements.desktopLinks, ...elements.mobileLinks].forEach(link => {
      link.classList.remove('active');
      const parentLi = link.closest('li');
      if (parentLi) parentLi.classList.remove('active-menu');
    });
    
    // Re-inicializar
    initActiveLinks();
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    init,
    getElements,
    toggleMobileMenu,
    closeMobileMenu,
    refreshActiveLinks
  };

})();

console.log('✅ HeaderModule loaded');