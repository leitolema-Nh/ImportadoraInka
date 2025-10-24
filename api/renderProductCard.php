<?php
/**
 * ============================================================
 * 🎴 renderProductCard.php - Renderiza HTML de tarjeta
 * ============================================================
 * Recibe: productos[] (JSON array de productos)
 * Retorna: HTML de las tarjetas renderizadas
 * ============================================================
 */

header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
    // Cargar configuración
    $config = require __DIR__ . '/../config/config.php';
    $paths = $config['paths'];
    
    // Cargar helper de imágenes
    require_once __DIR__ . '/imagesroute.php';
    
    // Obtener datos POST
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['productos']) || !is_array($data['productos'])) {
        throw new Exception('No se recibieron productos válidos');
    }
    
    $productos = $data['productos'];
    
    // Iniciar buffer de salida
    ob_start();
    
    // Renderizar cada producto
    foreach ($productos as $producto) {
        // Normalizar imagen usando el helper existente
        $producto['imagen'] = obtenerRutaImagen($producto['imagen'], $paths);
        
        // Incluir template
        include __DIR__ . '/../partials/productCard.php';
    }
    
    // Obtener HTML generado
    $html = ob_get_clean();
    
    // Retornar HTML
    echo $html;
    
} catch (Throwable $e) {
    error_log('❌ renderProductCard error: ' . $e->getMessage());
    http_response_code(500);
    echo '<div class="col-12 text-center text-danger py-4">Error al renderizar productos</div>';
}