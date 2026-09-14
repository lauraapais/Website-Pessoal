/* ------------------------------------------------------------------ *
 *  INTERACTION — while the user is dragging or scrolling the canvas,
 *  "wake up" the page:
 *    - tiles switch from the duotone filter to their real colors
 *    - tiles switch from 50% opacity to 100% opacity
 *    - the header switches from the index (grey) colors to the
 *      standard site colors
 *    - the landing-name image fades out
 *    - the background switches from --background-index to --background
 *
 *  As soon as interaction stops (no drag or scroll for IDLE_MS), it
 *  reverts back to the first stage (duotone + dim tiles + grey header
 *  + landing name + grey background).
 *
 *  Sits on top of duotone.js / index.js without editing either file:
 *  it just toggles a class on <body> and lets an injected stylesheet
 *  do the rest. Uses !important so it wins regardless of the order
 *  the <script> tags load in, or how specific the other rules are
 *  (e.g. the #body-index and #header-index ID rules in style.css).
 * ------------------------------------------------------------------ */
const EXPLORE_CLASS  = 'is-exploring';
const DRAG_THRESHOLD = 6;    // px — same threshold index.js uses for click-vs-drag
const IDLE_MS         = 2500; // ms of no drag/scroll before reverting to stage 1
const TRANSITION      = '1s ease';

function injectExploreStyle() {
  const style = document.createElement('style');
  style.textContent = `
    body {
      transition: background-color ${TRANSITION};
    }
    .tile-media {
      transition: filter ${TRANSITION};
    }
    .tile {
      transition: opacity ${TRANSITION};
    }
    .landing-name {
      transition: opacity ${TRANSITION};
    }
    #header-index {
      transition: background-color ${TRANSITION}, border-bottom-color ${TRANSITION};
    }

    body.${EXPLORE_CLASS} {
      background-color: var(--background) !important;
    }
    body.${EXPLORE_CLASS} .tile-media {
      filter: none !important;
    }
    body.${EXPLORE_CLASS} .tile {
      opacity: 1 !important;
    }
    body.${EXPLORE_CLASS} .landing-name {
      opacity: 0 !important;
      pointer-events: none;
    }
    body.${EXPLORE_CLASS} #header-index {
      background-color: var(--background) !important;
      border-bottom-color: var(--grey) !important;
    }
  `;
  document.head.appendChild(style);
}

let idleTimer = null;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(sleep, IDLE_MS);
}

function wake() {
  document.body.classList.add(EXPLORE_CLASS);
  resetIdleTimer();
}

function sleep() {
  document.body.classList.remove(EXPLORE_CLASS);
}

function initInteractionWatcher() {
  const grid = document.getElementById('grid');
  if (!grid) return;

  // Wheel / trackpad — every scroll tick counts as "still interacting",
  // so it keeps waking/re-waking and resetting the idle countdown.
  grid.addEventListener('wheel', wake, { passive: true });

  // Pointer drag — only wake once the pointer has moved past the same
  // threshold index.js uses to tell a drag from a click, then keep
  // resetting the idle countdown on every further move.
  let down = false;
  let dragActive = false;
  let startX = 0, startY = 0;

  grid.addEventListener('pointerdown', (e) => {
    down = true;
    dragActive = false;
    startX = e.clientX;
    startY = e.clientY;
  });

  grid.addEventListener('pointermove', (e) => {
    if (!down) return;
    if (!dragActive) {
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (moved > DRAG_THRESHOLD) dragActive = true;
    }
    if (dragActive) wake();
  });

  const stopTracking = () => { down = false; dragActive = false; };
  grid.addEventListener('pointerup', stopTracking);
  grid.addEventListener('pointercancel', stopTracking);
}

injectExploreStyle();
initInteractionWatcher();