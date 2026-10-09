/* ═══════════════════════════════════════════════════════
   PACKAGE MANAGER (demo) — users-app.js
   User management — Admin only
   ═══════════════════════════════════════════════════════ */

let usersEditingId = null;
let usersSearchQ = '';
let usersPage = 1;
const USERS_PER_PAGE = 10;

/* ── Init ── */
function initUsersApp() {
    renderUsersList();
    document.getElementById('users-search-input')?.addEventListener('input', function () {
        usersSearchQ = this.value.toLowerCase();
        usersPage = 1;
        renderUsersList();
    });
}

/* ── Render list ── */
function renderUsersList() {
    const users = getUsers();
    const session = getSession();

    let filtered = users.filter(u => {
        return !usersSearchQ
            || u.name.toLowerCase().includes(usersSearchQ)
            || u.username.toLowerCase().includes(usersSearchQ)
            || u.role.toLowerCase().includes(usersSearchQ);
    });

    // Stats
    const setT = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setT('users-stat-total', users.length);
    setT('users-stat-admins', users.filter(u => u.role === 'admin').length);
    setT('users-stat-editors', users.filter(u => u.role === 'editor').length);
    setT('users-stat-contributors', users.filter(u => u.role === 'contributor').length);
    const badge = document.getElementById('users-sb-badge');
    if (badge) badge.textContent = users.length;

    const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));
    if (usersPage > totalPages) usersPage = totalPages;
    const paged = filtered.slice((usersPage - 1) * USERS_PER_PAGE, usersPage * USERS_PER_PAGE);

    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    if (!filtered.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><i class="ti ti-user-off"></i><p>No users found</p></td></tr>`;
        renderUsersPagination(0, 0); return;
    }

    tbody.innerHTML = paged.map(u => {
        const isSelf = u.id === session?.id;
        const roleClass = { admin: 'role-admin', editor: 'role-editor', contributor: 'role-contributor' }[u.role] || '';
        return `<tr>
      <td>
        <div class="pkg-name-cell">
          <div class="sb-avatar role-${u.role}" style="width:36px;height:36px;font-size:14px;flex-shrink:0">
            ${u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="pkg-name">${u.name} ${isSelf ? '<span class="badge badge-mid" style="font-size:10px;margin-left:4px">You</span>' : ''}</div>
            <div class="pkg-dest">@${u.username}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${roleClass}">${roleLabel(u.role)}</span></td>
      <td style="color:var(--muted);font-size:12px">${formatDate(u.created_at)}</td>
      <td style="color:var(--muted);font-size:12px">${u.last_login ? formatDate(u.last_login) : 'Never'}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" onclick="openUserEdit('${u.id}')" aria-label="Edit user">
            <i class="ti ti-edit"></i>
          </button>
          ${!isSelf ? `
          <button class="icon-btn danger" onclick="confirmDeleteUser('${u.id}')" aria-label="Delete user">
            <i class="ti ti-trash"></i>
          </button>` : ''}
        </div>
      </td>
    </tr>`;
    }).join('');

    renderUsersPagination(filtered.length, totalPages);
}

function renderUsersPagination(total, totalPages) {
    const container = document.getElementById('users-pagination-bar');
    if (!container) return;
    if (totalPages <= 1) {
        container.innerHTML = `<span class="pag-info">Showing ${total} user${total !== 1 ? 's' : ''}</span>`;
        return;
    }
    const start = (usersPage - 1) * USERS_PER_PAGE + 1;
    const end = Math.min(usersPage * USERS_PER_PAGE, total);
    let pages = [], pageButtons = '', prev = 0;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= usersPage - 2 && i <= usersPage + 2)) pages.push(i);
    }
    pages.forEach(p => {
        if (prev && p - prev > 1) pageButtons += `<span class="pag-ellipsis">…</span>`;
        pageButtons += `<button class="pag-btn ${p === usersPage ? 'active' : ''}" onclick="goToUsersPage(${p})">${p}</button>`;
        prev = p;
    });
    container.innerHTML = `
    <span class="pag-info">Showing ${start}–${end} of ${total}</span>
    <div class="pag-controls">
      <button class="pag-btn pag-arrow" onclick="goToUsersPage(${usersPage - 1})" ${usersPage === 1 ? 'disabled' : ''}><i class="ti ti-chevron-left"></i> Prev</button>
      ${pageButtons}
      <button class="pag-btn pag-arrow" onclick="goToUsersPage(${usersPage + 1})" ${usersPage === totalPages ? 'disabled' : ''}>Next <i class="ti ti-chevron-right"></i></button>
    </div>`;
}

function goToUsersPage(page) {
    const users = getUsers();
    const total = users.length;
    const totalPages = Math.ceil(total / USERS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    usersPage = page; renderUsersList();
}

/* ── Add / Edit ── */
function openUserAdd() {
    usersEditingId = null;
    document.getElementById('user-edit-title').textContent = 'Add User';
    document.getElementById('user-delete-btn').style.display = 'none';
    document.getElementById('user-form-password-wrap').style.display = 'block';
    document.getElementById('user-form-password-note').style.display = 'none';
    clearUserForm();
    showView('users-edit');
}

function openUserEdit(id) {
    usersEditingId = id;
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return;
    const isSelf = user.id === getSession()?.id;
    document.getElementById('user-edit-title').textContent = 'Edit: ' + user.name;
    document.getElementById('user-delete-btn').style.display = isSelf ? 'none' : 'inline-flex';
    document.getElementById('user-form-password-wrap').style.display = 'none';
    document.getElementById('user-form-password-note').style.display = 'block';
    document.getElementById('uf-name').value = user.name;
    document.getElementById('uf-username').value = user.username;
    document.getElementById('uf-role').value = user.role;
    showView('users-edit');
}

function clearUserForm() {
    ['uf-name', 'uf-username', 'uf-password', 'uf-role'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    const role = document.getElementById('uf-role');
    if (role) role.value = 'contributor';
}

function saveUser() {
    const name = document.getElementById('uf-name')?.value?.trim();
    const username = document.getElementById('uf-username')?.value?.trim();
    const role = document.getElementById('uf-role')?.value;
    const password = document.getElementById('uf-password')?.value;

    if (!name || !username || !role) {
        showDeleteModal('error', 'Please fill in all required fields.');
        return;
    }

    const users = getUsers();

    if (usersEditingId) {
        // Edit existing
        const idx = users.findIndex(u => u.id === usersEditingId);
        if (idx < 0) return;
        users[idx].name = name;
        users[idx].username = username;
        users[idx].role = role;
        if (password) users[idx].password = password;
        // Update session if editing self
        if (usersEditingId === getSession()?.id) {
            const session = getSession();
            session.name = name; session.role = role;
            sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        }
        toast('User updated', 'success');
    } else {
        // New user
        if (!password) { toast('Password is required for new users', 'error'); return; }
        const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (exists) { toast('Username already taken', 'error'); return; }
        users.push({
            id: 'user-' + Date.now(),
            name, username, password, role,
            created_at: new Date().toISOString(),
            last_login: null,
        });
        toast('User created', 'success');
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    applyRoleUI();
    setTimeout(() => showView('users'), 500);
}

function confirmDeleteUser(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return;
    openDeleteConfirm(
        'Delete User',
        `Are you sure you want to delete <strong>${user.name}</strong> (@${user.username})? This cannot be undone.`,
        () => deleteUser(id)
    );
}

function deleteUser(id) {
    if (id === getSession()?.id) { toast("You can't delete your own account", 'error'); return; }
    let users = getUsers();
    users = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    renderUsersList();
    toast('User deleted', 'info');
    showView('users');
}

function cancelUserEdit() { showView('users'); }

/* ── Password change ── */
function showPasswordChange() {
    document.getElementById('user-form-password-wrap').style.display = 'block';
    document.getElementById('user-form-password-note').style.display = 'none';
}

/* ── Helpers ── */
function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-NG', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}