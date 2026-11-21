<?php
/**
 * ============================================================
 * 🎴 productCard.php - Tarjeta de producto (catálogo)
 * ============================================================
 * - Toda la tarjeta abre el modal (.js-show-modal1 + data-id)
 * - Foto cuadrada; si no hay foto se muestra un fondo neutro
 * - Título: descripción (2 líneas); si falta, se usa el tipo de producto
 * - Precio por unidad grande; por mayor (6+) y por docena (12+) como etiquetas
 * ============================================================
 */

if (!isset($producto) || !is_array($producto)) {
    return;
}

$esc = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');

$id           = (int)($producto['id'] ?? 0);
$codigo       = trim((string)($producto['codigo'] ?? ''));
$tipoProducto = trim((string)($producto['tipoProducto'] ?? ''));
$tipoUnidad   = trim((string)($producto['tipoUnidad'] ?? ''));
$imagen       = (string)($producto['imagen'] ?? '');
$esNuevo      = !empty($producto['nuevo']);

// Descripción: hay registros vacíos o con el texto literal "false"
$descripcion = trim((string)($producto['descripcion'] ?? ''));
if (in_array(strtolower($descripcion), ['', 'false', 'null', 'sin descripción'], true)) {
    $descripcion = '';
}

// Tipo en formato legible ("ARETE DE ACERO" -> "Arete de acero")
$tipoLegible = $tipoProducto;
if ($tipoLegible !== '' && mb_strtoupper($tipoLegible, 'UTF-8') === $tipoLegible) {
    $tipoLegible = mb_strtoupper(mb_substr($tipoLegible, 0, 1, 'UTF-8'), 'UTF-8')
                 . mb_strtolower(mb_substr($tipoLegible, 1, null, 'UTF-8'), 'UTF-8');
}

if ($descripcion !== '') {
    $etiqueta = $tipoLegible;
    $titulo   = $descripcion;
} else {
    // Sin descripción: el tipo pasa a ser el título y el código la etiqueta
    $etiqueta = $codigo !== '' ? 'Cód. ' . $codigo : '';
    $titulo   = $tipoLegible !== '' ? $tipoLegible : 'Producto';
}

// Precios: sin decimales cuando son enteros (RD$350), con miles (RD$1,250)
$fmt = function ($n) {
    $n = (float)$n;
    return 'RD$' . number_format($n, floor($n) == $n ? 0 : 2);
};
$pGeneral = (float)($producto['precio_general'] ?? 0);
$pMayor   = (float)($producto['precio_mayor'] ?? 0);
$pDocena  = (float)($producto['precio_docena'] ?? 0);
$mostrarMayor  = $pMayor > 0 && $pMayor != $pGeneral;
$mostrarDocena = $pDocena > 0 && $pDocena != $pGeneral;

// Precio destacado: el de docena si existe; si no, el de 6 o más; si no, el de unidad
if ($mostrarDocena) {
    $heroCant = 12; $heroPrecio = $pDocena;
} elseif ($mostrarMayor) {
    $heroCant = 6;  $heroPrecio = $pMayor;
} else {
    $heroCant = 1;  $heroPrecio = $pGeneral;
}
// Ahorro por unidad frente a comprar una sola
$ahorro = ($pGeneral > 0 && $heroPrecio < $pGeneral)
    ? (int)round(($pGeneral - $heroPrecio) / $pGeneral * 100)
    : 0;

// Unidad de venta: solo si aporta algo (no un número suelto)
$mostrarUnidad = !$mostrarMayor && !$mostrarDocena && mb_strlen($tipoUnidad, 'UTF-8') > 2 && !is_numeric($tipoUnidad);

$sinFoto = $imagen === '' || substr($imagen, -11) === 'default.jpg';
?>
<a href="#" class="pcard js-show-modal1" data-id="<?= $id ?>" onclick="return false;"
   aria-label="Ver detalles de <?= $esc($titulo) ?>">
    <div class="pcard__pic<?= $sinFoto ? ' is-empty' : '' ?>">
        <?php if (!$sinFoto): ?>
            <img src="<?= $esc($imagen) ?>" alt="<?= $esc($titulo) ?>" loading="lazy" decoding="async"
                 onerror="this.parentNode.classList.add('is-empty');this.remove();">
        <?php endif; ?>
        <span class="pcard__nopic" aria-hidden="true"><b>INKA</b>Foto pendiente</span>
        <?php /* El tipo va sobre la foto (arriba a la izquierda); la novedad, a la derecha */ ?>
        <?php if ($etiqueta !== ''): ?>
            <span class="pcard__type"><?= $esc($etiqueta) ?></span>
        <?php endif; ?>
        <?php if ($esNuevo): ?>
            <span class="pcard__badge">Nuevo</span>
        <?php endif; ?>
    </div>
    <div class="pcard__body">
        <span class="pcard__title"><?= $esc($titulo) ?></span>
        <?php if ($descripcion !== '' && $codigo !== ''): ?>
            <span class="pcard__code">Cód. <?= $esc($codigo) ?></span>
        <?php endif; ?>
    </div>
        <?php if ($heroCant > 1): ?>
            <?php /* Precio destacado: el mejor precio por cantidad. Siempre "c/u"
                     y con el total ya calculado, para que no se lea "la docena cuesta 40". */ ?>
            <?php /* Todos los precios van dentro de una misma caja para que se lean
                     como parte de este producto: referencia arriba, oferta grande. */ ?>
            <span class="pcard__box">
                <span class="pcard__ref">
                    <span><span>1 unidad</span><span><?= $fmt($pGeneral) ?></span></span>
                    <?php if ($heroCant === 12 && $mostrarMayor): ?>
                        <span><span>6 o más</span><span><?= $fmt($pMayor) ?></span></span>
                    <?php endif; ?>
                </span>
                <span class="pcard__price pcard__price--deal">
                    <strong><?= $fmt($heroPrecio) ?></strong> <small>c/u</small>
                    <?php if ($ahorro >= 5): ?><em class="pcard__save">-<?= $ahorro ?>%</em><?php endif; ?>
                </span>
                <span class="pcard__deal">
                    <?php if ($heroCant === 12): ?>
                        docena: <b><?= $fmt($heroPrecio * 12) ?></b>
                    <?php else: ?>
                        llevando 6 o más
                    <?php endif; ?>
                </span>
            </span>
        <?php else: ?>
            <span class="pcard__box pcard__box--plain">
                <span class="pcard__price"><strong><?= $fmt($pGeneral) ?></strong> <small>c/u</small></span>
                <?php if ($mostrarUnidad): ?>
                    <span class="pcard__unit">Se vende por <?= $esc(mb_strtolower($tipoUnidad, 'UTF-8')) ?></span>
                <?php endif; ?>
            </span>
        <?php endif; ?>
</a>
