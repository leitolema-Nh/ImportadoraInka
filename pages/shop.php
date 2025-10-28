<?php
/**
 * ============================================================================
 * 🛍️ shop.php - Página del Catálogo de Productos
 * ============================================================================
 * Versión modular usando renderLayout()
 * ✅ CORREGIDO: $activePage ahora es 'productos' (minúsculas)
 * ============================================================================
 */

require_once __DIR__ . '/../layout/layout.php';

// ============================================================================
// 📋 CONFIGURACIÓN DE LA PÁGINA
// ============================================================================

$pageTitle = 'Importadora Inka - Catálogo de Productos';
$pageDescription = 'Explora nuestro catálogo completo de productos importados de la más alta calidad';
$pageKeywords = 'catálogo, productos, importadora, inka, tienda, compras';
$pageContent = __DIR__ . '/../partials/shop-content.php';
$activePage = 'productos'; // ✅ CORREGIDO: Antes era 'PRODUCTOS' (mayúsculas)

// ============================================================================
// 🎨 SCRIPTS Y ESTILOS ESPECÍFICOS DE SHOP (Opcional)
// ============================================================================

// Si necesitas agregar CSS/JS específico de shop, puedes definirlos aquí
// y modificar layout.php para incluirlos

$pageStyles = [
    // 'css/shop-custom.css' // Ejemplo
];

$pageScripts = [
    // Los módulos se cargan automáticamente por init.js
    // No necesitas agregar nada aquí
];

// ============================================================================
// 🚀 RENDERIZAR PÁGINA
// ============================================================================

renderLayout($pageContent, $pageTitle, $pageDescription, $activePage);