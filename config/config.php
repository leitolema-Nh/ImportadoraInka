<?php
/**
 * 📦 CONFIG.PHP — Configuración global del catálogo INKA IMPORT
 * Totalmente independiente del nombre del folder (local o producción).
 */

// =============================
// 🔍 DETECCIÓN AUTOMÁTICA DE ENTORNO
// =============================

/**
 * Verifica si un host es una IP privada o localhost
 */
if (!function_exists('isLocalEnvironment')) {
    function isLocalEnvironment($host) {
        // Localhost común
        if (in_array($host, ['localhost', '127.0.0.1', '::1'])) {
            return true;
        }
        
        // Extraer IP si viene con puerto (ej: 10.0.0.21:8080)
        $hostParts = explode(':', $host);
        $ip = $hostParts[0];
        
        // Validar si es una IP válida
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            // Si no es IP válida, verificar si contiene 'localhost'
            return (strpos($host, 'localhost') !== false);
        }
        
        // Verificar si es IP privada usando flags de PHP
        // FILTER_FLAG_NO_PRIV_RANGE detecta IPs privadas (10.x, 192.168.x, 172.16-31.x)
        // FILTER_FLAG_NO_RES_RANGE detecta IPs reservadas (127.x)
        $isPublic = filter_var(
            $ip, 
            FILTER_VALIDATE_IP, 
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );
        
        // Si NO es pública, entonces es privada/local
        return ($isPublic === false);
    }
}

$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isLocal = isLocalEnvironment($host);
$env = $isLocal ? 'dev' : 'prod';

// Log para debug (comentar en producción)
if ($env === 'dev') {
    error_log("🔍 CONFIG: Host=$host, Detected as LOCAL environment");
}

// =============================
// 🌍 BASE URL AUTOMÁTICA
// =============================

// Ruta física raíz del proyecto
$rootDir = realpath(__DIR__ . '/..'); // sube un nivel desde /config/

// ✅ MEJORADO: Detectar carpeta correctamente
$projectFolder = '';

if ($isLocal) {
    // En LOCAL: buscar carpeta del proyecto
    $scriptPath = $_SERVER['SCRIPT_NAME'] ?? '/';
    $scriptPath = str_replace('\\', '/', $scriptPath);
    
    // Obtener solo el primer segmento que NO sea "pages", "api", etc.
    $parts = explode('/', trim($scriptPath, '/'));
    
    // Lista de carpetas que NO son carpeta raíz del proyecto
    $systemFolders = ['pages', 'api', 'config', 'vendor', 'images', 'files', 'css', 'js', 'fonts', 'data', 'documents', 'layout', 'partials', 'catalogo', 'appnet'];
    
    // Buscar carpeta raíz (antes de pages/api/config)
    if (count($parts) > 0) {
        $firstPart = $parts[0];
        // Si el primer segmento NO es una carpeta del sistema, es el proyecto
        if (!in_array($firstPart, $systemFolders)) {
            $projectFolder = $firstPart; // ej: "inka"
        }
    }
}
// En PRODUCCIÓN: siempre raíz (no carpeta adicional)

// Construir base folder dinámico
$baseFolder = $projectFolder ? '/' . $projectFolder . '/' : '/';

// Dominio + protocolo
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';

// Base URL completa
$baseURL = $protocol . $host . $baseFolder;

// =============================
// 🗂️ RUTAS
// =============================
$baseFilesPath  = ($env === 'prod') ? "$rootDir/catalogo/files/" : "$rootDir/files/";
$baseImagesPath = "$rootDir/images/";

$webFilesPath   = ($env === 'prod') ? 'catalogo/files/' : 'files/';
$webImagesPath  = 'images/';

// =============================
// 🗄️ BASE DE DATOS
// =============================
$dbConfig = [
  'dev' => [
    'host'    => 'localhost',
    'user'    => 'root',
    'pass'    => '',
    'name'    => 'inkaimport_v3',
    'charset' => 'utf8mb4'
  ],
  'prod' => [
    'host'    => 'localhost',
    'user'    => 'u136618646_inkaimport_V3',
    'pass'    => 'Imka_Version32023!',
    'name'    => 'u136618646_inkaimport_V3',
    'charset' => 'utf8mb4'
  ]
];

// =============================
// 🚀 RETORNAR CONFIG GLOBAL
// =============================
return [
  'env'  => $env,
  'paths' => [
    'baseURL'    => $baseURL,
    'baseFiles'  => $baseFilesPath,
    'baseImages' => $baseImagesPath,
    'webFiles'   => $webFilesPath,
    'webImages'  => $webImagesPath,
  ],
  'db' => $dbConfig
];