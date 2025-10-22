<?php
header("Content-Type: application/javascript; charset=UTF-8");

$config = include __DIR__ . '/../config/config.php';
$env = $config['env'] ?? 'dev';

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// CORRECCIÓN CLAVE: Detectar si el request viene de /pages/
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$scriptPath = $_SERVER['SCRIPT_NAME'] ?? '/';

// Si el referer contiene /pages/ o el script está siendo llamado desde /pages/
if (strpos($referer, '/pages/') !== false) {
    // Extraer la base desde el referer
    $parts = explode('/pages/', $referer);
    $baseURL = $parts[0] . '/';
} else {
    // Lógica original para otros casos
    $scriptPath = str_replace('\\', '/', $scriptPath);
    $parts = explode('/', trim($scriptPath, '/'));
    
    // Buscar si estamos en una carpeta del proyecto
    $projectFolder = '';
    if (strpos($host, 'localhost') !== false) {
        // En localhost, tomar el primer segmento que no sea 'js'
        foreach ($parts as $part) {
            if ($part && $part !== 'js') {
                $projectFolder = $part;
                break;
            }
        }
    }
    
    $baseFolder = $projectFolder ? '/' . $projectFolder . '/' : '/';
    $baseURL = $protocol . $host . $baseFolder;
}

// Asegurar que la URL base termine con /
$baseURL = rtrim($baseURL, '/') . '/';

$filesPath  = ($env === 'prod') ? $baseURL . 'catalogo/files/' : $baseURL . 'files/';
$imagesPath = $baseURL . 'images/';
$apiURL     = $baseURL . 'api/';

echo 'window.CONFIG = ' . json_encode([
  'environment' => $env,
  'baseURL'     => $baseURL,
  'apiURL'      => $apiURL,
  'imagesPath'  => $imagesPath,
  'filesPath'   => $filesPath
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ';';

// Agregar un helper JavaScript para rutas
echo "\n\n";
echo "// Helper para construir rutas absolutas\n";
echo "window.getAbsolutePath = function(path) {\n";
echo "  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {\n";
echo "    return path;\n";
echo "  }\n";
echo "  if (path.startsWith('/')) {\n";
echo "    return CONFIG.baseURL + path.substring(1);\n";
echo "  }\n";
echo "  return CONFIG.baseURL + path;\n";
echo "};\n";