<?php
/**
 * ============================================================
 * CONFIG.JS.PHP - Configuración JavaScript dinámica
 * Genera variables globales CONFIG para el frontend
 * ✅ CORREGIDO: Ahora usa directamente config.php (sin reimplementar lógica)
 * ============================================================
 */

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

// ✅ CARGAR CONFIGURACIÓN COMPLETA DESDE config.php
$config = include __DIR__ . '/../config/config.php';

// ✅ USAR DIRECTAMENTE LAS RUTAS QUE YA CALCULÓ config.php
$env = $config['env'];
$paths = $config['paths'];

// ✅ NO REIMPLEMENTAR LA LÓGICA - usar lo que ya está calculado
$baseURL = $paths['baseURL'];
$filesPath = $baseURL . $paths['webFiles'];
$imagesPath = $baseURL . $paths['webImages'];
$apiURL = $baseURL . 'api/';

// ============================================================
// GENERAR JAVASCRIPT
// ============================================================

// Configuración principal
echo 'window.CONFIG = ' . json_encode([
    'environment' => $env,
    'baseURL'     => $baseURL,
    'apiURL'      => $apiURL,
    'imagesPath'  => $imagesPath,
    'filesPath'   => $filesPath
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ';';

echo "\n\n";

// Helper para construir rutas absolutas
echo <<<'JAVASCRIPT'
// Helper para construir rutas absolutas
window.getAbsolutePath = function(path) {
  if (!path) return CONFIG.baseURL;
  
  // Si ya es URL absoluta, retornar tal cual
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  
  // Si comienza con /, construir desde baseURL
  if (path.startsWith('/')) {
    return CONFIG.baseURL + path.substring(1);
  }
  
  // Caso por defecto
  return CONFIG.baseURL + path;
};

// Log de configuración (solo en desarrollo)
if (CONFIG.environment === 'dev') {
  console.log('🔧 CONFIG cargado:', CONFIG);
}
JAVASCRIPT;

echo "\n";