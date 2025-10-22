<?php
// conn.php
$config = require __DIR__ . '/config.php';
$env = $config['env'];
$db  = $config['db'][$env];

// Crear conexión mysqli
$conn = new mysqli($db['host'], $db['user'], $db['pass'], $db['name']);

// Chequeo
if ($conn->connect_error) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'mensaje' => "Error de conexión ({$env}): " . $conn->connect_error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Charset
$charset = isset($db['charset']) ? $db['charset'] : 'utf8mb4';
$conn->set_charset($charset);

return $conn;
