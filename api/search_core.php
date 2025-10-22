<?php
// 📄 /api/search_core.php
// Núcleo de búsqueda unificado (usado por search.php y search_advanced.php)

function buscarProductos($conn, $q, $limit = 20) {
    $q = trim($q ?? '');
    if ($q === '') return [];

    $sql = "
        SELECT 
            p.id,
            p.codigo,
            p.tipoProducto,
            p.descripcion,
            p.codigosistema,
            p.imagen
        FROM products p
        WHERE (
            p.codigo LIKE ? 
            OR p.tipoProducto LIKE ? 
            OR p.descripcion LIKE ? 
            OR p.codigosistema LIKE ?
        )
        AND p.prodConfirm = 1
        AND p.precioConfirm = 1
        AND p.status = 0
        ORDER BY p.codigo ASC
        LIMIT ?
    ";

    $stmt = $conn->prepare($sql);
    $like = "%$q%";
    $stmt->bind_param("ssssi", $like, $like, $like, $like, $limit);
    $stmt->execute();
    $res = $stmt->get_result();

    $productos = [];
    while ($r = $res->fetch_assoc()) {
        $productos[] = $r;
    }

    return $productos;
}
