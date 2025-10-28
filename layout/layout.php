<?php
/**
 * ==============================================================
 *  LAYOUT.PHP - Sistema de Layout Base
 * ==============================================================
 *  Define la funcion renderLayout() que orquesta todo
 *  Carga config.php para obtener rutas dinamicas
 *  Captura el contenido y lo pasa al template
 *  ✅ CORREGIDO: Ahora acepta parámetro $activePage
 * ==============================================================
 */

// Cargar configuracion global
$config = require_once __DIR__ . '/../config/config.php';

/**
 * Funcion principal de renderizado
 * 
 * @param string $contentFile     Archivo PHP con el contenido de la pagina
 * @param string $pageTitle       Titulo de la pagina
 * @param string $pageDescription Descripcion meta
 * @param string $activePage      Pagina activa en el menu (home|productos|nosotros|contacto)
 * @param string $extraHead       HTML adicional para <head> (opcional)
 * @param string $extraScripts    Scripts adicionales antes de </body> (opcional)
 */
function renderLayout(
    $contentFile, 
    $pageTitle = "Importadora Inka", 
    $pageDescription = "Catalogo y tienda online de Importadora Inka.",
    $activePage = 'home',
    $extraHead = '',
    $extraScripts = ''
) {
    // Validar que el archivo de contenido existe
    if (!file_exists($contentFile)) {
        die("ERROR: Archivo de contenido no encontrado: $contentFile");
    }

    // Capturar el contenido de la pagina
    ob_start();
    include $contentFile;
    $content = ob_get_clean();

    // Renderizar el template completo
    // $activePage estará disponible en layout_template.php y header.php
    include __DIR__ . '/layout_template.php';
}