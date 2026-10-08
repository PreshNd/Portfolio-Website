/* ═══════════════════════════════════════════════════════
   PACKAGES (demo) — main.js v4
   ─ Dark mode + animated stars
   ─ Multi-step modal (replaces popup)
   ─ Group booking check (9+ → redirect)
   ─ Budget feasibility filter
   ─ Dynamic confirmed.html
   ─ Demo build: email removed, nothing is sent
   ═══════════════════════════════════════════════════════ */

/* ─── Email: disabled for the portfolio demo. Nothing is ever sent. ─── */
const DEST_TIER_MIN = {
  budget: 900000,
  mid: 1200000,
  premium: 2500000,
};

const BUDGET_BANDS = {
  '₦900,000 – ₦1,500,000': 1200000,
  '₦1,500,000 – ₦2,500,000': 2000000,
  '₦2,500,000 – ₦4,000,000': 3250000,
  '₦4,000,000 – ₦6,000,000': 5000000,
  '₦6,000,000 – ₦10,000,000': 8000000,
  '₦10,000,000+': 12000000,
};

/* ─── Dummy contact numbers (replace before go-live) ── */
const PHONE      = '+2349000000000';
const WHATSAPP   = '2349000000000';

/* ─── Modal state ────────────────────────────────────── */
let currentStep   = 1;
const TOTAL_STEPS = 4;
let wantsVisa     = false;
let isCustom      = false;
let prefilledPkg  = {};


/* ════════════════════════════════════════════════════════
    CARD GENERATION + FILTERING + SORTING
   ════════════════════════════════════════════════════════ */

let ALL_PACKAGES = [];
let currentTab = 'all';

function generateCards() {
  if (!document.getElementById('tab-all')) return;

  const stored = localStorage.getItem('ts-packages');
  if (!stored) {
    console.warn('No packages in localStorage. Publish packages via the CMS admin.');
    return;
  }

  const rawData = JSON.parse(stored);
  const data = Array.isArray(rawData) ? rawData : Object.values(rawData);
  ALL_PACKAGES = data.filter(pkg => pkg.status === 'published');

  populateDestinationFilter(ALL_PACKAGES);
  renderFilteredCards();
  updateHeroStats();
}

/* ════════════════════════════════════════════════════════
    HERO PACKAGES COUNTER
   ════════════════════════════════════════════════════════ */

function updateHeroStats() {
  const el = document.getElementById('heroDestCount');
  if (!el || !ALL_PACKAGES.length) return;
  el.textContent = ALL_PACKAGES.length + '+';
}

function populateDestinationFilter(pkgs) {
  const select = document.getElementById('filterDestination');
  if (!select) return;
  const dests = [...new Set(pkgs.map(p => p.destination))].sort();
  select.innerHTML = '<option value="">All Destinations</option>' +
    dests.map(d => `<option value="${d}">${d}</option>`).join('');
}

function getActiveFilters() {
  return {
    search: (document.getElementById('pkgSearchInput')?.value || '').trim().toLowerCase(),
    destination: document.getElementById('filterDestination')?.value || '',
    priceRange: document.getElementById('filterPrice')?.value || '',
    sort: document.getElementById('sortSelect')?.value || 'featured',
  };
}

function priceToNumber(priceStr) {
  return +(priceStr || '0').replace(/[^0-9]/g, '');
}

function applyFilters(pkgs, filters) {
  let result = pkgs.filter(pkg => {
    // Search — matches name or destination
    if (filters.search) {
      const haystack = (pkg.name + ' ' + pkg.destination).toLowerCase();
      if (!haystack.includes(filters.search)) return false;
    }
    // Destination dropdown
    if (filters.destination && pkg.destination !== filters.destination) return false;
    // Price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      const price = priceToNumber(pkg.price);
      if (price < min || price > max) return false;
    }
    return true;
  });

  // Sort
  switch (filters.sort) {
    case 'price-asc':
      result = result.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
      break;
    case 'price-desc':
      result = result.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
      break;
    case 'recent':
      result = result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      break;
    // 'featured' — keep original order
  }

  return result;
}

function renderFilteredCards() {
  const filters = getActiveFilters();
  const filtered = applyFilters(ALL_PACKAGES, filters);

  const TABS = ['all', 'budget', 'luxury', 'family', 'romantic', 'adventure', 'business'];
  TABS.forEach(tab => {
    const el = document.getElementById('tab-' + tab);
    if (el) el.innerHTML = '<div class="cards-grid"></div>';
  });

  // Filter by active category tab too
  const tabFiltered = currentTab === 'all'
    ? filtered
    : filtered.filter(pkg => (pkg.tab || []).includes(currentTab));

  // Results count — reflects the currently visible tab + filters
  const countEl = document.getElementById('resultsCount');
  if (countEl) {
    countEl.textContent = `${tabFiltered.length} package${tabFiltered.length === 1 ? '' : 's'} found`;
  }

  const noResults = document.getElementById('noResults');
  if (noResults) noResults.style.display = tabFiltered.length === 0 ? 'block' : 'none';

  // Build cards into ALL tabs (so switching tabs doesn't need re-filtering)
  TABS.forEach(tab => {
    const grid = document.querySelector(`#tab-${tab} .cards-grid`);
    if (!grid) return;
    const pkgsForTab = tab === 'all'
      ? filtered
      : filtered.filter(pkg => (pkg.tab || []).includes(tab));

    let html = '';
    pkgsForTab.forEach((pkg, i) => {
      html += buildCard(pkg);
      if ((i + 1) % 5 === 0) html += buildCustomQuoteCard();
    });
    // Always show the upsell card at the end if it wasn't just inserted
    if (pkgsForTab.length === 0 || pkgsForTab.length % 5 !== 0) {
      html += buildCustomQuoteCard();
    }
    grid.innerHTML = html;
  });
}

function buildCard(pkg) {
  const badge = pkg.badge?.text ? `<span class="pkg-card-badge ${pkg.badge.cls || ''}">${pkg.badge.text}</span>` : '';
  const visaTags = (pkg.visa || []).map(v => `<span class="visa-tag ${v.cls}">${v.text}</span>`).join('');
  const highlightList = Array.isArray(pkg.highlights)
    ? pkg.highlights
    : (pkg.highlights || '').split(',').map(h => h.trim()).filter(Boolean);
  const highlights = highlightList
    .map(h => `<span class="pkg-highlight-tag">${h}</span>`)
    .join('');

  const validityHtml = (pkg.valid_from && pkg.valid_to)
    ? `<div class="pkg-card-validity"><i class="fa-regular fa-calendar"></i> Valid: ${pkg.valid_from} – ${pkg.valid_to}</div>`
    : '';

  return `
    <div class="pkg-card">
      <div class="pkg-card-img">
        <img src="${pkg.card_img}" alt="${pkg.destination}" loading="lazy" />${badge}
      </div>
      <div class="pkg-card-body">
        <div class="pkg-card-dest">${pkg.destination}</div>
        <div class="pkg-card-name">${pkg.name}</div>
        <div class="pkg-card-meta"><span><i class="fa-solid fa-calendar-days"></i> ${pkg.days} Days / ${pkg.nights} Nights</span><span><i class="fa-solid fa-plane"></i> Flights incl.</span></div>
        ${validityHtml}
        <div class="pkg-card-highlights">${highlights}</div>
        ${visaTags ? `<div class="visa-tags">${visaTags}</div>` : ''}
      </div>
      <div class="pkg-card-footer">
        <div><div class="pkg-price-label">Starting from</div><div class="pkg-price">${pkg.price} <span>/person</span></div></div>
        <a href="package-detail.html?id=${pkg.id}" class="btn btn-primary btn-sm">View Package</a>
      </div>
    </div>`;
}

function buildCustomQuoteCard() {
  return `
    <div class="custom-quote-card">
      <div class="custom-quote-card-label">Don't See Your Trip?</div>
      <div class="custom-quote-card-title">Let our travel mixologists build it for you</div>
      <div class="custom-quote-card-sub">Tell us your dream destination, dates and budget — we'll create a custom package with flights, hotel and activities.</div>
      <div class="custom-quote-card-actions">
        <button class="btn btn-blue btn-sm" data-open-modal data-custom="true">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Request Custom Package
        </button>
        <a href="tel:+2349000000000" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-phone"></i> Call Us
        </a>
      </div>
    </div>`;
}

/* ─── Filter bar event wiring ─────────────────────────── */
function initFilterBar() {
  const searchInput = document.getElementById('pkgSearchInput');
  const destSelect = document.getElementById('filterDestination');
  const priceSelect = document.getElementById('filterPrice');
  const sortSelect = document.getElementById('sortSelect');

  if (!searchInput) return; // not on this page

  searchInput.addEventListener('input', renderFilteredCards);
  destSelect?.addEventListener('change', renderFilteredCards);
  priceSelect?.addEventListener('change', renderFilteredCards);
  sortSelect?.addEventListener('change', renderFilteredCards);

  // Sticky shadow on scroll
  const wrap = document.getElementById('filterBarWrap');
  if (wrap) {
    const sentinel = document.createElement('div');
    wrap.parentNode.insertBefore(sentinel, wrap);
    const observer = new IntersectionObserver(
      ([e]) => wrap.classList.toggle('stuck', !e.isIntersecting),
      { rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height')} 0px 0px 0px` }
    );
    observer.observe(sentinel);
  }
}

/* ════════════════════════════════════════════════════════
   DARK MODE
   ════════════════════════════════════════════════════════ */
function initDarkMode() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('ts-theme') || 'light';
  applyTheme(saved);
  btn.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ts-theme', next);
  });
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
}

/* ════════════════════════════════════════════════════════
   STAR CANVAS — animated, slightly-above-subtle
   ════════════════════════════════════════════════════════ */
function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], shoots = [], W, H;

  /* ── Resize ─────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  /* ── Build star field ────────────────────────────────── */
  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 1600);
    for (let i = 0; i < count; i++) {
      const type = Math.random();
      stars.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     type < 0.76 ? Math.random() * 0.75 + 0.18   // tiny
             : type < 0.93 ? Math.random() * 1.1  + 0.75   // medium
             :                Math.random() * 1.6  + 1.4,   // bright
        alpha: type < 0.76 ? Math.random() * 0.5  + 0.22
             : type < 0.93 ? Math.random() * 0.6  + 0.35
             :                Math.random() * 0.45 + 0.55,
        twinkleSpeed: Math.random() * 0.008 + 0.001,
        phase:        Math.random() * Math.PI * 2,
        col:   ['255,255,255','225,240,255','200,225,255',
                '255,248,220','210,215,255','180,215,255'][Math.floor(Math.random()*6)],
      });
    }
  }

  /* ── Animated galaxy background ──────────────────────── */
  function drawGalaxy(t) {
    // Deep space base
    ctx.fillStyle = '#020509';
    ctx.fillRect(0, 0, W, H);

    // ── Nebula 1: Blue-purple core ──
    // Pulse: breathes 70% → 100% size, drifts position
    const n1breath = Math.sin(t * 0.22) * 0.30 + 0.70;  // big swing
    const n1x = W * 0.36 + Math.sin(t * 0.08) * W * 0.04;
    const n1y = H * 0.30 + Math.cos(t * 0.06) * H * 0.05;
    const n1r = W * 0.70 * n1breath;
    const n1 = ctx.createRadialGradient(n1x, n1y, 0, n1x, n1y, n1r);
    n1.addColorStop(0,    `rgba(60,100,255,${(0.85 * n1breath).toFixed(3)})`);
    n1.addColorStop(0.15, `rgba(40,70,200,${(0.65 * n1breath).toFixed(3)})`);
    n1.addColorStop(0.35, `rgba(25,45,160,${(0.40 * n1breath).toFixed(3)})`);
    n1.addColorStop(0.60, `rgba(15,25,110,${(0.20 * n1breath).toFixed(3)})`);
    n1.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = n1;
    ctx.fillRect(0, 0, W, H);

    // ── Nebula 2: Teal/cyan upper right ──
    const n2breath = Math.sin(t * 0.17 + 1.8) * 0.28 + 0.72;
    const n2x = W * 0.76 + Math.cos(t * 0.07) * W * 0.05;
    const n2y = H * 0.15 + Math.sin(t * 0.09) * H * 0.06;
    const n2r = W * 0.50 * n2breath;
    const n2 = ctx.createRadialGradient(n2x, n2y, 0, n2x, n2y, n2r);
    n2.addColorStop(0,    `rgba(0,180,200,${(0.75 * n2breath).toFixed(3)})`);
    n2.addColorStop(0.20, `rgba(0,130,160,${(0.50 * n2breath).toFixed(3)})`);
    n2.addColorStop(0.45, `rgba(0,80,110,${(0.28 * n2breath).toFixed(3)})`);
    n2.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = n2;
    ctx.fillRect(0, 0, W, H);

    // ── Nebula 3: Amber/gold lower left ──
    const n3breath = Math.sin(t * 0.14 + 3.2) * 0.32 + 0.68;
    const n3x = W * 0.08 + Math.sin(t * 0.06) * W * 0.04;
    const n3y = H * 0.78 + Math.cos(t * 0.08) * H * 0.05;
    const n3r = W * 0.44 * n3breath;
    const n3 = ctx.createRadialGradient(n3x, n3y, 0, n3x, n3y, n3r);
    n3.addColorStop(0,    `rgba(200,100,20,${(0.70 * n3breath).toFixed(3)})`);
    n3.addColorStop(0.20, `rgba(160,65,10,${(0.48 * n3breath).toFixed(3)})`);
    n3.addColorStop(0.45, `rgba(110,35,5,${(0.26 * n3breath).toFixed(3)})`);
    n3.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = n3;
    ctx.fillRect(0, 0, W, H);

    // ── Nebula 4: Magenta/pink accent mid-right ──
    const n4breath = Math.sin(t * 0.19 + 5.1) * 0.35 + 0.65;
    const n4x = W * 0.85 + Math.cos(t * 0.10) * W * 0.04;
    const n4y = H * 0.58 + Math.sin(t * 0.07) * H * 0.06;
    const n4r = W * 0.32 * n4breath;
    const n4 = ctx.createRadialGradient(n4x, n4y, 0, n4x, n4y, n4r);
    n4.addColorStop(0,    `rgba(200,40,160,${(0.65 * n4breath).toFixed(3)})`);
    n4.addColorStop(0.25, `rgba(150,20,120,${(0.40 * n4breath).toFixed(3)})`);
    n4.addColorStop(0.55, `rgba(90,10,80,${(0.20 * n4breath).toFixed(3)})`);
    n4.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = n4;
    ctx.fillRect(0, 0, W, H);

    // ── Milky Way band (shimmers and shifts) ──
    const bandA = Math.sin(t * 0.25) * 0.08 + 0.18;   // 0.10 – 0.26
    const bandShift = Math.sin(t * 0.12) * 0.04;       // band drifts slightly
    const band = ctx.createLinearGradient(0, H * (0.05 + bandShift), W, H * (0.95 + bandShift));
    band.addColorStop(0,    'rgba(50,90,200,0)');
    band.addColorStop(0.25, `rgba(50,90,200,${(bandA * 0.55).toFixed(3)})`);
    band.addColorStop(0.50, `rgba(70,110,230,${bandA.toFixed(3)})`);
    band.addColorStop(0.75, `rgba(50,90,200,${(bandA * 0.55).toFixed(3)})`);
    band.addColorStop(1,    'rgba(50,90,200,0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── Shooting stars ──────────────────────────────────── */
  function spawnShoot() {
    if (shoots.length >= 3) return;
    // Start from random point along top or left edge
    const fromTop = Math.random() > 0.35;
    shoots.push({
      x:     fromTop ? Math.random() * W * 0.8 : 0,
      y:     fromTop ? 0 : Math.random() * H * 0.4,
      len:   Math.random() * 180 + 80,
      speed: Math.random() * 5 + 4,
      angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.5,
      alpha: 0,
      life:  0,
      maxLife: Math.random() * 60 + 40,
    });
  }

  function drawShoots() {
    shoots.forEach(s => {
      s.life++;
      // Fade in then out
      s.alpha = s.life < 10
        ? s.life / 10
        : Math.max(0, 1 - (s.life - 10) / (s.maxLife - 10));
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;

      const tailX = s.x - Math.cos(s.angle) * s.len * s.alpha;
      const tailY = s.y - Math.sin(s.angle) * s.len * s.alpha;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.7, `rgba(200,230,255,${(s.alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(1, `rgba(255,255,255,${(s.alpha * 0.9).toFixed(3)})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.alpha * 1.8;
      ctx.stroke();
    });
    // Remove dead shoots
    for (let i = shoots.length - 1; i >= 0; i--) {
      if (shoots[i].life >= shoots[i].maxLife) shoots.splice(i, 1);
    }
  }

  /* ── Main draw loop ──────────────────────────────────── */
  let frame = 0;
  function draw() {
    const t = Date.now() / 1000;
    ctx.clearRect(0, 0, W, H);

    drawGalaxy(t);

    // Stars
    stars.forEach(s => {
      const tw = Math.sin(t * s.twinkleSpeed * 55 + s.phase) * 0.30 + 0.70;
      const a  = Math.min(s.alpha * tw, 0.92);

      // Glow halo for bright stars
      if (s.r > 1.3) {
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        halo.addColorStop(0,   `rgba(${s.col},${(a * 0.3).toFixed(3)})`);
        halo.addColorStop(0.5, `rgba(${s.col},${(a * 0.08).toFixed(3)})`);
        halo.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.col},${a.toFixed(3)})`;
      ctx.fill();
    });

    // Shooting stars
    drawShoots();

    // Randomly spawn a shooting star (avg ~every 4s)
    frame++;
    if (frame % 240 === 0 && Math.random() < 0.7) spawnShoot();
    if (frame % 360 === 0 && Math.random() < 0.4) spawnShoot();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ════════════════════════════════════════════════════════
   CATEGORY TABS (unchanged)
   ════════════════════════════════════════════════════════ */
function initTabs() {
  const pills = document.querySelectorAll('.tab-pill');
  const contents = document.querySelectorAll('.tab-content');
  if (!pills.length) return;
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      pill.classList.add('active');
      currentTab = pill.dataset.tab;
      const el = document.getElementById('tab-' + currentTab);
      if (el) el.classList.add('active');
      renderFilteredCards();
    });
  });
  }

/* ════════════════════════════════════════════════════════
   MULTI-STEP MODAL
   ════════════════════════════════════════════════════════ */
function initModal() {
  const overlay = document.getElementById('requestModal');
  if (!overlay) return;

  // Open triggers — delegated, so dynamically inserted buttons work too
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-open-modal]');
    if (!btn) return;
    openModal({
      dest: btn.dataset.dest || '',
      pkg: btn.dataset.pkg || '',
      nights: btn.dataset.nights || '',
      custom: btn.dataset.custom === 'true',
    });
  });

  // Close
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Nav
  document.getElementById('modalBack')?.addEventListener('click',   () => goStep(currentStep - 1));
  document.getElementById('modalNext')?.addEventListener('click',   handleNext);
  document.getElementById('modalSubmit')?.addEventListener('click', handleSubmit);

  // Passenger fields → group check
  ['modalAdults', 'modalChildren', 'modalInfants'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      checkGroup();
      checkBudget();
    });
  });

  // Destination + budget → feasibility check
  document.getElementById('modalDest')?.addEventListener('change',   checkBudget);
  document.getElementById('modalBudget')?.addEventListener('change', checkBudget);

  // Visa toggle
  document.querySelectorAll('.visa-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.visa-opt-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      wantsVisa = btn.dataset.val === 'yes';
      document.getElementById('visaExtraFields')?.classList.toggle('show', wantsVisa);
    });
  });

  // T&Cs checkbox
  document.getElementById('tncCheck')?.addEventListener('change', e => {
    const s = document.getElementById('modalSubmit');
    if (s) s.disabled = !e.target.checked;
  });
}

function openModal({ dest = '', pkg = '', nights = '', custom = false } = {}) {
  isCustom = custom;
  wantsVisa = false;
  currentStep = 1;
  prefilledPkg = { dest, pkg, nights };

  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  const destSelect = document.getElementById('modalDest');
  const destCustom = document.getElementById('modalDestCustom');
  const nightsEl = document.getElementById('modalNights');

  if (custom) {
    // CUSTOM MODE — destination is free text, all fields editable
    if (destSelect) destSelect.style.display = 'none';
    if (destCustom) { destCustom.style.display = 'block'; destCustom.value = ''; destCustom.readOnly = false; }
    if (nightsEl) { nightsEl.value = ''; nightsEl.readOnly = false; }
    setVal('modalPkg', 'Custom Package Request');
  } else {
    // STANDARD MODE — destination locked, pre-filled from package
    if (destSelect) { destSelect.style.display = 'block'; if (dest) setVal('modalDest', dest); destSelect.disabled = true; }
    if (destCustom) destCustom.style.display = 'none';
    if (dest) setVal('modalDest', dest);
    if (pkg) setVal('modalPkg', pkg);
    if (nights) { setVal('modalNights', nights); if (nightsEl) nightsEl.readOnly = true; }
  }

  // Title & subtitle
  const t = document.getElementById('modalTitle');
  const s = document.getElementById('modalSubtitle');
  if (t) t.textContent = custom ? 'Request a Custom Package' : (pkg || 'Request this Package');
  if (s) s.textContent = custom
    ? "Tell us your dream destination and what you're looking for — our team will build it for you."
    : 'Fill in your details and receive a personalised quote within 24 hours.';

  // Reset visa
  document.querySelectorAll('.visa-opt-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('visaExtraFields')?.classList.remove('show');

  // Reset T&Cs
  const tnc = document.getElementById('tncCheck');
  if (tnc) tnc.checked = false;
  const sub = document.getElementById('modalSubmit');
  if (sub) sub.disabled = true;

  renderStep(1);
  document.getElementById('requestModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('requestModal').classList.remove('open');
  document.body.style.overflow = '';
}

function goStep(n) { if (n < 1 || n > TOTAL_STEPS) return; currentStep = n; renderStep(n); }

function renderStep(n) {
  // Step dots
  document.querySelectorAll('.modal-step-item').forEach((item, i) => {
    const s = i + 1;
    item.classList.remove('active', 'done');
    if (s === n)      item.classList.add('active');
    else if (s < n)   item.classList.add('done');
    const conn = item.nextElementSibling;
    if (conn?.classList.contains('modal-step-connector'))
      conn.classList.toggle('done', s < n);
  });

  // Show step
  document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + n)?.classList.add('active');

  // Progress bar
  const bar = document.getElementById('modalProgressBar');
  if (bar) bar.style.width = ((n - 1) / (TOTAL_STEPS - 1) * 100) + '%';

  // Buttons
  const back = document.getElementById('modalBack');
  const next = document.getElementById('modalNext');
  const sub  = document.getElementById('modalSubmit');
  if (back) back.style.display = n > 1           ? 'inline-flex' : 'none';
  if (next) next.style.display = n < TOTAL_STEPS ? 'inline-flex' : 'none';
  if (sub)  sub.style.display  = n === TOTAL_STEPS ? 'inline-flex' : 'none';

  if (n === TOTAL_STEPS) populateReview();
}

function handleNext() { if (validateStep(currentStep)) goStep(currentStep + 1); }

function validateStep(n) {
  if (n === 1) {
    const a   = +(document.getElementById('modalAdults')?.value   || 1);
    const ch  = +(document.getElementById('modalChildren')?.value || 0);
    const inf = +(document.getElementById('modalInfants')?.value  || 0);
    const mo  = document.getElementById('modalMonth')?.value;
    const bu  = document.getElementById('modalBudget')?.value;
    if (!mo || !bu) { shake(!mo ? 'modalMonth' : 'modalBudget'); return false; }
    if (a + ch + inf >= 9) { showGroup(true); return false; }
    showGroup(false);
    return true;
  }
  if (n === 2) {
    const nm = document.getElementById('modalName')?.value?.trim();
    const em = document.getElementById('modalEmail')?.value?.trim();
    const ph = document.getElementById('modalPhone')?.value?.trim();

    // Destination validation — check whichever field is visible
    const destSelect = document.getElementById('modalDest');
    const destCustom = document.getElementById('modalDestCustom');
    const dt = isCustom
      ? destCustom?.value?.trim()
      : destSelect?.value;

    let ok = true;
    if (!nm) { shake('modalName'); ok = false; }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { shake('modalEmail'); ok = false; }
    if (!ph) { shake('modalPhone'); ok = false; }
    if (!dt) { shake(isCustom ? 'modalDestCustom' : 'modalDest'); ok = false; }
    return ok;
  }
  return true;
}

function shake(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#DB282E';
  el.style.animation   = 'shake 0.3s ease';
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 700);
}
(function() {
  const st = document.createElement('style');
  st.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}';
  document.head.appendChild(st);
})();

/* ─── Group booking check ────────────────────────────── */
function checkGroup() {
  const a   = +(document.getElementById('modalAdults')?.value   || 1);
  const ch  = +(document.getElementById('modalChildren')?.value || 0);
  const inf = +(document.getElementById('modalInfants')?.value  || 0);
  showGroup(a + ch + inf >= 9);
}
function showGroup(show) {
  document.getElementById('groupBlock')?.classList.toggle('visible', show);
  const norm = document.getElementById('step1Fields');
  if (norm) norm.style.display = show ? 'none' : 'block';
  const nx = document.getElementById('modalNext');
  if (nx && currentStep === 1) nx.disabled = show;
}

/* ─── Budget feasibility ─────────────────────────────── */
function checkBudget() {
  if (isCustom) return; // no budget check for custom requests
  // ... rest of function unchanged
  const destVal = document.getElementById('modalDest')?.value;
  const budgetVal = document.getElementById('modalBudget')?.value;
  const a = +(document.getElementById('modalAdults')?.value || 1);
  const ch = +(document.getElementById('modalChildren')?.value || 0);
  const inf = +(document.getElementById('modalInfants')?.value || 0);
  const pax = Math.max(a + ch + inf, 1);
  const warn = document.getElementById('budgetWarning');
  if (!destVal || !budgetVal || !warn) return;

  // Get the actual package price from localStorage
  const stored = localStorage.getItem('ts-packages');
  const allPkgs = stored ? JSON.parse(stored) : [];
  const pkgData = Array.isArray(allPkgs)
    ? allPkgs.find(p => p.destination === destVal)
    : Object.values(allPkgs).find(p => p.destination === destVal);

  if (!pkgData) { warn.classList.remove('visible'); return; }

  // Strip price string to a number e.g. "₦1,150,000" → 1150000
  const pricePerPerson = +(pkgData.price || '0')
    .replace(/[^0-9]/g, '');

  if (!pricePerPerson) { warn.classList.remove('visible'); return; }

  // Minimum total = price per person × total passengers
  const minTotal = pricePerPerson * pax;
  const budgetAmt = BUDGET_BANDS[budgetVal] || 0;

  if (budgetAmt > 0 && budgetAmt < minTotal) {
    const minEl = warn.querySelector('.budget-warn-min');
    if (minEl) minEl.textContent = '₦' + minTotal.toLocaleString('en-NG');
    warn.classList.add('visible');
  } else {
    warn.classList.remove('visible');
  }
}

/* ─── Populate review ────────────────────────────────── */
function populateReview() {
  const g   = id => document.getElementById(id)?.value || '—';
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  set('rv-package', g('modalPkg')  || (isCustom ? 'Custom Package Request' : '—'));
  set('rv-dest',    g('modalDest'));
  set('rv-month',   g('modalMonth'));
  set('rv-nights',  g('modalNights') !== '—' ? g('modalNights') + ' nights' : '—');

  const a = g('modalAdults'), ch = g('modalChildren'), inf = g('modalInfants');
  set('rv-pax', `${a} Adult${a!=='1'?'s':''}, ${ch} Child${ch!=='1'?'ren':''}, ${inf} Infant${inf!=='1'?'s':''}`);

  set('rv-budget',  g('modalBudget'));
  set('rv-name',    g('modalName'));
  set('rv-email',   g('modalEmail'));
  set('rv-phone',   g('modalPhone'));
  set('rv-city',    g('modalCity'));
  set('rv-visa',    wantsVisa ? 'Yes — assistance requested' : 'No');
  set('rv-special', g('modalSpecial') || 'None');
}

/* ─── Submit ─────────────────────────────────────────── */
async function handleSubmit() {
  const tnc = document.getElementById('tncCheck');
  if (!tnc?.checked) return;
  const btn = document.getElementById('modalSubmit');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  const data = gatherData();
  sessionStorage.setItem('pkgRequest', JSON.stringify(data));

  // Demo: no email, no network. The request only lives in this tab.
  window.location.href = 'confirmed.html';
}

function gatherData() {
  const g = id => document.getElementById(id)?.value || '';
  return {
    package:        g('modalPkg') || (isCustom ? 'Custom Package' : 'Travel Package'),
    destination: isCustom
      ? (document.getElementById('modalDestCustom')?.value || '')
      : g('modalDest'),
    travel_month:   g('modalMonth'),
    nights:         g('modalNights'),
    adults:         g('modalAdults') || '1',
    children:       g('modalChildren') || '0',
    infants:        g('modalInfants') || '0',
    budget:         g('modalBudget'),
    name:           g('modalName'),
    email:          g('modalEmail'),
    phone:          g('modalPhone'),
    departure_city: g('modalCity'),
    visa_required:  wantsVisa ? 'Yes' : 'No',
    visa_nationality: wantsVisa ? g('modalVisaNat') : '',
    special:        g('modalSpecial'),
    is_custom:      isCustom ? 'Yes' : 'No',
    submitted_at:   new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
  };
}

/* ════════════════════════════════════════════════════════
   DYNAMIC DETAIL PAGE
   Reads ?id=dubai from URL and populates content
   ════════════════════════════════════════════════════════ */
function initDetailPage() {
  if (!document.getElementById('detailHero')) return;

  const stored = localStorage.getItem('ts-packages');
  if (!stored) { console.warn('No packages in localStorage.'); return; }
  const rawData = JSON.parse(stored);
  const PKGS = Array.isArray(rawData)
    ? rawData.reduce((acc, p) => { acc[p.id] = p; return acc; }, {}) : rawData;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'dubai';
  const pkg = PKGS[id];
  if (!pkg) { document.title = 'Package Not Found'; return; }

  // Document title
  document.title = pkg.name + ' – Packages demo';

  // Hero image
  const heroImg = document.getElementById('detailHeroImg');
  if (heroImg) heroImg.src = pkg.hero;

  // Breadcrumb
  const bc = document.getElementById('detailBreadcrumb');
  if (bc) bc.innerHTML = `<a href="index.html">Packages</a> &rsaquo; ${pkg.destination} &rsaquo; ${pkg.name}`;

  // Title
  const titleEl = document.getElementById('detailTitle');
  if (titleEl) titleEl.textContent = pkg.name;

  // Meta pills — declare metaEl here
  const metaEl = document.getElementById('detailMeta');
  const firstHighlight = Array.isArray(pkg.highlights)
    ? pkg.highlights[0]
    : (pkg.highlights || '').split(',')[0]?.trim() || '';
  if (metaEl) metaEl.innerHTML =
    `<span class="meta-pill"><i class="fa-solid fa-calendar-days"></i> ${pkg.days} Days / ${pkg.nights} Nights</span>
       <span class="meta-pill"><i class="fa-solid fa-plane"></i> Flights included</span>
       <span class="meta-pill"><i class="fa-solid fa-hotel"></i> ${firstHighlight}</span>` +
    (pkg.visa || []).map(v => `<span class="meta-pill">${v.text}</span>`).join('');

  // Overview
  const ov = document.getElementById('detailOverview');
  if (ov) ov.textContent = pkg.overview;

  // What's included
  const incGrid = document.getElementById('detailIncludes');
  if (incGrid) incGrid.innerHTML = (pkg.includes || []).map(i => {
    const iconHtml = i.icon && i.icon.startsWith('fa-')
      ? `<i class="${i.icon}"></i>`
      : (i.icon || '<i class="fa-solid fa-circle-check"></i>');
    return `<div class="include-item"><span class="include-icon">${iconHtml}</span><span class="include-text">${i.text}</span></div>`;
  }).join('');

  // What's NOT included
  const exList = document.getElementById('detailExcludes');
  if (exList) exList.innerHTML = (pkg.excludes || []).map(e =>
    `<div class="exclude-item">${e}</div>`
  ).join('');

  // Destination quick facts — declared ONCE
  const factsEl = document.getElementById('detailFacts');
  if (factsEl) factsEl.innerHTML = (pkg.facts || []).map(f => {
    const iconHtml = f.icon && f.icon.startsWith('fa-')
      ? `<i class="${f.icon}"></i>`
      : (f.icon || '<i class="fa-solid fa-circle-info"></i>');
    return `<div class="dest-fact"><div class="dest-fact-icon">${iconHtml}</div><div class="dest-fact-label">${f.label}</div><div class="dest-fact-value">${f.value}</div></div>`;
  }).join('');

  // Itinerary
  const itinEl = document.getElementById('detailItinerary');
  if (itinEl) itinEl.innerHTML = (pkg.itinerary || []).map(d =>
    `<div class="itin-day"><div class="itin-dot">${d.day}</div><div class="itin-content"><div class="itin-day-label">Day ${d.day}</div><div class="itin-title">${d.title}</div><div class="itin-desc">${d.desc}</div></div></div>`
  ).join('');

  // Things to do
  const todoEl = document.getElementById('detailTodo');
  if (todoEl) todoEl.innerHTML = (pkg.todo || []).map(t =>
    `<div class="todo-item">${t}</div>`
  ).join('');

  // Price — main display
  const priceEl = document.getElementById('detailPrice');
  if (priceEl) priceEl.textContent = pkg.price;
  const priceText = document.getElementById('detailPriceText');
  if (priceText) priceText.textContent = pkg.price;

  // Price card includes list — declared ONCE, separate from factsEl
  const priceInc = document.getElementById('detailPriceIncludes');
  if (priceInc) priceInc.innerHTML = (pkg.includes || []).map(i => {
    const iconHtml = i.icon && i.icon.startsWith('fa-')
      ? `<i class="${i.icon}"></i>`
      : (i.icon || '<i class="fa-solid fa-circle-check"></i>');
    return `<li>${iconHtml} ${i.text}</li>`;
  }).join('');

  // Wire up modal buttons
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    if (!btn.dataset.dest) btn.dataset.dest = pkg.destination;
    if (!btn.dataset.pkg) btn.dataset.pkg = pkg.name;
    if (!btn.dataset.nights) btn.dataset.nights = String(pkg.nights);
  });
  }

/* ════════════════════════════════════════════════════════
   CONFIRMED PAGE — populate from sessionStorage
   ════════════════════════════════════════════════════════ */
function initConfirmed() {
  const shell = document.querySelector('.confirm-shell');
  if (!shell) return;
  const d = JSON.parse(sessionStorage.getItem('pkgRequest') || '{}');
  if (!d.name) return; // no data, leave defaults

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || '—'; };
  set('conf-package',     d.package);
  set('conf-destination', d.destination);
  set('conf-month',       d.travel_month);
  set('conf-travelers',   `${d.adults||1} Adults, ${d.children||0} Children, ${d.infants||0} Infants`);
  set('conf-budget',      d.budget);
  set('conf-name',        d.name);
  set('conf-email',       d.email);
  set('conf-visa',        d.visa_required || 'No');
  set('conf-city',        d.departure_city);
  set('conf-time',        d.submitted_at);
}

/* ════════════════════════════════════════════════════════
   FAQ TOGGLE (unchanged)
   ════════════════════════════════════════════════════════ */
function initFaqToggle() {
  const btn = document.getElementById('faqToggleBtn');
  if (!btn) return;
  const extras = document.querySelectorAll('.faq-extra');
  let expanded = false;
  btn.addEventListener('click', () => {
    expanded = !expanded;
    extras.forEach(item => item.classList.toggle('faq-expanded', expanded));
    btn.textContent = expanded ? 'Hide FAQs' : 'View More FAQs';
    btn.classList.toggle('btn-outline', !expanded);
    btn.classList.toggle('btn-primary', expanded);
  });
}

/* ════════════════════════════════════════════════════════
   SMOOTH SCROLL (unchanged)
   ════════════════════════════════════════════════════════ */
function initScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ─── Helper ─────────────────────────────────────────── */
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ════════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  
  // ── Hamburger menu ──
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  const backdrop = document.getElementById('navMobileBackdrop');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      if (backdrop) backdrop.classList.toggle('open', open);
    });

    // Close on backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        backdrop.classList.remove('open');
      });
    }

    // Close on outside click (fallback)
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('open');
      }
    });
  }

  initDarkMode();
  initStars();
  generateCards();
  initFilterBar()
  initTabs();
  initModal();
  initDetailPage();
  initConfirmed();
  initFaqToggle();
  initScrollLinks();
});
