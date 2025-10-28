<?php
/**
 * 🧩 productsByCategories.php — Productos por categoría y subcategorías
 * ✅ ACTUALIZADO: Soporta búsqueda con parámetro q
 * 
 * GET: category_id (int) requerido
 *      subcategory_ids[] (int[]) opcional (varios)
 *      q (string) opcional - término de búsqueda
 *      page (int, default 1), limit (int, default 20)
 * 
 * Devuelve: { status, total, pagina, por_pagina, total_paginas, productos: [] }
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
  $config = require __DIR__ . '/../config/config.php';
  $conn   = require __DIR__ . '/../config/conn.php';
  require_once __DIR__ . '/../helpers.php';
  require_once __DIR__ . '/imagesroute.php';
  $paths  = $config['paths'];
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>'Init error: '.$e->getMessage()], JSON_UNESCAPED_UNICODE);
  exit;
}

$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
$subs = isset($_GET['subcategory_ids']) ? $_GET['subcategory_ids'] : [];
if (!is_array($subs)) $subs = [$subs];

// ✅ NUEVO: Parámetro de búsqueda
$searchQuery = isset($_GET['q']) ? trim($_GET['q']) : '';

$page   = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit  = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 20;
$offset = ($page - 1) * $limit;

try {
  // Validación
  if ($categoryId <= 0) {
    echo json_encode(['status'=>'ok','total'=>0,'pagina'=>$page,'por_pagina'=>$limit,'total_paginas'=>0,'productos'=>[]], JSON_UNESCAPED_UNICODE);
    exit;
  }

  // ✅ Construir condiciones base
  $conds = "p.prodConfirm=1 AND p.precioConfirm=1 AND p.status=0 AND cp.id = ?";
  $params = [ $categoryId ];
  $types  = "i";

  // ✅ Agregar filtro de subcategorías si existen
  if (!empty($subs)) {
    $subs = array_map('intval', $subs);
    $subs = array_values(array_filter($subs, fn($n)=>$n>0));
    if ($subs) {
      $in  = implode(',', array_fill(0, count($subs), '?'));
      $conds .= " AND sp.id IN ($in)";
      $params = array_merge($params, $subs);
      $types .= str_repeat('i', count($subs));
    }
  }

  // ✅ NUEVO: Agregar filtro de búsqueda si existe
  if ($searchQuery !== '') {
    $like = "%{$searchQuery}%";
    $conds .= " AND (p.codigo LIKE ? OR p.codigosistema LIKE ? OR p.descripcion LIKE ? OR p.tipoProducto LIKE ?)";
    $params = array_merge($params, [$like, $like, $like, $like]);
    $types .= "ssss";
  }

  // Conteo
  $sqlCount = "
    SELECT COUNT(*) AS total
    FROM products p
    LEFT JOIN subcategory_products sp ON p.tipoProducto = sp.name_subcategory
    LEFT JOIN category_products cp ON sp.category_id = cp.id
    WHERE $conds
  ";
  $stmtC = $conn->prepare($sqlCount);
  if (!$stmtC) throw new Exception("Prepare count: ".$conn->error);
  $stmtC->bind_param($types, ...$params);
  $stmtC->execute();
  $rC = $stmtC->get_result();
  $total = (int)($rC->fetch_assoc()['total'] ?? 0);
  $stmtC->close();

  // Datos
  $sql = "
    SELECT 
      p.id, p.codigo, p.imagen, p.tipoProducto, p.descripcion,
      p.cantidad, p.tipoUnidad,
      p.Pv1 AS precio_general, p.Pv2 AS precio_mayor, p.Pv3 AS precio_docena,
      cp.Name_category AS categoria, p.containerid
    FROM products p
    LEFT JOIN subcategory_products sp ON p.tipoProducto = sp.name_subcategory
    LEFT JOIN category_products cp ON sp.category_id = cp.id
    WHERE $conds
    ORDER BY p.containerid DESC, p.id ASC
    LIMIT ? OFFSET ?
  ";
  $params2 = array_merge($params, [ $limit, $offset ]);
  $types2  = $types . "ii";
  $stmt = $conn->prepare($sql);
  if (!$stmt) throw new Exception("Prepare data: ".$conn->error);
  $stmt->bind_param($types2, ...$params2);
  $stmt->execute();
  $res = $stmt->get_result();

  $productos = [];
  while ($row = $res->fetch_assoc()) {
    $row['imagen']         = obtenerRutaImagen($row['imagen'], $paths);
    $row['descripcion']    = limpiarDescripcion($row['descripcion']);
    $row['precio_general'] = (float)($row['precio_general'] ?? 0);
    $row['precio_mayor']   = (float)($row['precio_mayor']   ?? 0);
    $row['precio_docena']  = (float)($row['precio_docena']  ?? 0);
    $productos[] = $row;
  }

  echo json_encode([
    'status'=>'ok',
    'total'=>$total,
    'pagina'=>$page,
    'por_pagina'=>$limit,
    'total_paginas'=> $limit > 0 ? ceil($total / $limit) : 0,
    'productos'=>$productos
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
} finally {
  if (isset($res) && $res instanceof mysqli_result) $res->free();
  if (isset($stmt) && $stmt instanceof mysqli_stmt) $stmt->close();
  if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
exit;