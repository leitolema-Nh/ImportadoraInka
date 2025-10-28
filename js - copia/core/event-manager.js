/**
 * ============================================================
 * EVENT MANAGER - Gestor Central de Eventos
 * ============================================================
 * Centraliza la gestión de event listeners
 * Previene duplicación de eventos
 * Facilita cleanup y debugging
 * ============================================================
 */

window.EventManager = (function() {
  'use strict';

  // ========================================
  // REGISTRO DE EVENTOS
  // ========================================
  const listeners = new Map();

  // ========================================
  // AGREGAR EVENTO
  // ========================================
  function on(selector, event, handler, options = {}) {
    const element = typeof selector === 'string' 
      ? DOMManager.get(selector) 
      : selector;

    if (!element) {
      console.warn(`⚠️ EventManager: Elemento no encontrado: ${selector}`);
      return false;
    }

    // Generar ID único para el evento
    const eventId = `${selector}_${event}_${Date.now()}`;

    // Guardar referencia
    listeners.set(eventId, {
      element,
      event,
      handler,
      options
    });

    // Agregar listener
    element.addEventListener(event, handler, options);

    return eventId;
  }

  // ========================================
  // AGREGAR EVENTO A MÚLTIPLES ELEMENTOS
  // ========================================
  function onAll(selector, event, handler, options = {}) {
    const elements = DOMManager.getAll(selector);
    
    if (elements.length === 0) {
      console.warn(`⚠️ EventManager: No se encontraron elementos: ${selector}`);
      return [];
    }

    return elements.map(element => {
      return on(element, event, handler, options);
    });
  }

  // ========================================
  // ELIMINAR EVENTO
  // ========================================
  function off(eventId) {
    const listener = listeners.get(eventId);
    
    if (listener) {
      listener.element.removeEventListener(
        listener.event, 
        listener.handler, 
        listener.options
      );
      listeners.delete(eventId);
      return true;
    }
    
    return false;
  }

  // ========================================
  // DELEGACIÓN DE EVENTOS
  // ========================================
  function delegate(parentSelector, childSelector, event, handler) {
    const parent = DOMManager.get(parentSelector);
    
    if (!parent) {
      console.warn(`⚠️ EventManager: Padre no encontrado: ${parentSelector}`);
      return false;
    }

    const delegatedHandler = function(e) {
      const target = e.target.closest(childSelector);
      if (target && parent.contains(target)) {
        handler.call(target, e);
      }
    };

    return on(parent, event, delegatedHandler, true);
  }

  // ========================================
  // EVENTO UNA SOLA VEZ
  // ========================================
  function once(selector, event, handler) {
    return on(selector, event, handler, { once: true });
  }

  // ========================================
  // LIMPIAR TODOS LOS EVENTOS
  // ========================================
  function removeAll() {
    listeners.forEach((listener, eventId) => {
      off(eventId);
    });
    console.log('🧹 EventManager: Todos los eventos eliminados');
  }

  // ========================================
  // DEBUGGING
  // ========================================
  function debug() {
    console.log('📊 EventManager: Eventos activos:', listeners.size);
    listeners.forEach((listener, id) => {
      console.log(`  - ${id}:`, listener);
    });
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    on,
    onAll,
    off,
    delegate,
    once,
    removeAll,
    debug
  };

})();

console.log('✅ EventManager loaded');