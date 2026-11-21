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

if (!function_exists('catalogoFiltros')) {
    /**
     * Filtros y orden opcionales del catálogo (shop.php).
     * GET: sort (recent|price_asc|price_desc|name), pmin, pmax, foto=1
     * Devuelve [condicionesSQL (empiezan con " AND"), params, types, orderBy].
     */
    function catalogoFiltros(array $q) {
        $conds = '';
        $params = [];
        $types = '';

        if (isset($q['pmin']) && is_numeric($q['pmin'])) {
            $conds .= " AND p.Pv1 >= ?";
            $params[] = max(0, (float)$q['pmin']);
            $types .= 'd';
        }
        if (isset($q['pmax']) && is_numeric($q['pmax'])) {
            $conds .= " AND p.Pv1 <= ?";
            $params[] = max(0, (float)$q['pmax']);
            $types .= 'd';
        }
        if (!empty($q['foto'])) {
            $conds .= " AND p.imagen IS NOT NULL AND p.imagen NOT IN ('', '[]')";
        }

        $orders = [
            'recent'     => 'p.containerid DESC, p.id ASC',
            'price_asc'  => 'p.Pv1 ASC, p.id ASC',
            'price_desc' => 'p.Pv1 DESC, p.id ASC',
            'name'       => 'p.tipoProducto ASC, p.descripcion ASC, p.id ASC',
        ];
        $sort = isset($q['sort']) && is_string($q['sort']) ? $q['sort'] : 'recent';
        $order = $orders[$sort] ?? $orders['recent'];

        return [$conds, $params, $types, $order];
    }
}

if (!function_exists('catalogoSqlNuevo')) {
    /** Expresión SQL: 1 si el producto pertenece al contenedor público más reciente. */
    function catalogoSqlNuevo() {
        return "(p.containerid = (SELECT MAX(p2.containerid) FROM products p2 WHERE p2.prodConfirm=1 AND p2.precioConfirm=1 AND p2.status=0)) AS nuevo";
    }
}
