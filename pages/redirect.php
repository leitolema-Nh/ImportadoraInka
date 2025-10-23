<?php
$title = "Importadora Inka - Home";
$activePage = "home";
include __DIR__ . '/../partials/header.php';

// Simple autenticación básica
$usuario_valido = "Inka";
$contrasena_valida = "Inka123";

// Base URL (ajústalo si es necesario)
$base = "/"; // ejemplo: "/inka/" si tu sitio está en /public_html/inka/

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = trim($_POST["usuario"]);
    $contrasena = trim($_POST["contrasena"]);

    if ($usuario === $usuario_valido && $contrasena === $contrasena_valida) {
        header("Location: " . $base . "catalogo/index.htm");
        exit;
    } else {
        $mensaje = "❌ Usuario o contraseña erróneos";
    }
}
<style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-box {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            width: 90%;
            max-width: 320px;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px;
            margin: 8px 0 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
        }
        button {
            width: 100%;
            background: #007BFF;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
        .mensaje {
            color: red;
            text-align: center;
            margin-bottom: 10px;
        }
    </style>

?>
<body>
    <div class="login-box">
        <h2>Inka - Acceso</h2>
        <?php if ($mensaje): ?>
            <div class="mensaje"><?= $mensaje ?></div>
        <?php endif; ?>
        <form method="POST" action="">
            <input type="text" name="usuario" placeholder="Usuario" required autofocus>
            <input type="password" name="contrasena" placeholder="Contraseña" required>
            <button type="submit">Entrar</button>
        </form>
    </div>
</body>

<?php
include __DIR__ . '/../partials/footer.php';
?>

