<?php
/**
 * ============================================================
 * 🎴 productCard.php - Template de Tarjeta de Producto
 * ============================================================
 * ✅ Optimizado: Imagen dominante, jerarquía visual mejorada
 * Template HTML puro para renderizar productos
 * Recibe: $producto (array con datos del producto)
 * ============================================================
 */

// Validación
if (!isset($producto) || !is_array($producto)) {
    return;
}

// Extraer datos
$id = $producto['id'] ?? 0;
$codigo = htmlspecialchars($producto['codigo'] ?? '', ENT_QUOTES, 'UTF-8');
$descripcion = htmlspecialchars($producto['descripcion'] ?? 'Sin descripción', ENT_QUOTES, 'UTF-8');
$tipoProducto = htmlspecialchars($producto['tipoProducto'] ?? '', ENT_QUOTES, 'UTF-8');
$imagen = $producto['imagen'] ?? '';
$precioGeneral = number_format($producto['precio_general'] ?? 0, 2);
$precioMayor = number_format($producto['precio_mayor'] ?? 0, 2);
$precioDocena = number_format($producto['precio_docena'] ?? 0, 2);

// Flags para mostrar precios opcionales
$mostrarMayor = ($producto['precio_mayor'] ?? 0) > 0 && $producto['precio_mayor'] != $producto['precio_general'];
$mostrarDocena = ($producto['precio_docena'] ?? 0) > 0 && $producto['precio_docena'] != $producto['precio_general'];

// URL de imagen por defecto
$imagenDefault = ($config['paths']['baseURL'] ?? '') . 'images/default.jpg';
?>

<!-- ============================================================
     🎴 TARJETA DE PRODUCTO - ESTILO INKA OPTIMIZADO
     ============================================================ -->
<div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
    <div class="block2">
        
        <!-- 📸 IMAGEN DEL PRODUCTO -->
        <div class="block2-pic">
            
            <!-- 🏷️ Badge de Categoría (arriba izquierda) -->
            <?php if ($tipoProducto): ?>
                <span class="badge-categoria"><?= strtoupper($tipoProducto) ?></span>
            <?php endif; ?>
            
            <!-- Imagen con lazy loading -->
            <img src="<?= $imagen ?>" 
                 alt="<?= $descripcion ?>"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='<?= $imagenDefault ?>'">
        </div>
        
        <!-- 📝 INFORMACIÓN DEL PRODUCTO -->
        <div class="block2-txt">
            
            <!-- 🔢 Código del Producto -->
            <?php if ($codigo): ?>
                <span class="product-code"><?= $codigo ?></span>
            <?php endif; ?>
            
            <!-- 📖 Título/Descripción -->
            <h3 class="product-title">
                <?= $descripcion ?>
            </h3>
            
            <!-- 💰 PRECIOS -->
            <div class="precios-container">
                
                <!-- Precio General (principal) -->
                <div class="precio-general">
                    RD$ <?= $precioGeneral ?>
                </div>
                
                <!-- Precio Mayor (verde) -->
                <?php if ($mostrarMayor): ?>
                    <div class="precio-mayor">
                        Mayor: RD$ <?= $precioMayor ?>
                    </div>
                <?php endif; ?>
                
                <!-- Precio Docena (amarillo) -->
                <?php if ($mostrarDocena): ?>
                    <div class="precio-docena">
                        Docena: RD$ <?= $precioDocena ?>
                    </div>
                <?php endif; ?>
                
            </div>
            
        </div>
        
    </div>
</div>