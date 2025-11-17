// ============================================================================
// 🎭 productModal.module.js - VERSIÓN FINAL CORREGIDA
// ============================================================================
// ✅ Limpieza completa al cerrar
// ✅ Thumbnails con imágenes automáticas
// ✅ Resetear scroll al abrir (siempre empieza arriba)
// ✅ Forzar overflow hidden en body (prevenir scroll del grid)
// ❌ SIN swipe-to-close (solo botones X y CERRAR)
// ============================================================================

console.log('🎭 productModal.module.js cargando...');

export class ModalModule {
    constructor() {
        console.log('🏗️ ModalModule: Inicializando...');
        
        this.dom = {
            modal: document.querySelector('.js-modal1'),
            overlay: null,
            container: null,
            gallery: null,
            title: null,
            description: null,
            priceBox: null,
            closeBtns: []
        };

        if (this.dom.modal) {
            this.dom.overlay = this.dom.modal.querySelector('.overlay-modal1');
            this.dom.container = this.dom.modal.querySelector('.modal-container');
            this.dom.gallery = this.dom.modal.querySelector('#modalGallery');
            this.dom.title = this.dom.modal.querySelector('.js-modal-title');
            this.dom.description = this.dom.modal.querySelector('.js-modal-desc');
            this.dom.priceBox = this.dom.modal.querySelector('.js-modal-precios');
            this.dom.closeBtns = this.dom.modal.querySelectorAll('.js-hide-modal1');
        }

        this.state = {
            currentProduct: null,
            isMobile: window.innerWidth < 768,
            isOpen: false,
            scrollPosition: 0 // Guardar posición del scroll del body
        };

        this._isLoading = false;
        this._initialized = false;
        this._globalListenerAdded = false;
        this._clickHandler = null;
    }

    init() {
        console.log('🚀 ModalModule: Iniciando...');
        
        if (this._initialized) {
            console.warn('⚠️ ModalModule ya está inicializado');
            return;
        }
        
        if (!this.dom.modal) {
            console.error('❌ No se encontró el modal (.js-modal1)');
            return;
        }

        this.setupEvents();
        this.setupGlobalTriggers();
        this.setupResponsiveHandlers();
        
        window.shopModal = {
            open: (product) => this.open(product),
            close: () => this.close()
        };
        
        window.modalModule = this;
        
        this._initialized = true;
        
        console.log('✅ ModalModule inicializado correctamente');
    }

    setupEvents() {
        if (this.dom.overlay) {
            this.dom.overlay.addEventListener('click', () => this.close());
        }

        this.dom.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.close();
            }
        });

        console.log('✅ Eventos de modal configurados');
    }

    setupGlobalTriggers() {
        if (this._globalListenerAdded) {
            console.warn('⚠️ Global listeners ya están configurados');
            return;
        }

        const clickHandler = (e) => {
            const btn = e.target.closest('.js-show-modal1');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                const productId = btn.getAttribute('data-id');
                if (productId) {
                    console.log('🎯 Click detectado en elemento con data-id:', productId);
                    this.loadAndOpen(productId);
                    return;
                }
            }

            const link = e.target.closest('.js-name-detail');
            if (link) {
                e.preventDefault();
                e.stopPropagation();
                const productId = link.getAttribute('data-id');
                if (productId) {
                    console.log('🎯 Click en título con data-id:', productId);
                    this.loadAndOpen(productId);
                    return;
                }
            }
        };

        this._clickHandler = clickHandler;
        document.addEventListener('click', clickHandler);
        this._globalListenerAdded = true;

        console.log('✅ Listeners globales configurados');
    }

    setupResponsiveHandlers() {
        window.addEventListener('resize', () => {
            const wasMobile = this.state.isMobile;
            this.state.isMobile = window.innerWidth < 768;
            
            console.log('📐 Viewport cambió:', this.state.isMobile ? 'MÓVIL' : 'DESKTOP');
            
            if (wasMobile !== this.state.isMobile && this.state.isOpen) {
                this.adaptLayout();
            }
        });

        console.log('✅ Handlers responsivos configurados');
    }

    async loadAndOpen(productId) {
        if (this._isLoading) {
            console.warn('⚠️ Ya hay una carga en proceso...');
            return;
        }

        this._isLoading = true;

        try {
            console.log('📡 Cargando producto:', productId);
            
            // Detectar entorno: desarrollo incluye '/inka/', producción no
            const isDev = window.location.pathname.includes('/inka/');
            const basePath = isDev ? '/inka/api' : '/api';
            const apiUrl = `${window.location.origin}${basePath}/product.php?id=${productId}`;
            
            console.log('📡 Entorno:', isDev ? 'Desarrollo' : 'Producción');
            console.log('📡 Fetching:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            // Verificar que la respuesta sea JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('❌ La API no devolvió JSON:', textResponse.substring(0, 200));
                throw new Error('La API devolvió un formato inválido. Verifica la URL del endpoint.');
            }
            
            const data = await response.json();
            
            console.log('📦 Respuesta API:', data);

            if (data.status === 'ok' && data.producto) {
                console.log('✅ Producto válido, abriendo modal...');
                this.open(data.producto);
            } else {
                console.error('❌ Error cargando producto:', data.mensaje || 'Producto no encontrado');
                throw new Error(data.mensaje || 'Producto no encontrado');
            }
        } catch (error) {
            console.error('❌ Error cargando producto:', error);
            this.showError('No se pudo cargar el producto');
        } finally {
            this._isLoading = false;
        }
    }

    open(product) {
        if (!product) {
            console.error('❌ No se proporcionó un producto para mostrar');
            return;
        }

        console.log('🟢 Abriendo modal con producto:', product);

        // ✅ FIX 1: GUARDAR POSICIÓN ACTUAL DEL SCROLL
        this.state.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // ✅ FIX 2: PREVENIR SCROLL DEL BODY (FORZADO)
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.state.scrollPosition}px`;
        document.body.style.width = '100%';
        document.documentElement.style.overflow = 'hidden';

        // Actualizar contenido
        this.state.currentProduct = product;
        this.updateModalContent(product);
        
        // Mostrar modal
        this.dom.modal.classList.add('show-modal1');
        document.body.classList.add('modal-open');
        this.state.isOpen = true;

        // ✅ FIX 3: RESETEAR SCROLL DEL MODAL (SIEMPRE EMPIEZA ARRIBA)
        if (this.dom.container) {
            const modalBody = this.dom.container.querySelector('.modal-body');
            if (modalBody) {
                modalBody.scrollTop = 0;
                console.log('✅ Scroll del modal reseteado');
            }
        }

        console.log('✅ Modal abierto en modo:', this.state.isMobile ? 'MÓVIL' : 'DESKTOP');
    }

    close() {
        console.log('🔴 Cerrando modal...');

        // DESTRUIR SLICK
        if (window.$ && $.fn.slick) {
            const $gallery = $(this.dom.gallery);
            if ($gallery.hasClass('slick-initialized')) {
                try {
                    $gallery.slick('unslick');
                    console.log('✅ Slick destruido');
                } catch (error) {
                    console.warn('⚠️ Error al destruir Slick:', error);
                }
            }
        }

        // LIMPIAR HTML
        if (this.dom.gallery) {
            this.dom.gallery.innerHTML = '';
            console.log('✅ Galería limpiada');
        }

        const dotsContainer = this.dom.modal.querySelector('.wrap-slick3-dots');
        const arrowsContainer = this.dom.modal.querySelector('.wrap-slick3-arrows');
        
        if (dotsContainer) dotsContainer.innerHTML = '';
        if (arrowsContainer) arrowsContainer.innerHTML = '';

        // CERRAR MODAL
        this.dom.modal.classList.remove('show-modal1');
        
        if (this.dom.overlay) {
            this.dom.overlay.style.display = 'none';
        }

        document.body.classList.remove('modal-open');

        // ✅ FIX 4: RESTAURAR SCROLL DEL BODY
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';

        // ✅ FIX 5: RESTAURAR POSICIÓN DEL SCROLL
        window.scrollTo(0, this.state.scrollPosition);
        
        this.state.isOpen = false;
        this.state.currentProduct = null;

        console.log('✅ Modal cerrado y scroll restaurado');
    }

    updateModalContent(product) {
        this.updateTitle(product);
        this.updateDescription(product);
        this.updatePrices(product);
        this.updateCode(product);
        this.updateCategory(product);
        this.updateAvailability(product);
        this.updateUnit(product);
        this.updateGallery(product);
        this.updateSocialLinks(product);
    }

    updateTitle(product) {
        if (this.dom.title && product.tipoProducto) {
            this.dom.title.textContent = product.tipoProducto;
            console.log('✅ Título actualizado:', product.tipoProducto);
        }
    }

    updateDescription(product) {
        const descElement = this.dom.modal.querySelector('.js-modal-desc');
        if (descElement && product.descripcion) {
            descElement.textContent = product.descripcion;
            console.log('✅ Descripción actualizada');
        }
    }

    updatePrices(product) {
        if (!this.dom.priceBox) return;

        const precios = [];
        if (product.precioGeneral) precios.push({ label: 'General', value: product.precioGeneral });
        if (product.precioMayor) precios.push({ label: 'Mayor', value: product.precioMayor });
        if (product.precioDocena) precios.push({ label: 'Docena', value: product.precioDocena });

        if (precios.length === 0) {
            this.dom.priceBox.innerHTML = '<p class="text-muted">Precio no disponible</p>';
            return;
        }

        const html = `
            <div class="price-box">
                <div class="price-header">Precios</div>
                ${precios.map(p => `
                    <div class="price-row">
                        <span class="label">${p.label}:</span>
                        <span class="value">RD$ ${parseFloat(p.value).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        `;

        this.dom.priceBox.innerHTML = html;
        console.log('✅ Precios actualizados');
    }

    updateCode(product) {
        const codeElements = this.dom.modal.querySelectorAll('.js-modal-codigo, .js-modal-codigo-display');
        codeElements.forEach(el => {
            if (product.codigo) {
                el.textContent = product.codigo;
            }
        });
        console.log('✅ Código actualizado:', product.codigo);
    }

    updateCategory(product) {
        const categoryElement = this.dom.modal.querySelector('.js-modal-category');
        if (categoryElement && product.tipoProducto) {
            categoryElement.textContent = product.tipoProducto;
            console.log('✅ Categoría actualizada:', product.tipoProducto);
        }
    }

    updateAvailability(product) {
        const availabilityElement = this.dom.modal.querySelector('.js-modal-disponibilidad');
        if (!availabilityElement) return;

        const stock = parseInt(product.disponibilidad) || 0;
        
        if (stock > 0) {
            availabilityElement.textContent = 'En stock';
            availabilityElement.style.color = '#27ae60';
        } else {
            availabilityElement.textContent = 'Agotado';
            availabilityElement.style.color = '#e74c3c';
        }
        
        console.log('✅ Disponibilidad actualizada:', stock);
    }

    updateUnit(product) {
        const unitElement = this.dom.modal.querySelector('.js-modal-unidad');
        if (unitElement && product.unidad) {
            unitElement.textContent = product.unidad;
            console.log('✅ Unidad actualizada:', product.unidad);
        }
    }

    updateGallery(product) {
        if (!this.dom.gallery) {
            console.error('❌ Elemento de galería no encontrado');
            return;
        }

        console.log('📸 Actualizando galería...');

        const images = this.getProductImages(product.imagenes || product.imagen);
        console.log('📸 Imágenes a renderizar:', images);

        // LIMPIAR
        this.dom.gallery.innerHTML = '';

        // DESTRUIR SLICK
        if (window.$ && $.fn.slick) {
            const $gallery = $(this.dom.gallery);
            if ($gallery.hasClass('slick-initialized')) {
                try {
                    $gallery.slick('unslick');
                    console.log('✅ Slick destruido antes de renderizar');
                } catch (error) {
                    console.warn('⚠️ Error destruyendo Slick:', error);
                }
            }
        }

        if (images.length === 1) {
            console.log('📸 Solo 1 imagen detectada, renderizando sin slider...');
            this.renderSingleImage(images[0]);
        } else {
            console.log('📸 Múltiples imágenes detectadas, inicializando slider...');
            this.renderMultipleImages(images);
        }
    }

    renderSingleImage(imageUrl) {
        const html = `
            <div class="item-slick3" data-thumb="${imageUrl}">
                <div class="wrap-pic-w pos-relative">
                    <img src="${imageUrl}" 
                         alt="Producto" 
                         class="modal-gallery-image"
                         style="display: block;">
                    <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" 
                       href="${imageUrl}" 
                       target="_blank"
                       aria-label="Ver imagen en tamaño completo">
                        <i class="fa fa-expand"></i>
                    </a>
                </div>
            </div>
        `;

        this.dom.gallery.innerHTML = html;
        this.dom.gallery.classList.add('single-image');

        const dotsContainer = this.dom.modal.querySelector('.wrap-slick3-dots');
        const arrowsContainer = this.dom.modal.querySelector('.wrap-slick3-arrows');
        
        if (dotsContainer) dotsContainer.style.display = 'none';
        if (arrowsContainer) arrowsContainer.style.display = 'none';

        console.log('✅ Imagen única renderizada (sin slider)');
    }

    renderMultipleImages(images) {
        const html = images.map(img => `
            <div class="item-slick3" data-thumb="${img}">
                <div class="wrap-pic-w pos-relative">
                    <img src="${img}" 
                         alt="Producto" 
                         class="modal-gallery-image"
                         style="display: block;">
                    <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" 
                       href="${img}" 
                       target="_blank"
                       aria-label="Ver imagen en tamaño completo">
                        <i class="fa fa-expand"></i>
                    </a>
                </div>
            </div>
        `).join('');

        this.dom.gallery.innerHTML = html;
        this.dom.gallery.classList.remove('single-image');

        const dotsContainer = this.dom.modal.querySelector('.wrap-slick3-dots');
        const arrowsContainer = this.dom.modal.querySelector('.wrap-slick3-arrows');
        
        if (dotsContainer) dotsContainer.style.display = '';
        if (arrowsContainer) arrowsContainer.style.display = '';

        setTimeout(() => this.initSlick(images), 100);

        console.log('✅ Múltiples imágenes renderizadas');
    }

    getProductImages(rawImages) {
        const images = [];

        if (!rawImages) {
            images.push('https://via.placeholder.com/800x800/f5f5f5/999999?text=Sin+Imagen');
            return images;
        }

        if (Array.isArray(rawImages)) {
            rawImages.forEach(img => {
                if (typeof img === 'string' && img) {
                    images.push(img);
                } else if (typeof img === 'object') {
                    const url = img.name || img.url || img.thumbnail;
                    if (url) images.push(url);
                }
            });
        } else if (typeof rawImages === 'string') {
            images.push(rawImages);
        }

        if (images.length === 0) {
            images.push('https://via.placeholder.com/800x800/f5f5f5/999999?text=Sin+Imagen');
        }

        return images;
    }

    initSlick(imageUrls) {
        if (!window.$ || !$.fn.slick) {
            console.warn('⚠️ Slick no disponible');
            return;
        }

        const $gallery = $(this.dom.gallery);

        if ($gallery.hasClass('slick-initialized')) {
            $gallery.slick('unslick');
        }

        const config = {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            appendDots: $('.wrap-slick3-dots'),
            fade: false,
            adaptiveHeight: true
        };

        if (this.state.isMobile) {
            config.arrows = false;
            config.swipeToSlide = true;
            config.touchThreshold = 10;
        } else {
            config.arrows = true;
            config.appendArrows = $('.wrap-slick3-arrows');
            config.customPaging = function(slick, index) {
                const portrait = $(slick.$slides[index]).data('thumb');
                return `<img src="${portrait}"/><div class="slick3-dot-overlay"></div>`;
            };
        }

        $gallery.slick(config);

        // FIX: Forzar imágenes en thumbnails
        setTimeout(() => {
            this.fixThumbnails(imageUrls);
        }, 200);

        console.log('✅ Slick inicializado');
    }

    fixThumbnails(imageUrls) {
        const dots = document.querySelectorAll('.slick-dots li');
        
        dots.forEach((dot, index) => {
            const existingImg = dot.querySelector('img');
            
            if (!existingImg && imageUrls && imageUrls[index]) {
                dot.innerHTML = '';
                
                const img = document.createElement('img');
                img.src = imageUrls[index];
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
                
                const overlay = document.createElement('div');
                overlay.className = 'slick3-dot-overlay';
                
                dot.appendChild(img);
                dot.appendChild(overlay);
                
                dot.addEventListener('click', function() {
                    $('#modalGallery').slick('slickGoTo', index);
                });
                
                console.log(`✅ Thumbnail ${index + 1} fixed`);
            }
        });
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

    adaptLayout() {
        console.log('🔄 Adaptando layout al nuevo viewport...');
        
        if (this.state.currentProduct) {
            this.updateGallery(this.state.currentProduct);
        }
    }

    showError(message) {
        if (window.swal) {
            swal("Error", message, "error");
        } else {
            alert(message);
        }
    }
}

export default ModalModule;

console.log('✅ productModal.module.js cargado correctamente');