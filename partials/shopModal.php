<?php
/**
 * ============================================================================
 * 🎭 shopModal.php - Modal de Detalle de Producto RESPONSIVO
 * ============================================================================
 * ✅ UN SOLO HTML - Adaptativo con CSS
 * ✅ Mobile First Design
 * ✅ Desktop: 2 columnas centrado (Bootstrap 4)
 * ✅ Móvil: Full screen slide-up
 * ============================================================================
 */
?>

<!-- ============================================================================
     🎭 MODAL DE PRODUCTO RESPONSIVO
     ============================================================================ -->
<div class="wrap-modal1 js-modal1 modal-responsive p-t-60 p-b-20">
    
    <!-- Overlay (visible solo en desktop) -->
    <div class="overlay-modal1 js-hide-modal1"></div>

    <!-- Container Principal -->
    <div class="modal-container bg0">
        
        <!-- ========================================
             📋 HEADER
             ======================================== -->
        <div class="modal-header">
            <!-- Indicador pull-to-close (solo móvil) -->
            <div class="modal-drag-indicator"></div>
            
            <h4 class="modal-title js-modal-title mtext-105 cl2">
                Producto
            </h4>
            
            <button class="modal-close js-hide-modal1 hov3 trans-04" 
                    aria-label="Cerrar modal">
                <i class="zmdi zmdi-close fs-20"></i>
            </button>
        </div>

        <!-- ========================================
             📦 BODY (Layout adaptativo con Bootstrap 4)
             ======================================== -->
        <div class="modal-body">
            
            <!-- Bootstrap 4 Grid: 2 columnas en desktop, apiladas en móvil -->
            <div class="row">
                
                <!-- ========================================
                     📸 COLUMNA IZQUIERDA - GALERÍA
                     ======================================== -->
                <div class="col-md-6">
                    <div class="modal-gallery-section">
                        <div class="wrap-slick3 flex-sb flex-w">
                            
                            <!-- Dots de navegación -->
                            <div class="wrap-slick3-dots"></div>
                            
                            <!-- Flechas de navegación (solo desktop) -->
                            <div class="wrap-slick3-arrows flex-sb-m flex-w"></div>

                            <!-- Galería principal -->
                            <div id="modalGallery" class="slick3 gallery-lb modal-gallery">
                                <!-- Imagen por defecto (se reemplaza dinámicamente) -->
                                <div class="item-slick3" data-thumb="<?= $baseURL ?? '' ?>images/default.jpg">
                                    <div class="wrap-pic-w pos-relative">
                                        <img src="<?= $baseURL ?? '' ?>images/default.jpg" 
                                             alt="Producto"
                                             class="modal-gallery-image">
                                        <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" 
                                           href="<?= $baseURL ?? '' ?>images/default.jpg" 
                                           target="_blank"
                                           aria-label="Ver imagen en tamaño completo">
                                            <i class="fa fa-expand"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ========================================
                     📝 COLUMNA DERECHA - INFORMACIÓN
                     ======================================== -->
                <div class="col-md-6">
                    <div class="modal-info-section">
                        
                        <!-- Código del producto -->
                        <div class="modal-code-section p-b-10">
                            <span class="stext-107 cl6 js-modal-codigo">
                                <!-- Código cargado dinámicamente -->
                            </span>
                        </div>

                        <!-- Categoría -->
                        <div class="modal-category-section p-b-14">
                            <span class="badge badge-secondary js-modal-category">
                                Categoría
                            </span>
                        </div>

                        <!-- Descripción -->
                        <div class="modal-description-section p-b-20">
                            <h5 class="stext-102 cl3 p-b-10">
                                Descripción
                            </h5>
                            <p class="stext-102 cl6 js-modal-desc">
                                Cargando descripción...
                            </p>
                        </div>

                        <!-- Precios -->
                        <div class="modal-prices-section p-b-20">
                            <div class="js-modal-precios">
                                <!-- Precios cargados dinámicamente -->
                                <div class="price-box">
                                    <div class="price-header">Precios</div>
                                    <div class="price-row">
                                        <span class="label">General:</span>
                                        <span class="value">RD$ 0.00</span>
                                    </div>
                                    <div class="price-row">
                                        <span class="label">Mayor:</span>
                                        <span class="value">RD$ 0.00</span>
                                    </div>
                                    <div class="price-row">
                                        <span class="label">Docena:</span>
                                        <span class="value">RD$ 0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Información adicional -->
                        <div class="modal-extra-info p-b-20">
                            <div class="flex-w flex-m p-b-10">
                                <div class="size-203 flex-c-m stext-108 cl2">
                                    Código:
                                </div>
                                <div class="size-204 respon6-next">
                                    <span class="stext-109 cl6 js-modal-codigo-display">
                                        ---
                                    </span>
                                </div>
                            </div>

                            <div class="flex-w flex-m p-b-10">
                                <div class="size-203 flex-c-m stext-108 cl2">
                                    Disponibilidad:
                                </div>
                                <div class="size-204 respon6-next">
                                    <span class="stext-109 cl6 js-modal-disponibilidad">
                                        En stock
                                    </span>
                                </div>
                            </div>

                            <div class="flex-w flex-m p-b-10">
                                <div class="size-203 flex-c-m stext-108 cl2">
                                    Unidad:
                                </div>
                                <div class="size-204 respon6-next">
                                    <span class="stext-109 cl6 js-modal-unidad">
                                        Unidad
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Compartir en redes sociales -->
                        <div class="modal-share-section p-t-20 p-b-20">
                            <h5 class="stext-102 cl3 p-b-10">
                                Compartir
                            </h5>
                            <div class="flex-w">
                                <a href="#" 
                                   id="shareFacebook"
                                   class="fs-18 cl5 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" 
                                   data-tooltip="Facebook"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Compartir en Facebook">
                                    <i class="fa fa-facebook"></i>
                                </a>

                                <a href="#" 
                                   id="shareTwitter"
                                   class="fs-18 cl5 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" 
                                   data-tooltip="Twitter"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Compartir en Twitter">
                                    <i class="fa fa-twitter"></i>
                                </a>

                                <a href="#" 
                                   id="shareWhatsapp"
                                   class="fs-18 cl5 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" 
                                   data-tooltip="WhatsApp"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Compartir en WhatsApp">
                                    <i class="fa fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Botones de acción (desktop) -->
                        <div class="modal-actions-desktop">
                            <button class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-hide-modal1">
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
                
            </div>
            
        </div>

        <!-- ========================================
             📱 FOOTER (Solo móvil - sticky bottom)
             ======================================== -->
        <div class="modal-footer">
            <button class="modal-footer-btn js-hide-modal1">
                Cerrar
            </button>
        </div>
        
    </div>
</div>