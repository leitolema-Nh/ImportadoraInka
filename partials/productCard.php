<?php
/**
 * ============================================================
 * 🎴 productCard.php - Template OPTIMIZADO de Tarjeta
 * ============================================================
 * ✅ Badge → Título principal
 * ✅ Descripción → Descripción secundaria (clickeable)
 * ✅ Código con formato "ID: XXX"
 * ✅ Precios en español estructurados
 * ✅ Imagen clickeable → Abre modal
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

// Capitalizar el tipo de producto para el título
$tituloProducto = ucwords(strtolower($tipoProducto));
?>

<!-- ============================================================
     🎴 TARJETA DE PRODUCTO OPTIMIZADA
     ============================================================ -->
<div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
    <div class="block2">
        
        <!-- ========================================
             📸 IMAGEN DEL PRODUCTO (Clickeable)
             ======================================== -->
        <div class="block2-pic hov-img0">
            
            <!-- 🏷️ Badge OCULTO por CSS - No borrar (mantiene compatibilidad) -->
            <?php if ($tipoProducto): ?>
                <span class="badge-categoria"><?= strtoupper($tipoProducto) ?></span>
            <?php endif; ?>
            
            <!-- ✅ Imagen clickeable -->
            <img src="<?= $imagen ?>" 
                 alt="<?= $tituloProducto ?> - <?= $descripcion ?>"
                 class="js-show-modal1"
                 data-id="<?= $id ?>"
                 loading="lazy"
                 style="cursor: pointer;"
                 title="Click para ver detalles de <?= $tituloProducto ?>"
                 onerror="this.onerror=null;this.src='<?= $imagenDefault ?>'">
            
            <!-- Overlay sutil en hover -->
            <div class="block2-overlay"></div>
            
        </div>
        
        <!-- ========================================
             📋 INFORMACIÓN DEL PRODUCTO (REORDENADA)
             ======================================== -->
        <div class="block2-txt flex-w flex-t p-t-14">
            <div class="block2-txt-child1 flex-col-l">
                
                <!-- ========================================
                     🏷️ TÍTULO PRINCIPAL (Era el Badge)
                     ======================================== -->
                <?php if ($tipoProducto): ?>
                    <span class="product-category-title">
                        <?= $tituloProducto ?>
                    </span>
                <?php endif; ?>
                
                <!-- ========================================
                     📖 DESCRIPCIÓN (Era el Título - Clickeable)
                     ======================================== -->
                <h3 class="product-title stext-104 cl4 hov-cl1 trans-04 js-name-b-detail p-b-6">
                    <a href="#" 
                       class="js-name-detail js-show-modal1 product-title-link" 
                       data-id="<?= $id ?>"
                       title="Ver detalles de <?= $descripcion ?>"
                       onclick="return false;">
                        <?= $descripcion ?>
                    </a>
                </h3>
                
                <!-- ========================================
                     🔢 CÓDIGO DEL PRODUCTO
                     CSS agrega "ID: " con ::before
                     ======================================== -->
                <?php if ($codigo): ?>
                    <span class="product-code stext-105 cl3">
                        <?= $codigo ?>
                    </span>
                <?php endif; ?>
                
                <!-- ========================================
                     💰 PRECIOS ESTRUCTURADOS
                     ======================================== -->
                <div class="precios-container">
                    
                    <!-- Precio General (Por unidad) -->
                    <div class="precio-general stext-105 cl3">
                        RD$ <?= $precioGeneral ?>
                    </div>
                    
                    <!-- Precio Mayor (Por mayor 6+) -->
                    <?php if ($mostrarMayor): ?>
                        <div class="precio-mayor stext-107 cl10">
                            RD$ <?= $precioMayor ?>
                        </div>
                    <?php endif; ?>
                    
                    <!-- Precio Docena (Por docena 12+) -->
                    <?php if ($mostrarDocena): ?>
                        <div class="precio-docena stext-107 cl11">
                            RD$ <?= $precioDocena ?>
                        </div>
                    <?php endif; ?>
                    
                </div>
                
                <!-- ========================================
                     🛒 ZONA DE ACCIONES
                     ======================================== -->
                <div class="product-actions">
                    <span class="product-actions-hint stext-107 cl6">
                        <i class="zmdi zmdi-eye"></i> Click en imagen o descripción para ver detalles
                    </span>
                </div>
                
            </div>
        </div>
        
    </div>
</div>