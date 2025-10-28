<?php
/**
 * ============================================================================
 * 🎭 shopModal.php - Modal de Detalle de Producto
 * ============================================================================
 * Partial que contiene la estructura HTML del modal
 * La lógica JS está en modal.module.js
 * ============================================================================
 */
?>

<!-- ============================================================================
     🎭 MODAL DE PRODUCTO
     ============================================================================ -->
<div class="wrap-modal1 js-modal1 p-t-60 p-b-20">
    <div class="overlay-modal1 js-hide-modal1"></div>

    <div class="container">
        <div class="bg0 p-t-60 p-b-30 p-lr-15-lg how-pos3-parent">
            
            <!-- Botón cerrar -->
            <button class="how-pos3 hov3 trans-04 js-hide-modal1">
                <img src="<?= $baseURL ?>images/icons/icon-close.png" alt="CLOSE">
            </button>

            <div class="row">
                
                <!-- ========================================
                     📸 GALERÍA DE IMÁGENES (Izquierda)
                     ======================================== -->
                <div class="col-md-6 col-lg-7 p-b-30">
                    <div class="p-l-25 p-r-30 p-lr-0-lg">
                        <div class="wrap-slick3 flex-sb flex-w">
                            <div class="wrap-slick3-dots"></div>
                            <div class="wrap-slick3-arrows flex-sb-m flex-w"></div>

                            <div id="modalGallery" class="slick3 gallery-lb">
                                <!-- Las imágenes se cargan dinámicamente por modal.module.js -->
                                <div class="item-slick3" data-thumb="<?= $baseURL ?>images/default.jpg">
                                    <div class="wrap-pic-w pos-relative">
                                        <img src="<?= $baseURL ?>images/default.jpg" alt="IMG-PRODUCT">
                                        <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" 
                                           href="<?= $baseURL ?>images/default.jpg">
                                            <i class="fa fa-expand"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ========================================
                     📋 INFORMACIÓN DEL PRODUCTO (Derecha)
                     ======================================== -->
                <div class="col-md-6 col-lg-5 p-b-30">
                    <div class="p-r-50 p-t-5 p-lr-0-lg">
                        
                        <!-- ========================================
                             🏷️ TÍTULO Y CATEGORÍA
                             ======================================== -->
                        <h4 class="mtext-105 cl2 js-modal-title p-b-14">
                            Cargando...
                        </h4>

                        <div class="p-b-20">
                            <span class="badge badge-secondary js-modal-category">
                                Categoría
                            </span>
                        </div>

                        <!-- ========================================
                             💰 PRECIOS
                             ======================================== -->
                        <div class="js-modal-precios p-b-20">
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

                        <!-- ========================================
                             📝 DESCRIPCIÓN
                             ======================================== -->
                        <div class="p-b-20">
                            <h5 class="stext-102 cl3 p-b-10">
                                Descripción
                            </h5>
                            <p class="stext-102 cl6 js-modal-desc">
                                Cargando descripción...
                            </p>
                        </div>

                        <!-- ========================================
                             📦 INFORMACIÓN ADICIONAL
                             ======================================== -->
                        <div class="p-b-20">
                            <div class="flex-w flex-m p-b-10">
                                <div class="size-203 flex-c-m stext-108 cl2">
                                    Código:
                                </div>
                                <div class="size-204 respon6-next">
                                    <span class="stext-109 cl6 js-modal-codigo">
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

                        <!-- ========================================
                             📤 COMPARTIR EN REDES SOCIALES
                             ======================================== -->
                        <div class="p-t-20 p-b-20">
                            <h5 class="stext-102 cl3 p-b-10">
                                Compartir
                            </h5>
                            <div class="flex-w">
                                <a href="#" 
                                   id="shareFacebook"
                                   class="fs-18 cl5 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" 
                                   data-tooltip="Facebook"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <i class="fa fa-facebook"></i>
                                </a>

                                <a href="#" 
                                   id="shareTwitter"
                                   class="fs-18 cl5 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" 
                                   data-tooltip="Twitter"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <i class="fa fa-twitter"></i>
                                </a>

                                <a href="#" 
                                   id="shareWhatsapp"
                                   class="fs-18 cl5 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" 
                                   data-tooltip="WhatsApp"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <i class="fa fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                        <!-- ========================================
                             🎬 BOTONES DE ACCIÓN
                             ======================================== -->
                        <div class="p-t-20">
                            <button class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-hide-modal1">
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<!-- ============================================================================
     ESTILOS ESPECÍFICOS DEL MODAL
     ============================================================================ -->
<style>
/* ========================================
   🎭 MODAL BASE
   ======================================== */
.wrap-modal1 {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;
    overflow-y: auto;
}

.wrap-modal1.show-modal1 {
    visibility: visible;
    opacity: 1;
}

.overlay-modal1 {
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.7);
    cursor: pointer;
}

/* ========================================
   💰 CAJA DE PRECIOS
   ======================================== */
.price-box {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    padding: 15px;
}

.price-header {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dee2e6;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;
}

.price-row .label {
    font-weight: 500;
    color: #666;
}

.price-row .value {
    font-weight: 600;
    color: #333;
    font-size: 16px;
}

/* Destacar el precio general */
.price-row:first-of-type .value {
    color: #e74c3c;
    font-size: 18px;
}

/* ========================================
   📸 GALERÍA
   ======================================== */
.wrap-slick3 {
    position: relative;
}

.wrap-slick3-dots {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    gap: 10px;
}

.wrap-slick3-arrows {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 10;
    pointer-events: none;
}

.wrap-slick3-arrows button {
    pointer-events: all;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.wrap-slick3-arrows button:hover {
    background: #333;
    color: white;
    border-color: #333;
}

.slick3-dots {
    display: flex !important;
    gap: 8px;
}

.slick3-dots li {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
}

.slick3-dots li.slick-active {
    border-color: #333;
}

.slick3-dots li img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========================================
   🏷️ BADGES Y ETIQUETAS
   ======================================== -->
.badge {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 20px;
}

.badge-secondary {
    background: #6c757d;
    color: white;
}

/* ========================================
   📤 BOTONES DE COMPARTIR
   ======================================== */
.tooltip100 {
    position: relative;
}

.tooltip100::before {
    content: attr(data-tooltip);
    position: absolute;
    z-index: 100;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    pointer-events: none;
}

.tooltip100:hover::before {
    opacity: 1;
    visibility: visible;
}

/* ========================================
   🎬 BOTÓN CERRAR
   ======================================== */
.how-pos3 {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.how-pos3:hover {
    transform: rotate(90deg);
    background: #f8f8f8;
}

.how-pos3 img {
    width: 20px;
    height: 20px;
}

/* ========================================
   📱 RESPONSIVE
   ======================================== */
@media (max-width: 767px) {
    .wrap-modal1 .container {
        padding: 15px;
    }

    .p-r-50 {
        padding-right: 15px !important;
    }

    .p-l-25 {
        padding-left: 15px !important;
    }

    .price-row {
        font-size: 13px;
    }

    .price-row .value {
        font-size: 15px;
    }

    .slick3-dots li {
        width: 50px;
        height: 50px;
    }

    .how-pos3 {
        width: 35px;
        height: 35px;
        top: 15px;
        right: 15px;
    }
}

/* ========================================
   🎨 ANIMACIONES
   ======================================== */
@keyframes fadeInModal {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.show-modal1 .bg0 {
    animation: fadeInModal 0.4s ease-out;
}

/* ========================================
   🔒 PREVENIR SCROLL DEL BODY
   ======================================== */
body.modal-open {
    overflow: hidden;
}
</style>

<!-- ============================================================================
     📝 SCRIPT PARA INTEGRACIÓN CON LIGHTBOX (Opcional)
     ============================================================================ -->
<script>
/**
 * Este script se ejecuta cuando el modal está listo
 * Integra con librerías de lightbox si están disponibles
 */
document.addEventListener('DOMContentLoaded', function() {
    // Integración con lightGallery o similar (si está disponible)
    if (typeof lightGallery !== 'undefined') {
        const galleryElements = document.querySelectorAll('.gallery-lb');
        galleryElements.forEach(function(element) {
            lightGallery(element, {
                thumbnail: true,
                selector: 'a'
            });
        });
    }
});
</script>