/**
 * ============================================================
 * SCRIPT LOADER - Cargador Secuencial de Scripts
 * ============================================================
 * Mueve la lógica de carga desde footer.php a JavaScript
 * Permite control programático y mejor debugging
 * ============================================================
 */

window.ScriptLoader = (function() {
  'use strict';

  // ========================================
  // CONFIGURACIÓN
  // ========================================
  const loaded = new Set();
  const loading = new Map();
  const errors = new Set();

  // ========================================
  // CARGAR SCRIPT
  // ========================================
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolver inmediatamente
      if (loaded.has(src)) {
        console.log(`✓ Ya cargado: ${src}`);
        return resolve(src);
      }

      // Si está cargando, esperar
      if (loading.has(src)) {
        return loading.get(src);
      }

      console.log(`📥 Cargando: ${src}`);

      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Mantener orden

      script.onload = () => {
        loaded.add(src);
        loading.delete(src);
        console.log(`✅ Cargado: ${src}`);
        resolve(src);
      };

      script.onerror = () => {
        errors.add(src);
        loading.delete(src);
        console.error(`❌ Error: ${src}`);
        reject(new Error(`Failed to load: ${src}`));
      };

      // Guardar promesa
      const promise = { resolve, reject };
      loading.set(src, promise);

      document.body.appendChild(script);
    });
  }

  // ========================================
  // CARGAR MÚLTIPLES SCRIPTS EN SECUENCIA
  // ========================================
  async function loadSequence(scripts, baseUrl = '') {
    console.log(`🔄 Cargando ${scripts.length} scripts en secuencia...`);
    
    const startTime = performance.now();
    
    for (const script of scripts) {
      const fullPath = baseUrl + script;
      try {
        await loadScript(fullPath);
      } catch (error) {
        console.warn(`⚠️ Continuando después de error en: ${script}`);
      }
    }
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Carga completada en ${duration}s`);
    console.log(`   - Exitosos: ${loaded.size}`);
    console.log(`   - Errores: ${errors.size}`);
    
    return {
      loaded: Array.from(loaded),
      errors: Array.from(errors),
      duration
    };
  }

  // ========================================
  // CARGAR EN PARALELO (para scripts independientes)
  // ========================================
  async function loadParallel(scripts, baseUrl = '') {
    console.log(`⚡ Cargando ${scripts.length} scripts en paralelo...`);
    
    const promises = scripts.map(script => {
      const fullPath = baseUrl + script;
      return loadScript(fullPath).catch(err => {
        console.warn(`⚠️ Error cargando: ${script}`);
        return null;
      });
    });
    
    await Promise.all(promises);
    
    return {
      loaded: Array.from(loaded),
      errors: Array.from(errors)
    };
  }

  // ========================================
  // VERIFICAR SI UN SCRIPT ESTÁ CARGADO
  // ========================================
  function isLoaded(src) {
    return loaded.has(src);
  }

  // ========================================
  // OBTENER ESTADÍSTICAS
  // ========================================
  function getStats() {
    return {
      loaded: loaded.size,
      loading: loading.size,
      errors: errors.size,
      loadedScripts: Array.from(loaded),
      errorScripts: Array.from(errors)
    };
  }

  // ========================================
  // API PÚBLICA
  // ========================================
  return {
    load: loadScript,
    loadSequence,
    loadParallel,
    isLoaded,
    getStats
  };

})();

console.log('✅ ScriptLoader loaded');