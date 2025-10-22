document.addEventListener("click", e => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const data = JSON.parse(card.dataset.product);

  document.getElementById("modalProductTitle").textContent = data.descripcion;
  document.getElementById("modalProductImage").src = data.imagen;
  document.getElementById("modalPrecioGeneral").textContent = data.precio_general + " $";
  document.getElementById("modalPrecioMayor").textContent = data.precio_mayor + " $";
  document.getElementById("modalPrecioDocena").textContent = data.precio_docena + " $";

  // miniaturas si vienen varias imágenes en JSON
  const thumbsContainer = document.getElementById("modalThumbs");
  thumbsContainer.innerHTML = "";
  if (Array.isArray(data.imagenes)) {
    data.imagenes.forEach(img => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.className = "img-thumbnail";
      thumb.style.width = "60px";
      thumb.onclick = () => (document.getElementById("modalProductImage").src = img);
      thumbsContainer.appendChild(thumb);
    });
  }

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
});
