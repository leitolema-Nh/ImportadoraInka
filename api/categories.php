<?php
/**
 * 📁 categories.php — Lista de categorías
 * Devuelve: { status, categorias: [ {id, nombre} ] }
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
  $sql = "SELECT id, Name_category AS nombre FROM category_products ORDER BY nombre ASC";
  $res = $conn->query($sql);
  if (!$res) throw new Exception("Query: ".$conn->error);
  $out = [];
  while ($row = $res->fetch_assoc()) $out[] = $row;
  echo json_encode(['status'=>'ok','categorias'=>$out], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status'=>'error','mensaje'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
} finally {
  if (isset($res) && $res instanceof mysqli_result) $res->free();
  if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
exit;
