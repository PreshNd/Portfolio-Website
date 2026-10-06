/**
 * Motion primitives shared by every page.
 * - Lenis smooth scroll (skipped for reduced motion and touch-first devices,
 *   where native scrolling already feels right and costs nothing)
 * - [data-reveal] elements fade up as they enter the viewport
 */
import Lenis from 'lenis';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;

export let lenis: Lenis | null = null;

if (!reduced && !coarse) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  const raf = (t: number) => {
    lenis!.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // keep in-page anchor links (skip link, "jump to") smooth and focus-correct
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.querySelector<HTMLElement>(a.getAttribute('href')!);
    if (!target) return;
    e.preventDefault();
    lenis!.scrollTo(target, { offset: -24 });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
);

document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
