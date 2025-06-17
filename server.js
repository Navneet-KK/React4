const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files like index.html, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Load and group batch data
const data2021 = [
  ...JSON.parse(fs.readFileSync('data1.json')),
  ...JSON.parse(fs.readFileSync('data2.json'))
];
const data2013 = [
  ...JSON.parse(fs.readFileSync('data3.json')),
  ...JSON.parse(fs.readFileSync('data4.json'))
];
const allData = [...data2021, ...data2013];

// Search route with pagination
app.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const batch = req.query.b || 'all';

  if (!query) return res.status(400).json({ error: 'Empty query' });

  // Choose the right dataset
  let sourceData;
  if (batch === '2021') sourceData = data2021;
  else if (batch === '2013') sourceData = data2013;
  else sourceData = allData;

  const queryWords = query.split(/\s+/);
  const filtered = sourceData.filter(entry => {
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
