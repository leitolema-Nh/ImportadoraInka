<?php
/**
 * 🔍 TEST DEBUG - Diagnosticar error en products.php
 */

// Activar TODOS los errores
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

echo "<h1>Test de Diagnóstico</h1>";
echo "<pre>";

// Test 1: Verificar que PHP funciona
echo "✅ PHP funciona correctamente\n";
echo "Versión PHP: " . phpversion() . "\n\n";

// Test 2: Verificar config.php
echo "📂 Test 2: Cargando config.php...\n";
try {
    $config = require __DIR__ . '/../config/config.php';
    echo "✅ config.php cargado\n";
    echo "Entorno: " . ($config['env'] ?? 'no definido') . "\n\n";
} catch (Throwable $e) {
    echo "❌ ERROR en config.php: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
    exit;
}

// Test 3: Verificar conn.php
echo "🔌 Test 3: Cargando conn.php...\n";
try {
    $conn = require __DIR__ . '/../config/conn.php';
    echo "✅ conn.php cargado\n";
    if ($conn instanceof mysqli) {
        echo "✅ Conexión MySQL establecida\n\n";
    } else {
        echo "❌ conn no es un objeto mysqli\n\n";
    }
} catch (Throwable $e) {
    echo "❌ ERROR en conn.php: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
    exit;
}

// Test 4: Verificar helpers.php
echo "🧰 Test 4: Cargando helpers.php...\n";
try {
    require_once __DIR__ . '/../helpers.php';
    echo "✅ helpers.php cargado\n";
    
    if (function_exists('limpiarDescripcion')) {
        echo "✅ Función limpiarDescripcion existe\n";
    } else {
        echo "⚠️ Función limpiarDescripcion NO existe\n";
    }
} catch (Throwable $e) {
    echo "❌ ERROR en helpers.php: " . $e->getMessage() . "\n";
    exit;
}

// Test 5: Verificar imagesroute.php
echo "\n📸 Test 5: Cargando imagesroute.php...\n";
try {
    require_once __DIR__ . '/imagesroute.php';
    echo "✅ imagesroute.php cargado\n";
    
    if (function_exists('obtenerRutaImagen')) {
        echo "✅ Función obtenerRutaImagen existe\n";
    } else {
        echo "⚠️ Función obtenerRutaImagen NO existe\n";
    }
} catch (Throwable $e) {
    echo "❌ ERROR en imagesroute.php: " . $e->getMessage() . "\n";
    exit;
}

// Test 6: Test de query básica
echo "\n📊 Test 6: Query de prueba a la BD...\n";
try {
    $sql = "SELECT COUNT(*) as total FROM products WHERE prodConfirm=1 AND precioConfirm=1 AND status=0";
    $result = $conn->query($sql);
    
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Query ejecutada correctamente\n";
        echo "Total productos: " . $row['total'] . "\n";
    } else {
        echo "❌ Error en query: " . $conn->error . "\n";
    }
} catch (Throwable $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}

// Test 7: Verificar estructura de paths
echo "\n🗂️ Test 7: Verificando estructura de paths...\n";
$paths = $config['paths'] ?? [];
echo "baseURL: " . ($paths['baseURL'] ?? 'NO DEFINIDO') . "\n";
echo "webFiles: " . ($paths['webFiles'] ?? 'NO DEFINIDO') . "\n";
echo "webImages: " . ($paths['webImages'] ?? 'NO DEFINIDO') . "\n";

echo "\n\n✅ TODOS LOS TESTS COMPLETADOS\n";
echo "Si llegaste aquí, el problema está en la lógica de products.php, no en las dependencias.\n";

echo "</pre>";