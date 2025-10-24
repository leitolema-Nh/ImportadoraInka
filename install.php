#!/usr/bin/env php
<?php
/**
 * 🔧 Script de instalación/configuración de INKA IMPORT
 * Ejecutar: php install.php
 */

echo "\n";
echo "╔════════════════════════════════════════╗\n";
echo "║  🚀 INSTALADOR INKA IMPORT            ║\n";
echo "╚════════════════════════════════════════╝\n\n";

$rootDir = __DIR__;
$envFile = $rootDir . '/.env';
$envExample = $rootDir . '/.env.example';

// Verificar si ya existe .env
if (file_exists($envFile)) {
    echo "⚠️  Ya existe un archivo .env\n";
    echo "¿Deseas sobrescribirlo? (s/n): ";
    $respuesta = trim(fgets(STDIN));
    
    if (strtolower($respuesta) !== 's') {
        echo "❌ Instalación cancelada.\n\n";
        exit(0);
    }
}

// Preguntas de configuración
echo "📝 Configuración del entorno:\n\n";

// 1. Entorno
echo "1️⃣  ¿Qué entorno es este?\n";
echo "   [1] Desarrollo (dev) - Para localhost o IPs locales\n";
echo "   [2] Producción (prod) - Para servidor en vivo\n";
echo "Selecciona (1 o 2): ";
$envChoice = trim(fgets(STDIN));
$env = ($envChoice === '2') ? 'prod' : 'dev';

// 2. Carpeta del proyecto (solo si es dev)
$projectFolder = '';
if ($env === 'dev') {
    echo "\n2️⃣  ¿En qué carpeta está el proyecto?\n";
    echo "   Ejemplos:\n";
    echo "   - http://localhost/inka/pages/shop.php → escribe: inka\n";
    echo "   - http://10.0.0.21/proyecto/ → escribe: proyecto\n";
    echo "   - http://localhost/pages/shop.php → deja vacío (presiona Enter)\n";
    echo "Carpeta del proyecto: ";
    $projectFolder = trim(fgets(STDIN));
}

// 3. Base de datos
echo "\n3️⃣  Configuración de base de datos ($env):\n";
echo "Host (localhost): ";
$dbHost = trim(fgets(STDIN)) ?: 'localhost';

echo "Usuario: ";
$dbUser = trim(fgets(STDIN));

echo "Contraseña: ";
$dbPass = trim(fgets(STDIN));

echo "Nombre de la base de datos: ";
$dbName = trim(fgets(STDIN));

// Crear contenido del .env
$envContent = "# ========================================\n";
$envContent .= "# 🔧 CONFIGURACIÓN INKA IMPORT\n";
$envContent .= "# ========================================\n";
$envContent .= "# Generado automáticamente el " . date('Y-m-d H:i:s') . "\n\n";
$envContent .= "# Entorno: dev o prod\n";
$envContent .= "APP_ENV=$env\n\n";

if ($env === 'dev' && $projectFolder) {
    $envContent .= "# Carpeta del proyecto (solo para desarrollo)\n";
    $envContent .= "PROJECT_FOLDER=$projectFolder\n\n";
}

$envContent .= "# Base de datos - " . ucfirst($env) . "\n";
$envContent .= "DB_" . strtoupper($env) . "_HOST=$dbHost\n";
$envContent .= "DB_" . strtoupper($env) . "_USER=$dbUser\n";
$envContent .= "DB_" . strtoupper($env) . "_PASS=$dbPass\n";
$envContent .= "DB_" . strtoupper($env) . "_NAME=$dbName\n";

// Guardar archivo
if (file_put_contents($envFile, $envContent)) {
    echo "\n✅ Archivo .env creado exitosamente!\n\n";
    echo "📁 Ubicación: $envFile\n";
    echo "🔒 Recuerda: El archivo .env NO debe subirse a repositorios públicos\n\n";
    
    // Mostrar resumen
    echo "📋 Resumen de configuración:\n";
    echo "   Entorno: $env\n";
    if ($projectFolder) {
        echo "   Carpeta: $projectFolder\n";
    }
    echo "   Base de datos: $dbName @ $dbHost\n\n";
    
    echo "🎉 ¡Listo! Puedes comenzar a usar el sistema.\n\n";
} else {
    echo "\n❌ Error: No se pudo crear el archivo .env\n";
    echo "Verifica los permisos de escritura en el directorio.\n\n";
    exit(1);
}