/* ═══════════════════════════════════════════════════════
   PACKAGE MANAGER (demo) — categories-app.js
   Category management. Stored in ts-cms-categories.
   Packages tab-cats chips pull from this dynamically.
   ═══════════════════════════════════════════════════════ */

const CATS_KEY = 'ts-cms-categories';

const DEFAULT_CATEGORIES = [
    { id: 'budget', label: 'Budget Getaways', slug: 'budget', color: '#59AA47', description: 'Affordable packages for budget-conscious travellers.' },
    { id: 'luxury', label: 'Luxury Escapes', slug: 'luxury', color: '#793CAA', description: 'Premium experiences with high-end hotels and services.' },
    { id: 'family', label: 'Family Trips', slug: 'family', color: '#1BB3F5', description: 'Child-friendly packages suited for the whole family.' },
    { id: 'romantic', label: 'Romantic Vacations', slug: 'romantic', color: '#D651D7', description: 'Couples getaways and honeymoon packages.' },
    { id: 'adventure', label: 'Adventure Tours', slug: 'adventure', color: '#F47B20', description: 'Action-packed trips with outdoor and adventure activities.' },
    { id: 'business', label: 'Business', slug: 'business', color: '#062231', description: 'Corporate travel and business-friendly packages.' },
];

/* ── State ── */
let categories = [];
let catsEditingId = null;
let catsSearchQ = '';
let catsPage = 1;
const CATS_PAGE_SIZE = 10;

/* ── Seed on first load ── */
function seedCategories() {
    if (!localStorage.getItem(CATS_KEY)) {
        localStorage.setItem(CATS_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
}

/* ── Get categories ── */
function getCategories() {
    return JSON.parse(localStorage.getItem(CATS_KEY) || '[]');
}

/* ── Persist ── */
function persistCategories() {
    localStorage.setItem(CATS_KEY, JSON.stringify(categories));
}

/* ── Init ── */
function initCategoriesApp() {
    seedCategories();
    categories = getCategories();
    renderCategoriesList();
    rebuildCatChips();

    document.getElementById('cats-search-input')?.addEventListener('input', function () {
        catsSearchQ = this.value.toLowerCase();
        catsPage = 1;
        renderCategoriesList();
    });
}

/* ── Rebuild cat chips in package edit form ── */
function rebuildCatChips() {
    const wrap = document.getElementById('cat-chips');
    if (!wrap) return;
    const cats = getCategories();
    // Preserve active state of currently selected chips
    const activeVals = [...wrap.querySelectorAll('.chip.active')].map(c => c.dataset.val);
    wrap.innerHTML = cats.map(c => `
    <div class="chip ${activeVals.includes(c.slug) ? 'active' : ''}"
         data-val="${c.slug}" onclick="toggleChip(this)"
         style="border-left: 3px solid ${c.color}">
      ${c.label}
    </div>`).join('');
}

/* ── Render list ── */
function renderCategoriesList() {
    const setT = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setT('cats-stat-total', categories.length);
    setT('cats-sb-count', categories.length);

    let filtered = categories.filter(c =>
        !catsSearchQ
        || c.label.toLowerCase().includes(catsSearchQ)
        || c.slug.toLowerCase().includes(catsSearchQ)
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / CATS_PAGE_SIZE));
    if (catsPage > totalPages) catsPage = totalPages;
    const paged = filtered.slice((catsPage - 1) * CATS_PAGE_SIZE, catsPage * CATS_PAGE_SIZE);

    const tbody = document.getElementById('cats-tbody');
    if (!tbody) return;

    if (!filtered.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="4"><i class="ti ti-tags"></i><p>No categories found</p></td></tr>`;
        renderCatsPagination(0, 0);
        return;
    }

    tbody.innerHTML = paged.map(c => {
        // Count packages using this category
        const pkgs = JSON.parse(localStorage.getItem('ts-packages') || '[]');
        const pkgArray = Array.isArray(pkgs) ? pkgs : Object.values(pkgs);
        const count = pkgArray.filter(p => (p.tab || []).includes(c.slug)).length;
        const isDefault = DEFAULT_CATEGORIES.some(d => d.id === c.id);

        return `<tr>
      <td>
        <div class="pkg-name-cell">
          <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:${c.color};flex-shrink:0;display:flex;align-items:center;justify-content:center">
            <i class="fa-solid fa-tag" style="color:#fff;font-size:14px"></i>
          </div>
          <div>
            <div class="pkg-name">${c.label}</div>
            <div class="pkg-dest">slug: ${c.slug}</div>
          </div>
        </div>
      </td>
      <td style="color:var(--muted);font-size:13px">${c.description || '—'}</td>
      <td>
        <span class="badge badge-mid">${count} package${count !== 1 ? 's' : ''}</span>
        ${isDefault ? '<span class="badge" style="background:rgba(89,170,71,0.1);color:#3B6D11;margin-left:4px">Default</span>' : ''}
      </td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="openCatEdit('${c.id}')" aria-label="Edit">
            <i class="ti ti-edit"></i>
          </button>
          ${!isDefault ? `
          <button class="icon-btn danger" onclick="confirmDeleteCat('${c.id}')" aria-label="Delete">
            <i class="ti ti-trash"></i>
          </button>` : `
          <button class="icon-btn" disabled title="Default categories cannot be deleted" style="opacity:0.3;cursor:not-allowed">
            <i class="ti ti-lock"></i>
          </button>`}
        </div>
      </td>
    </tr>`;
    }).join('');

    renderCatsPagination(filtered.length, totalPages);
}

function renderCatsPagination(total, totalPages) {
    const container = document.getElementById('cats-pagination-bar');
    if (!container) return;
    if (totalPages <= 1) {
        container.innerHTML = `<span class="pag-info">Showing ${total} categor${total !== 1 ? 'ies' : 'y'}</span>`;
        return;
    }
    const start = (catsPage - 1) * CATS_PAGE_SIZE + 1;
    const end = Math.min(catsPage * CATS_PAGE_SIZE, total);
    let pages = [], pageButtons = '', prev = 0;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= catsPage - 2 && i <= catsPage + 2)) pages.push(i);
    }
    pages.forEach(p => {
        if (prev && p - prev > 1) pageButtons += `<span class="pag-ellipsis">…</span>`;
        pageButtons += `<button class="pag-btn ${p === catsPage ? 'active' : ''}" onclick="goToCatsPage(${p})">${p}</button>`;
        prev = p;
    });
    container.innerHTML = `
    <span class="pag-info">Showing ${start}–${end} of ${total}</span>
    <div class="pag-controls">
      <button class="pag-btn pag-arrow" onclick="goToCatsPage(${catsPage - 1})" ${catsPage === 1 ? 'disabled' : ''}><i class="ti ti-chevron-left"></i> Prev</button>
      ${pageButtons}
      <button class="pag-btn pag-arrow" onclick="goToCatsPage(${catsPage + 1})" ${catsPage === totalPages ? 'disabled' : ''}>Next <i class="ti ti-chevron-right"></i></button>
    </div>`;
}

function goToCatsPage(page) {
    const total = categories.filter(c => !catsSearchQ || c.label.toLowerCase().includes(catsSearchQ)).length;
    const totalPages = Math.ceil(total / CATS_PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    catsPage = page;
    renderCategoriesList();
}

/* ── Add / Edit ── */
function openCatAdd() {
    catsEditingId = null;
    clearCatForm();
    document.getElementById('cat-edit-title').textContent = 'Add Category';
    document.getElementById('cat-delete-btn').style.display = 'none';
    showView('categories-edit');
}

function openCatEdit(id) {
    catsEditingId = id;
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    document.getElementById('cat-edit-title').textContent = 'Edit: ' + cat.label;
    const isDefault = DEFAULT_CATEGORIES.some(d => d.id === id);
    document.getElementById('cat-delete-btn').style.display = isDefault ? 'none' : 'inline-flex';
    document.getElementById('cf-label').value = cat.label || '';
    document.getElementById('cf-slug').value = cat.slug || '';
    document.getElementById('cf-color').value = cat.color || '#062231';
    document.getElementById('cf-description').value = cat.description || '';
    // Lock slug for default categories
    const slugInput = document.getElementById('cf-slug');
    if (slugInput) slugInput.readOnly = isDefault;
    showView('categories-edit');
}

function clearCatForm() {
    ['cf-label', 'cf-slug', 'cf-description'].forEach(id => {
        const el = document.getElementById(id); if (el) { el.value = ''; el.readOnly = false; }
    });
    const color = document.getElementById('cf-color');
    if (color) color.value = '#1BB3F5';
}

function saveCat() {
    const label = document.getElementById('cf-label')?.value?.trim();
    const slug = document.getElementById('cf-slug')?.value?.trim()
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const color = document.getElementById('cf-color')?.value || '#062231';
    const desc = document.getElementById('cf-description')?.value?.trim();

    if (!label) { toast('Category name is required', 'error'); return; }
    if (!slug) { toast('Slug is required', 'error'); return; }

    if (catsEditingId) {
        const idx = categories.findIndex(c => c.id === catsEditingId);
        if (idx >= 0) {
            categories[idx] = { ...categories[idx], label, slug, color, description: desc };
        }
        toast('Category updated', 'success');
    } else {
        const exists = categories.find(c => c.slug === slug);
        if (exists) { toast('A category with this slug already exists', 'error'); return; }
        categories.push({
            id: slug + '-' + Date.now(),
            label, slug, color, description: desc,
        });
        toast('Category created', 'success');
    }

    persistCategories();
    rebuildCatChips();
    setTimeout(() => showView('categories'), 500);
}

function confirmDeleteCat(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const isDefault = DEFAULT_CATEGORIES.some(d => d.id === id);
    if (isDefault) { toast('Default categories cannot be deleted', 'error'); return; }

    // Check if any packages use this category
    const pkgs = JSON.parse(localStorage.getItem('ts-packages') || '[]');
    const pkgArray = Array.isArray(pkgs) ? pkgs : Object.values(pkgs);
    const count = pkgArray.filter(p => (p.tab || []).includes(cat.slug)).length;
    const warning = count > 0
        ? ` <strong>${count} package${count !== 1 ? 's' : ''}</strong> use this category and will lose the tag.`
        : '';

    openDeleteConfirm(
        'Delete Category',
        `Are you sure you want to delete <strong>${cat.label}</strong>?${warning} This cannot be undone.`,
        () => deleteCat(id)
    );
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    persistCategories();
    rebuildCatChips();
    renderCategoriesList();
    toast('Category deleted', 'info');
    showView('categories');
}

function cancelCatEdit() { showView('categories'); }

/* ── Auto-generate slug from label ── */
function autoSlug() {
    const label = document.getElementById('cf-label')?.value || '';
    const slugInput = document.getElementById('cf-slug');
    if (slugInput && !slugInput.readOnly && !catsEditingId) {
        slugInput.value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
}