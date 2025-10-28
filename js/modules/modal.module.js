// ============================================================================
// 🎭 modal.module.js - Módulo de Modal de Producto
// ============================================================================
// Consolida: modal.js, shopModal.js
// ============================================================================

console.log('🎭 modal.module.js cargando...');

export class ModalModule {
    constructor() {
        console.log('🏗️ ModalModule: Inicializando...');
        
        // ============================================
        // 🎯 ELEMENTOS DOM
        // ============================================
        this.dom = {
            modal: document.querySelector('.js-modal1'),
            overlay: null,
            gallery: null,
            title: null,
            description: null,
            priceBox: null,
            closeBtns: []
        };

        // Inicializar elementos internos del modal
        if (this.dom.modal) {
            this.dom.overlay = this.dom.modal.querySelector('.overlay-modal1');
            this.dom.gallery = this.dom.modal.querySelector('#modalGallery');
            this.dom.title = this.dom.modal.querySelector('.js-modal-title');
            this.dom.description = this.dom.modal.querySelector('.js-modal-desc');
            this.dom.priceBox = this.dom.modal.querySelector('.js-modal-precios');
            this.dom.closeBtns = this.dom.modal.querySelectorAll('.js-hide-modal1');
        }

        // ============================================
        // 📊 ESTADO
        // ============================================
        this.currentProduct = null;
    }

    // ============================================================================
    // 🚀 INICIALIZACIÓN
    // ============================================================================
    
    init() {
        console.log('🚀 ModalModule: Iniciando...');
        
        if (!this.dom.modal) {
            console.error('❌ No se encontró el modal (.js-modal1)');
            return;
        }

        this.setupEvents();
        this.setupGlobalTriggers();
        
        // Exportar globalmente
        window.shopModal = {
            open: (product) => this.open(product),
            close: () => this.close()
        };
        
        console.log('✅ ModalModule inicializado correctamente');
    }

    // ============================================================================
    // 🎯 CONFIGURAR EVENTOS
    // ============================================================================
    
    setupEvents() {
        // Cerrar con overlay
        if (this.dom.overlay) {
            this.dom.overlay.addEventListener('click', () => this.close());
        }

        // Cerrar con botones
        this.dom.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    setupGlobalTriggers() {
        // Delegar eventos a nivel documento para botones dinámicos
        document.addEventListener('click', (e) => {
            // Botón "Ver detalle"
            const btn = e.target.closest('.js-show-modal1');
            if (btn) {
                e.preventDefault();
                const productId = btn.getAttribute('data-id');
                if (productId) {
                    this.loadAndOpen(productId);
                }
            }

            // Botón desde título del producto
            const link = e.target.closest('.js-name-detail');
            if (link) {
                e.preventDefault();
                const productId = link.getAttribute('data-id');
                if (productId) {
                    this.loadAndOpen(productId);
                }
            }
        });
    }

    // ============================================================================
    // 📡 CARGAR Y ABRIR PRODUCTO
    // ============================================================================
    
    async loadAndOpen(productId) {
        console.log('📡 Cargando producto:', productId);
        
        try {
            const response = await window.helpers.fetchJSON(`product.php?id=${productId}`);
            console.log('🔍 Respuesta de API:', response);
            
            const product = response?.producto || response?.data || response;
            
            if (product && typeof product === 'object') {
                this.open(product);
            } else {
                console.error('❌ Producto inválido:', response);
                alert('Error al cargar el producto');
            }
        } catch (err) {
            console.error('❌ Error en loadAndOpen:', err);
            alert('Error al cargar el producto');
        }
    }

    // ============================================================================
    // 🟢 ABRIR MODAL
    // ============================================================================
    
    open(product) {
        console.log('🟢 Abriendo modal con producto:', product);
        
        // Validación
        if (!product || typeof product !== 'object') {
            console.error('❌ Producto inválido:', product);
            return;
        }

        this.currentProduct = product;

        // Actualizar contenido
        this.updateTitle(product);
        this.updateDescription(product);
        this.updatePrices(product);
        this.updateGallery(product);
        this.updateSocialLinks(product);

        // Mostrar modal
        this.dom.modal.classList.add('show-modal1');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        console.log('✅ Modal abierto');
    }

    // ============================================================================
    // 🔴 CERRAR MODAL
    // ============================================================================
    
    close() {
        console.log('🔴 Cerrando modal');
        
        this.dom.modal.classList.remove('show-modal1');
        document.body.style.overflow = ''; // Restaurar scroll
        this.currentProduct = null;
        
        console.log('✅ Modal cerrado');
    }

    isOpen() {
        return this.dom.modal.classList.contains('show-modal1');
    }

    // ============================================================================
    // 📝 ACTUALIZAR CONTENIDO DEL MODAL
    // ============================================================================
    
    updateTitle(product) {
        if (this.dom.title) {
            this.dom.title.innerText = product.tipoProducto || product.nombre || 'Producto';
        }
    }

    updateDescription(product) {
        if (this.dom.description) {
            this.dom.description.innerText = product.descripcion || '';
        }
    }

    updatePrices(product) {
        if (this.dom.priceBox) {
            this.dom.priceBox.innerHTML = `
                <div class="price-box mt-2">
                    <div class="price-header">Precios</div>
                    <div class="price-row">
                        <span class="label">General:</span> 
                        ${window.helpers.formatPrice(product.precio_general)}
                    </div>
                    <div class="price-row">
                        <span class="label">Mayor:</span> 
                        ${window.helpers.formatPrice(product.precio_mayor)}
                    </div>
                    <div class="price-row">
                        <span class="label">Docena:</span> 
                        ${window.helpers.formatPrice(product.precio_docena)}
                    </div>
                </div>
            `;
        }
    }

    updateGallery(product) {
        if (!this.dom.gallery) return;

        this.dom.gallery.innerHTML = '';
        
        const images = this.getProductImages(product.imagenes || product.imagen);

        images.forEach(url => {
            this.dom.gallery.insertAdjacentHTML('beforeend', `
                <div class="item-slick3" data-thumb="${url}">
                    <div class="wrap-pic-w pos-relative">
                        <img src="${url}" alt="IMG-PRODUCT">
                        <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" 
                           href="${url}" target="_blank">
                            <i class="fa fa-expand"></i>
                        </a>
                    </div>
                </div>
            `);
        });

        // Re-inicializar slick si está disponible
        this.initSlick();
    }

    getProductImages(rawImages) {
        const images = [];

        if (!rawImages) {
            images.push(window.CONFIG.imagesPath + 'default.jpg');
            return images;
        }

        // Si es array
        if (Array.isArray(rawImages)) {
            rawImages.forEach(img => {
                if (typeof img === 'string' && img) {
                    images.push(img);
                } else if (typeof img === 'object') {
                    const url = img.name || img.url || img.thumbnail;
                    if (url) images.push(url);
                }
            });
        } 
        // Si es string
        else if (typeof rawImages === 'string') {
            images.push(rawImages);
        }

        // Si no hay imágenes válidas, usar default
        if (images.length === 0) {
            images.push(window.CONFIG.imagesPath + 'default.jpg');
        }

        return images;
    }

    initSlick() {
        if (!window.$ || !$.fn.slick) {
            console.warn('⚠️ Slick no disponible');
            return;
        }

        const $gallery = $(this.dom.gallery);

        // Destruir instancia anterior
        if ($gallery.hasClass('slick-initialized')) {
            $gallery.slick('unslick');
        }

        // Inicializar nueva instancia
        $gallery.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: true,
            appendDots: $('.wrap-slick3-dots'),
            appendArrows: $('.wrap-slick3-arrows'),
            customPaging: function(slick, index) {
                const portrait = $(slick.$slides[index]).data('thumb');
                return `<img src="${portrait}"/><div class="slick3-dot-overlay"></div>`;
            }
        });

        console.log('✅ Slick inicializado en modal');
    }

    updateSocialLinks(product) {
        if (!product.id) return;

        const urlShare = `${location.origin}${location.pathname}?id=${product.id}`;
        
        const fb = this.dom.modal.querySelector('#shareFacebook');
        const tw = this.dom.modal.querySelector('#shareTwitter');
        const wa = this.dom.modal.querySelector('#shareWhatsapp');

        if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlShare)}`;
        if (tw) tw.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlShare)}`;
        if (wa) wa.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(urlShare)}`;
    }
}

// ============================================================================
// 🌐 EXPORTAR
// ============================================================================

export default ModalModule;

console.log('✅ modal.module.js cargado correctamente');