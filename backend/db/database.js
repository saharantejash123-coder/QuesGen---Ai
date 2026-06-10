const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'questra.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize schema
const initDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        initials TEXT,
        role TEXT,
        subtitle TEXT,
        email TEXT UNIQUE,
        password TEXT,
        school_name TEXT,
        phone TEXT,
        registration_number TEXT,
        subject TEXT
      )
    `);

    // Safely add columns if they don't exist (for existing databases)
    const addColumn = (col, type) => {
      db.run(`ALTER TABLE users ADD COLUMN ${col} ${type}`, (err) => {
        // Ignore errors about column already existing
      });
    };
    addColumn('school_name', 'TEXT');
    addColumn('phone', 'TEXT');
    addColumn('registration_number', 'TEXT');
    addColumn('subject', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        board TEXT,
        class TEXT,
        subject TEXT,
        chapter TEXT,
        text TEXT,
        options TEXT,
        answer TEXT,
        type TEXT,
        diff TEXT,
        conf INTEGER
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS blueprints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        board TEXT,
        class TEXT,
        subject TEXT,
        data TEXT
      )
    `);
  });
};

initDB();

module.exports = db;
