<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', '0');
error_reporting(0);

try {
    $config = require __DIR__ . '/../config/config.php';
    $conn = require __DIR__ . '/../config/conn.php';
    require_once __DIR__ . '/../helpers.php';
    require_once __DIR__ . '/imagesroute.php';
    $paths = $config['paths'];
} catch (Throwable $e) {
    http_response_code(500);
    die(json_encode(['status'=>'error','mensaje'=>'Init: '.$e->getMessage()]));
}

// ✅ ASEGURAR QUE SEAN ENTEROS
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 20;
$offset = ($page - 1) * $limit;
$multi = isset($_GET['multi']) ? trim($_GET['multi']) : '';

try {
    if ($multi !== '') {
        $separator = (strpos($multi, '-') !== false) ? '-' : ',';
        $pattern = ($separator === '-') ? '/[\s\-]+/' : '/[,\s]+/';
        $terms = array_filter(array_map('trim', preg_split($pattern, $multi)));
        
        if ($terms) {
            $wheres = [];
            $params = [];
            $types = '';
            
            foreach ($terms as $t) {
                $like = "%{$t}%";
                $wheres[] = "(p.codigo LIKE ? OR p.codigosistema LIKE ? OR p.tipoProducto LIKE ? OR p.descripcion LIKE ?)";
                array_push($params, $like, $like, $like, $like);
                $types .= "ssss";
            }
            
            $whereSQL = implode(' OR ', $wheres);
            
            $countSql = "SELECT COUNT(*) AS total FROM products p WHERE ($whereSQL) AND p.prodConfirm=1 AND p.precioConfirm=1 AND p.status=0";
            $countStmt = $conn->prepare($countSql);
            if (!$countStmt) throw new Exception($conn->error);
            $countStmt->bind_param($types, ...$params);
            $countStmt->execute();
            $totalResults = (int)($countStmt->get_result()->fetch_assoc()['total'] ?? 0);
            $countStmt->close();
            
            $sql = "SELECT p.id, p.codigo, p.codigosistema, p.imagen, p.tipoProducto, p.descripcion, p.cantidad, p.tipoUnidad, p.Pv1 AS precio_general, p.Pv2 AS precio_mayor, p.Pv3 AS precio_docena, p.containerid FROM products p WHERE ($whereSQL) AND p.prodConfirm=1 AND p.precioConfirm=1 AND p.status=0 ORDER BY p.containerid DESC, p.id ASC LIMIT ? OFFSET ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new Exception($conn->error);
            $params[] = $limit;
            $params[] = $offset;
            $types .= "ii";
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $res = $stmt->get_result();
            
            $productos = [];
            while ($row = $res->fetch_assoc()) {
                $row['imagen'] = obtenerRutaImagen($row['imagen'], $paths);
                $row['descripcion'] = limpiarDescripcion($row['descripcion']);
                $row['precio_general'] = (float)($row['precio_general'] ?? 0);
                $row['precio_mayor'] = (float)($row['precio_mayor'] ?? 0);
                $row['precio_docena'] = (float)($row['precio_docena'] ?? 0);
                $productos[] = $row;
            }
            
            die(json_encode([
                'status'=>'ok',
                'total'=>$totalResults,
                'pagina'=>$page,
                'por_pagina'=>$limit,
                'total_paginas'=>$limit > 0 ? ceil($totalResults / $limit) : 1,
                'productos'=>$productos
            ], JSON_UNESCAPED_UNICODE));
        }
    }
    
    // ✅ QUERY SIN BÚSQUEDA (CASO NORMAL)
    $countRes = $conn->query("SELECT COUNT(*) AS total FROM products WHERE prodConfirm=1 AND precioConfirm=1 AND status=0");
    if (!$countRes) throw new Exception($conn->error);
    $total = (int)($countRes->fetch_assoc()['total'] ?? 0);
    $countRes->free();
    
    $sql = "SELECT p.id, p.codigo, p.imagen, p.tipoProducto, p.descripcion, p.cantidad, p.tipoUnidad, p.Pv1 AS precio_general, p.Pv2 AS precio_mayor, p.Pv3 AS precio_docena, cp.Name_category AS categoria, p.containerid FROM products p LEFT JOIN subcategory_products sp ON p.tipoProducto = sp.name_subcategory LEFT JOIN category_products cp ON sp.category_id = cp.id WHERE p.prodConfirm=1 AND p.precioConfirm=1 AND p.status=0 ORDER BY p.containerid DESC, p.id ASC LIMIT ? OFFSET ?";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparing statement: " . $conn->error);
    }
    
    // ✅ ASEGURAR QUE LAS VARIABLES SEAN ENTEROS ANTES DEL BIND
    $limitInt = (int)$limit;
    $offsetInt = (int)$offset;
    
    // ✅ BIND CORREGIDO - usar variables separadas
    if (!$stmt->bind_param("ii", $limitInt, $offsetInt)) {
        throw new Exception("Error binding parameters: " . $stmt->error);
    }
    
    if (!$stmt->execute()) {
        throw new Exception("Error executing statement: " . $stmt->error);
    }
    
    $res = $stmt->get_result();
    
    $productos = [];
    while ($row = $res->fetch_assoc()) {
        $row['imagen'] = obtenerRutaImagen($row['imagen'], $paths);
        $row['descripcion'] = limpiarDescripcion($row['descripcion']);
        $row['precio_general'] = (float)($row['precio_general'] ?? 0);
        $row['precio_mayor'] = (float)($row['precio_mayor'] ?? 0);
        $row['precio_docena'] = (float)($row['precio_docena'] ?? 0);
        $productos[] = $row;
    }
    
    $stmt->close();
    
    die(json_encode([
        'status'=>'ok',
        'total'=>$total,
        'pagina'=>$page,
        'por_pagina'=>$limit,
        'total_paginas'=>$limit > 0 ? ceil($total / $limit) : 0,
        'productos'=>$productos
    ], JSON_UNESCAPED_UNICODE));
    
} catch (Throwable $e) {
    http_response_code(500);
    die(json_encode([
        'status'=>'error',
        'mensaje'=>'Error fatal',
        'details'=>[
            'message'=>$e->getMessage(),
            'file'=>$e->getFile(),
            'line'=>$e->getLine()
        ]
    ], JSON_UNESCAPED_UNICODE));
}