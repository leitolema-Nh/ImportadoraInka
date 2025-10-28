// ============================================================================
// 📤 share.module.js - Módulo de Compartir
// ============================================================================
// Consolida: share.js
// ============================================================================

console.log('📤 share.module.js cargando...');

export class ShareModule {
    constructor() {
        console.log('🏗️ ShareModule: Inicializando...');
        
        // ============================================
        // 🎯 ELEMENTOS DOM
        // ============================================
        this.dom = {
            shareBtn: document.getElementById('share-btn'),
            shareProductBtns: [] // Botones dinámicos en tarjetas
        };
    }

    // ============================================================================
    // 🚀 INICIALIZACIÓN
    // ============================================================================
    
    init() {
        console.log('🚀 ShareModule: Iniciando...');
        
        this.setupGlobalShareBtn();
        this.setupDynamicShareBtns();
        
        // Exportar globalmente
        window.shareModule = {
            sharePage: () => this.sharePage(),
            shareProduct: (product) => this.shareProduct(product),
            shareUrl: (url, title) => this.shareUrl(url, title)
        };
        
        console.log('✅ ShareModule inicializado correctamente');
    }

    // ============================================================================
    // 🎯 CONFIGURAR BOTÓN GLOBAL DE COMPARTIR
    // ============================================================================
    
    setupGlobalShareBtn() {
        if (this.dom.shareBtn) {
            this.dom.shareBtn.addEventListener('click', () => {
                this.sharePage();
            });
            console.log('✅ Botón global de compartir configurado');
        }
    }

    setupDynamicShareBtns() {
        // Delegar eventos para botones dinámicos
        document.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('.js-share-product');
            if (shareBtn) {
                e.preventDefault();
                const productData = this.extractProductData(shareBtn);
                if (productData) {
                    this.shareProduct(productData);
                }
            }
        });
    }

    extractProductData(btn) {
        // Intentar obtener datos del producto desde data attributes
        const productId = btn.getAttribute('data-id');
        const productName = btn.getAttribute('data-name');
        const productUrl = btn.getAttribute('data-url');
        
        if (productId || productName) {
            return {
                id: productId,
                nombre: productName || 'Producto',
                url: productUrl || `${location.origin}${location.pathname}?id=${productId}`
            };
        }
        
        return null;
    }

    // ============================================================================
    // 📤 COMPARTIR PÁGINA ACTUAL
    // ============================================================================
    
    async sharePage() {
        const url = window.location.href;
        const title = document.title || '📦 Catálogo Importadora Inka';
        
        // Obtener categoría actual si existe
        let category = '';
        if (typeof window.currentCategoryName !== 'undefined' && window.currentCategoryName) {
            category = `Categoría: ${window.currentCategoryName}`;
        }

        const text = `${title}\n${category}`.trim();

        await this.share(url, title, text);
    }

    // ============================================================================
    // 📤 COMPARTIR PRODUCTO ESPECÍFICO
    // ============================================================================
    
    async shareProduct(product) {
        if (!product) {
            console.error('❌ Producto no definido');
            return;
        }

        const title = product.nombre || product.descripcion || 'Producto';
        const url = product.url || `${location.origin}${location.pathname}?id=${product.id}`;
        const text = `📦 ${title} - Importadora Inka`;

        await this.share(url, title, text);
    }

    // ============================================================================
    // 📤 COMPARTIR URL GENÉRICA
    // ============================================================================
    
    async shareUrl(url, title = '') {
        const text = title || document.title;
        await this.share(url, title, text);
    }

    // ============================================================================
    // 🌐 LÓGICA PRINCIPAL DE COMPARTIR
    // ============================================================================
    
    async share(url, title, text) {
        console.log('📤 Compartiendo:', { url, title, text });

        // ✅ API nativa de compartir (móviles y navegadores modernos)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url
                });
                console.log('✅ Compartido exitosamente');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('❌ Error al compartir:', err);
                }
            }
        } 
        // ⬇️ Fallback para escritorio
        else {
            this.showShareOptions(url, title, text);
        }
    }

    // ============================================================================
    // 💻 FALLBACK: OPCIONES DE COMPARTIR (Escritorio)
    // ============================================================================
    
    showShareOptions(url, title, text) {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(`${text}\n\n${url}`);
        const encodedTitle = encodeURIComponent(title);

        const options = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h3 style="margin-bottom: 15px;">Compartir en:</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="https://wa.me/?text=${encodedText}" 
                       target="_blank" 
                       style="padding: 10px; background: #25D366; color: white; text-decoration: none; border-radius: 5px; text-align: center;">
                        📱 WhatsApp
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" 
                       target="_blank"
                       style="padding: 10px; background: #1877F2; color: white; text-decoration: none; border-radius: 5px; text-align: center;">
                        📘 Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodedText}" 
                       target="_blank"
                       style="padding: 10px; background: #1DA1F2; color: white; text-decoration: none; border-radius: 5px; text-align: center;">
                        🐦 Twitter
                    </a>
                    <button onclick="navigator.clipboard.writeText('${url}').then(() => alert('Enlace copiado')).catch(() => prompt('Copia este enlace:', '${url}'))"
                            style="padding: 10px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        📋 Copiar enlace
                    </button>
                </div>
            </div>
        `;

        // Intentar abrir popup
        const popup = window.open('', 'Compartir', 'width=400,height=500');
        
        if (popup) {
            popup.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Compartir</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="margin: 0;">
                    ${options}
                </body>
                </html>
            `);
        } else {
            // Si el popup fue bloqueado, usar alert
            const fallbackText = `Comparte este enlace:\n\n${url}`;
            prompt('Copia este enlace:', url);
        }
    }

    // ============================================================================
    // 📋 COPIAR AL PORTAPAPELES
    // ============================================================================
    
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                console.log('✅ Copiado al portapapeles');
                return true;
            } else {
                // Fallback para navegadores antiguos
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            }
        } catch (err) {
            console.error('❌ Error al copiar:', err);
            return false;
        }
    }

    // ============================================================================
    // 🔗 GENERAR ENLACES DE REDES SOCIALES
    // ============================================================================
    
    getSocialLinks(url, title, text) {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text || title);
        
        return {
            whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`
        };
    }
}

// ============================================================================
// 🌐 EXPORTAR
// ============================================================================

export default ShareModule;

console.log('✅ share.module.js cargado correctamente');