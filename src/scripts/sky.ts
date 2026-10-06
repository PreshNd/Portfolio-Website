/**
 * The sky engine.
 *
 * Two canvases per sky:
 * - backdrop: painted ONCE (galactic band, nebula clouds, thousands of
 *   micro-stars), then only moved with a cheap CSS transform for parallax.
 * - stars: redrawn at ~30fps for twinkle, bright flares and the spiral.
 *
 * Budget rules (from the brief):
 * - pauses when the tab is hidden, and in Read mode
 * - fewer particles and a lower pixel ratio on small or weak devices
 * - one static frame for prefers-reduced-motion (no parallax, no twinkle)
 */

export type Variant = 'whisper' | 'milkyway' | 'bloom' | 'spiral';
export const VARIANTS: Variant[] = ['whisper', 'milkyway', 'bloom', 'spiral'];

type Opts = { variant: Variant; parallax?: boolean; seed?: number };

const C = {
  plum: '34,2,43',
  deep: '154,12,172',
  primary: '183,68,197',
  orchid: '228,146,245',
  lilac: '254,230,254',
  white: '255,246,255',
  peach: '238,130,153',
};

/** Small seeded PRNG so a sky looks the same on every visit. */
function prng(seed: number) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const range = (min: number, max: number) => min + rand() * (max - min);
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const pick = <T>(items: [T, number][]) => {
    let r = rand();
    for (const [item, w] of items) if ((r -= w) <= 0) return item;
    return items[items.length - 1][0];
  };
  return { rand, range, gauss, pick };
}

function blob(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: string, a: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(0.45, `rgba(${rgb},${a * 0.45})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/** A soft elongated wisp: a blob squashed and rotated. */
function wisp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  squash: number,
  angle: number,
  rgb: string,
  a: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1, squash);
  blob(ctx, 0, 0, r, rgb, a);
  ctx.restore();
}

function microStars(
  ctx: CanvasRenderingContext2D,
  R: ReturnType<typeof prng>,
  count: number,
  place: () => [number, number],
) {
  for (let i = 0; i < count; i++) {
    const [x, y] = place();
    const s = R.range(0.35, 1);
    ctx.fillStyle = `rgba(${R.rand() < 0.85 ? C.lilac : C.orchid},${R.range(0.15, 0.75)})`;
    ctx.fillRect(x, y, s, s);
  }
}

/* ── Backdrop painters (run once per resize) ───────────────── */

function paintMilkyWay(ctx: CanvasRenderingContext2D, w: number, h: number, R: ReturnType<typeof prng>, weak: boolean) {
  const x0 = -0.15 * w, y0 = 0.95 * h, x1 = 1.15 * w, y1 = 0.05 * h;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const dx = (x1 - x0) / len, dy = (y1 - y0) / len;
  const nx = -dy, ny = dx;
  const band = Math.max(w, h) * 0.085;
  const at = (t: number, off: number): [number, number] => [x0 + dx * t * len + nx * off, y0 + dy * t * len + ny * off];

  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 110; i++) {
    const [x, y] = at(R.rand(), R.gauss() * band * 0.9);
    const col = R.pick<string>([[C.primary, 0.4], [C.deep, 0.25], [C.orchid, 0.25], [C.peach, 0.1]]);
    wisp(ctx, x, y, band * R.range(0.7, 1.9), R.range(0.35, 0.7), Math.atan2(dy, dx), col, R.range(0.055, 0.12));
  }
  // the brighter heart of the band
  for (let i = 0; i < 16; i++) {
    const [x, y] = at(R.range(0.45, 0.68), R.gauss() * band * 0.4);
    blob(ctx, x, y, band * R.range(0.6, 1.3), R.rand() < 0.5 ? C.peach : C.lilac, R.range(0.04, 0.08));
  }

  // dark dust lanes running through it
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 70; i++) {
    const [x, y] = at(R.rand(), band * 0.12 + R.gauss() * band * 0.22);
    wisp(ctx, x, y, band * R.range(0.18, 0.5), R.range(0.3, 0.6), Math.atan2(dy, dx), C.plum, R.range(0.25, 0.45));
  }

  // thousands of tiny stars, crowded into the band
  const n = Math.min(Math.round((w * h) / (weak ? 700 : 380)), weak ? 2200 : 5200);
  microStars(ctx, R, n, () => (R.rand() < 0.72 ? at(R.rand(), R.gauss() * band * 0.75) : [R.rand() * w, R.rand() * h]));
}

function paintBloom(ctx: CanvasRenderingContext2D, w: number, h: number, R: ReturnType<typeof prng>, weak: boolean) {
  const m = Math.max(w, h);
  // lift the whole sky a little so it never reads as black
  blob(ctx, w * 0.5, h * 0.1, m * 0.9, C.deep, 0.22);

  ctx.globalCompositeOperation = 'lighter';
  const clouds: [number, number, number, string[]][] = [
    [0.18, 0.22, 0.3, [C.orchid, C.primary, C.deep]],
    [0.88, 0.42, 0.34, [C.deep, C.primary, C.orchid]],
    [0.42, 0.88, 0.28, [C.peach, C.orchid, C.primary]],
    [0.68, 0.08, 0.22, [C.primary, C.lilac]],
  ];
  for (const [cx, cy, size, cols] of clouds) {
    const r = m * size;
    for (let i = 0; i < 46; i++) {
      const x = cx * w + R.gauss() * r * 0.45;
      const y = cy * h + R.gauss() * r * 0.35;
      const col = cols[Math.floor(R.rand() * cols.length)];
      wisp(ctx, x, y, r * R.range(0.25, 0.7), R.range(0.3, 0.9), R.range(-0.6, 0.6), col, R.range(0.03, 0.07));
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  const n = Math.min(Math.round((w * h) / (weak ? 1600 : 900)), weak ? 900 : 2000);
  microStars(ctx, R, n, () => [R.rand() * w, R.rand() * h]);
}

function paintSpiralBackdrop(ctx: CanvasRenderingContext2D, w: number, h: number, R: ReturnType<typeof prng>, weak: boolean) {
  const m = Math.max(w, h);
  blob(ctx, w * 0.15, h * 0.2, m * 0.5, C.deep, 0.2);
  blob(ctx, w * 0.9, h * 0.85, m * 0.45, C.primary, 0.12);
  const n = Math.min(Math.round((w * h) / (weak ? 1800 : 1000)), weak ? 800 : 1800);
  microStars(ctx, R, n, () => [R.rand() * w, R.rand() * h]);
}

/** Spiral dust arms, painted face-on once; drawn rotated + tilted each frame. */
function makeGalaxyDust(R: number, rand: ReturnType<typeof prng>) {
  const size = Math.ceil(R * 2.2);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const o = size / 2;
  g.globalCompositeOperation = 'lighter';
  blob(g, o, o, R * 0.9, C.deep, 0.18);
  for (const arm of [0, Math.PI]) {
    for (let i = 0; i < 90; i++) {
      const k = Math.pow(rand.rand(), 0.8);
      const r = R * k;
      const th = arm + k * 3.6 + rand.gauss() * 0.16;
      const x = o + Math.cos(th) * r;
      const y = o + Math.sin(th) * r;
      const col = rand.pick<string>([[C.primary, 0.4], [C.orchid, 0.35], [C.peach, 0.15], [C.deep, 0.1]]);
      // wisps follow the arm's direction
      wisp(g, x, y, R * rand.range(0.08, 0.22) * (1.2 - k * 0.5), 0.45, th + Math.PI / 2.4, col, rand.range(0.06, 0.13));
    }
  }
  return c;
}

/* ── Bright flare sprite (pre-rendered once) ─────────────── */

function makeFlare(rgb: string) {
  const s = 48;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  blob(g, s / 2, s / 2, s / 2, rgb, 0.55);
  blob(g, s / 2, s / 2, s / 7, C.white, 1);
  g.strokeStyle = `rgba(${C.white},0.5)`;
  g.lineWidth = 0.8;
  g.beginPath();
  g.moveTo(s / 2, 4);
  g.lineTo(s / 2, s - 4);
  g.moveTo(4, s / 2);
  g.lineTo(s - 4, s / 2);
  g.stroke();
  return c;
}

/* ── The sky ─────────────────────────────────────────────── */

type Star = { x: number; y: number; r: number; a: number; tw: number; layer: number; col: string };
type Flare = { x: number; y: number; size: number; tw: number; sprite: number };
type Arm = { r: number; th: number; a: number; s: number; col: string };

const LAYER_SPEED = [0.03, 0.08, 0.16];

const FIELD_DENSITY: Record<Variant, number> = { whisper: 1.4, milkyway: 0.6, bloom: 0.9, spiral: 0.8 };
const FLARES: Record<Variant, number> = { whisper: 0, milkyway: 7, bloom: 6, spiral: 5 };

export function initSky(host: HTMLElement, opts: Opts) {
  const backdrop = host.querySelector<HTMLCanvasElement>('.backdrop');
  const canvas = host.querySelector<HTMLCanvasElement>('.stars');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !backdrop) return () => {};

  const { variant, parallax = true, seed = 7 } = opts;
  host.dataset.variant = variant;

  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const weak =
    (navigator.hardwareConcurrency ?? 8) <= 4 ||
    // @ts-expect-error deviceMemory is not in every lib.dom yet
    (navigator.deviceMemory ?? 8) <= 4 ||
    window.innerWidth < 600;

  let w = 0, h = 0, dpr = 1;
  let stars: Star[] = [];
  let flares: Flare[] = [];
  let arms: Arm[] = [];
  let galaxy = { cx: 0, cy: 0, R: 0 };
  let dust: HTMLCanvasElement | null = null;
  let raf = 0;
  let running = false;
  let lastFrame = 0;
  let lastScroll = -1;
  const sprites = [makeFlare(C.orchid), makeFlare(C.peach), makeFlare(C.lilac)];

  const scrollY = () => (parallax && !reducedMq.matches ? window.scrollY : 0);

  function build() {
    const R = prng(seed);
    w = host.clientWidth;
    h = host.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, weak ? 1 : 1.5);

    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // backdrop is 125% tall so parallax can slide it without showing an edge
    const bh = Math.round(h * 1.25);
    const bctx = backdrop!.getContext('2d')!;
    backdrop!.width = w;
    backdrop!.height = bh;
    backdrop!.style.height = `${bh}px`;
    bctx.clearRect(0, 0, w, bh);
    if (variant === 'milkyway') paintMilkyWay(bctx, w, bh, R, weak);
    if (variant === 'bloom') paintBloom(bctx, w, bh, R, weak);
    if (variant === 'spiral') paintSpiralBackdrop(bctx, w, bh, R, weak);

    const density = FIELD_DENSITY[variant] * (weak ? 0.65 : 1);
    const count = Math.min(Math.round(((w * h) / 10000) * density), weak ? 140 : 260);
    stars = Array.from({ length: count }, () => {
      const layer = R.rand() < 0.55 ? 0 : R.rand() < 0.7 ? 1 : 2;
      return {
        x: R.rand() * w,
        y: R.rand() * h,
        r: R.range(0.4, 0.9) + layer * 0.35,
        a: R.range(0.3, 0.6) + layer * 0.15,
        tw: R.rand() * Math.PI * 2,
        layer,
        col: R.pick<string>([[C.lilac, 0.5], [C.white, 0.3], [C.orchid, 0.15], [C.peach, 0.05]]),
      };
    });

    flares = Array.from({ length: FLARES[variant] }, () => ({
      x: R.range(0.05, 0.95) * w,
      y: R.range(0.05, 0.95) * h,
      size: R.range(14, 30),
      tw: R.rand() * Math.PI * 2,
      sprite: Math.floor(R.rand() * sprites.length),
    }));

    arms = [];
    if (variant === 'spiral') {
      const narrow = w < 700;
      // narrow screens: tuck it into the top-right corner, above the headline
      galaxy = {
        cx: w * (narrow ? 0.8 : 0.77),
        cy: h * (narrow ? 0.15 : 0.44),
        R: narrow ? w * 0.42 : Math.min(w * 0.27, h * 0.4),
      };
      dust = makeGalaxyDust(galaxy.R, R);
      const n = weak ? 1400 : 2600;
      for (let i = 0; i < n; i++) {
        const disk = R.rand() < 0.22;
        const r = galaxy.R * Math.pow(R.rand(), 1.15) * (1 + R.gauss() * 0.04);
        const arm = R.rand() < 0.5 ? 0 : Math.PI;
        const spread = 0.24 * (1.15 - r / galaxy.R);
        const th = disk ? R.rand() * Math.PI * 2 : arm + (r / galaxy.R) * 3.6 + R.gauss() * spread;
        const k = r / galaxy.R;
        arms.push({
          r,
          th,
          a: R.range(0.25, 0.85) * (disk ? 0.55 : 1),
          s: R.range(0.6, 1.7) * (k < 0.15 ? 1.2 : 1),
          col:
            k < 0.12
              ? R.pick<string>([[C.white, 0.5], [C.peach, 0.3], [C.lilac, 0.2]])
              : R.pick<string>([[C.orchid, 0.45], [C.primary, 0.25], [C.lilac, 0.2], [C.peach, 0.1]]),
        });
      }
    }
  }

  function drawSpiral(t: number, scroll: number) {
    const { cx, R } = galaxy;
    const cy = galaxy.cy - scroll * 0.12;
    if (cy < -R || cy > h + R) return; // scrolled away: skip the work
    const tilt = 0.42;
    const rot = -0.38;
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    const time = reducedMq.matches ? 0 : t;

    ctx!.globalCompositeOperation = 'lighter';
    ctx!.globalAlpha = 1;
    // dust arms: one rotated image (turns at the speed of the mid-disk stars)
    if (dust) {
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(rot);
      ctx!.scale(1, tilt);
      ctx!.rotate(time * (0.000035 / 0.75));
      ctx!.drawImage(dust, -dust.width / 2, -dust.height / 2);
      ctx!.restore();
    }
    // glowing core
    blob(ctx!, cx, cy, R * 0.32, C.orchid, 0.22);
    blob(ctx!, cx, cy, R * 0.12, C.peach, 0.45);
    blob(ctx!, cx, cy, R * 0.045, C.white, 0.9);

    for (let i = 0; i < arms.length; i++) {
      const p = arms[i];
      // inner stars turn faster than outer ones (a full turn takes minutes)
      const th = p.th + time * (0.000035 / (0.25 + p.r / R));
      const lx = Math.cos(th) * p.r;
      const ly = Math.sin(th) * p.r * tilt;
      const x = cx + lx * cosR - ly * sinR;
      const y = cy + lx * sinR + ly * cosR;
      ctx!.globalAlpha = p.a;
      ctx!.fillStyle = `rgb(${p.col})`;
      ctx!.fillRect(x, y, p.s, p.s);
    }
    ctx!.globalCompositeOperation = 'source-over';
  }

  function draw(t: number) {
    const scroll = scrollY();
    // backdrop: a compositor-only transform, ~20% of its height over the whole page
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    backdrop!.style.transform = `translate3d(0, ${-(scroll / max) * h * 0.2}px, 0)`;

    ctx!.clearRect(0, 0, w, h);
    const still = reducedMq.matches;

    for (const s of stars) {
      const y = (((s.y - scroll * LAYER_SPEED[s.layer]) % h) + h) % h;
      const twinkle = still ? 1 : 0.7 + 0.3 * Math.sin(t * 0.0013 + s.tw);
      ctx!.globalAlpha = s.a * twinkle;
      ctx!.fillStyle = `rgb(${s.col})`;
      ctx!.beginPath();
      ctx!.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx!.fill();
    }

    for (const f of flares) {
      const y = (((f.y - scroll * 0.1) % h) + h) % h;
      const pulse = still ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.0009 + f.tw);
      ctx!.globalAlpha = pulse;
      const s = f.size * (0.85 + 0.15 * pulse);
      ctx!.drawImage(sprites[f.sprite], f.x - s / 2, y - s / 2, s, s);
    }
    ctx!.globalAlpha = 1;

    if (variant === 'spiral') drawSpiral(t, scroll);
  }

  function loop(t: number) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const sy = window.scrollY;
    if (sy === lastScroll && t - lastFrame < 33) return; // ~30fps when idle
    lastScroll = sy;
    lastFrame = t;
    draw(t);
  }

  // preview panels (not the page background) keep running in Read mode
  const active = () => !parallax || document.documentElement.dataset.mode !== 'read';

  function start() {
    if (running || reducedMq.matches || document.hidden || !active()) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  build();
  draw(performance.now());
  start();

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // mobile URL bars change height constantly; only rebuild on real changes
      if (Math.abs(host.clientWidth - w) > 2 || Math.abs(host.clientHeight - h) > 120) {
        build();
        draw(performance.now());
      }
    }, 150);
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onMode = () => (active() ? start() : stop());
  const onReduced = () => {
    if (reducedMq.matches) {
      stop();
      draw(0);
    } else start();
  };

  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('modechange', onMode);
  reducedMq.addEventListener('change', onReduced);

  return () => {
    stop();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('modechange', onMode);
    reducedMq.removeEventListener('change', onReduced);
  };
}
