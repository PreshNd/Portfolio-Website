/* ═══════════════════════════════════════════════════════
   PACKAGE MANAGER (demo) — auth.js v2
   Username + password auth, 3 roles: admin / editor / contributor
   Session stored in sessionStorage as ts-cms-session
   ═══════════════════════════════════════════════════════ */

const AUTH_SESSION_KEY = 'ts-cms-session';
const USERS_KEY = 'ts-cms-users';

/* ── Default users (seeded on first load) ── */
const DEFAULT_USERS = [
    {
        id: 'user-001',
        username: 'admin',
        password: 'Admin1234',
        name: 'Admin User',
        role: 'admin',
        created_at: '2026-01-01T00:00:00',
    },
    {
        id: 'user-002',
        username: 'editor',
        password: 'Editor1234',
        name: 'Editor User',
        role: 'editor',
        created_at: '2026-01-01T00:00:00',
    },
    {
        id: 'user-003',
        username: 'contributor',
        password: 'Contrib1234',
        name: 'Contributor User',
        role: 'contributor',
        created_at: '2026-01-01T00:00:00',
    },
];

/* ── Seed users if first load ── */
function seedUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

/* ── Get all users ── */
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

/* ── Get current session ── */
function getSession() {
    const s = sessionStorage.getItem(AUTH_SESSION_KEY);
    return s ? JSON.parse(s) : null;
}

/* ── Current user convenience ── */
function currentUser() {
    return getSession();
}

/* ── Role checks ── */
function isAdmin() { return getSession()?.role === 'admin'; }
function isEditor() { return getSession()?.role === 'editor'; }
function isContributor() { return getSession()?.role === 'contributor'; }
function canPublish() { return ['admin', 'editor'].includes(getSession()?.role); }
function canDelete() { return ['admin', 'editor'].includes(getSession()?.role); }
function canManageUsers() { return getSession()?.role === 'admin'; }
function canManageCats() { return ['admin', 'editor'].includes(getSession()?.role); }

/* ── Login ── */
function login(username, password) {
    const users = getUsers();
    const user = users.find(u =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );
    if (user) {
        const session = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
        };
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        return true;
    }
    return false;
}

/* ── Logout ── */
function logout() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    location.reload();
}

/* ── Show / hide screens ── */
function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app-shell').style.display = 'none';
}

function showAppShell() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-shell').style.display = 'flex';
}

/* ── Apply role-based UI ── */
function applyRoleUI() {
    const user = getSession();
    if (!user) return;

    /* Sidebar user info */
    const nameEl = document.getElementById('sb-user-name');
    const roleEl = document.getElementById('sb-user-role');
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = roleLabel(user.role);

    /* Role badge on avatar */
    const avatar = document.getElementById('sb-avatar');
    if (avatar) {
        avatar.textContent = user.name.charAt(0).toUpperCase();
        avatar.className = `sb-avatar role-${user.role}`;
    }

    /* Hide Users link for non-admins */
    const usersLink = document.getElementById('sb-link-users');
    if (usersLink) usersLink.style.display = canManageUsers() ? 'flex' : 'none';

    /* Hide Categories link for contributors */
    const catsLink = document.getElementById('sb-link-categories');
    if (catsLink) catsLink.style.display = canManageCats() ? 'flex' : 'none';

    /* Show/hide delete buttons based on role */
    document.querySelectorAll('.role-delete-btn').forEach(btn => {
        btn.style.display = canDelete() ? 'inline-flex' : 'none';
    });

    /* Show/hide publish options based on role */
    document.querySelectorAll('.role-publish-btn').forEach(btn => {
        btn.style.display = canPublish() ? 'inline-flex' : 'none';
    });

    /* Contributors see "Submit for review" instead of publish */
    document.querySelectorAll('.role-submit-btn').forEach(btn => {
        btn.style.display = isContributor() ? 'inline-flex' : 'none';
    });
}

function roleLabel(role) {
    return { admin: 'Administrator', editor: 'Editor', contributor: 'Contributor' }[role] || role;
}

/* ── Init auth ── */
function initAuth() {
    seedUsers();

    const session = getSession();
    if (session) {
        showAppShell();
        applyRoleUI();
        if (typeof initApp === 'function') initApp();
        return;
    }

    showLoginScreen();

    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-pw').value;
        const err = document.getElementById('login-err');

        if (login(username, password)) {
            showAppShell();
            applyRoleUI();
            if (typeof initApp === 'function') initApp();
        } else {
            err.style.display = 'block';
            document.getElementById('login-pw').value = '';
            document.getElementById('login-pw').focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', initAuth);