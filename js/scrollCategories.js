// ✅ scrollCategories.js — Función restaurada para scroll horizontal de categorías
console.log("✅ scrollCategories.js activo");

function scrollCategories(dir) {
  const bar = document.querySelector(".categories-bar");
  if (bar) bar.scrollBy({ left: dir * 200, behavior: "smooth" });
}
window.scrollCategories = scrollCategories;
