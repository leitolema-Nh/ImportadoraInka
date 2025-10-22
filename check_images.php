<?php
header('Content-Type: text/plain; charset=utf-8');

require_once __DIR__ . '/conn.php';

$sql = "SELECT id, descripcion, imagen FROM products LIMIT 5"; // solo 5 para probar
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    echo "Producto ID: {$row['id']}\n";
    echo "Descripcion: {$row['descripcion']}\n";

    $imagenes = json_decode($row['imagen'], true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo " ❌ Error decodificando JSON: " . json_last_error_msg() . "\n";
        continue;
    }

    if (is_array($imagenes)) {
        foreach ($imagenes as $img) {
            $name = $img['name'] ?? null;
            if (!$name) continue;

            // Normalizamos la ruta
            $name = str_replace("\\", "/", $name);
            $name = ltrim($name, "/");

            // Ruta real en tu servidor (ajusta según corresponda)
            $path = $_SERVER['DOCUMENT_ROOT'] . "/cozastore-master/" . $name;

            if (file_exists($path)) {
                echo " ✅ Existe: {$path}\n";
            } else {
                echo " ❌ No existe: {$path}\n";
            }
        }
    }
    echo "----------------------\n";
}
