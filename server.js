// server.js
// A simple Express.js backend for a Todo list API

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) console.error('Error opening database', err.message);
});

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority TEXT DEFAULT 'low',
    isComplete BOOLEAN DEFAULT 0,
    isFun BOOLEAN DEFAULT 1
  )
`);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json(rows);
  });
});

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Todo item not found' });
    res.json(row);
  });
});

// POST a new todo item
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = 1 } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  db.run(
    'INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, 0, ?)',
    [name, priority, isFun],
    function (err) {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });

      res.status(201).json({ id: this.lastID, name, priority, isComplete: false, isFun });
    }
  );
});
  


 app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });

    if (this.changes === 0) {
      res.status(404).json({ message: 'Todo item not found' });
    } else {
      res.json({ message: `Todo item ${id} deleted.` });
    }
  });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
