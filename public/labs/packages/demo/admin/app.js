/* ═══════════════════════════════════════════════════════
   PACKAGE MANAGER (demo) — app.js
   Full CMS logic. Reads/writes localStorage.
   Export button generates packages-data.js for deployment.
   ═══════════════════════════════════════════════════════ */

const LS_KEY = 'ts-packages';
const FRONTEND_LS_KEY = 'ts-packages';

const CATEGORIES = {
    budget: 'Budget Getaways',
    luxury: 'Luxury Escapes',
    family: 'Family Trips',
    romantic: 'Romantic Vacations',
    adventure: 'Adventure Tours',
    business: 'Business',
};

const TIERS = { budget: 'Budget', mid: 'Mid-range', premium: 'Premium' };

const FACT_TYPES = [
    { value: 'visa', label: 'Visa', icon: 'fa-solid fa-stamp' },
    { value: 'insurance', label: 'Insurance', icon: 'fa-solid fa-shield-halved' },
    { value: 'season', label: 'Best Season', icon: 'fa-solid fa-sun' },
    { value: 'weather', label: 'Weather', icon: 'fa-solid fa-cloud-sun' },
    { value: 'currency', label: 'Currency', icon: 'fa-solid fa-money-bill' },
    { value: 'language', label: 'Language', icon: 'fa-solid fa-language' },
    { value: 'timezone', label: 'Time Zone', icon: 'fa-regular fa-clock' },
    { value: 'capital', label: 'Capital', icon: 'fa-solid fa-building-columns' },
    { value: 'flighttime', label: 'Flight Time', icon: 'fa-solid fa-plane' },
    { value: 'transport', label: 'Transport', icon: 'fa-solid fa-car' },
    { value: 'power', label: 'Power/Plug', icon: 'fa-solid fa-plug' },
    { value: 'tip', label: 'Travel Tip', icon: 'fa-solid fa-lightbulb' },
];

const SAMPLE_PACKAGES = [
    {
        id: 'dubai', name: 'Dubai Desert Escape', destination: 'Dubai, UAE',
        price: '₦1,150,000', days: 5, nights: 4, tier: 'mid',
        highlights: '4-Star Hotel,Desert Safari,City Tour',
        badge: { text: 'Popular', cls: '' },
        hero: '/labs/packages/demo/img/dubai.svg',
        card_img: '/labs/packages/demo/img/dubai.svg',
        dest_img: '/labs/packages/demo/img/dubai.svg',
        overview: 'This 5-day Dubai package combines luxury accommodation, a desert safari and guided city tour.',
        includes: [
            { icon: 'fa-solid fa-plane', text: 'Return Flights (Lagos – Dubai)' },
            { icon: 'fa-solid fa-hotel', text: '4-Star Hotel (4 nights)' },
            { icon: 'fa-solid fa-mug-saucer', text: 'Daily Breakfast' },
            { icon: 'fa-solid fa-van-shuttle', text: 'Airport Transfers' },
            { icon: 'fa-solid fa-sun', text: 'Desert Safari' },
            { icon: 'fa-solid fa-map', text: 'Dubai City Tour' },
        ],
        excludes: ['Visa fees', 'Meals beyond breakfast', 'Personal expenses'],
        facts: [
            { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'Required' },
            { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Oct – Apr' },
            { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'UAE Dirham' },
            { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '20–25°C winter' },
        ],
        itinerary: [
            { day: 1, title: 'Arrival', desc: 'Airport pickup and hotel check-in.' },
            { day: 2, title: 'Dubai City Tour', desc: 'Burj Khalifa, Dubai Mall, Gold Souk.' },
            { day: 3, title: 'Desert Safari', desc: 'Dune bashing, camel riding, BBQ dinner.' },
            { day: 4, title: 'Free Day', desc: 'Leisure or optional activities.' },
            { day: 5, title: 'Departure', desc: 'Breakfast and airport transfer.' },
        ],
        todo: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Jumeirah Beach', 'Gold & Spice Souks'],
        tab: ['all', 'adventure'], category_label: 'Adventure & City',
        visa: [{ cls: 'visa-tag-required', text: 'Visa Required' }],
        status: 'published',
    },
    {
        id: 'zanzibar', name: 'Zanzibar Beach Retreat', destination: 'Zanzibar, Tanzania',
        price: '₦990,000', days: 6, nights: 5, tier: 'budget',
        highlights: 'Beachfront Hotel,Snorkelling,Spice Tour',
        badge: { text: 'Best Value', cls: 'green' },
        hero: '/labs/packages/demo/img/zanzibar.svg',
        card_img: '/labs/packages/demo/img/zanzibar.svg',
        dest_img: '/labs/packages/demo/img/zanzibar.svg',
        overview: 'Pristine beaches, turquoise waters and UNESCO Stone Town.',
        includes: [
            { icon: 'fa-solid fa-plane', text: 'Return Flights' },
            { icon: 'fa-solid fa-hotel', text: 'Beachfront Hotel' },
            { icon: 'fa-solid fa-fish', text: 'Snorkelling Trip' },
            { icon: 'fa-solid fa-leaf', text: 'Spice Tour' },
            { icon: 'fa-solid fa-van-shuttle', text: 'Transfers' },
            { icon: 'fa-solid fa-mug-saucer', text: 'Daily Breakfast' },
        ],
        excludes: ['Visa fees', 'Insurance (compulsory)', 'Personal expenses'],
        facts: [
            { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'Required' },
            { type: 'insurance', icon: 'fa-solid fa-shield-halved', label: 'Insurance', value: 'Compulsory' },
            { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Jun – Oct' },
            { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'Tanzanian Shilling' },
        ],
        itinerary: [
            { day: 1, title: 'Arrival', desc: 'Hotel check-in.' },
            { day: 2, title: 'Stone Town', desc: 'UNESCO heritage tour.' },
            { day: 3, title: 'Spice Tour', desc: 'Full spice farm visit.' },
            { day: 4, title: 'Snorkelling', desc: 'Mnemba Atoll trip.' },
            { day: 5, title: 'Beach Day', desc: 'Free day.' },
            { day: 6, title: 'Departure', desc: 'Return flight.' },
        ],
        todo: ['Stone Town', 'Prison Island', 'Nungwi Beach', 'Kizimkazi dolphins', 'Jozani Forest'],
        tab: ['all', 'budget'], category_label: 'Beach & Culture',
        visa: [{ cls: 'visa-tag-required', text: 'Visa Required' }, { cls: 'visa-tag-insurance', text: 'Insurance Compulsory' }],
        status: 'published',
    },
    {
        id: 'maldives', name: 'Maldives Overwater Paradise', destination: 'Maldives',
        price: '₦3,200,000', days: 7, nights: 6, tier: 'premium',
        highlights: 'Overwater Villa,All Inclusive,Diving',
        badge: { text: 'Luxury', cls: 'purple' },
        hero: '/labs/packages/demo/img/maldives.svg',
        card_img: '/labs/packages/demo/img/maldives.svg',
        dest_img: '/labs/packages/demo/img/maldives.svg',
        overview: 'Wake above the Indian Ocean in a private overwater villa.',
        includes: [
            { icon: 'fa-solid fa-plane', text: 'Return Flights' },
            { icon: 'fa-solid fa-umbrella-beach', text: 'Overwater Villa' },
            { icon: 'fa-solid fa-utensils', text: 'All Inclusive' },
            { icon: 'fa-solid fa-water', text: 'Snorkelling & Diving' },
            { icon: 'fa-solid fa-ship', text: 'Speedboat Transfers' },
            { icon: 'fa-solid fa-sailboat', text: 'Sunset Cruise' },
        ],
        excludes: ['Visa on arrival fee', 'Extra water sports', 'Spa treatments'],
        facts: [
            { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'On arrival' },
            { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Nov – Apr' },
            { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'USD accepted' },
            { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '28–30°C' },
        ],
        itinerary: [
            { day: 1, title: 'Arrival', desc: 'Speedboat to resort.' },
            { day: 2, title: 'Reef Snorkelling', desc: 'Guided reef trip.' },
            { day: 3, title: 'Diving', desc: 'Intro dive session.' },
            { day: 4, title: 'Dolphin Cruise', desc: 'Sunset cruise.' },
            { day: 5, title: 'Island Hopping', desc: 'Village visit.' },
            { day: 6, title: 'Leisure', desc: 'Relax or spa.' },
            { day: 7, title: 'Departure', desc: 'Return flight.' },
        ],
        todo: ['Snorkel with mantas', 'Underwater dining', 'Sandbank picnic', 'Night fishing'],
        tab: ['all', 'luxury', 'romantic'], category_label: 'Luxury & Romance',
        visa: [{ cls: 'visa-tag-arrival', text: 'Visa on Arrival' }],
        status: 'published',
    },
    {
        id: 'capetown', name: 'Cape Town Explorer', destination: 'Cape Town, South Africa',
        price: '₦980,000', days: 5, nights: 4, tier: 'budget',
        highlights: 'Table Mountain,Wine Tour,Cape Point',
        badge: { text: '', cls: '' },
        hero: '/labs/packages/demo/img/capetown.svg',
        card_img: '/labs/packages/demo/img/capetown.svg',
        dest_img: '/labs/packages/demo/img/capetown.svg',
        overview: 'Iconic Table Mountain, world-class wine farms and stunning coastline.',
        includes: [
            { icon: 'fa-solid fa-plane', text: 'Return Flights' },
            { icon: 'fa-solid fa-hotel', text: '3-Star+ Hotel' },
            { icon: 'fa-solid fa-mountain', text: 'Table Mountain' },
            { icon: 'fa-solid fa-wine-glass', text: 'Winelands Tour' },
            { icon: 'fa-solid fa-binoculars', text: 'Boulders Beach' },
            { icon: 'fa-solid fa-van-shuttle', text: 'Transfers' },
        ],
        excludes: ['Meals beyond breakfast', 'Cape Point entry', 'Optional boat trips'],
        facts: [
            { type: 'visa', icon: 'fa-solid fa-circle-check', label: 'Visa', value: 'Visa free' },
            { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Oct – Apr' },
            { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'South African Rand' },
            { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '20–28°C summer' },
        ],
        itinerary: [
            { day: 1, title: 'Arrival', desc: 'V&A Waterfront evening.' },
            { day: 2, title: 'Table Mountain', desc: 'Cable car and city tour.' },
            { day: 3, title: 'Cape Peninsula', desc: 'Cape Point and penguins.' },
            { day: 4, title: 'Winelands', desc: 'Stellenbosch wine tour.' },
            { day: 5, title: 'Departure', desc: 'Airport transfer.' },
        ],
        todo: ['Table Mountain', 'V&A Waterfront', 'Robben Island', 'Boulders Beach', 'Stellenbosch'],
        tab: ['all', 'budget', 'family', 'adventure'], category_label: 'Adventure & Culture',
        visa: [{ cls: 'visa-tag-free', text: 'Visa Free' }],
        status: 'published',
    },
    {
        id: 'paris', name: 'Paris Romantic Getaway', destination: 'Paris, France',
        price: '₦2,100,000', days: 5, nights: 4, tier: 'premium',
        highlights: 'Boutique Hotel,Seine Cruise,Eiffel Visit',
        badge: { text: 'Romantic', cls: 'purple' },
        hero: '/labs/packages/demo/img/paris.svg',
        card_img: '/labs/packages/demo/img/paris.svg',
        dest_img: '/labs/packages/demo/img/paris.svg',
        overview: 'The city of light, love and croissants.',
        includes: [
            { icon: 'fa-solid fa-plane', text: 'Return Flights' },
            { icon: 'fa-solid fa-hotel', text: 'Boutique Hotel Central Paris' },
            { icon: 'fa-solid fa-tower-observation', text: 'Eiffel Tower Entry' },
            { icon: 'fa-solid fa-sailboat', text: 'Seine River Cruise' },
            { icon: 'fa-solid fa-landmark', text: 'Louvre Museum' },
            { icon: 'fa-solid fa-van-shuttle', text: 'Transfers' },
        ],
        excludes: ['Schengen visa fees', 'Meals', 'Metro pass'],
        facts: [
            { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'Schengen required' },
            { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Apr – Jun, Sep – Oct' },
            { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'Euro (EUR)' },
            { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '15–25°C spring' },
        ],
        itinerary: [
            { day: 1, title: 'Arrival', desc: 'Champs-Elysees evening.' },
            { day: 2, title: 'Landmarks', desc: 'Eiffel Tower, Seine cruise.' },
            { day: 3, title: 'Art & Culture', desc: 'Louvre and Montmartre.' },
            { day: 4, title: 'Versailles', desc: 'Optional palace day trip.' },
            { day: 5, title: 'Departure', desc: 'Final transfer.' },
        ],
        todo: ['Eiffel Tower', 'The Louvre', 'Notre-Dame', 'Montmartre', 'Versailles'],
        tab: ['all', 'luxury', 'romantic'], category_label: 'Romance & Culture',
        visa: [{ cls: 'visa-tag-required', text: 'Visa Required (Schengen)' }],
        status: 'published',
    },
];

/* ══════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════ */
let packages = [];
let editingId = null;
let editStatus = 'published';
let searchQuery = '';
let filterStatus = 'all';
let deleteConfirmCallback = null;
let currentPage = 1;
const PAGE_SIZE = 5;

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
function initApp() {
    const stored = localStorage.getItem(LS_KEY);
    packages = stored
        ? JSON.parse(stored)
        : JSON.parse(JSON.stringify(
            typeof PACKAGES !== 'undefined' ? Object.values(PACKAGES) : SAMPLE_PACKAGES
        ));
    renderList();
    showView('packages');

    document.getElementById('search-input')?.addEventListener('input', function () {
        searchQuery = this.value.toLowerCase();
        currentPage = 1;
        renderList();
    });
    document.getElementById('filter-status')?.addEventListener('change', function () {
        filterStatus = this.value;
        currentPage = 1;
        renderList();
    });
}

/* ══════════════════════════════════════════════
   PERSIST
   ══════════════════════════════════════════════ */
function persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(packages));
    updateStats();
}

/* ══════════════════════════════════════════════
   VIEW SWITCHING
   ══════════════════════════════════════════════ */
function showView(name) {
    document.querySelectorAll('[id^="view-"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
    const view = document.getElementById('view-' + name);
    if (view) view.style.display = 'flex';
    const link = document.querySelector(`.sb-link[data-view="${name}"]`);
    if (link) link.classList.add('active');

    if (name === 'packages') renderList();
    if (name === 'visa') {
        if (typeof initVisaApp === 'function' && !window._visaInited) {
            initVisaApp(); window._visaInited = true;
        } else if (typeof renderVisaList === 'function') {
            renderVisaList();
        }
    }
    if (name === 'users') {
        if (typeof canManageUsers === 'function' && !canManageUsers()) {
            showView('packages'); return;
        }
        if (typeof initUsersApp === 'function' && !window._usersInited) {
            initUsersApp(); window._usersInited = true;
        } else if (typeof renderUsersList === 'function') {
            renderUsersList();
        }
    }
    if (name === 'categories') {
        if (typeof canManageCats === 'function' && !canManageCats()) {
            showView('packages'); return;
        }
        if (typeof initCategoriesApp === 'function' && !window._catsInited) {
            initCategoriesApp(); window._catsInited = true;
        } else if (typeof renderCategoriesList === 'function') {
            renderCategoriesList();
        }
      }
}

/* ══════════════════════════════════════════════
   STATS
   ══════════════════════════════════════════════ */
function updateStats() {
    const live = packages.filter(p => p.status === 'published').length;
    const draft = packages.filter(p => p.status !== 'published').length;
    const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setEl('stat-total', packages.length);
    setEl('stat-live', live);
    setEl('stat-draft', draft);
    setEl('sb-badge', packages.length);
}

/* ══════════════════════════════════════════════
   LIST VIEW
   ══════════════════════════════════════════════ */
function renderList() {
    updateStats();

    let filtered = packages.filter(p => {
        const matchQ = !searchQuery
            || p.name.toLowerCase().includes(searchQuery)
            || p.destination.toLowerCase().includes(searchQuery);
        const matchS = filterStatus === 'all' || p.status === filterStatus;
        return matchQ && matchS;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const paged = filtered.slice(start, start + PAGE_SIZE);
    const tbody = document.getElementById('pkg-tbody');
    if (!tbody) return;

    if (!filtered.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7"><i class="ti ti-package-off"></i><p>No packages found</p></td></tr>`;
        renderPagination(0, 0);
        return;
    }

    tbody.innerHTML = paged.map(p => {
        const cats = (p.tab || []).filter(t => t !== 'all').map(t => CATEGORIES[t] || t).join(', ') || 'All';
        const thumb = p.card_img
            ? `<img class="pkg-thumb" src="${p.card_img}" alt="" onerror="this.style.display='none'" />`
            : `<div class="pkg-thumb" style="background:var(--subtle);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:18px"><i class="ti ti-photo"></i></div>`;
        return `<tr>
      <td>
        <div class="pkg-name-cell">
          ${thumb}
          <div>
            <div class="pkg-name">${p.name}</div>
            <div class="pkg-dest">${p.destination}</div>
          </div>
        </div>
      </td>
      <td style="color:var(--muted);font-size:12px">${cats}</td>
      <td style="color:var(--muted);font-size:12px">${p.days}D / ${p.nights}N</td>
      <td style="font-weight:600;font-size:13px">${p.price}</td>
      <td><span class="badge badge-${p.tier || 'mid'}">${TIERS[p.tier] || 'Mid'}</span></td>
      <td>
      ${p.status === 'published'
                ? '<span class="badge badge-live">Published</span>'
                : p.status === 'pending'
                    ? '<span class="badge badge-pending">Pending Review</span>'
                    : '<span class="badge badge-draft">Draft</span>'}
    </td>
    <td>
    <div class="row-actions">
      <button class="icon-btn" onclick="openEdit('${p.id}')" aria-label="Edit">
        <i class="ti ti-edit"></i>
      </button>
      ${p.status === 'pending' && typeof canPublish === 'function' && canPublish() ? `
        <button class="icon-btn" style="color:var(--green);border-color:var(--green)"
          onclick="approvePackage('${p.id}')" aria-label="Approve">
          <i class="ti ti-check"></i>
        </button>
        <button class="icon-btn danger" onclick="rejectPackage('${p.id}')" aria-label="Reject">
          <i class="ti ti-x"></i>
        </button>
      ` : `
        <button class="icon-btn" onclick="duplicatePackage('${p.id}')" aria-label="Duplicate">
          <i class="ti ti-copy"></i>
        </button>
        <button class="icon-btn danger" onclick="deletePackage('${p.id}')" aria-label="Delete">
          <i class="ti ti-trash"></i>
        </button>
      `}
    </div>
  </td>
    </tr>`;
    }).join('');

    renderPagination(filtered.length, totalPages);
}

function renderPagination(total, totalPages) {
    const container = document.getElementById('pagination-bar');
    if (!container) return;
    if (totalPages <= 1) {
        container.innerHTML = `<span class="pag-info">Showing ${total} package${total !== 1 ? 's' : ''}</span>`;
        return;
    }
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    let pages = [], pageButtons = '', prev = 0;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) pages.push(i);
    }
    pages.forEach(p => {
        if (prev && p - prev > 1) pageButtons += `<span class="pag-ellipsis">…</span>`;
        pageButtons += `<button class="pag-btn ${p === currentPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`;
        prev = p;
    });
    container.innerHTML = `
    <span class="pag-info">Showing ${start}–${end} of ${total}</span>
    <div class="pag-controls">
      <button class="pag-btn pag-arrow" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="ti ti-chevron-left"></i> Prev
      </button>
      ${pageButtons}
      <button class="pag-btn pag-arrow" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        Next <i class="ti ti-chevron-right"></i>
      </button>
    </div>`;
}

function goToPage(page) {
    const filtered = packages.filter(p => {
        const matchQ = !searchQuery || p.name.toLowerCase().includes(searchQuery) || p.destination.toLowerCase().includes(searchQuery);
        const matchS = filterStatus === 'all' || p.status === filterStatus;
        return matchQ && matchS;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderList();
}

/* ══════════════════════════════════════════════
   EDIT / ADD
   ══════════════════════════════════════════════ */
function openAdd() {
    editingId = null;
    editStatus = 'published';
    clearForm();
    document.getElementById('edit-title').textContent = 'Add Package';
    document.getElementById('delete-btn').style.display = 'none';
    const infoCard = document.getElementById('entry-info-card');
    if (infoCard) infoCard.style.display = 'none';
    activateTab('tab-basics');
    setStatusUI('published');
    showView('edit');
}

function openEdit(id) {
    editingId = id;
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    editStatus = pkg.status || 'published';
    document.getElementById('edit-title').textContent = 'Edit: ' + pkg.name;
    document.getElementById('delete-btn').style.display = 'inline-flex';
    populateForm(pkg);
    activateTab('tab-basics');
    setStatusUI(editStatus);

    // Entry info card
    const infoCard = document.getElementById('entry-info-card');
    if (infoCard) {
        infoCard.style.display = 'block';
        const set = (elId, v) => { const el = document.getElementById(elId); if (el) el.textContent = v || '—'; };
        set('info-created-by', pkg.created_by);
        set('info-created-at', pkg.created_at ? formatDate(pkg.created_at) : '—');
        set('info-updated-by', pkg.updated_by);
        set('info-updated-at', pkg.updated_at ? formatDate(pkg.updated_at) : '—');
    }
    showView('edit');
}

function cancelEdit() { showView('packages'); }

/* ══════════════════════════════════════════════
   AAPROVE AND REJECT PACKAGE 
   ══════════════════════════════════════════════ */

function approvePackage(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    const user = typeof currentUser === 'function' ? currentUser() : null;
    pkg.status = 'published';
    pkg.updated_by = user?.name || 'Unknown';
    pkg.updated_at = new Date().toISOString();
    persist();
    toast('Package approved and published', 'success');
}

function rejectPackage(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    openDeleteConfirm(
        'Reject Changes',
        `Reject changes to <strong>${pkg.name}</strong> and move it back to Draft?`,
        () => {
            const user = typeof currentUser === 'function' ? currentUser() : null;
            pkg.status = 'draft';
            pkg.updated_by = user?.name || 'Unknown';
            pkg.updated_at = new Date().toISOString();
            persist();
            toast('Changes rejected — moved to draft', 'info');
        }
    );
  }

/* ══════════════════════════════════════════════
   DELETE CONFIRMATION MODAL
   ══════════════════════════════════════════════ */
function openDeleteConfirm(title, message, onConfirm) {
    document.getElementById('delete-modal-title').textContent = title;
    document.getElementById('delete-modal-message').innerHTML = message;
    document.getElementById('delete-confirm-modal').classList.add('open');
    deleteConfirmCallback = onConfirm;
}

function closeDeleteConfirm() {
    document.getElementById('delete-confirm-modal').classList.remove('open');
    deleteConfirmCallback = null;
}

function confirmDeleteAction() {
    if (typeof deleteConfirmCallback === 'function') deleteConfirmCallback();
    closeDeleteConfirm();
}

function deletePackage(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    openDeleteConfirm(
        'Delete Package',
        `Are you sure you want to delete <strong>${pkg.name}</strong>? This cannot be undone.`,
        () => {
            packages = packages.filter(p => p.id !== id);
            persist();
            toast('Package deleted', 'info');
            showView('packages');
        }
    );
}

function duplicatePackage(id) {
    const src = packages.find(p => p.id === id);
    if (!src) return;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = src.id + '-copy';
    copy.name = src.name + ' (Copy)';
    copy.status = 'draft';
    packages.push(copy);
    persist();
    toast('Package duplicated as draft', 'info');
}

/* ══════════════════════════════════════════════
   POPULATE FORM
   ══════════════════════════════════════════════ */
function populateForm(pkg) {
    sv('f-name', pkg.name || '');
    sv('f-destination', pkg.destination || '');
    sv('f-overview', pkg.overview || '');
    sv('f-price', pkg.price || '');
    sv('f-days', pkg.days || '');
    sv('f-nights', pkg.nights || '');
    sv('f-tier', pkg.tier || 'mid');
    sv('f-highlights', Array.isArray(pkg.highlights) ? pkg.highlights.join(',') : (pkg.highlights || ''));
    sv('f-badge-text', pkg.badge?.text || '');
    sv('f-badge-cls', pkg.badge?.cls || '');
    sv('f-hero', pkg.hero || '');
    sv('f-card-img', pkg.card_img || '');
    sv('f-dest-img', pkg.dest_img || '');
    sv('f-cat-label', pkg.category_label || '');
    sv('f-cat-label', pkg.category_label || '');
    sv('f-valid-from', pkg.valid_from || '');
    sv('f-valid-to', pkg.valid_to || '');

    previewImg('f-hero', 'prev-hero');
    previewImg('f-card-img', 'prev-card');
    previewImg('f-dest-img', 'prev-dest');

    const il = document.getElementById('includes-list'); il.innerHTML = '';
    (pkg.includes || []).forEach(i => addIncludeRow(migrateIcon(i.icon || ''), i.text));

    const el = document.getElementById('excludes-list'); el.innerHTML = '';
    (pkg.excludes || []).forEach(e => addExcludeRow(e));

    const it = document.getElementById('itinerary-list'); it.innerHTML = '';
    (pkg.itinerary || []).forEach(d => addItinRow(d.day, d.title, d.desc));

    const fl = document.getElementById('facts-list'); fl.innerHTML = '';
    (pkg.facts || []).forEach(f => addFactRow(f.type || '', f.label, f.value));

    const tl = document.getElementById('todo-list'); tl.innerHTML = '';
    (pkg.todo || []).forEach(t => addTodoRow(t));

    document.querySelectorAll('#cat-chips .chip').forEach(c => {
        c.classList.toggle('active', (pkg.tab || []).includes(c.dataset.val));
    });
    document.querySelectorAll('#visa-chips .chip').forEach(c => {
        c.classList.toggle('active', (pkg.visa || []).some(v => v.cls === c.dataset.cls));
    });
}

/* ══════════════════════════════════════════════
   CLEAR FORM
   ══════════════════════════════════════════════ */
function clearForm() {
    ['f-name', 'f-destination', 'f-overview', 'f-price', 'f-days', 'f-nights',
        'f-highlights', 'f-badge-text', 'f-hero', 'f-card-img', 'f-dest-img', 'f-cat-label',
        'f-valid-from', 'f-valid-to']
        .forEach(id => sv(id, ''));
    sv('f-tier', 'mid'); sv('f-badge-cls', '');
    ['includes-list', 'excludes-list', 'itinerary-list', 'facts-list', 'todo-list']
        .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = ''; });
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    ['prev-hero', 'prev-card', 'prev-dest'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = `<span><i class="ti ti-photo" style="font-size:24px;display:block;margin-bottom:4px;opacity:.3"></i>Preview</span>`;
    });
    addIncludeRow('fa-solid fa-plane', '');
    addIncludeRow('fa-solid fa-hotel', '');
    addExcludeRow('');
    addItinRow(1, '', '');
    addFactRow('visa', 'Visa', '');
    addFactRow('season', 'Best Season', '');
    addFactRow('currency', 'Currency', '');
    addFactRow('weather', 'Weather', '');
    addTodoRow('');
}

/* ══════════════════════════════════════════════
   COLLECT FORM
   ══════════════════════════════════════════════ */
function collectForm() {
    const name = gv('f-name').trim();
    if (!name) { toast('Package name is required', 'error'); return null; }

    const id = editingId || slugify(name);
    const includes = [...document.querySelectorAll('#includes-list .dyn-item')].map(r => {
        const sel = r.querySelector('select');
        const inp = r.querySelector('input');
        const icon = sel?.value || 'fa-solid fa-circle-check';
        const text = inp?.value?.trim() || '';
        return { icon, text };
    }).filter(i => i.text);
    const excludes = [...document.querySelectorAll('#excludes-list .dyn-item')]
        .map(r => r.querySelector('input')?.value).filter(Boolean);
    const itinerary = [...document.querySelectorAll('.itin-card')].map((d, i) => {
        const ins = d.querySelectorAll('input');
        return { day: i + 1, title: ins[0]?.value || '', desc: ins[1]?.value || '' };
    });
    const facts = [...document.querySelectorAll('#facts-list .dyn-item')].map(r => {
        const sel = r.querySelector('select');
        const ins = r.querySelectorAll('input');
        const type = sel?.value || '';
        const found = FACT_TYPES.find(f => f.value === type);
        return {
            type,
            icon: found?.icon || 'fa-solid fa-circle-info',
            label: ins[0]?.value || found?.label || '',
            value: ins[1]?.value || '',
        };
    }).filter(f => f.value);
    const todo = [...document.querySelectorAll('#todo-list .dyn-item')]
        .map(r => r.querySelector('input')?.value).filter(Boolean);
    const tabs = ['all', ...[...document.querySelectorAll('#cat-chips .chip.active')].map(c => c.dataset.val)];
    const visa = [...document.querySelectorAll('#visa-chips .chip.active')]
        .map(c => ({ cls: c.dataset.cls, text: c.dataset.text }));

    const existing = packages.find(p => p.id === editingId);
    const now = new Date().toISOString();
    const user = typeof currentUser === 'function' ? currentUser() : null;

    return {
        id, name,
        destination: gv('f-destination'),
        overview: gv('f-overview'),
        price: gv('f-price'),
        days: +gv('f-days') || 5,
        nights: +gv('f-nights') || 4,
        tier: gv('f-tier'),
        highlights: gv('f-highlights'),
        badge: { text: gv('f-badge-text'), cls: gv('f-badge-cls') },
        hero: gv('f-hero'),
        card_img: gv('f-card-img'),
        dest_img: gv('f-dest-img'),
        category_label: gv('f-cat-label'),
        valid_from: gv('f-valid-from'),
        valid_to: gv('f-valid-to'),
        includes, excludes, itinerary, facts, todo,
        tab: tabs,
        visa: visa,
        status: editStatus,
        created_by: existing?.created_by || user?.name || 'Unknown',
        created_at: existing?.created_at || now,
        updated_by: user?.name || 'Unknown',
        updated_at: now,
    };
}

/* ══════════════════════════════════════════════
   SAVE PACKAGE
   ══════════════════════════════════════════════ */
function savePackage(status) {
    const user = typeof currentUser === 'function' ? currentUser() : null;

    // Contributors can only save as pending — not directly published
    if (status === 'published' && user?.role === 'contributor') {
        status = 'pending';
    }

    editStatus = status;
    const pkg = collectForm();
    if (!pkg) return;
    pkg.status = status;

    const idx = packages.findIndex(p => p.id === pkg.id);
    if (idx >= 0) packages.splice(idx, 1, pkg);
    else packages.push(pkg);

    persist();

    const messages = {
        published: 'Package published successfully',
        draft: 'Saved as draft',
        pending: 'Submitted for review — an Editor will approve your changes',
    };
    toast(messages[status] || 'Saved', 'success');
    setTimeout(() => showView('packages'), 600);
  }

/* ══════════════════════════════════════════════
   DYNAMIC ROW BUILDERS
   ══════════════════════════════════════════════ */
function addIncludeRow(icon = '', text = '') {
    const d = document.createElement('div');
    d.className = 'dyn-item';
    const iconOpts = [
        'fa-solid fa-plane', 'fa-solid fa-hotel', 'fa-solid fa-mug-saucer',
        'fa-solid fa-van-shuttle', 'fa-solid fa-utensils', 'fa-solid fa-umbrella-beach',
        'fa-solid fa-water', 'fa-solid fa-ship', 'fa-solid fa-mountain',
        'fa-solid fa-wine-glass', 'fa-solid fa-binoculars', 'fa-solid fa-leaf',
        'fa-solid fa-fish', 'fa-solid fa-map', 'fa-solid fa-car',
        'fa-solid fa-sailboat', 'fa-solid fa-landmark', 'fa-solid fa-tower-observation',
        'fa-solid fa-circle-check',
    ];
    const options = iconOpts.map(o =>
        `<option value="${o}" ${o === icon ? 'selected' : ''}>${o.replace('fa-solid fa-', '').replace('fa-regular fa-', '').replace(/-/g, ' ')}</option>`
    ).join('');
    d.innerHTML = `
    <select class="form-input" style="width:140px;flex-shrink:0">
      <option value="">Icon</option>${options}
    </select>
    <input class="form-input" type="text" value="${text}" placeholder="e.g. Return flights Lagos – Dubai" />
    <button class="dyn-remove" onclick="this.parentElement.remove()" aria-label="Remove"><i class="ti ti-x"></i></button>`;
    document.getElementById('includes-list').appendChild(d);
}

function addExcludeRow(text = '') {
    const d = document.createElement('div');
    d.className = 'dyn-item';
    d.innerHTML = `
    <input class="form-input" type="text" value="${text}" placeholder="e.g. Visa fees" />
    <button class="dyn-remove" onclick="this.parentElement.remove()" aria-label="Remove"><i class="ti ti-x"></i></button>`;
    document.getElementById('excludes-list').appendChild(d);
}

function addItinRow(day = 1, title = '', desc = '') {
    const n = document.querySelectorAll('.itin-card').length + 1;
    const d = document.createElement('div');
    d.className = 'itin-card';
    d.innerHTML = `
    <div class="itin-card-header">
      <span class="itin-day-label">Day ${n}</span>
      <button class="dyn-remove" onclick="this.closest('.itin-card').remove(); renumberDays()" aria-label="Remove day"><i class="ti ti-x"></i></button>
    </div>
    <div class="form-grid">
      <div class="form-col">
        <label class="form-label">Title</label>
        <input class="form-input" type="text" value="${title}" placeholder="e.g. Dubai City Tour" />
      </div>
      <div class="form-col">
        <label class="form-label">Description</label>
        <input class="form-input" type="text" value="${desc}" placeholder="Brief summary of the day" />
      </div>
    </div>`;
    document.getElementById('itinerary-list').appendChild(d);
}

function renumberDays() {
    document.querySelectorAll('.itin-card').forEach((c, i) => {
        const label = c.querySelector('.itin-day-label');
        if (label) label.textContent = 'Day ' + (i + 1);
    });
}

function factTypeOptions(selected = '') {
    return FACT_TYPES.map(f =>
        `<option value="${f.value}" ${selected === f.value ? 'selected' : ''}>${f.label}</option>`
    ).join('');
}

function addFactRow(type = '', label = '', value = '') {
    const d = document.createElement('div');
    d.className = 'dyn-item';
    d.innerHTML = `
    <select class="form-input" style="width:150px;flex-shrink:0" onchange="updateFactLabel(this)">
      <option value="">Select type</option>
      ${factTypeOptions(type)}
    </select>
    <input class="form-input label-input" type="text" value="${label}"
      placeholder="Label e.g. Visa" style="width:120px;flex-shrink:0" />
    <input class="form-input" type="text" value="${value}" placeholder="Value e.g. Required" />
    <button class="dyn-remove" onclick="this.parentElement.remove()" aria-label="Remove">
      <i class="ti ti-x"></i>
    </button>`;
    document.getElementById('facts-list').appendChild(d);
}

function updateFactLabel(select) {
    const row = select.parentElement;
    const labelInput = row.querySelectorAll('input')[0];
    const found = FACT_TYPES.find(f => f.value === select.value);
    if (found && labelInput && !labelInput.value) {
        labelInput.value = found.label;
    }
}

function addTodoRow(text = '') {
    const d = document.createElement('div');
    d.className = 'dyn-item';
    d.innerHTML = `
    <input class="form-input" type="text" value="${text}" placeholder="e.g. Burj Khalifa" />
    <button class="dyn-remove" onclick="this.parentElement.remove()" aria-label="Remove"><i class="ti ti-x"></i></button>`;
    document.getElementById('todo-list').appendChild(d);
}

/* ══════════════════════════════════════════════
   IMAGE PREVIEW
   ══════════════════════════════════════════════ */
function previewImg(inputId, previewId) {
    const url = document.getElementById(inputId)?.value;
    const box = document.getElementById(previewId);
    if (!box) return;
    box.innerHTML = url
        ? `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span>Image not found</span>'" />`
        : `<span><i class="ti ti-photo" style="font-size:24px;display:block;margin-bottom:4px;opacity:.3"></i>Preview</span>`;
}

/* ══════════════════════════════════════════════
   CHIP TOGGLES
   ══════════════════════════════════════════════ */
function toggleChip(el) { el.classList.toggle('active'); }

/* ══════════════════════════════════════════════
   STATUS UI
   ══════════════════════════════════════════════ */
function setStatusUI(status) {
    editStatus = status;
    document.querySelectorAll('.status-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.status === status);
    });
}

/* ══════════════════════════════════════════════
   TABS
   ══════════════════════════════════════════════ */
function activateTab(id) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === id));
}

/* ══════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════ */
function exportData() {
    const published = packages.filter(p => p.status === 'published');
    const entries = published.map(p => `  ${p.id}: ${JSON.stringify(p, null, 4)}`).join(',\n\n');
    const output = `/* Auto-generated by Package Manager (demo) — ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} */\n\nconst PACKAGES = {\n${entries}\n};\n\nconst DEST_TIER_MIN = { budget: 900000, mid: 1200000, premium: 2500000 };\n\nconst BUDGET_BANDS = {\n  '₦900,000 – ₦1,500,000': 1200000,\n  '₦1,500,000 – ₦2,500,000': 2000000,\n  '₦2,500,000 – ₦4,000,000': 3250000,\n  '₦4,000,000 – ₦6,000,000': 5000000,\n  '₦6,000,000 – ₦10,000,000': 8000000,\n  '₦10,000,000+': 12000000,\n};\n`;
    const blob = new Blob([output], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'packages-data.js';
    a.click();
    toast('packages-data.js exported', 'success');
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */
function toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
}

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
function sv(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function gv(id) { return document.getElementById(id)?.value || ''; }
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-NG', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}
/* ── Migrate old emoji icons to FA class strings ── */
function migrateIcon(icon) {
    // If it's already a FA class string, return as-is
    if (icon.startsWith('fa-')) return icon;
    // Map common emoji to FA equivalents
    const map = {
        '✈️': 'fa-solid fa-plane',
        '🏨': 'fa-solid fa-hotel',
        '🍳': 'fa-solid fa-mug-saucer',
        '🚐': 'fa-solid fa-van-shuttle',
        '🏜️': 'fa-solid fa-sun',
        '🗺️': 'fa-solid fa-map',
        '🏝️': 'fa-solid fa-umbrella-beach',
        '🍽️': 'fa-solid fa-utensils',
        '🤿': 'fa-solid fa-water',
        '🚤': 'fa-solid fa-ship',
        '🌅': 'fa-solid fa-sailboat',
        '⛰️': 'fa-solid fa-mountain',
        '🍷': 'fa-solid fa-wine-glass',
        '🐧': 'fa-solid fa-binoculars',
        '🗼': 'fa-solid fa-tower-observation',
        '⛵': 'fa-solid fa-sailboat',
        '🖼️': 'fa-solid fa-landmark',
        '🐠': 'fa-solid fa-fish',
        '🌿': 'fa-solid fa-leaf',
        '🏆': 'fa-solid fa-trophy',
        '🎯': 'fa-solid fa-bullseye',
    };
    return map[icon] || 'fa-solid fa-circle-check';
}