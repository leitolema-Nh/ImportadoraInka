// js/footer.js
console.log("✅ footer.js cargado");

// 🆙 Crear botón "Volver arriba" dinámicamente
document.addEventListener("DOMContentLoaded", () => {
  const btnTop = document.createElement("button");
  btnTop.id = "btnTop";
  btnTop.innerHTML = "↑";
  document.body.appendChild(btnTop);

  btnTop.style.position = "fixed";
  btnTop.style.bottom = "30px";
  btnTop.style.right = "30px";
  btnTop.style.background = "#007bff";
  btnTop.style.color = "#fff";
  btnTop.style.border = "none";
  btnTop.style.padding = "10px 15px";
  btnTop.style.borderRadius = "50%";
  btnTop.style.cursor = "pointer";
  btnTop.style.display = "none";
  btnTop.style.zIndex = "1000";
  btnTop.style.transition = "opacity 0.3s";

  // Mostrar/ocultar botón

});
