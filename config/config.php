<?php
/**
 * 📦 CONFIG.PHP — Configuración global INKA IMPORT
 * Soporta .env para configuración explícita
 * ✅ Protegido contra redeclaración de funciones
 */

// =============================
// 🔧 CARGAR .ENV (si existe)
// =============================
if (!function_exists('loadEnv')) {
    function loadEnv($path) {
        if (!file_exists($path)) {
            return [];
        }
        
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $env = [];
        
        foreach ($lines as $line) {
            // Ignorar comentarios
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Parsear KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remover comillas si existen
                $value = trim($value, '"\'');
                
                $env[$key] = $value;
            }
        }
        
        return $env;
    }
}

// =============================
// 🔍 VERIFICAR SI ES IP LOCAL
// =============================
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
        
        // Verificar si es IP privada
        $isPublic = filter_var(
            $ip, 
            FILTER_VALIDATE_IP, 
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );
        
        // Si NO es pública, entonces es privada/local
        return ($isPublic === false);
    }
}

$rootDir = realpath(__DIR__ . '/..');
$envFile = $rootDir . '/.env';
$envVars = loadEnv($envFile);

// =============================
// 🌍 DETERMINAR ENTORNO
// =============================

// Si existe .env y define APP_ENV, usarlo
if (!empty($envVars['APP_ENV'])) {
    $env = $envVars['APP_ENV'];
    error_log("✅ CONFIG: Usando APP_ENV del .env = $env");
} else {
    // Fallback: autodetección por IP
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $env = isLocalEnvironment($host) ? 'dev' : 'prod';
    error_log("⚠️ CONFIG: .env no encontrado, autodetectando entorno = $env (host: $host)");
}

// =============================
// 🗂️ CARPETA DEL PROYECTO
// =============================

$projectFolder = '';

if ($env === 'dev') {
    // Si hay PROJECT_FOLDER en .env, usarlo
    if (!empty($envVars['PROJECT_FOLDER'])) {
        $projectFolder = trim($envVars['PROJECT_FOLDER'], '/');
        error_log("✅ CONFIG: Usando PROJECT_FOLDER del .env = $projectFolder");
    } else {
        // Fallback: autodetección
        $scriptPath = $_SERVER['SCRIPT_NAME'] ?? '/';
        $scriptPath = str_replace('\\', '/', $scriptPath);
        $parts = array_filter(explode('/', trim($scriptPath, '/')));
        
        $systemFolders = [
            'pages', 'api', 'config', 'vendor', 'images', 
            'files', 'css', 'js', 'fonts', 'data', 
            'documents', 'layout', 'partials', 'catalogo', 'appnet'
        ];
        
        if (count($parts) > 0) {
            $firstPart = reset($parts);
            if (!in_array($firstPart, $systemFolders)) {
                $projectFolder = $firstPart;
            }
        }
        
        error_log("⚠️ CONFIG: PROJECT_FOLDER autodetectado = '$projectFolder'");
    }
}
// En producción siempre es raíz (sin carpeta)

// =============================
// 🌐 BASE URL
// =============================

$baseFolder = $projectFolder ? '/' . $projectFolder . '/' : '/';
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$baseURL = $protocol . $host . $baseFolder;

error_log("🌐 CONFIG: baseURL = $baseURL");

// =============================
// 🗂️ RUTAS FÍSICAS Y WEB
// =============================

$baseFilesPath  = ($env === 'prod') ? "$rootDir/catalogo/files/" : "$rootDir/files/";
$baseImagesPath = "$rootDir/images/";

$webFilesPath   = ($env === 'prod') ? 'catalogo/files/' : 'files/';
$webImagesPath  = 'images/';

// =============================
// 🗄️ BASE DE DATOS
// =============================

// Si hay configuración en .env, usarla
$dbConfig = [
    'dev' => [
        'host'    => $envVars['DB_DEV_HOST'] ?? 'localhost',
        'user'    => $envVars['DB_DEV_USER'] ?? 'root',
        'pass'    => $envVars['DB_DEV_PASS'] ?? '',
        'name'    => $envVars['DB_DEV_NAME'] ?? 'inkaimport_v3',
        'charset' => 'utf8mb4'
    ],
    'prod' => [
        'host'    => $envVars['DB_PROD_HOST'] ?? 'localhost',
        'user'    => $envVars['DB_PROD_USER'] ?? 'u136618646_inkaimport_V3',
        'pass'    => $envVars['DB_PROD_PASS'] ?? 'Imka_Version32023!',
        'name'    => $envVars['DB_PROD_NAME'] ?? 'u136618646_inkaimport_V3',
        'charset' => 'utf8mb4'
    ]
];

// =============================
// 🚀 RETORNAR CONFIG
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