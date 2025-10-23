<?php
/**
 * FOOTER GLOBAL — Importadora INKA
 * PHP 7 + Bootstrap 4 + Cozastore compatible
 */
?>
<footer class="bg3 p-t-75 p-b-32" style="opacity:0; display:none; transition:opacity .5s ease;">
  <div class="container">
    <div class="row">
      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Menú</h4>
        <ul>
          <li class="p-b-10"><a id="footer-link-inicio" class="stext-107 cl7 hov-cl1 trans-04">Inicio</a></li>
          <li class="p-b-10"><a id="footer-link-productos" class="stext-107 cl7 hov-cl1 trans-04">Productos</a></li>
          <li class="p-b-10"><a id="footer-link-nosotros" class="stext-107 cl7 hov-cl1 trans-04">Nosotros</a></li>
          <li class="p-b-10"><a id="footer-link-contacto" class="stext-107 cl7 hov-cl1 trans-04">Contacto</a></li>
        </ul>
      </div>

      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Contacto</h4>
        <p class="stext-107 cl7 size-201">
          Hnos. Pinzón #82 <br> (Casi esquina con Manuela Díez), <br>Santo Domingo, República Dominicana<br>Tel: +1 809 681 8560<br>Email: administracion@importadorainka.com
        </p>
      </div>

      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Síguenos</h4>
        <div>
          <a href="https://www.facebook.com/importadorainka" target="_blank" rel="noopener noreferrer" class="fs-18 cl7 hov-cl1 trans-04 m-r-16"><i class="fa fa-facebook"></i></a>
          <a href="https://www.instagram.com/importadorainka/" target="_blank" rel="noopener noreferrer" class="fs-18 cl7 hov-cl1 trans-04 m-r-16"><i class="fa fa-instagram"></i></a>
          <a href="https://api.whatsapp.com/send/?phone=18096818560&text=Hola%2C%20me%20interesa%20conocer%20sus%20productos%20y%20promociones.%20He%20revisado%20la%20web%20https%3A%2F%2Fimportadorainka.com%20-%20por%20favor%20pueden%20enviarme%20detalles%20y%20disponibilidad%3F%20Gracias." target="_blank" rel="noopener noreferrer" class="fs-18 cl7 hov-cl1 trans-04 m-r-16" title="Abrir chat en WhatsApp" aria-label="WhatsApp">
            <i class="fa fa-whatsapp" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      <div class="col-sm-6 col-lg-3 p-b-50 text-center">
        <h4 class="stext-301 cl0 p-b-30">Importadora Inka</h4>
        <p class="stext-107 cl7">
          &copy; <?= date('Y'); ?> Importadora Inka. Todos los derechos reservados.<br>
          Desarrollado por <strong>Meetclic-RD</strong>
        </p>
      </div>
    </div>
  </div>
</footer>

<script>
console.log('🔧 Footer iniciando carga de scripts...');

document.addEventListener("DOMContentLoaded", function() {
  console.log('✅ DOM Ready');
  
  // ========================================
  // 🔧 CALCULAR BASE URL
  // ========================================
  var base = "/";
  
  if (window.CONFIG && window.CONFIG.baseURL) {
    base = window.CONFIG.baseURL;
    console.log('✅ Usando CONFIG.baseURL:', base);
  } else {
    // Detectar automáticamente el folder del proyecto
    var parts = window.location.pathname.split("/").filter(Boolean);
    var idx = parts.indexOf("inka");
    
    if (idx >= 0) {
      base = "/" + parts[idx] + "/";
    } else if (parts[0] && parts[0] !== "pages") {
      base = "/" + parts[0] + "/";
    }
    
    console.log('⚠️ CONFIG no disponible, usando base detectada:', base);
  }

  // ========================================
  // 📦 LISTA DE SCRIPTS EN ORDEN
  // ========================================
  var scripts = [
    "vendor/jquery/jquery-3.2.1.min.js",
    "vendor/bootstrap/js/popper.min.js",
    "vendor/bootstrap/js/bootstrap.min.js",
    "vendor/animsition/js/animsition.min.js",
    "vendor/select2/select2.min.js",
    "vendor/daterangepicker/moment.min.js",
    "vendor/daterangepicker/daterangepicker.js",
    "vendor/slick/slick.min.js",
    "js/slick-custom.js",
    "vendor/MagnificPopup/jquery.magnific-popup.min.js",
    "vendor/isotope/isotope.pkgd.min.js",
    "vendor/sweetalert/sweetalert.min.js",
    "vendor/perfect-scrollbar/perfect-scrollbar.min.js",
    "js/helpers.js",              // ✅ CRÍTICO: Descomentado
    "js/main.js",
    "js/header.js",
    "js/footer.js",
    "js/categories.js",           // ✅ Antes de products.js
    "js/products.js",
    "js/productsByCategories.js",
    "js/subcategories.js",        // ✅ Agregado
    "js/shopModal.js",
    "js/search.js",
    "js/share.js",
    "js/shopCodeFilter.js",
    "js/globalSearch.js"
  ];

  // ========================================
  // 🔄 CARGA SECUENCIAL DE SCRIPTS
  // ========================================
  var i = 0;
  var loadedCount = 0;
  var errorCount = 0;
  
  function loadNext() {
    if (i >= scripts.length) {
      console.log('✅ Carga completada:', loadedCount, 'OK,', errorCount, 'errores');
      
      // Verificar dependencias críticas
      setTimeout(function() {
        console.log('🔍 Verificación de dependencias:');
        console.log('  - CONFIG:', typeof window.CONFIG !== 'undefined' ? '✅' : '❌');
        console.log('  - helpers:', typeof window.helpers !== 'undefined' ? '✅' : '❌');
        console.log('  - jQuery:', typeof $ !== 'undefined' ? '✅' : '❌');
        
        if (typeof window.helpers === 'undefined') {
          console.error('❌ CRÍTICO: helpers.js no se cargó correctamente');
        }
      }, 500);
      
      return;
    }
    
    var scriptPath = scripts[i];
    var fullPath = base + scriptPath;
    
    console.log('📥 [' + (i+1) + '/' + scripts.length + '] Cargando:', scriptPath);
    
    var s = document.createElement("script");
    s.src = fullPath;
    
    s.onload = function() {
      console.log('  ✅ OK:', scriptPath);
      loadedCount++;
      i++;
      loadNext();
    };
    
    s.onerror = function() {
      console.error('  ❌ ERROR:', scriptPath, '- URL:', fullPath);
      errorCount++;
      i++;
      loadNext(); // Continuar aunque falle
    };
    
    document.body.appendChild(s);
  }
  
  // Iniciar carga
  loadNext();

  // ========================================
  // 🔗 CONFIGURAR LINKS DEL FOOTER
  // ========================================
  var links = {
    "footer-link-inicio": "pages/index.php",
    "footer-link-productos": "pages/shop.php",
    "footer-link-nosotros": "pages/about.php",
    "footer-link-contacto": "pages/contacto.php"
  };
  
  for (var id in links) {
    var el = document.getElementById(id);
    if (el) {
      el.href = base + links[id];
      console.log('🔗 Link configurado:', id, '→', base + links[id]);
    }
  }
});

// ========================================
// 👁️ MOSTRAR FOOTER CUANDO TODO ESTÉ LISTO
// ========================================
window.addEventListener("load", function() {
  console.log('✅ Window load completo');
  
  var f = document.querySelector("footer");
  if (f) {
    f.style.display = "block";
    setTimeout(function() { 
      f.style.opacity = "1";
      console.log('✅ Footer visible');
    }, 200);
  }
});
</script>
</body>
</html>