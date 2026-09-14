/* ------------------------------------------------------------------ *
 *  DUOTONE — recolors media between two flat tones instead of full
 *  color. Works on <img> AND <video> since it's a CSS `filter`, not a
 *  canvas rewrite — so it applies to tiles even after index.js builds
 *  them dynamically (no MutationObserver needed, it's just a CSS rule).
 *
 *  Change the two colors below to re-tune the palette.
 * ------------------------------------------------------------------ */
const DUOTONE_SHADOW    = '#000000'; // dark areas of the image map to this
const DUOTONE_HIGHLIGHT = '#D9D9D9'; // light areas of the image map to this
const DUOTONE_SELECTOR  = '.tile-media'; // elements the effect is applied to

function hexToRGB01(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

function buildDuotoneFilter() {
  const shadow    = hexToRGB01(DUOTONE_SHADOW);
  const highlight = hexToRGB01(DUOTONE_HIGHLIGHT);
  const svgNS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.style.overflow = 'hidden';

  const filter = document.createElementNS(svgNS, 'filter');
  filter.setAttribute('id', 'duotone-filter');
  filter.setAttribute('color-interpolation-filters', 'sRGB');

  // Step 1 — flatten the image to grayscale (standard luminance weights).
  const grayscale = document.createElementNS(svgNS, 'feColorMatrix');
  grayscale.setAttribute('type', 'matrix');
  grayscale.setAttribute('values',
    '0.2126 0.7152 0.0722 0 0 ' +
    '0.2126 0.7152 0.0722 0 0 ' +
    '0.2126 0.7152 0.0722 0 0 ' +
    '0 0 0 1 0'
  );

  // Step 2 — remap black→white onto DUOTONE_SHADOW → DUOTONE_HIGHLIGHT.
  const remap = document.createElementNS(svgNS, 'feComponentTransfer');
  ['R', 'G', 'B'].forEach((channel) => {
    const key = channel.toLowerCase();
    const func = document.createElementNS(svgNS, `feFunc${channel}`);
    func.setAttribute('type', 'table');
    func.setAttribute('tableValues', `${shadow[key]} ${highlight[key]}`);
    remap.appendChild(func);
  });

  filter.append(grayscale, remap);
  svg.appendChild(filter);
  document.body.appendChild(svg);
}

function applyDuotoneStyle() {
  const style = document.createElement('style');
  style.textContent = `${DUOTONE_SELECTOR} { filter: url(#duotone-filter); }`;
  document.head.appendChild(style);
}

buildDuotoneFilter();
applyDuotoneStyle();