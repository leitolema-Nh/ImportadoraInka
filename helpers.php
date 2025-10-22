<?php
/**
 * 🧰 helpers.php — utilidades de BACKEND (compacto)
 * - Solo lógica de datos (nada de render/HTML)
 * - Pensado para APIs JSON (products.php, product.php, etc.)
 * - Compatible con config/config.php (usa $config['paths'])
 */

if (!function_exists('limpiarDescripcion')) {
    /**
     * Limpia descripciones procedentes de HTML/BD.
     */
    function limpiarDescripcion($txt) {
        if ($txt === null) return '';
        // Normalizar saltos de línea y espacios
        $txt = html_entity_decode($txt, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $txt = strip_tags($txt);
        // Colapsar espacios/saltos múltiples
        $txt = preg_replace('/\s+/u', ' ', $txt);
        return trim($txt);
    }
}

if (!function_exists('ensure_trailing_slash')) {
    function ensure_trailing_slash($s) {
        if ($s === null || $s === '') return '/';
        return rtrim($s, '/') . '/';
    }
}

if (!function_exists('resolver_base_url')) {
    /**
     * Devuelve una baseURL absoluta confiable.
     * Prioriza $paths['baseURL'] de config.php; si no existe, calcula desde $_SERVER.
     */
    function resolver_base_url(array $paths = []) {
        if (!empty($paths['baseURL'])) {
            return ensure_trailing_slash($paths['baseURL']);
        }
        // Fallback calculado
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        $scheme = $https ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        // Intento de detectar carpeta raíz (primer segmento)
        $script = $_SERVER['SCRIPT_NAME'] ?? '/';
        $parts = explode('/', trim($script, '/'));
        $folder = count($parts) > 0 ? '/' . $parts[0] . '/' : '/';
        // Si no es localhost, asumir raíz sitiada
        if (strpos($host, 'localhost') === false) $folder = '/';
        return $scheme . $host . ltrim($folder, '/');
    }
}

if (!function_exists('to_float')) {
    function to_float($v) {
        if ($v === null || $v === '') return 0.0;
        return (float)$v;
    }
}
