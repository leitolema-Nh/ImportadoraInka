<?php
/**
 * 📁 subcategories.php — Lista por categoría
 * GET: category_id (int) — si no se envía, retorna vacío (status ok)
 * Devuelve: { status, subcategorias: [ {id, name_subcategory} ] }
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

$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
if ($categoryId <= 0) {
  echo json_encode(['status'=>'ok','subcategorias'=>[]], JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  $stmt = $conn->prepare("
    SELECT id, name_subcategory
    FROM subcategory_products
    WHERE category_id = ?
    ORDER BY name_subcategory ASC
  ");
  if (!$stmt) throw new Exception("Prepare: ".$conn->error);
  $stmt->bind_param("i", $categoryId);
  $stmt->execute();
  $res = $stmt->get_result();
  $out = [];
  while ($row = $res->fetch_assoc()) $out[] = $row;
  echo json_encode(['status'=>'ok','subcategorias'=>$out], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
} finally {
  if (isset($res) && $res instanceof mysqli_result) $res->free();
  if (isset($stmt) && $stmt instanceof mysqli_stmt) $stmt->close();
  if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
exit;
