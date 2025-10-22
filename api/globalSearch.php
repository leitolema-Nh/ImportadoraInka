<?php
/**
 * ============================================================================
 * 🔍 GLOBAL SEARCH API - Importadora INKA
 * ============================================================================
 * 
 * @description Sistema unificado de búsqueda global multi-término
 * @version 2.0.0
 * @author Tu Empresa
 * @date 2025-01-19
 * 
 * ============================================================================
 * ENDPOINTS:
 * ============================================================================
 * 
 * GET /api/globalSearch.php?q=termo
 *   → Búsqueda simple de un término
 * 
 * GET /api/globalSearch.php?multi=termo1,termo2,termo3
 *   → Búsqueda multi-término (OR logic)
 * 
 * GET /api/globalSearch.php?q=termo&limit=10
 *   → Búsqueda con límite personalizado
 * 
 * ============================================================================
 * PARÁMETROS:
 * ============================================================================
 * 
 * @param {string} q          - Término de búsqueda simple
 * @param {string} multi      - Términos múltiples separados por coma
 * @param {int}    limit      - Límite de resultados (default: 20, max: 100)
 * @param {string} fields     - Campos a retornar (opcional)
 * @param {string} orderBy    - Ordenamiento (relevance|newest|price)
 * 
 * ============================================================================
 * RESPONSE FORMAT:
 * ============================================================================
 * 
 * {
 *   "status": "ok|error",
 *   "data": {
 *     "query": {
 *       "original": "juguete stitch",
 *       "terms": ["juguete", "stitch"],
 *       "type": "multi"
 *     },
 *     "results": {
 *       "total": 45,
 *       "returned": 20,
 *       "hasMore": true
 *     },
 *     "productos": [...]
 *   },
 *   "meta": {
 *     "timestamp": "2025-01-19T10:30:00Z",
 *     "executionTime": "0.045s"
 *   }
 * }
 * 
 * ============================================================================
 * SEARCH LOGIC:
 * ============================================================================
 * 
 * Búsqueda en campos:
 *   - codigo           (peso: 100) - Código SKU del producto
 *   - codigosistema    (peso: 90)  - Código interno del sistema
 *   - descripcion      (peso: 80)  - Descripción del producto
 *   - tipoProducto     (peso: 70)  - Categoría/tipo
 * 
 * Operador OR entre términos múltiples
 * Ordenamiento por relevancia (matches exactos primero)
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Error handling
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Request tracking
$requestId = uniqid('search_', true);
$startTime = microtime(true);

// Log inicio
error_log("[$requestId] ========== GLOBAL SEARCH REQUEST ==========");
error_log("[$requestId] Method: {$_SERVER['REQUEST_METHOD']}");
error_log("[$requestId] Query: " . json_encode($_GET));

// ============================================================================
// INITIALIZATION
// ============================================================================

try {
    // Cargar dependencias
    $config = require __DIR__ . '/../config/config.php';
    $conn   = require __DIR__ . '/../config/conn.php';
    require_once __DIR__ . '/../helpers.php';
    require_once __DIR__ . '/imagesroute.php';
    
    $paths = $config['paths'];
    $env = $config['env'];
    
    error_log("[$requestId] Environment: $env");
    error_log("[$requestId] Database connected successfully");
    
} catch (Throwable $e) {
    error_log("[$requestId] CRITICAL: Initialization failed - {$e->getMessage()}");
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'System initialization failed',
        'error' => [
            'type' => 'INIT_ERROR',
            'details' => $env === 'dev' ? $e->getMessage() : 'Internal server error'
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ============================================================================
// INPUT VALIDATION & SANITIZATION
// ============================================================================

// Obtener parámetros
$rawQuery = isset($_GET['q']) ? trim($_GET['q']) : '';
$rawMulti = isset($_GET['multi']) ? trim($_GET['multi']) : '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$orderBy = isset($_GET['orderBy']) ? trim($_GET['orderBy']) : 'relevance';

// Validar límite
$limit = max(1, min(100, $limit));

// Determinar tipo de búsqueda
$searchType = '';
$searchQuery = '';

if ($rawMulti !== '') {
    $searchType = 'multi';
    $searchQuery = $rawMulti;
} elseif ($rawQuery !== '') {
    $searchType = 'simple';
    $searchQuery = $rawQuery;
} else {
    // Sin término de búsqueda
    echo json_encode([
        'status' => 'ok',
        'data' => [
            'query' => [
                'original' => '',
                'terms' => [],
                'type' => 'empty'
            ],
            'results' => [
                'total' => 0,
                'returned' => 0,
                'hasMore' => false
            ],
            'productos' => []
        ],
        'meta' => [
            'timestamp' => date('c'),
            'executionTime' => '0.000s',
            'requestId' => $requestId
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

error_log("[$requestId] Search type: $searchType");
error_log("[$requestId] Search query: $searchQuery");

// ============================================================================
// QUERY PROCESSING
// ============================================================================

// Dividir en términos individuales
// Soporta: comas, espacios, o ambos
$terms = array_filter(
    array_map('trim', preg_split('/[,\s]+/', $searchQuery))
);

if (empty($terms)) {
    echo json_encode([
        'status' => 'ok',
        'data' => [
            'query' => [
                'original' => $searchQuery,
                'terms' => [],
                'type' => $searchType
            ],
            'results' => [
                'total' => 0,
                'returned' => 0,
                'hasMore' => false
            ],
            'productos' => []
        ],
        'meta' => [
            'timestamp' => date('c'),
            'executionTime' => number_format(microtime(true) - $startTime, 3) . 's',
            'requestId' => $requestId
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

error_log("[$requestId] Terms parsed: " . json_encode($terms));

// ============================================================================
// SQL QUERY CONSTRUCTION
// ============================================================================

// Construir cláusulas WHERE con OR para cada término
$whereClauses = [];
$params = [];
$types = '';

foreach ($terms as $term) {
    $like = "%{$term}%";
    
    // Buscar en múltiples campos con OR
    $whereClauses[] = "(
        p.codigo LIKE ? OR 
        p.codigosistema LIKE ? OR 
        p.descripcion LIKE ? OR 
        p.tipoProducto LIKE ?
    )";
    
    // Agregar 4 parámetros por término (uno por cada campo)
    array_push($params, $like, $like, $like, $like);
    $types .= "ssss";
}

// Combinar cláusulas con OR
$whereSQL = implode(' OR ', $whereClauses);

// ============================================================================
// ORDENAMIENTO
// ============================================================================

$orderBySQL = "p.containerid DESC, p.id ASC"; // Default

if ($orderBy === 'relevance') {
    // Ordenar por relevancia (exactitud del match)
    $firstTerm = $terms[0];
    $orderBySQL = "
        CASE 
            WHEN p.codigo = '$firstTerm' THEN 1
            WHEN p.codigo LIKE '$firstTerm%' THEN 2
            WHEN p.codigosistema = '$firstTerm' THEN 3
            WHEN p.descripcion LIKE '%$firstTerm%' THEN 4
            ELSE 5
        END ASC,
        p.containerid DESC,
        p.id ASC
    ";
} elseif ($orderBy === 'newest') {
    $orderBySQL = "p.containerid DESC, p.id DESC";
} elseif ($orderBy === 'price') {
    $orderBySQL = "p.Pv1 ASC, p.id ASC";
}

// ============================================================================
// MAIN SQL QUERY
// ============================================================================

$sql = "
    SELECT 
        p.id, 
        p.codigo, 
        p.codigosistema,
        p.tipoProducto, 
        p.descripcion, 
        p.imagen,
        p.cantidad,
        p.tipoUnidad,
        p.Pv1 AS precio_general,
        p.Pv2 AS precio_mayor,
        p.Pv3 AS precio_docena,
        p.NroDeCajas,
        p.containerid
    FROM products p
    WHERE ($whereSQL)
      AND p.prodConfirm = 1 
      AND p.precioConfirm = 1 
      AND p.status = 0
    ORDER BY $orderBySQL
    LIMIT ?
";

error_log("[$requestId] SQL prepared with " . count($terms) . " terms");

// ============================================================================
// EXECUTE QUERY
// ============================================================================

try {
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("SQL Prepare failed: " . $conn->error);
    }
    
    // Agregar límite a los parámetros
    $params[] = $limit;
    $types .= "i";
    
    // Bind parameters
    $stmt->bind_param($types, ...$params);
    
    error_log("[$requestId] Executing query...");
    $stmt->execute();
    
    $res = $stmt->get_result();
    
    if (!$res) {
        throw new Exception("Query execution failed: " . $stmt->error);
    }
    
    error_log("[$requestId] Query executed successfully");
    
} catch (Throwable $e) {
    error_log("[$requestId] ERROR: Query execution - {$e->getMessage()}");
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database query failed',
        'error' => [
            'type' => 'QUERY_ERROR',
            'details' => $env === 'dev' ? $e->getMessage() : 'Database error'
        ],
        'meta' => [
            'timestamp' => date('c'),
            'requestId' => $requestId
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ============================================================================
// PROCESS RESULTS
// ============================================================================

$productos = [];
$rowCount = 0;

while ($row = $res->fetch_assoc()) {
    $rowCount++;
    
    // Procesar imagen
    $row['imagen'] = obtenerRutaImagen($row['imagen'], $paths);
    
    // Limpiar descripción
    $row['descripcion'] = limpiarDescripcion($row['descripcion']);
    
    // Convertir precios a float
    $row['precio_general'] = (float)($row['precio_general'] ?? 0);
    $row['precio_mayor']   = (float)($row['precio_mayor'] ?? 0);
    $row['precio_docena']  = (float)($row['precio_docena'] ?? 0);
    
    // Convertir cantidades a int
    $row['cantidad']    = (int)($row['cantidad'] ?? 0);
    $row['NroDeCajas']  = (int)($row['NroDeCajas'] ?? 0);
    $row['containerid'] = (int)($row['containerid'] ?? 0);
    
    // Agregar al array
    $productos[] = $row;
}

$hasMore = ($rowCount >= $limit);

error_log("[$requestId] Results processed: $rowCount productos");

// ============================================================================
// RESPONSE
// ============================================================================

$executionTime = microtime(true) - $startTime;

$response = [
    'status' => 'ok',
    'data' => [
        'query' => [
            'original' => $searchQuery,
            'terms' => $terms,
            'type' => $searchType,
            'orderBy' => $orderBy
        ],
        'results' => [
            'total' => $rowCount,
            'returned' => $rowCount,
            'hasMore' => $hasMore,
            'limit' => $limit
        ],
        'productos' => $productos
    ],
    'meta' => [
        'timestamp' => date('c'),
        'executionTime' => number_format($executionTime, 3) . 's',
        'requestId' => $requestId,
        'version' => '2.0.0'
    ]
];

error_log("[$requestId] Response ready: " . count($productos) . " productos");
error_log("[$requestId] Execution time: " . number_format($executionTime, 3) . 's');
error_log("[$requestId] ========== END REQUEST ==========");

// Output JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// ============================================================================
// CLEANUP
// ============================================================================

if (isset($res) && $res instanceof mysqli_result) {
    $res->free();
}

if (isset($stmt) && $stmt instanceof mysqli_stmt) {
    $stmt->close();
}

if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

exit;