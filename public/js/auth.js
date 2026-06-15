/*
  Client-side authentication for NeonForge.
  - Handles login + signup forms
  - Stores session cookie via server routes
  - Also exposes a small auth-state helper for index.html
*/

(function () {
  const byId = (id) => document.getElementById(id);

  function setNote(noteEl, msg, isError) {
    if (!noteEl) return;
    noteEl.textContent = msg || '';
    noteEl.style.color = isError ? 'rgba(255,79,216,.95)' : 'var(--muted)';
  }

  async function postJson(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({ ok: false, message: 'Request failed.' }));
    if (!res.ok) {
      throw new Error(data?.message || 'Request failed.');
    }
    return data;
  }

  async function getMe() {
    const res = await fetch('/auth/me', { method: 'GET' });
    const data = await res.json().catch(() => ({ ok: false }));
    if (!data.ok) return { ok: false, user: null };
    return { ok: true, user: data.user || null };
  }

  function initLogin() {
    const form = byId('loginForm');
    if (!form) return;

    const emailEl = byId('loginEmail');
    const pwEl = byId('loginPassword');
    const noteEl = byId('loginNote');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailEl?.value?.trim();
      const password = pwEl?.value;

      if (!email) return setNote(noteEl, 'Enter your email address.', true);
      if (!password || password.length < 1) return setNote(noteEl, 'Enter your password.', true);

      try {
        setNote(noteEl, 'Logging in…');
        const data = await postJson('/auth/login', { email, password });
        if (data?.ok) {
          setNote(noteEl, 'Login successful. Redirecting…');
          setTimeout(() => {
            window.location.href = '/';
          }, 600);
        } else {
          setNote(noteEl, data?.message || 'Login failed.', true);
        }
      } catch (err) {
        setNote(noteEl, err.message || 'Login failed.', true);
      }
    });
  }

  function initSignup() {
    const form = byId('signupForm');
    if (!form) return;

    const emailEl = byId('signupEmail');
    const pwEl = byId('signupPassword');
    const confirmEl = byId('signupConfirm');
    const noteEl = byId('signupNote');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailEl?.value?.trim();
      const password = pwEl?.value;
      const confirm = confirmEl?.value;

      if (!email) return setNote(noteEl, 'Enter your email address.', true);
      if (!password || password.length < 8) return setNote(noteEl, 'Password must be at least 8 characters.', true);
      if (password !== confirm) return setNote(noteEl, 'Passwords do not match.', true);

      try {
        setNote(noteEl, 'Creating account…');
        const data = await postJson('/auth/signup', { email, password });
        if (data?.ok) {
          setNote(noteEl, 'Account created. Redirecting…');
          setTimeout(() => {
            window.location.href = '/';
          }, 650);
        } else {
          setNote(noteEl, data?.message || 'Signup failed.', true);
        }
      } catch (err) {
        setNote(noteEl, err.message || 'Signup failed.', true);
      }
    });
  }

  function initLogoutButton() {
    const logout = document.querySelector('[data-action="logout"]');
    if (!logout) return;

    logout.addEventListener('click', async () => {
      try {
        await postJson('/auth/logout', {});
      } catch (_) {
        // even if request fails, clear local UI
      }
      window.location.href = '/';
    });
  }

  function updateIndexAuthUI() {
    // Optional elements expected on index.html if we wire them later.
    const getAccessBtn = document.querySelector('[data-open="auth"]');
    const authState = document.querySelector('[data-auth-state]');
    const logoutBtn = document.querySelector('[data-action="logout"]');

    if (!authState && !logoutBtn && !getAccessBtn) return;

    getMe()
      .then(({ ok, user }) => {
        const loggedIn = !!user;
        if (authState) {
          authState.textContent = loggedIn ? `Logged in as ${user.email}` : 'Not logged in';
        }
        if (logoutBtn) logoutBtn.style.display = loggedIn ? 'inline-flex' : 'none';
        if (getAccessBtn) getAccessBtn.style.display = loggedIn ? 'none' : '';
      })
      .catch(() => {
        if (authState) authState.textContent = 'Auth unavailable';
      });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initSignup();
    initLogoutButton();
    updateIndexAuthUI();
  });
})();

