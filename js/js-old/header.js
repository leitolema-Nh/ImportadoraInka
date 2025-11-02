// 📁 js/header.js
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".header-v4");

  // 🪄 Cambiar estilo al hacer scroll
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    });
  }

  // 📍 Activar el link actual del menú
  const currentPath = window.location.pathname;
  document.querySelectorAll(".main-menu .nav-link, .main-menu-m .nav-link").forEach(link => {
    if (
      link.getAttribute("href") &&
      currentPath.includes(
        link.getAttribute("href")
          .replace("/pages/", "")
          .replace(".php", "")
      )
    ) {
      link.classList.add("active");
    }
  });
});
