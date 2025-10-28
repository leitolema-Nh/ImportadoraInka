// ==========================================================
//  shopModal.js — Modal de producto optimizado y seguro
// ==========================================================
console.log("✅ shopModal.js cargado");

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".js-modal1");
  if (!modal) {
    console.error("❌ No se encontró el modal (.js-modal1)");
    return;
  }

  const overlay = modal.querySelector(".overlay-modal1");

  // ==========================================================
  // 🟢 Abrir modal con datos del producto
  // ==========================================================
  function openShopModal(product) {
    // ✅ Validación robusta
    if (!product || typeof product !== "object") {
      console.error("❌ Producto inválido o indefinido en openShopModal:", product);
      return;
    }

    // 📌 Título
    const titleEl = modal.querySelector(".js-modal-title");
    if (titleEl) titleEl.innerText = product.tipoProducto || product.nombre || "Producto";

    // 📌 Descripción
    const descEl = modal.querySelector(".js-modal-desc");
    if (descEl) descEl.innerText = product.descripcion || "";

    // 📌 Precios
    const priceBox = modal.querySelector(".js-modal-precios");
    if (priceBox) {
      priceBox.innerHTML = `
        <div class="price-box mt-2">
          <div class="price-header">Precios</div>
          <div class="price-row"><span class="label">General:</span> ${helpers.formatPrice(product.precio_general)}</div>
          <div class="price-row"><span class="label">Mayor:</span> ${helpers.formatPrice(product.precio_mayor)}</div>
          <div class="price-row"><span class="label">Docena:</span> ${helpers.formatPrice(product.precio_docena)}</div>
        </div>`;
    }

    // 📸 Galería
    const gallery = modal.querySelector("#modalGallery");
    if (gallery) {
      gallery.innerHTML = "";
      const images = getProductImages(product.imagenes || product.imagen);

      images.forEach((url) => {
        gallery.insertAdjacentHTML("beforeend", `
          <div class="item-slick3" data-thumb="${url}">
            <div class="wrap-pic-w pos-relative">
              <img src="${url}" alt="IMG-PRODUCT">
              <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="${url}">
                <i class="fa fa-expand"></i>
              </a>
            </div>
          </div>`);
      });

      // 🔄 Re-inicializar slick
      if ($.fn.slick) {
        if ($(gallery).hasClass("slick-initialized")) $(gallery).slick("unslick");
        $(gallery).slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
          appendDots: $(".wrap-slick3-dots"),
          appendArrows: $(".wrap-slick3-arrows")
        });
      } else {
        console.error("❌ Slick no está disponible. Revisa si slick.min.js está cargado.");
      }
    }

    // 📤 Redes sociales
    const urlShare = location.origin + location.pathname + "?id=" + (product.id || "");
    const fb = modal.querySelector("#shareFacebook");
    const tw = modal.querySelector("#shareTwitter");
    const wa = modal.querySelector("#shareWhatsapp");

    if (product.id) {
      if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(urlShare);
      if (tw) tw.href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(urlShare);
      if (wa) wa.href = "https://api.whatsapp.com/send?text=" + encodeURIComponent(urlShare);
    }

    // ✅ Mostrar modal
    modal.classList.add("show-modal1");
  }

  // ==========================================================
  // 🔴 Cerrar modal
  // ==========================================================
  function closeShopModal() {
    modal.classList.remove("show-modal1");
  }

  if (overlay) overlay.addEventListener("click", closeShopModal);
  modal.querySelectorAll(".js-hide-modal1").forEach(btn => btn.addEventListener("click", closeShopModal));

  // ==========================================================
  // 🟠 Evento global "Ver detalle"
  // ==========================================================
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".block2-btn");
    if (!btn) return;

    e.preventDefault();
    const id = btn.getAttribute("data-id");
    if (!id) return;

    helpers.fetchJSON(`product.php?id=${id}`)
      .then(response => {
        console.log("🔍 Respuesta de API (product.php):", response);
        const product = response?.producto || response?.data || response;
        if (product && typeof product === "object") {
          openShopModal(product);
        } else {
          console.error("❌ Producto inválido:", response);
        }
      })
      .catch(err => console.error("❌ Error en fetchJSON:", err));
  });

  // Exponer global
  window.shopModal = { open: openShopModal, close: closeShopModal };
});
