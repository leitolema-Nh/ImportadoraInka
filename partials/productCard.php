<?php
/**
 * ============================================================
 * 🎴 productCard.php - Template de Tarjeta de Producto
 * ============================================================
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
?>

<!-- ============================================================
     🎴 TARJETA DE PRODUCTO - ESTILO COZASTORE
     ============================================================ -->
<div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
    <div class="block2">
        
        <!-- 📸 IMAGEN DEL PRODUCTO -->
        <div class="block2-pic hov-img0">
            <img src="<?= $imagen ?>" 
                 alt="<?= $descripcion ?>"
                 onerror="this.onerror=null;this.src='<?= $config['paths']['baseURL'] ?>images/default.jpg'">
            
            <!-- 🏷️ Badge de Código -->
            <?php if ($codigo): ?>
                <span class="block2-label-new"><?= $codigo ?></span>
            <?php endif; ?>
            
            <!-- 👁️ Botón Quick View -->
            <a href="#" 
               class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
               data-id="<?= $id ?>">
                Quick View
            </a>
        </div>
        
        <!-- 📝 INFORMACIÓN DEL PRODUCTO -->
        <div class="block2-txt flex-w flex-t p-t-14">
            <div class="block2-txt-child1 flex-col-l w-full">
                
                <!-- 🏷️ Tipo de Producto -->
                <?php if ($tipoProducto): ?>
                    <span class="badge-subcat mb-2"><?= $tipoProducto ?></span>
                <?php endif; ?>
                
                <!-- 📝 Descripción/Título -->
                <a href="#" 
                   class="stext-104 cl4 hov-cl1 trans-04 js-name-detail p-b-6 product-title"
                   data-id="<?= $id ?>">
                    <?= $descripcion ?>
                </a>
                
                <!-- 💰 CAJA DE PRECIOS -->
                <div class="price-box mt-2">
                    <div class="price-header">Precios</div>
                    
                    <!-- Precio General -->
                    <div class="price-row">
                        <span class="label">General:</span>
                        <span class="value">RD$ <?= $precioGeneral ?></span>
                    </div>
                    
                    <!-- Precio Mayor (opcional) -->
                    <?php if ($mostrarMayor): ?>
                        <div class="price-row">
                            <span class="label">Mayor:</span>
                            <span class="value">RD$ <?= $precioMayor ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <!-- Precio Docena (opcional) -->
                    <?php if ($mostrarDocena): ?>
                        <div class="price-row">
                            <span class="label">Docena:</span>
                            <span class="value">RD$ <?= $precioDocena ?></span>
                        </div>
                    <?php endif; ?>
                </div>
                
            </div>
            
            <!-- ❤️ BOTÓN DE FAVORITOS -->
            <div class="block2-txt-child2 flex-r p-t-3">
                <a href="#" 
                   class="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                   data-id="<?= $id ?>"
                   title="Añadir a favoritos">
                    <i class="zmdi zmdi-favorite-outline icon-heart1 dis-block trans-04"></i>
                    <i class="zmdi zmdi-favorite icon-heart2 dis-block trans-04 ab-t-l"></i>
                </a>
            </div>
        </div>
        
    </div>
</div>