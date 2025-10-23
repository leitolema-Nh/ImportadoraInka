<?php
/**
 * 📁 api/imagesroute.php — Normalizador de rutas de imágenes
 * Unifica todos los casos (string/JSON/absoluto) y devuelve URL absolutas.
 * Compatible con config/config.php → $config['paths'].
 */

if (!function_exists('ir_ensure_slash')) {
    function ir_ensure_slash($s) { return rtrim((string)$s, '/') . '/'; }
}

if (!function_exists('ir_is_abs_url')) {
    function ir_is_abs_url($s) { return preg_match('#^https?://#i', (string)$s) === 1; }
}

if (!function_exists('ir_filename_like')) {
    function ir_filename_like($s) { return preg_match('#\.(jpe?g|png|gif|webp|svg)$#i', (string)$s) === 1; }
}

if (!function_exists('ir_base_url')) {
    function ir_base_url(array $paths = []) {
        // Si config ya trae baseURL, úsala
        if (!empty($paths['baseURL'])) return ir_ensure_slash($paths['baseURL']);
        // Fallback calculado
        $https  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        $scheme = $https ? 'https://' : 'http://';
        $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $script = $_SERVER['SCRIPT_NAME'] ?? '/';
        $parts  = explode('/', trim($script, '/'));
        $folder = count($parts) > 0 ? '/' . $parts[0] . '/' : '/';
        if (strpos($host, 'localhost') === false) $folder = '/';
        return $scheme . $host . ltrim($folder, '/');
    }
}

if (!function_exists('obtenerRutaImagen')) {
    /**
     * Devuelve una URL absoluta de imagen "principal".
     * $rawImagen puede ser:
     *  - string: "files/img.jpg", "images/logo.png", URL absoluta, filename simple
     *  - JSON:   objeto/array con campos name/thumbnail/url
     */
    function obtenerRutaImagen($rawImagen, array $paths) {
        $baseURL   = ir_base_url($paths);
        $webFiles  = ir_ensure_slash($paths['webFiles']  ?? 'files');
        $webImages = ir_ensure_slash($paths['webImages'] ?? 'images');
        $default   = $baseURL . $webImages . 'default.jpg';

        if (!$rawImagen || trim((string)$rawImagen) === '') return $default;

        $raw = (string)$rawImagen;

        // 1) JSON
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            if (is_array($decoded)) {
                // Array de items o map
                if (isset($decoded[0])) {
                    foreach ($decoded as $it) {
                        if (is_string($it) && $it) {
                            return obtenerRutaImagen($it, $paths);
                        }
                        if (is_array($it)) {
                            $url = $it['name'] ?? $it['thumbnail'] ?? $it['url'] ?? '';
                            if ($url) return obtenerRutaImagen($url, $paths);
                        }
                    }
                } else {
                    $url = $decoded['name'] ?? $decoded['thumbnail'] ?? $decoded['url'] ?? '';
                    if ($url) return obtenerRutaImagen($url, $paths);
                }
            }
            // Si no se obtuvo nada válido, usar default
            return $default;
        }

        // 2) URL absoluta
        if (ir_is_abs_url($raw)) return $raw;

        // 3) Normalizar rutas relativas
        $raw = ltrim($raw, '/'); // remover slash inicial si existe

        // 3.1) Si empieza con files/ o images/ - CORRECCIÓN AQUÍ
        if (stripos($raw, 'files/') === 0) {
            // Remover "files/" del inicio y agregar la ruta correcta según el entorno
            $filename = substr($raw, 6); // Remueve "files/"
            return $baseURL . $webFiles . $filename;
        }
        if (stripos($raw, 'images/') === 0) {
            // Para images, simplemente usar la ruta base + images/
            return $baseURL . $raw;
        }

        // 3.2) Si parece nombre de archivo -> asumir files/
        if (ir_filename_like($raw)) return $baseURL . $webFiles . $raw;

        // 3.3) Cualquier otro caso, default
        return $default;
    }
}

if (!function_exists('obtenerGaleriaImagenes')) {
    /**
     * Devuelve un array de URLs absolutas para galería (modal).
     */
    function obtenerGaleriaImagenes($rawImagen, array $paths) {
        $urls = [];

        if (!$rawImagen) {
            $urls[] = obtenerRutaImagen(null, $paths);
            return $urls;
        }

        $raw = (string)$rawImagen;
        $decoded = json_decode($raw, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            if (is_array($decoded)) {
                // Array de strings u objetos
                foreach ($decoded as $it) {
                    if (is_string($it) && $it) {
                        $urls[] = obtenerRutaImagen($it, $paths);
                    } elseif (is_array($it)) {
                        $url = $it['name'] ?? $it['thumbnail'] ?? $it['url'] ?? '';
                        if ($url) $urls[] = obtenerRutaImagen($url, $paths);
                    }
                }
            } else {
                // Objeto simple
                $url = $decoded['name'] ?? $decoded['thumbnail'] ?? $decoded['url'] ?? '';
                if ($url) $urls[] = obtenerRutaImagen($url, $paths);
            }
        } else {
            // String simple / nombre de archivo
            $urls[] = obtenerRutaImagen($raw, $paths);
        }

        if (empty($urls)) $urls[] = obtenerRutaImagen(null, $paths);
        // Eliminar duplicados
        $urls = array_values(array_unique($urls));
        return $urls;
    }
}