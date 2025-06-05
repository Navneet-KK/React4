const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files like index.html, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Load and merge data
const data1 = JSON.parse(fs.readFileSync('data1.json'));
const data2 = JSON.parse(fs.readFileSync('data2.json'));
const data = [...data1, ...data2];

// Search route with pagination
app.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query) return res.status(400).json({ error: 'Empty query' });

  const queryWords = query.split(/\s+/);
  const filtered = data.filter(entry => {
    const nameWords = entry.name.toLowerCase().split(/\s+/);
    return queryWords.every(qw =>
      nameWords.some(nw => nw.includes(qw))
    );
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  res.json({
    results: paginated,
    page,
    totalPages,
    total
  });
});

// Start server
app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
