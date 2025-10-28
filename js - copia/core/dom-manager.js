/**
 * ============================================================
 * DOM MANAGER - Gestor Central de Elementos DOM
 * ============================================================
 * Centraliza la selección y verificación de elementos
 * Evita errores de elementos null/undefined
 * ============================================================
 */

window.DOMManager = (function() {
  'use strict';

  // ========================================
  // CACHÉ DE ELEMENTOS
  // ========================================
  const cache = new Map();

  // ========================================
  // SELECCIÓN SEGURA DE ELEMENTOS
  // ========================================
  function get(selector, context = document) {
    // Verificar si está en caché
    if (cache.has(selector)) {
      return cache.get(selector);
    }

    const element = context.querySelector(selector);
    
    if (element) {
      cache.set(selector, element);
    }

    return element;
  }

  function getAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  function getById(id) {
    return get(`#${id}`);
  }

  // ========================================
  // VERIFICACIÓN DE EXISTENCIA
  // ========================================
  function exists(selector, context = document) {
    return get(selector, context) !== null;
  }

  // ========================================
  // CREACIÓN DE ELEMENTOS
  // ========================================
  function create(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) {
      element.className = options.className;
    }
    
    if (options.id) {
      element.id = options.id;
    }
    
    if (options.html) {
      element.innerHTML = options.html;
    }
    
    if (options.text) {
      element.textContent = options.text;
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    return element;
  }

  // ========================================
  // MANIPULACIÓN DE CLASES
  // ========================================
  function addClass(selector, className) {
    const element = get(selector);
    if (element) element.classList.add(className);
  }

  function removeClass(selector, className) {
    const element = get(selector);
    if (element) element.classList.remove(className);
  }

  function toggleClass(selector, className) {
    const element = get(selector);
    if (element) element.classList.toggle(className);
  }

  // ========================================
  // LIMPIAR CACHÉ
  // ========================================
  function clearCache() {
    cache.clear();
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    get,
    getAll,
    getById,
    exists,
    create,
    addClass,
    removeClass,
    toggleClass,
    clearCache
  };

})();

console.log('✅ DOMManager loaded');