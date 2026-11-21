<?php
/**
 * 📁 categories.php — Lista de categorías con sus subcategorías y conteos
 * Devuelve:
 * {
 *   status,
 *   total_productos,                      // productos públicos en todo el catálogo
 *   categorias: [
 *     { id, nombre, total,                // total = productos públicos de la categoría
 *       subcategorias: [ { id, name_subcategory, total } ] }
 *   ]
 * }
 * `id` y `nombre` se mantienen igual que antes; lo demás es aditivo.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
  $config = require __DIR__ . '/../config/config.php';
  $conn   = require __DIR__ . '/../config/conn.php';
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>'Init error: '.$e->getMessage()], JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  $publico = "p.prodConfirm=1 AND p.precioConfirm=1 AND p.status=0";

  // Categorías
  $cats = [];
  $res = $conn->query("SELECT id, Name_category AS nombre FROM category_products ORDER BY nombre ASC");
  if (!$res) throw new Exception("Query: ".$conn->error);
  while ($row = $res->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['nombre'] = trim((string)$row['nombre']);
    $row['total'] = 0;
    $row['subcategorias'] = [];
    $cats[$row['id']] = $row;
  }
  $res->free();

  // Subcategorías con su número de productos públicos
  $res = $conn->query("
    SELECT sp.id, sp.name_subcategory, sp.category_id, COUNT(p.id) AS total
    FROM subcategory_products sp
    LEFT JOIN products p ON p.tipoProducto = sp.name_subcategory AND $publico
    GROUP BY sp.id, sp.name_subcategory, sp.category_id
    ORDER BY sp.name_subcategory ASC
  ");
  if (!$res) throw new Exception("Query: ".$conn->error);
  while ($row = $res->fetch_assoc()) {
    $cid = (int)$row['category_id'];
    if (!isset($cats[$cid])) continue;
    $total = (int)$row['total'];
    $cats[$cid]['subcategorias'][] = [
      'id' => (int)$row['id'],
      'name_subcategory' => trim((string)$row['name_subcategory']),
      'total' => $total,
    ];
    $cats[$cid]['total'] += $total;
  }
  $res->free();

  $res = $conn->query("SELECT COUNT(*) AS total FROM products p WHERE $publico");
  if (!$res) throw new Exception("Query: ".$conn->error);
  $totalProductos = (int)($res->fetch_assoc()['total'] ?? 0);

  echo json_encode([
    'status' => 'ok',
    'total_productos' => $totalProductos,
    'categorias' => array_values($cats),
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
} finally {
  if (isset($res) && $res instanceof mysqli_result) $res->free();
  if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
exit;
