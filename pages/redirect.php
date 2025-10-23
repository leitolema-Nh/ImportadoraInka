<?php
/**
 * ===============================================================
 * PÁGINA DE ACCESO - Importadora INKA
 * Redirige al catálogo si las credenciales son correctas
 * ===============================================================
 */

// 🔧 Detectar base URL automáticamente (compatible con config.php)
$scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
$segments   = explode('/', trim($scriptPath, '/'));
$rootFolder = $segments[0] ?? '';
$base = $rootFolder ? "/{$rootFolder}/" : '/';

// Compatibilidad PHP 7 (sin str_contains)
if (strpos($_SERVER['REQUEST_URI'], '/pages/') !== false) {
    $base = str_replace('/pages', '', $base);
}

// =============================
// 🔐 AUTENTICACIÓN
// =============================
$usuario_valido = "Inka";
$contrasena_valida = "Inka123";
$mensaje = "";
$tipo_mensaje = ""; // 'error' o 'success'

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = trim($_POST["usuario"] ?? "");
    $contrasena = trim($_POST["contrasena"] ?? "");

    if ($usuario === $usuario_valido && $contrasena === $contrasena_valida) {
        // ✅ Credenciales correctas - redirigir al catálogo
        header("Location: " . $base . "catalogo/index.htm");
        exit;
    } else {
        // ❌ Credenciales incorrectas
        $mensaje = "Usuario o contraseña incorrectos. Por favor, intenta nuevamente.";
        $tipo_mensaje = "error";
    }
}

// Variables para el header
$pageTitle = "Acceso al Catálogo - Importadora Inka";
$pageDescription = "Ingresa tus credenciales para acceder al catálogo completo de Importadora Inka";
$activePage = "login";

include __DIR__ . '/../partials/header.php';
?>

<!-- ================= ESTILOS PERSONALIZADOS PARA LOGIN ================= -->
<style>
/* Contenedor principal con altura completa menos header */
.login-container {
    min-height: calc(100vh - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
}

/* Caja del formulario */
.login-box {
    background: white;
    padding: 50px 40px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 420px;
    animation: slideUp 0.5s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Logo/Título */
.login-box h2 {
    text-align: center;
    color: #333;
    font-size: 2rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.login-box .subtitle {
    text-align: center;
    color: #666;
    font-size: 1rem;
    margin-bottom: 30px;
}

/* Mensajes de error */
.mensaje {
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 0.95rem;
    animation: shake 0.5s ease;
}

.mensaje.error {
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
}

.mensaje.success {
    background: #efe;
    color: #3c3;
    border: 1px solid #cfc;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

/* Campos del formulario */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: #555;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.95rem;
}

.form-group input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Botón de envío */
.btn-login {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-login:active {
    transform: translateY(0);
}

/* Link de ayuda */
.help-text {
    text-align: center;
    margin-top: 20px;
    color: #666;
    font-size: 0.9rem;
}

.help-text a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.help-text a:hover {
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 576px) {
    .login-box {
        padding: 40px 30px;
    }
    
    .login-box h2 {
        font-size: 1.6rem;
    }
}
</style>

<!-- ================= CONTENIDO PRINCIPAL ================= -->
<div class="login-container">
    <div class="login-box">
        <h2>🔐 Acceso al Catálogo</h2>
        <p class="subtitle">Importadora Inka</p>
        
        <?php if ($mensaje): ?>
            <div class="mensaje <?= $tipo_mensaje ?>">
                <?= htmlspecialchars($mensaje) ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="usuario">Usuario</label>
                <input 
                    type="text" 
                    id="usuario" 
                    name="usuario" 
                    placeholder="Ingresa tu usuario" 
                    required 
                    autofocus
                    autocomplete="username"
                    value="<?= isset($_POST['usuario']) ? htmlspecialchars($_POST['usuario']) : '' ?>"
                >
            </div>
            
            <div class="form-group">
                <label for="contrasena">Contraseña</label>
                <input 
                    type="password" 
                    id="contrasena" 
                    name="contrasena" 
                    placeholder="Ingresa tu contraseña" 
                    required
                    autocomplete="current-password"
                >
            </div>
            
            <button type="submit" class="btn-login">
                Ingresar al Catálogo
            </button>
            
            <div class="help-text">
                ¿Necesitas ayuda? <a href="<?= $base ?>pages/contacto.php">Contáctanos</a>
            </div>
        </form>
    </div>
</div>

<?php
include __DIR__ . '/../partials/footer.php';
?>