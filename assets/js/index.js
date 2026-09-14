/* ------------------------------------------------------------------ *
 *  DATA — swap these for your own projects.
 *  type: 'image' | 'video'
 *  For video, use { type:'video', src:'/your/clip.webm', href:'#' }
 * ------------------------------------------------------------------ */
const PROJECTS = [
  { type:'image', src:'assets/data/index power/Index_2026_20.jpg',   href:'/projects/index-power.html' },
  { type:'image', src:'assets/data/meridianos do futuro/Meridianos_Futuro_0.jpg',     href:'/projects/meridianos-do-futuro.html' },
  { type:'image', src:'assets/data/siga/siga_01.jpg',     href:'/projects/siga.html' },
  { type:'image', src:'assets/data/joaquim januario/Joaquim Januario_5.jpg',     href:'/projects/joaquim-januario.html' },
  { type:'image', src:'assets/data/tmap/TMAP_05.jpg',     href:'/projects/tm-antoniopinheiro.html' },
  { type:'image', src:'assets/data/cae vale de cambra/cae_08.jpg',    href:'/projects/cae-vale-de-cambra.html' },
  { type:'image', src:'assets/data/joao machado/Joao Machado_08.jpg',     href:'/projects/joao-machado.html' },
  { type:'image', src:'assets/data/semibreve-2025/Semibreve2025_10.jpg',      href:'/projects/semibreve-2025.html' },
  { type:'image', src:'assets/data/retratos-galeria/retratos-galeria_08.jpg',    href:'/projects/retratos-galeria.html' },
  { type:'image', src:'assets/data/cesario-costa/Cesario-Costa_01.jpg', href:'/projects/cesario-costa.html' },
  { type:'image', src:'assets/data/pedro lima/Pedro Lima_0.jpg', href:'/projects/pedro-lima.html' },
  { type:'image', src:'assets/data/tse/tse_03.jpg', href:'/projects/tse.html' },
];

/* ------------------------------------------------------------------ *
 *  ENGINE
 * ------------------------------------------------------------------ */
const grid      = document.getElementById('grid');
const container = document.getElementById('container');

const readVar = (name) => parseInt(getComputedStyle(document.documentElement).getPropertyValue(name));
let CELL_W, CELL_H;

let cols, rows, blockW, blockH, tiles = [];

const offset   = { x: 0, y: 0 };
const target   = { x: 0, y: 0 };
const velocity = { x: 0, y: 0 };

const EASE     = 0.12;   
const FRICTION = 0.93;   

function wrap(v, min, max) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src; 
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }
}, { rootMargin: '150px' });

function makeTile(data) {
  const tile = document.createElement(data.href ? 'a' : 'div');
  tile.className = 'tile';
  if (data.href) tile.href = data.href;

  // Enforce rigid flex-centering inside each grid cell container
  tile.style.display = 'flex';
  tile.style.justifyContent = 'center';
  tile.style.alignItems = 'center';

  let media;
  if (data.type === 'video') {
    media = document.createElement('video');
    media.className = 'tile-media';
    media.muted = true; media.loop = true; media.playsInline = true;
    media.preload = 'none';
    media.dataset.src = data.src;

    io.observe(media);
  } else {
    media = document.createElement('img');
    media.className = 'tile-media';
    media.src = data.src;
    media.loading = 'lazy';
    media.alt = '';
    media.draggable = false;
  }

  // Uniform aspect-ratio containment guarantees precise visual centering
  media.style.maxWidth = '100%';
  media.style.maxHeight = '100%';
  media.style.objectFit = 'contain';

  // Stop native browser drag-ghost on the media itself (images already get
  // this via draggable = false above; videos need the CSS property instead).
  media.style.webkitUserDrag = 'none';
  media.style.userSelect = 'none';

  tile.append(media);
  return tile;
}

function build() {
  const itemW = readVar('--item-w');
  const itemH = itemW * (3 / 4);
  const gapX  = readVar('--item-gap-x');
  const gapY  = readVar('--item-gap-y');
  CELL_W = itemW + gapX;   
  CELL_H = itemH + gapY; 

  container.innerHTML = '';
  tiles.forEach(t => { const v = t.el.querySelector('video'); if (v) io.unobserve(v); });
  tiles = [];

  cols = Math.ceil(window.innerWidth  / CELL_W) + 2;
  rows = Math.ceil(window.innerHeight / CELL_H) + 2;
  blockW = cols * CELL_W;
  blockH = rows * CELL_H;

  // Align grid axes so one row and column intersect precisely at screen center.
  // Center on the actual tile size (itemW/itemH), not the padded cell size —
  // the tile box is smaller than the cell, so centering on CELL_W/CELL_H
  // left it consistently off-center.
  const centerCol = Math.floor(cols / 2);
  const centerRow = Math.floor(rows / 2);

  const startX = (window.innerWidth / 2) - (centerCol * CELL_W) - (itemW / 2);
  const startY = (window.innerHeight / 2) - (centerRow * CELL_H) - (itemH / 2);

  // Prime stride prevents repeating patterns along straight grid lines
  const STRIDE = 7; 

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const projectIndex = (r * STRIDE + c) % PROJECTS.length;
      const el = makeTile(PROJECTS[projectIndex]);

      container.appendChild(el);
      tiles.push({ 
        el, 
        homeX: startX + c * CELL_W, 
        homeY: startY + r * CELL_H 
      });
    }
  }

  // Reset any pan so the centered tile lands exactly in the middle of the
  // screen — both on first load and after every resize (a previous drag
  // offset should not carry over and throw off the recentered grid).
  offset.x = target.x = velocity.x = 0;
  offset.y = target.y = velocity.y = 0;
}

function frame() {
  if (!dragging) {
    target.x += velocity.x;
    target.y += velocity.y;
    velocity.x *= FRICTION;
    velocity.y *= FRICTION;
    if (Math.abs(velocity.x) < 0.05) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.05) velocity.y = 0;
  }

  offset.x += (target.x - offset.x) * EASE;
  offset.y += (target.y - offset.y) * EASE;

  for (const t of tiles) {
    const x = wrap(t.homeX + offset.x, -CELL_W, blockW - CELL_W);
    const y = wrap(t.homeY + offset.y, -CELL_H, blockH - CELL_H);
    t.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ *
 *  INPUT — pointer drag (mouse + touch), plus trackpad/wheel pan.
 * ------------------------------------------------------------------ */
let dragging = false;
let last = { x: 0, y: 0 };
let startPos = { x: 0, y: 0 };
let moved = 0;

grid.addEventListener('pointerdown', (e) => {
  // Only start drag inside the grid element
  if (e.target.tagName === 'A' || e.target.tagName === 'IMG') {
    e.preventDefault();
  }

  dragging = true;
  moved = 0;
  velocity.x = velocity.y = 0;
  last.x = e.clientX; 
  last.y = e.clientY;
  startPos.x = e.clientX; 
  startPos.y = e.clientY;
  
  grid.classList.add('is-dragging');
});

window.addEventListener('pointermove', (e) => {
  // Release drag state if mouse button is no longer held down
  if (e.buttons === 0) {
    endDrag();
    return;
  }

  if (!dragging) return;
  const dx = e.clientX - last.x;
  const dy = e.clientY - last.y;
  target.x += dx;
  target.y += dy;
  velocity.x = dx;
  velocity.y = dy;
  
  moved = Math.hypot(e.clientX - startPos.x, e.clientY - startPos.y);
  last.x = e.clientX; 
  last.y = e.clientY;
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  grid.classList.remove('is-dragging');
}

window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

// Safeguards: Reset dragging when mouse leaves window or tab loses focus
document.addEventListener('mouseleave', endDrag);
window.addEventListener('blur', endDrag);

// ONLY intercept clicks originating from inside the #grid container
grid.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;

  // Block tile navigation only if dragging exceeded threshold
  if (moved > 6) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

grid.addEventListener('wheel', (e) => {
  e.preventDefault();
  target.x -= e.deltaX;
  target.y -= e.deltaY;
}, { passive: false });

/* ------------------------------------------------------------------ *
 *  BOOT + resize
 * ------------------------------------------------------------------ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 150);
});

build();
requestAnimationFrame(frame);