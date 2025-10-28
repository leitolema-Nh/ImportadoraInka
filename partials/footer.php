<?php
/**
 * ==============================================================
 *  FOOTER - Solo HTML
 * ==============================================================
 *  Sin </body></html> - El layout_template.php los cierra
 *  Los eventos se manejan en footer.module.js
 * ==============================================================
 */

global $config;
$base = $config['paths']['baseURL'] ?? '/';
?>

<footer class="bg3 p-t-75 p-b-32">
  <div class="container">
    <div class="row">
      
      <!-- COLUMNA 1: MENU -->
      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Menu</h4>
        <ul>
          <li class="p-b-10">
            <a href="<?= $base ?>pages/index.php" id="footer-link-inicio" class="stext-107 cl7 hov-cl1 trans-04">
              Inicio
            </a>
          </li>
          <li class="p-b-10">
            <a href="<?= $base ?>pages/shop.php" id="footer-link-productos" class="stext-107 cl7 hov-cl1 trans-04">
              Productos
            </a>
          </li>
          <li class="p-b-10">
            <a href="<?= $base ?>pages/about.php" id="footer-link-nosotros" class="stext-107 cl7 hov-cl1 trans-04">
              Nosotros
            </a>
          </li>
          <li class="p-b-10">
            <a href="<?= $base ?>pages/contacto.php" id="footer-link-contacto" class="stext-107 cl7 hov-cl1 trans-04">
              Contacto
            </a>
          </li>
        </ul>
      </div>

      <!-- COLUMNA 2: AYUDA -->
      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Ayuda</h4>
        <ul>
          <li class="p-b-10">
            <a href="#" class="stext-107 cl7 hov-cl1 trans-04">
              Seguimiento de pedido
            </a>
          </li>
          <li class="p-b-10">
            <a href="#" class="stext-107 cl7 hov-cl1 trans-04">
              Devoluciones
            </a>
          </li>
          <li class="p-b-10">
            <a href="#" class="stext-107 cl7 hov-cl1 trans-04">
              Envio
            </a>
          </li>
          <li class="p-b-10">
            <a href="#" class="stext-107 cl7 hov-cl1 trans-04">
              FAQs
            </a>
          </li>
        </ul>
      </div>

      <!-- COLUMNA 3: CONTACTO -->
      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Contacto</h4>
        <p class="stext-107 cl7 size-201">
          Hnos. Pinzon #82<br>
          (Casi esquina con Manuela Diez)<br>
          Santo Domingo, Republica Dominicana
        </p>
        <p class="stext-107 cl7 size-201 p-t-10">
          <strong>Tel:</strong> 
          <a href="tel:+18096818560" class="cl7 hov-cl1 trans-04">
            +1 809 681 8560
          </a>
        </p>
        <p class="stext-107 cl7 size-201">
          <strong>Email:</strong><br>
          <a href="mailto:administracion@importadorainka.com" class="cl7 hov-cl1 trans-04">
            administracion@importadorainka.com
          </a>
        </p>
        
        <!-- Redes Sociales -->
        <div class="p-t-20">
          <a href="https://www.facebook.com/importadorainka" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="fs-18 cl7 hov-cl1 trans-04 m-r-16"
             title="Siguenos en Facebook">
            <i class="fa fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/importadorainka/" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="fs-18 cl7 hov-cl1 trans-04 m-r-16"
             title="Siguenos en Instagram">
            <i class="fa fa-instagram"></i>
          </a>
          <a href="https://api.whatsapp.com/send/?phone=18096818560&text=Hola%2C%20me%20interesa%20conocer%20sus%20productos" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="fs-18 cl7 hov-cl1 trans-04 m-r-16" 
             title="Chatea con nosotros en WhatsApp">
            <i class="fa fa-whatsapp"></i>
          </a>
        </div>
      </div>

      <!-- COLUMNA 4: NEWSLETTER -->
      <div class="col-sm-6 col-lg-3 p-b-50">
        <h4 class="stext-301 cl0 p-b-30">Newsletter</h4>
        <form>
          <div class="wrap-input1 w-full p-b-4">
            <input class="input1 bg-none plh1 stext-107 cl7" 
                   type="text" 
                   name="email" 
                   placeholder="email@example.com">
            <div class="focus-input1 trans-04"></div>
          </div>
          <div class="p-t-18">
            <button class="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04">
              Suscribirse
            </button>
          </div>
        </form>
      </div>
      
    </div>

    <!-- METODOS DE PAGO Y COPYRIGHT -->
    <div class="p-t-40">
      <div class="flex-c-m flex-w p-b-18">
        <a href="#" class="m-all-1">
          <img src="<?= $base ?>images/icons/icon-pay-01.png" alt="ICON-PAY">
        </a>
        <a href="#" class="m-all-1">
          <img src="<?= $base ?>images/icons/icon-pay-02.png" alt="ICON-PAY">
        </a>
        <a href="#" class="m-all-1">
          <img src="<?= $base ?>images/icons/icon-pay-03.png" alt="ICON-PAY">
        </a>
        <a href="#" class="m-all-1">
          <img src="<?= $base ?>images/icons/icon-pay-04.png" alt="ICON-PAY">
        </a>
        <a href="#" class="m-all-1">
          <img src="<?= $base ?>images/icons/icon-pay-05.png" alt="ICON-PAY">
        </a>
      </div>

      <p class="stext-107 cl6 txt-center">
        Copyright &copy; <?= date('Y') ?> Todos los derechos reservados | 
        Hecho con <i class="fa fa-heart-o" aria-hidden="true"></i> por 
        <a href="https://meetclic.com" target="_blank">Meetclic-RD</a>
      </p>
    </div>
  </div>
</footer>

<!-- BOTON BACK TO TOP -->
<div class="btn-back-to-top" id="myBtn">
  <span class="symbol-btn-back-to-top">
    <i class="zmdi zmdi-chevron-up"></i>
  </span>
</div>