/**
 * ============================================================
 * FOOTER MODULE - Lógica del Footer
 * ============================================================
 * Centraliza toda la funcionalidad del footer
 * ============================================================
 */

window.FooterModule = (function() {
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
    console.log('🔧 Inicializando FooterModule...');

    cacheElements();

    if (!elements.footer) {
      console.error('❌ Footer no encontrado');
      return false;
    }

    initBackToTop();
    initFooterLinks();
    showFooter();

    console.log('✅ FooterModule inicializado');
    return true;
  }

  // ========================================
  // CACHEAR ELEMENTOS
  // ========================================
  function cacheElements() {
    elements = {
      footer: DOM.get('footer'),
      backToTop: DOM.get('#myBtn') || createBackToTopButton(),
      footerLinks: DOM.getAll('footer a[id^="footer-link-"]')
    };
  }

  // ========================================
  // CREAR BOTÓN "VOLVER ARRIBA"
  // ========================================
  function createBackToTopButton() {
    const button = DOM.create('button', {
      id: 'myBtn',
      className: 'btn-back-to-top',
      html: '<i class="fa fa-angle-up symbol-btn-back-to-top"></i>'
    });

    document.body.appendChild(button);
    return button;
  }

  // ========================================
  // BOTÓN VOLVER ARRIBA
  // ========================================
  function initBackToTop() {
    if (!elements.backToTop) return;

    // Mostrar/ocultar según scroll
    Events.on(window, 'scroll', () => {
      if (window.pageYOffset > window.innerHeight / 2) {
        elements.backToTop.style.display = 'flex';
      } else {
        elements.backToTop.style.display = 'none';
      }
    }, { passive: true });

    // Click para volver arriba
    Events.on(elements.backToTop, 'click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    console.log('✓ Botón volver arriba inicializado');
  }

  // ========================================
  // CONFIGURAR LINKS DEL FOOTER
  // ========================================
  function initFooterLinks() {
    if (!window.CONFIG || !window.CONFIG.baseURL) {
      console.warn('⚠️ CONFIG no disponible para footer links');
      return;
    }

    const base = window.CONFIG.baseURL;

    const links = {
      'footer-link-inicio': 'pages/index.php',
      'footer-link-productos': 'pages/shop.php',
      'footer-link-nosotros': 'pages/about.php',
      'footer-link-contacto': 'pages/contacto.php'
    };

    Object.entries(links).forEach(([id, path]) => {
      const element = DOM.getById(id);
      if (element) {
        element.href = base + path;
      }
    });

    console.log('✓ Links del footer configurados');
  }

  // ========================================
  // MOSTRAR FOOTER CON ANIMACIÓN
  // ========================================
  function showFooter() {
    if (!elements.footer) return;

    // Mostrar con animación suave
    elements.footer.style.display = 'block';
    
    setTimeout(() => {
      elements.footer.style.opacity = '1';
    }, 200);

    console.log('✓ Footer visible');
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    init,
    getElements: () => elements
  };

})();

console.log('✅ FooterModule loaded');