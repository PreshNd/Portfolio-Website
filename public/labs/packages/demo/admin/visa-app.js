/* ═══════════════════════════════════════════════════════
   PACKAGE MANAGER (demo) — visa-app.js
   Visa CMS logic. Separate from packages (app.js).
   localStorage key: ts-visa
   ═══════════════════════════════════════════════════════ */

const VISA_LS_KEY = 'ts-visa';

const VISA_STATUS_OPTIONS = [
    { cls: 'visa-tag-required', text: 'Visa Required' },
    { cls: 'visa-tag-free', text: 'Visa Free' },
    { cls: 'visa-tag-arrival', text: 'Visa on Arrival' },
    { cls: 'visa-tag-evisa', text: 'eVisa Required' },
    { cls: 'visa-tag-included', text: 'Visa Included' },
    { cls: 'visa-tag-insurance', text: 'Insurance Compulsory' },
  ];

const SAMPLE_VISA = [
    { id: 'dubai-visa', destination: 'Dubai', country: 'UAE', hero: '/labs/packages/demo/img/dubai.svg', visa_tags: [{ cls: 'visa-tag-required', text: '🛂 Visa Required' }], visa_type: 'Tourist Visa', visa_cost: '$90 USD (approx. ₦140,000)', processing_time: '3–5 business days', where_to_apply: 'Online via UAE ICA portal or through our visa team', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Completed visa application form', 'Passport photograph (white background)', 'Confirmed hotel booking', 'Return flight itinerary', 'Bank statement (last 3 months)', 'Proof of accommodation'], best_season: 'October – April', currency: 'UAE Dirham (AED) · 1 AED ≈ ₦430', notes: 'UAE tourist visas for Nigerians are processed online. Approval is usually fast but not guaranteed. Ensure your passport has at least 2 blank pages.', status: 'published' },
    { id: 'zanzibar-visa', destination: 'Zanzibar', country: 'Tanzania', hero: '/labs/packages/demo/img/zanzibar.svg', visa_tags: [{ cls: 'visa-tag-required', text: '🛂 Visa Required' }, { cls: 'visa-tag-insurance', text: '🔒 Insurance Compulsory' }], visa_type: 'Tourist Visa', visa_cost: '$50 USD (approx. ₦78,000)', processing_time: 'On arrival (7–14 days advance recommended)', where_to_apply: 'Tanzania High Commission, Abuja or on arrival at Zanzibar Airport', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Completed arrival card', 'Return flight ticket', 'Proof of accommodation', 'Compulsory travel insurance certificate', 'Yellow fever vaccination certificate'], best_season: 'June – October (dry season)', currency: 'Tanzanian Shilling (TZS) · USD widely accepted', notes: 'Travel insurance is compulsory for entry into Tanzania. You must carry proof of insurance at the port of entry. Yellow fever vaccination is also required for Nigerian travellers.', status: 'published' },
    { id: 'maldives-visa', destination: 'Maldives', country: 'Maldives', hero: '/labs/packages/demo/img/maldives.svg', visa_tags: [{ cls: 'visa-tag-arrival', text: '🟠 Visa on Arrival' }], visa_type: 'Visa on Arrival (30 days)', visa_cost: 'Free', processing_time: 'On arrival at Velana International Airport', where_to_apply: 'No pre-application required — issued at the airport on arrival', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Confirmed hotel or resort booking', 'Return flight ticket', 'Proof of sufficient funds'], best_season: 'November – April', currency: 'Maldivian Rufiyaa (MVR) · USD widely accepted at resorts', notes: 'Nigerians receive a free 30-day tourist visa on arrival in the Maldives. No pre-application needed. Ensure you have a confirmed resort booking as it may be checked at immigration.', status: 'published' },
    { id: 'capetown-visa', destination: 'Cape Town', country: 'South Africa', hero: '/labs/packages/demo/img/capetown.svg', visa_tags: [{ cls: 'visa-tag-free', text: '✅ Visa Free' }], visa_type: 'Visa Free (30 days)', visa_cost: 'Free', processing_time: 'No visa required', where_to_apply: 'No application required', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Return flight ticket', 'Proof of accommodation', 'Sufficient funds for the trip', 'Yellow fever vaccination certificate (if transiting through yellow fever zone)'], best_season: 'October – April (Southern Hemisphere summer)', currency: 'South African Rand (ZAR) · 1 ZAR ≈ ₦85', notes: 'Nigerian passport holders can visit South Africa visa-free for up to 30 days. Ensure your passport has at least 2 blank pages as immigration officers stamp on entry and exit.', status: 'published' },
    { id: 'paris-visa', destination: 'Paris', country: 'France', hero: '/labs/packages/demo/img/paris.svg', visa_tags: [{ cls: 'visa-tag-required', text: '🛂 Visa Required (Schengen)' }], visa_type: 'Schengen Short-Stay Visa (Type C)', visa_cost: '€80 EUR (approx. ₦160,000)', processing_time: '15–30 business days (apply early)', where_to_apply: 'VFS Global France Visa Application Centre, Lagos or Abuja', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Completed Schengen visa application form', '2 recent passport photographs', 'Confirmed hotel booking for full stay', 'Return flight itinerary', 'Travel insurance (min. €30,000 cover)', 'Bank statement (last 6 months, min. balance equivalent to trip cost)', 'Employment letter or business registration', 'Tax clearance certificate (last 3 years)'], best_season: 'April – June and September – October', currency: 'Euro (EUR) · 1 EUR ≈ ₦2,000', notes: 'The Schengen visa is one of the most document-intensive for Nigerian travellers. Apply at least 6–8 weeks before travel. Strong financial proof and ties to Nigeria significantly improve approval chances. Our visa team can assist with document preparation.', status: 'published' },
];

/* ══════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════ */
let visaEntries = [];
let visaEditingId = null;
let visaEditStatus = 'published';
let visaSearch = '';
let visaFilter = 'all';
let visaPage = 1;
const VISA_PAGE_SIZE = 10;

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
function initVisaApp() {
    const stored = localStorage.getItem(VISA_LS_KEY);
    visaEntries = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(SAMPLE_VISA));
    renderVisaList();

    document.getElementById('visa-search-input')?.addEventListener('input', function () {
        visaSearch = this.value.toLowerCase(); visaPage = 1; renderVisaList();
    });
    document.getElementById('visa-filter-status')?.addEventListener('change', function () {
        visaFilter = this.value; visaPage = 1; renderVisaList();
    });
}

function persistVisa() {
    localStorage.setItem(VISA_LS_KEY, JSON.stringify(visaEntries));
    updateVisaStats();
}

/* ══════════════════════════════════════════════
   STATS
   ══════════════════════════════════════════════ */
function updateVisaStats() {
    const live = visaEntries.filter(v => v.status === 'published').length;
    const draft = visaEntries.filter(v => v.status !== 'published').length;
    const total = visaEntries.length;
    const setT = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setT('visa-stat-total', total);
    setT('visa-stat-live', live);
    setT('visa-stat-draft', draft);
    setT('visa-sb-badge', total);
}

/* ══════════════════════════════════════════════
   LIST VIEW
   ══════════════════════════════════════════════ */
function renderVisaList() {
    updateVisaStats();
    let filtered = visaEntries.filter(v => {
        const matchQ = !visaSearch || v.destination.toLowerCase().includes(visaSearch) || v.country.toLowerCase().includes(visaSearch);
        const matchS = visaFilter === 'all' || v.status === visaFilter;
        return matchQ && matchS;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / VISA_PAGE_SIZE));
    if (visaPage > totalPages) visaPage = totalPages;
    const start = (visaPage - 1) * VISA_PAGE_SIZE;
    const paged = filtered.slice(start, start + VISA_PAGE_SIZE);
    const tbody = document.getElementById('visa-tbody');
    if (!tbody) return;

    if (!filtered.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6"><i class="ti ti-map-pin-off"></i><p>No visa entries found</p></td></tr>`;
        renderVisaPagination(0, 0); return;
    }

    tbody.innerHTML = paged.map(v => {
        const tags = (v.visa_tags || []).map(t => `<span class="badge" style="background:rgba(27,179,245,0.1);color:#185FA5;margin-right:4px">${t.text}</span>`).join('');
        const thumb = v.hero
            ? `<img class="pkg-thumb" src="${v.hero}" alt="" onerror="this.style.display='none'" />`
            : `<div class="pkg-thumb" style="background:var(--subtle);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:18px"><i class="ti ti-map-pin"></i></div>`;
        return `<tr>
      <td>
        <div class="pkg-name-cell">
          ${thumb}
          <div>
            <div class="pkg-name">${v.destination}</div>
            <div class="pkg-dest">${v.country}</div>
          </div>
        </div>
      </td>
      <td>${tags}</td>
      <td style="color:var(--muted);font-size:12px">${v.visa_type || '—'}</td>
      <td style="font-weight:600;font-size:13px">${v.visa_cost || '—'}</td>
      <td><span class="badge ${v.status === 'published' ? 'badge-live' : 'badge-draft'}">${v.status === 'published' ? 'Published' : 'Draft'}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="openVisaEdit('${v.id}')" aria-label="Edit"><i class="ti ti-edit"></i></button>
          <button class="icon-btn" onclick="duplicateVisa('${v.id}')" aria-label="Duplicate"><i class="ti ti-copy"></i></button>
          <button class="icon-btn danger" onclick="deleteVisa('${v.id}')" aria-label="Delete"><i class="ti ti-trash"></i></button>
        </div>
      </td>
    </tr>`;
    }).join('');

    renderVisaPagination(filtered.length, totalPages);
}

function renderVisaPagination(total, totalPages) {
    const container = document.getElementById('visa-pagination-bar');
    if (!container) return;
    if (totalPages <= 1) {
        container.innerHTML = `<span class="pag-info">Showing ${total} destination${total !== 1 ? 's' : ''}</span>`;
        return;
    }
    const start = (visaPage - 1) * VISA_PAGE_SIZE + 1;
    const end = Math.min(visaPage * VISA_PAGE_SIZE, total);
    let pages = [], pageButtons = '', prev = 0;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= visaPage - 2 && i <= visaPage + 2)) pages.push(i);
    }
    pages.forEach(p => {
        if (prev && p - prev > 1) pageButtons += `<span class="pag-ellipsis">…</span>`;
        pageButtons += `<button class="pag-btn ${p === visaPage ? 'active' : ''}" onclick="goToVisaPage(${p})">${p}</button>`;
        prev = p;
    });
    container.innerHTML = `
    <span class="pag-info">Showing ${start}–${end} of ${total}</span>
    <div class="pag-controls">
      <button class="pag-btn pag-arrow" onclick="goToVisaPage(${visaPage - 1})" ${visaPage === 1 ? 'disabled' : ''}><i class="ti ti-chevron-left"></i> Prev</button>
      ${pageButtons}
      <button class="pag-btn pag-arrow" onclick="goToVisaPage(${visaPage + 1})" ${visaPage === totalPages ? 'disabled' : ''}>Next <i class="ti ti-chevron-right"></i></button>
    </div>`;
}

function goToVisaPage(page) {
    const filtered = visaEntries.filter(v => {
        const matchQ = !visaSearch || v.destination.toLowerCase().includes(visaSearch) || v.country.toLowerCase().includes(visaSearch);
        const matchS = visaFilter === 'all' || v.status === visaFilter;
        return matchQ && matchS;
    });
    const totalPages = Math.ceil(filtered.length / VISA_PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    visaPage = page; renderVisaList();
}

/* ══════════════════════════════════════════════
   EDIT / ADD
   ══════════════════════════════════════════════ */
function openVisaAdd() {
    visaEditingId = null; visaEditStatus = 'published';
    clearVisaForm();
    document.getElementById('visa-edit-title').textContent = 'Add Visa Destination';
    document.getElementById('visa-delete-btn').style.display = 'none';
    activateVisaTab('vtab-basics');
    setVisaStatusUI('published');
    // Hide entry info card for new entries
    const infoCard = document.getElementById('entry-info-card');
    if (infoCard) infoCard.style.display = 'none';
    showView('visa-edit');
}

function openVisaEdit(id) {
    visaEditingId = id;
    const entry = visaEntries.find(v => v.id === id);
    if (!entry) return;
    visaEditStatus = entry.status || 'published';
    document.getElementById('visa-edit-title').textContent = 'Edit: ' + entry.destination;
    document.getElementById('visa-delete-btn').style.display = 'inline-flex';
    populateVisaForm(entry);
    activateVisaTab('vtab-basics');
    setVisaStatusUI(visaEditStatus);

    const infoCard = document.getElementById('entry-info-card');
    if (infoCard && entry) {
        infoCard.style.display = 'block';
        const set = (elId, v) => { const el = document.getElementById(elId); if (el) el.textContent = v || '—'; };
        set('info-created-by', entry.created_by);
        set('info-created-at', entry.created_at ? formatDate(entry.created_at) : '—');
        set('info-updated-by', entry.updated_by);
        set('info-updated-at', entry.updated_at ? formatDate(entry.updated_at) : '—');
    } else if (infoCard) {
        infoCard.style.display = 'none';
    }
    showView('visa-edit');
}

function cancelVisaEdit() { showView('visa'); }

function populateVisaForm(v) {
    const sv = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    sv('vf-destination', v.destination);
    sv('vf-country', v.country);
    sv('vf-country-code', v.country_code || '');
    sv('vf-hero', v.hero);
    sv('vf-visa-type', v.visa_type);
    sv('vf-visa-cost', v.visa_cost);
    sv('vf-processing', v.processing_time);
    sv('vf-where', v.where_to_apply);
    sv('vf-season', v.best_season);
    sv('vf-currency', v.currency);
    sv('vf-notes', v.notes);
    visaPreviewImg('vf-hero', 'vprev-hero');

    // Documents
    const dl = document.getElementById('vf-docs-list'); dl.innerHTML = '';
    (v.documents || ['']).forEach(d => addVisaDocRow(d));

    // Visa tags
    document.querySelectorAll('#visa-status-chips .chip').forEach(c => {
        c.classList.toggle('active', (v.visa_tags || []).some(t => t.cls === c.dataset.cls));
    });
}

function clearVisaForm() {
    ['vf-destination', 'vf-country', 'vf-country-code', 'vf-hero', 'vf-visa-type', 'vf-visa-cost',
        'vf-processing', 'vf-where', 'vf-season', 'vf-currency', 'vf-notes'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
    document.getElementById('vf-docs-list').innerHTML = '';
    addVisaDocRow('');
    document.querySelectorAll('#visa-status-chips .chip').forEach(c => c.classList.remove('active'));
    const box = document.getElementById('vprev-hero');
    if (box) box.innerHTML = `<span><i class="ti ti-photo" style="font-size:24px;display:block;margin-bottom:4px;opacity:.3"></i>Preview</span>`;
}

function collectVisaForm() {
    const gv = id => document.getElementById(id)?.value || '';
    const name = gv('vf-destination').trim();
    if (!name) { visaToast('Destination name is required', 'error'); return null; }
    const id = visaEditingId || slugifyVisa(name);
    const docs = [...document.querySelectorAll('#vf-docs-list .dyn-item')]
        .map(r => r.querySelector('input')?.value).filter(Boolean);
    const tags = [...document.querySelectorAll('#visa-status-chips .chip.active')]
        .map(c => ({ cls: c.dataset.cls, text: c.dataset.text }));
    return {
        id, destination: name, country: gv('vf-country'),
        hero: gv('vf-hero'), visa_type: gv('vf-visa-type'),
        visa_cost: gv('vf-visa-cost'), processing_time: gv('vf-processing'),
        where_to_apply: gv('vf-where'), best_season: gv('vf-season'),
        currency: gv('vf-currency'), notes: gv('vf-notes'),
        documents: docs, visa_tags: tags, status: visaEditStatus, country_code: gv('vf-country-code'),
    };
}

function saveVisaEntry(status) {
    visaEditStatus = status;
    const entry = collectVisaForm();
    if (!entry) return;
    entry.status = status;
    const idx = visaEntries.findIndex(v => v.id === entry.id);
    if (idx >= 0) visaEntries.splice(idx, 1, entry);
    else visaEntries.push(entry);
    persistVisa();
    visaToast(status === 'published' ? 'Visa destination published' : 'Saved as draft', 'success');
    setTimeout(() => showView('visa'), 600);
}

// In visa-app.js deleteVisa:
function deleteVisa(id) {
    const entry = visaEntries.find(v => v.id === id);
    if (!entry) return;
    openDeleteConfirm(
        'Delete Visa Entry',
        `Are you sure you want to delete <strong>${entry.destination}</strong>? This cannot be undone.`,
        () => {
            visaEntries = visaEntries.filter(v => v.id !== id);
            persistVisa();
            toast('Visa entry deleted', 'info');
            showView('visa');
        }
    );
}

function duplicateVisa(id) {
    const src = visaEntries.find(v => v.id === id);
    if (!src) return;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = src.id + '-copy'; copy.destination = src.destination + ' (Copy)'; copy.status = 'draft';
    visaEntries.push(copy); persistVisa(); visaToast('Duplicated as draft', 'info');
}

/* ══════════════════════════════════════════════
   DYNAMIC ROW BUILDERS
   ══════════════════════════════════════════════ */
function addVisaDocRow(text = '') {
    const d = document.createElement('div'); d.className = 'dyn-item';
    d.innerHTML = `<input class="form-input" type="text" value="${text}" placeholder="e.g. Valid Nigerian passport (min. 6 months validity)" /><button class="dyn-remove" onclick="this.parentElement.remove()" aria-label="Remove"><i class="ti ti-x"></i></button>`;
    document.getElementById('vf-docs-list').appendChild(d);
}

/* ══════════════════════════════════════════════
   IMAGE PREVIEW
   ══════════════════════════════════════════════ */
function visaPreviewImg(inputId, previewId) {
    const url = document.getElementById(inputId)?.value;
    const box = document.getElementById(previewId);
    if (!box) return;
    box.innerHTML = url
        ? `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span>Image not found</span>'" />`
        : `<span><i class="ti ti-photo" style="font-size:24px;display:block;margin-bottom:4px;opacity:.3"></i>Preview</span>`;
}

/* ══════════════════════════════════════════════
   TABS + STATUS
   ══════════════════════════════════════════════ */
function activateVisaTab(id) {
    document.querySelectorAll('.visa-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    document.querySelectorAll('.visa-tab-panel').forEach(p => p.classList.toggle('active', p.id === id));
}

function setVisaStatusUI(status) {
    visaEditStatus = status;
    document.querySelectorAll('#visa-status-opts .status-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.status === status);
    });
}

/* ══════════════════════════════════════════════
   TOAST + HELPERS
   ══════════════════════════════════════════════ */
function visaToast(msg, type = 'success') {
    const t = document.createElement('div'); t.className = `toast ${type}`; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
}
function slugifyVisa(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-visa'; }
function toggleVisaChip(el) { el.classList.toggle('active'); }