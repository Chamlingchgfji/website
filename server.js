<<<<<<< HEAD
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

const { initDb } = require('./server/db');

const app = express();

// ---------- App setup ----------
app.disable('x-powered-by');

app.use(helmet({
  crossOriginEmbedderPolicy: false // keep simple for local/dev
}));

app.use(cookieParser());

// Parse body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false // local dev; enable HTTPS for production
    }
  })
);

// Serve static assets
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// SEO-friendly routes: let the HTML pages handle their own SEO.
app.get(['/login', '/signup', '/contact'], (req, res) => {
  const url = req.path;
  const file =
    url === '/login'
      ? 'login.html'
      : url === '/signup'
        ? 'signup.html'
        : 'contact.html';
  res.sendFile(path.join(__dirname, 'public', file));
});

app.get(['/logout'], (req, res) => {
  // If user visits /logout directly, do it and redirect.
  req.logoutHandled = true;
  res.redirect('/');
});

// ---------- Routes with rate limits ----------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/auth', authLimiter, authRoutes);
app.use('/contact', contactRoutes);

// ---------- DB init ----------
try {
  initDb();
} catch (e) {
  console.warn('DB init failed (auth/contact will degrade gracefully).', e?.message || e);
}


// ---------- Error handling ----------
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ ok: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NeonForge running on http://localhost:${PORT}`);
});

=======
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

const { initDb } = require('./server/db');

const app = express();

// ---------- App setup ----------
app.disable('x-powered-by');

app.use(helmet({
  crossOriginEmbedderPolicy: false // keep simple for local/dev
}));

app.use(cookieParser());

// Parse body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false // local dev; enable HTTPS for production
    }
  })
);

// Serve static assets
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// SEO-friendly routes: let the HTML pages handle their own SEO.
app.get(['/login', '/signup', '/contact'], (req, res) => {
  const url = req.path;
  const file =
    url === '/login'
      ? 'login.html'
      : url === '/signup'
        ? 'signup.html'
        : 'contact.html';
  res.sendFile(path.join(__dirname, 'public', file));
});

app.get(['/logout'], (req, res) => {
  // If user visits /logout directly, do it and redirect.
  req.logoutHandled = true;
  res.redirect('/');
});

// ---------- Routes with rate limits ----------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/auth', authLimiter, authRoutes);
app.use('/contact', contactRoutes);

// ---------- DB init ----------
try {
  initDb();
} catch (e) {
  console.warn('DB init failed (auth/contact will degrade gracefully).', e?.message || e);
}


// ---------- Error handling ----------
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ ok: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NeonForge running on http://localhost:${PORT}`);
});

>>>>>>> 90160272d5dadd85078d532cdc48313dec82902c
