// ✅ shopCodeFilter.js — filtra por código directo (?cod=)
console.log("✅ shopCodeFilter.js cargado");

window.addEventListener("load", async () => {
  const grid = document.getElementById("products-container");
  if (!grid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const codigo = urlParams.get("cod");
  if (!codigo) return;

  window.CURRENT_MODE = "code"; // protege el modo
  grid.innerHTML = `
    <div class='text-center py-5 text-muted'>
      <div class='spinner-border text-primary' role='status'></div>
      <p class='mt-2'>Buscando producto <strong>${codigo}</strong>...</p>
    </div>`;

  try {
    const api = CONFIG.apiURL;
    const res = await fetch(`${api}search.php?q=${encodeURIComponent(codigo)}`);
    const data = await res.json();

    if (!data || data.status !== "ok" || !data.productos.length) {
      grid.innerHTML = `
        <div class='text-center py-5 text-danger'>
          ❌ No se encontró el producto <strong>${codigo}</strong>.<br>
          <a href='${CONFIG.baseURL}pages/shop.php' class='btn btn-outline-dark mt-3'>
            Volver al catálogo
          </a>
        </div>`;
      return;
    }

    const producto = data.productos[0];
    if (helpers.renderProducts) helpers.renderProducts([producto], false);
    window.CURRENT_MODE = "code";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error("❌ Error al buscar producto:", err);
    grid.innerHTML = "<div class='text-center py-5 text-danger'>Error al cargar el producto.</div>";
  }
});
