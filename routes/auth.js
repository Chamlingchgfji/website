const express = require('express');
const bcrypt = require('bcrypt');

const { getDb } = require('../server/db');

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function safeUserFromSession(req) {
  // Minimal exposed user object for front-end.
  if (!req.session?.user) return null;
  return { id: req.session.user.id, email: req.session.user.email };
}

function dbGet(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbRun(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID });
    });
  });
}

router.get('/me', (req, res) => {
  res.json({ ok: true, user: safeUserFromSession(req) });
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, message: 'Enter a valid email.' });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res
        .status(400)
        .json({ ok: false, message: 'Password must be at least 8 characters.' });
    }

    const emailNorm = email.trim().toLowerCase();
    const db = getDb();

    if (!db) {
      return res
        .status(503)
        .json({ ok: false, message: 'Database not available on this system.' });
    }

    const existing = await dbGet(db, 'SELECT id FROM users WHERE email = ?', [emailNorm]);

    if (existing) {
      return res.status(409).json({ ok: false, message: 'Email already exists. Please log in.' });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const info = await dbRun(
      db,
      'INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)',
      [emailNorm, passwordHash, Date.now()]
    );

    // Create session
    req.session.user = { id: info.lastID, email: emailNorm };

    return res.json({ ok: true, user: safeUserFromSession(req) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Signup failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, message: 'Enter a valid email.' });
    }

    if (typeof password !== 'string' || password.length < 1) {
      return res.status(400).json({ ok: false, message: 'Enter your password.' });
    }

    const emailNorm = email.trim().toLowerCase();
    const db = getDb();

    if (!db) {
      return res.status(503).json({ ok: false, message: 'Database not available on this system.' });
    }

    const user = await dbGet(db, 'SELECT id, email, password_hash FROM users WHERE email = ?', [emailNorm]);


    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password.' });
    }

    req.session.user = { id: user.id, email: user.email };
    return res.json({ ok: true, user: safeUserFromSession(req) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: 'Login failed.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;


