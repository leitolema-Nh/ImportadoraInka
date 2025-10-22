<?php
/**
 * ==============================================================
 *  TEMPLATE PRINCIPAL - LAYOUT BASE
 * ==============================================================
 */
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <meta name="description" content="<?= htmlspecialchars($pageDescription) ?>">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/inka/images/icons/favicon.png" />

  <!-- Config global -->
  <script src="/inka/js/config.js.php"></script>
  <script src="/inka/js/helpers.js"></script>

  <!-- VENDOR & MAIN STYLES -->
  <link rel="stylesheet" href="/inka/vendor/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="/inka/vendor/animate/animate.css">
  <link rel="stylesheet" href="/inka/vendor/css-hamburgers/hamburgers.min.css">
  <link rel="stylesheet" href="/inka/vendor/animsition/css/animsition.min.css">
  <link rel="stylesheet" href="/inka/vendor/select2/select2.min.css">
  <link rel="stylesheet" href="/inka/vendor/slick/slick.css">
  <link rel="stylesheet" href="/inka/vendor/MagnificPopup/magnific-popup.css">
  <link rel="stylesheet" href="/inka/vendor/perfect-scrollbar/perfect-scrollbar.css">

  <!-- UTIL + MAIN -->
  <link rel="stylesheet" href="/inka/css/util.css">
  <link rel="stylesheet" href="/inka/css/main.css">

  <?= $extraHead ?? '' ?>
</head>

<body class="animsition">

  <!-- HEADER GLOBAL -->
  <header>
    <div class="container-menu-desktop">

      <!-- TOP BAR -->
      <?php include __DIR__ . '/../partials/top-bar.php'; ?>

      <!-- WRAP MENU (MENU PRINCIPAL) -->
      <div class="wrap-menu-desktop">
        <?php include __DIR__ . '/../partials/header.php'; ?>
      </div>

    </div>

    <!-- MENU MOBILE -->
    <div class="menu-mobile">
      <?php include __DIR__ . '/../partials/top-bar-mobile.php'; ?>
    </div>
  </header>

  <!-- CONTENIDO PRINCIPAL -->
  <main>
    <?= $content ?>
  </main>

  <!-- FOOTER GLOBAL -->
  <?php include __DIR__ . '/../partials/footer.php'; ?>

  <!-- JS BASE -->
  <script src="/inka/vendor/jquery/jquery-3.6.0.min.js"></script>
  <script src="/inka/vendor/animsition/js/animsition.min.js"></script>
  <script src="/inka/vendor/bootstrap/js/popper.min.js"></script>
  <script src="/inka/vendor/bootstrap/js/bootstrap.min.js"></script>
  <script src="/inka/vendor/select2/select2.min.js"></script>
  <script src="/inka/vendor/slick/slick.min.js"></script>
  <script src="/inka/vendor/MagnificPopup/jquery.magnific-popup.min.js"></script>
  <script src="/inka/vendor/perfect-scrollbar/perfect-scrollbar.min.js"></script>
  <script src="/inka/js/main.js"></script>

  <?= $extraScripts ?? '' ?>
</body>
</html>
