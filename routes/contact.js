const express = require('express');

const { getDb } = require('../server/db');

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    const n = String(name || '').trim();
    const e = String(email || '').trim();
    const m = String(message || '').trim();

    if (n.length < 2) return res.status(400).json({ ok: false, message: 'Please enter your name.' });
    if (!isValidEmail(e)) return res.status(400).json({ ok: false, message: 'Please enter a valid email.' });
    if (m.length < 8) return res.status(400).json({ ok: false, message: 'Message must be at least 8 characters.' });

    const db = getDb();

    if (!db) {
      return res.status(503).json({ ok: false, message: 'Database not available on this system.' });
    }


    db.run(
      'INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, ?)',
      [n, e.toLowerCase(), m, Date.now()],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ ok: false, message: 'Could not send message.' });
        }
        return res.json({ ok: true, message: 'Message received.' });
      }
    );

    return;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Could not send message.' });
  }
});

module.exports = router;


