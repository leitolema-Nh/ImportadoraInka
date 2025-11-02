<?php
/**
 * Generador de URLs RAW (versión 100 % compatible con Windows + WAMP)
 * Lee los archivos rastreados por Git directamente desde la consola
 */

$repoBase = "https://gitlab.com/leitolema/imkaweb/-/raw/main/";
$outputFile = __DIR__ . "/urls_raw.txt";

// 1️⃣  Ejecuta “git ls-files” usando shell de Windows
$cmd = 'cmd /c "git ls-files"';
exec($cmd, $files, $exitCode);

// 2️⃣  Validar salida
if ($exitCode !== 0 || empty($files)) {
    echo "❌ No se pudieron leer los archivos desde Git.\n";
    echo "Verifica que estás en la carpeta correcta (donde está .git)\n";
    exit(1);
}

// 3️⃣  Generar listado de URLs RAW
$output = "";
foreach ($files as $file) {
    $file = trim($file);
    if ($file === '') continue;
    $url = $repoBase . str_replace('\\', '/', $file);
    $output .= $url . "\n";
}

// 4️⃣  Guardar archivo
file_put_contents($outputFile, $output);

echo "✅ Archivo generado correctamente: urls_raw.txt\n";
echo "Contiene " . count($files) . " rutas RAW.\n";
?>
