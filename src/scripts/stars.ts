/**
 * A quiet, three-depth star field on a 2D canvas.
 *
 * Budget rules (from the brief):
 * - pauses when the tab is hidden
 * - scales star count and pixel ratio down on small or weak devices
 * - draws one static frame for prefers-reduced-motion (no parallax, no twinkle)
 * - only redraws while something is moving (scroll or twinkle)
 */

type Star = { x: number; y: number; r: number; a: number; tw: number; layer: number };

const LAYERS = [
  { speed: 0.04, size: [0.4, 0.9], alpha: [0.25, 0.55] }, // far
  { speed: 0.1, size: [0.7, 1.3], alpha: [0.4, 0.75] }, // mid
  { speed: 0.2, size: [1.0, 1.8], alpha: [0.55, 0.95] }, // near
] as const;

const COLORS = ['254,230,254', '228,146,245', '255,246,255', '238,130,153'];

export function initStars(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const weak =
    (navigator.hardwareConcurrency ?? 8) <= 4 ||
    // @ts-expect-error deviceMemory is not in every lib.dom yet
    (navigator.deviceMemory ?? 8) <= 4;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let stars: Star[] = [];
  let raf = 0;
  let lastScroll = window.scrollY;
  let running = false;

  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, weak ? 1 : 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // density per 10k px², capped so huge screens stay cheap
    const density = weak ? 0.9 : 1.4;
    const count = Math.min(Math.round(((w * h) / 10000) * density), weak ? 140 : 260);
    stars = Array.from({ length: count }, () => {
      const layer = Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2;
      const L = LAYERS[layer];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(L.size[0], L.size[1]),
        a: rand(L.alpha[0], L.alpha[1]),
        tw: Math.random() * Math.PI * 2,
        layer,
      };
    });
  }

  function draw(t: number) {
    ctx!.clearRect(0, 0, w, h);
    const scroll = reduced.matches ? 0 : window.scrollY;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const L = LAYERS[s.layer];
      // wrap vertically so parallax never runs out of sky
      const y = (((s.y - scroll * L.speed) % h) + h) % h;
      const twinkle = reduced.matches ? 1 : 0.75 + 0.25 * Math.sin(t * 0.0012 + s.tw);
      ctx!.globalAlpha = s.a * twinkle;
      ctx!.fillStyle = `rgb(${COLORS[i % 7 === 0 ? 1 : i % 23 === 0 ? 3 : i % 2 ? 0 : 2]})`;
      ctx!.beginPath();
      ctx!.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  // Twinkle runs at a gentle ~30fps; scroll gets drawn on the next frame.
  let lastFrame = 0;
  function loop(t: number) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const scrolled = window.scrollY !== lastScroll;
    if (!scrolled && t - lastFrame < 33) return;
    lastScroll = window.scrollY;
    lastFrame = t;
    draw(t);
  }

  function start() {
    if (running || reduced.matches || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  build();
  draw(0);
  start();

  let resizeTimer = 0;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // mobile URL bars change height constantly; only rebuild on real changes
        if (Math.abs(canvas.clientWidth - w) > 2 || Math.abs(canvas.clientHeight - h) > 120) {
          build();
          draw(performance.now());
        }
      }, 150);
    },
    { passive: true },
  );

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stop();
      draw(0);
    } else start();
  });
}
