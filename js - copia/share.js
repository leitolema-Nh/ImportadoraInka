// js/share.js
console.log("✅ share.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const shareBtn = document.getElementById("share-btn");

  if (!shareBtn) return;

  shareBtn.addEventListener("click", async () => {
    const url = window.location.href;
    const title = "📦 Catálogo Importadora Inka";
    const category =
      typeof currentCategoryName !== "undefined" && currentCategoryName
        ? `Categoría: ${currentCategoryName}`
        : "";

    // ✅ El texto, dejando el link SOLO al final
    const text = `${title}
${category}

${url}`;

    if (navigator.share) {
      // 🌐 API nativa en móviles
      try {
        await navigator.share({
          title: title,
          text: `${title}\n${category}`,
          url: url,
        });
      } catch (err) {
        console.warn("❌ Cancelado compartir:", err);
      }
    } else {
      // 🌐 Fallback escritorio → opciones de redes
      const options = `
        <div style="padding:10px;">
          <a href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank">WhatsApp</a><br>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank">Facebook</a><br>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}" target="_blank">Twitter</a>
        </div>
      `;
      const popup = window.open("", "Compartir", "width=300,height=200");
      if (popup) {
        popup.document.write(options);
      } else {
        alert("Copia este enlace:\n" + url);
      }
    }
  });
});
