<?php
/**
 * 🔎 search.php — Búsqueda global simple (para overlay e input del catálogo)
 * GET: q (string), limit (int, default 20)
 * Busca en: codigo, codigosistema, tipoProducto, descripcion
 * Devuelve: productos básicos (id, codigo, tipoProducto, descripcion, imagen)
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

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 20;

if ($q === '') {
  echo json_encode(['status'=>'ok','productos'=>[]], JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  $like = "%" . $q . "%";
  $sql = "
    SELECT 
      p.id, p.codigo, p.codigosistema, p.tipoProducto, p.descripcion, p.imagen
    FROM products p
    WHERE (p.codigo LIKE ? OR p.codigosistema LIKE ? OR p.tipoProducto LIKE ? OR p.descripcion LIKE ?)
      AND p.prodConfirm=1 AND p.precioConfirm=1 AND p.status=0
    ORDER BY p.containerid DESC, p.id ASC
    LIMIT ?
  ";
  $stmt = $conn->prepare($sql);
  if (!$stmt) throw new Exception("Prepare: ".$conn->error);
  $stmt->bind_param("ssssi", $like, $like, $like, $like, $limit);
  $stmt->execute();
  $res = $stmt->get_result();

  $productos = [];
  while ($row = $res->fetch_assoc()) {
    $row['imagen']      = obtenerRutaImagen($row['imagen'], $paths);
    $row['descripcion'] = limpiarDescripcion($row['descripcion']);
    $productos[] = [
      'id'           => (int)$row['id'],
      'codigo'       => $row['codigo'],
      'codigosistema'=> $row['codigosistema'],
      'tipoProducto' => $row['tipoProducto'],
      'descripcion'  => $row['descripcion'],
      'imagen'       => $row['imagen']
    ];
  }

  echo json_encode(['status'=>'ok','productos'=>$productos], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
} finally {
  if (isset($res) && $res instanceof mysqli_result) $res->free();
  if (isset($stmt) && $stmt instanceof mysqli_stmt) $stmt->close();
  if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
exit;
