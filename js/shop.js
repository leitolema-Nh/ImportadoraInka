// Detectar entorno automáticamente
const isProd = window.location.hostname !== "localhost";

// Ruta base para imágenes
const imageBasePath = isProd 
  ? "/catalogo/files/"   // ✅ Producción
  : "/files/";           // ✅ Desarrollo local

// Ruta base para la API
const apiBase = isProd 
  ? "/catalogo/api/products.php" 
  : "/api/products.php";
