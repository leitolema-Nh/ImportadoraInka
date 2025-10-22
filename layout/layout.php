<?php
/**
 * ==============================================================
 *  LAYOUT BASE - IMPORTADORA INKA
 *  Ubicación: /layout/layout.php
 *  Autor: ChatGPT Dev (adaptado a estructura Inka)
 *  Descripción:
 *    - Centraliza top-bar, header y footer.
 *    - Soporta título, descripción y scripts específicos.
 *    - Permite detección de entorno (dev/prod).
 * ==============================================================
 */

// ---------------------------------------------------------------
// 🔧 CONFIGURACIÓN GLOBAL
// ---------------------------------------------------------------
require_once __DIR__ . '/../config/config.php';

// Detectar entorno automáticamente
$env = (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) ? 'dev' : 'prod';

// ---------------------------------------------------------------
// 🧩 FUNCIÓN PRINCIPAL DE RENDERIZADO
// ---------------------------------------------------------------
function renderLayout($contentFile, $pageTitle = "Importadora Inka", $pageDescription = "Catálogo y tienda online de Importadora Inka.", $extraHead = '', $extraScripts = '')
{
    // Capturar contenido de la página
    ob_start();
    include $contentFile;
    $content = ob_get_clean();

    // Renderizar layout base
    include __DIR__ . '/layout_template.php';
}
