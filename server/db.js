const path = require('path');
// sqlite3 requires native binaries. If they fail to load on this system,
// NeonForge still works as a front-end demo. Auth/contact will gracefully degrade.
let sqlite3;
try {
  sqlite3 = require('sqlite3').verbose();
} catch (e) {
  sqlite3 = null;
}


const dbPath = path.join(__dirname, '..', 'data.sqlite');
let db;

function initDb() {
  if (!sqlite3) {
    // graceful degradation
    db = null;
    return null;
  }
  db = new sqlite3.Database(dbPath);


  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);');
  });

  return db;
}

function getDb() {
  if (!db) initDb();
  return db;
}

module.exports = { initDb, getDb };


