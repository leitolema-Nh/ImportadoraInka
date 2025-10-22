<?php
/**
 * 🔍 search_advanced.php — usa el core central de búsqueda
 * No duplica la lógica ni los helpers.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', '0');

try {
    // 1️⃣ Core backend unificado
    $config = require __DIR__ . '/../config/config.php';
    $conn   = require __DIR__ . '/../config/conn.php';
    require_once __DIR__ . '/../helpers.php';          // funciones globales
    require_once __DIR__ . '/helpers-images.php';      // imágenes y rutas

    // 2️⃣ Leer parámetro multi (uno o varios términos)
    $query = trim($_GET['multi'] ?? '');
    if ($query === '') {
        echo json_encode(['status' => 'error', 'mensaje' => 'Sin término de búsqueda']);
        exit;
    }

    $terms = array_filter(array_map('trim', explode(',', $query)));
    if (empty($terms)) {
        echo json_encode(['status' => 'ok', 'productos' => []]);
        exit;
    }

    // 3️⃣ Reutilizar tu core de consulta
    // -> usa función interna del helper (ej. buscarProductosAvanzado)
    if (!function_exists('buscarProductosAvanzado')) {
        throw new Exception("Falta la función buscarProductosAvanzado() en helpers.php");
    }

    $productos = buscarProductosAvanzado($conn, $terms, $config['paths']);

    // 4️⃣ Respuesta JSON
    echo json_encode(['status' => 'ok', 'productos' => $productos], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'mensaje' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
} finally {
    if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
