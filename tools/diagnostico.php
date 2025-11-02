<?php
/**
 * 🔍 DIAGNÓSTICO - Ver errores del API
 * Acceder a: http://localhost/inka/diagnostico.php
 */

// Mostrar todos los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔍 Diagnóstico INKA IMPORT</h1>";
echo "<hr>";

// 1. Verificar config
echo "<h2>1️⃣ Configuración</h2>";
try {
    $config = require __DIR__ . '/config/config.php';
    echo "✅ config.php cargado correctamente<br>";
    echo "<pre>";
    print_r($config);
    echo "</pre>";
} catch (Exception $e) {
    echo "❌ Error en config.php: " . $e->getMessage() . "<br>";
}

echo "<hr>";

// 2. Verificar conexión BD
echo "<h2>2️⃣ Conexión a Base de Datos</h2>";
try {
    $conn = require __DIR__ . '/config/conn.php';
    echo "✅ Conexión exitosa<br>";
    echo "Base de datos: " . $config['db'][$config['env']]['name'] . "<br>";
    echo "Entorno: " . $config['env'] . "<br>";
} catch (Exception $e) {
    echo "❌ Error en conexión: " . $e->getMessage() . "<br>";
}

echo "<hr>";

// 3. Probar query básica
echo "<h2>3️⃣ Consulta de Productos</h2>";
try {
    $sql = "SELECT COUNT(*) as total FROM productos";
    $result = $conn->query($sql);
    
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Tabla 'productos' encontrada<br>";
        echo "Total de productos: " . $row['total'] . "<br>";
        
        // Ver estructura de la tabla
        $sqlColumns = "DESCRIBE productos";
        $resultColumns = $conn->query($sqlColumns);
        
        echo "<h3>Columnas de la tabla:</h3>";
        echo "<ul>";
        while ($col = $resultColumns->fetch_assoc()) {
            echo "<li>" . $col['Field'] . " (" . $col['Type'] . ")</li>";
        }
        echo "</ul>";
        
    } else {
        echo "❌ Error en query: " . $conn->error . "<br>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

echo "<hr>";

// 4. Simular llamada al API
echo "<h2>4️⃣ Simular API products.php</h2>";
echo "<p>Intentando ejecutar la misma lógica del API...</p>";

try {
    $_GET['page'] = 1;
    $_GET['limit'] = 20;
    
    ob_start();
    include __DIR__ . '/api/products.php';
    $output = ob_get_clean();
    
    echo "✅ API ejecutado sin errores fatales<br>";
    echo "<h3>Respuesta:</h3>";
    echo "<pre>" . htmlspecialchars($output) . "</pre>";
    
} catch (Exception $e) {
    echo "❌ Error al ejecutar API: " . $e->getMessage() . "<br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<hr>";
echo "<p><strong>🔗 Probar API directamente:</strong></p>";
echo "<ul>";
echo "<li><a href='api/products.php?page=1&limit=20' target='_blank'>api/products.php?page=1&limit=20</a></li>";
echo "<li><a href='api/categories.php' target='_blank'>api/categories.php</a></li>";
echo "</ul>";