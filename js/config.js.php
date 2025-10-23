<?php
/**
 * ============================================================
 * CONFIG.JS.PHP - Configuración JavaScript dinámica
 * Genera variables globales CONFIG para el frontend
 * ============================================================
 */

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

// Cargar configuración PHP
$config = include __DIR__ . '/../config/config.php';
$env = $config['env'] ?? 'prod';

// Detectar protocolo
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// ============================================================
// DETECCIÓN INTELIGENTE DE BASE URL
// ============================================================

// Por defecto, asumir raíz
$baseURL = $protocol . $host . '/';

// SOLO en localhost, detectar carpeta del proyecto
if (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false) {
    $scriptPath = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/');
    $parts = explode('/', trim($scriptPath, '/'));
    
    // Si el primer segmento no es 'js', 'api', 'pages', etc., es la carpeta del proyecto
    $systemFolders = ['js', 'api', 'pages', 'config', 'vendor', 'images', 'files'];
    
    if (!empty($parts[0]) && !in_array($parts[0], $systemFolders)) {
        $baseURL = $protocol . $host . '/' . $parts[0] . '/';
    }
}

// Asegurar que termine con /
$baseURL = rtrim($baseURL, '/') . '/';

// ============================================================
// DEFINIR RUTAS
// ============================================================

$filesPath  = ($env === 'prod') ? $baseURL . 'catalogo/files/' : $baseURL . 'files/';
$imagesPath = $baseURL . 'images/';
$apiURL     = $baseURL . 'api/';

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