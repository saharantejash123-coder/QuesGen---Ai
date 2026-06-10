const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all blueprints
router.get('/blueprints', (req, res) => {
  db.all('SELECT * FROM blueprints', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Transform flat rows back into nested object like oracleData.js
    const oracleBlueprints = {};
    rows.forEach(row => {
      if (!oracleBlueprints[row.board]) oracleBlueprints[row.board] = {};
      if (!oracleBlueprints[row.board][row.class]) oracleBlueprints[row.board][row.class] = {};
      oracleBlueprints[row.board][row.class][row.subject] = JSON.parse(row.data);
    });

    res.json(oracleBlueprints);
  });
});

// Get all dummy questions (or filter by board/class/subject)
router.get('/questions', (req, res) => {
  const { board, class: cls, subject, chapter } = req.query;

  let query = 'SELECT * FROM questions WHERE 1=1';
  let params = [];

  if (board) { query += ' AND board = ?'; params.push(board); }
  if (cls) { query += ' AND class = ?'; params.push(cls); }
  if (subject) { query += ' AND subject = ?'; params.push(subject); }
  if (chapter) { query += ' AND chapter = ?'; params.push(chapter); }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedRows = rows.map(r => ({
      ...r,
      options: JSON.parse(r.options)
    }));

    res.json(formattedRows);
  });
});

module.exports = router;
