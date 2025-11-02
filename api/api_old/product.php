<?php
/**
 * 🧩 product.php — Detalle individual para modal
 * Devuelve JSON limpio del producto (con imagen normalizada y galería)
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
    echo json_encode(['status'=>'error','mensaje'=>'Init error: '.$e->getMessage()]);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(['status'=>'error','mensaje'=>'ID inválido']);
    exit;
}

try {
    $sql = "
        SELECT 
            p.id, p.codigo, p.imagen, p.tipoProducto, p.descripcion,
            p.cantidad, p.tipoUnidad,
            p.Pv1 AS precio_general, p.Pv2 AS precio_mayor, p.Pv3 AS precio_docena,
            cp.Name_category AS categoria, p.containerid
        FROM products p
        LEFT JOIN subcategory_products sp ON p.tipoProducto = sp.name_subcategory
        LEFT JOIN category_products cp ON sp.category_id = cp.id
        WHERE p.id = ?
          AND p.prodConfirm = 1 AND p.precioConfirm = 1 AND p.status = 0
        LIMIT 1
    ";
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception("prepare: ".$conn->error);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    if (!$row) {
        echo json_encode(['status'=>'error','mensaje'=>'Producto no encontrado']);
        exit;
    }

    $row['descripcion']    = limpiarDescripcion($row['descripcion']);
    $row['precio_general'] = (float)($row['precio_general'] ?? 0);
    $row['precio_mayor']   = (float)($row['precio_mayor']   ?? 0);
    $row['precio_docena']  = (float)($row['precio_docena']  ?? 0);

    // Imagen principal + galería
    $row['imagen']   = obtenerRutaImagen($row['imagen'], $paths);
    $row['imagenes'] = obtenerGaleriaImagenes($row['imagen'], $paths);

    echo json_encode(['status'=>'ok','producto'=>$row], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','mensaje'=>$e->getMessage()]);
} finally {
    if (isset($res) && $res instanceof mysqli_result) $res->free();
    if (isset($stmt) && $stmt instanceof mysqli_stmt) $stmt->close();
    if (isset($conn) && $conn instanceof mysqli) $conn->close();
}
exit;
