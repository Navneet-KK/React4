const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Load data once at startup
let data;
try {
  data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));
} catch (err) {
  console.error('Failed to load data.json:', err);
  process.exit(1); // Exit if data can't be loaded
}

app.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) return res.status(400).json({ error: 'Empty query' });

  const queryWords = query.split(/\s+/); // split on spaces

  const matches = data.filter(entry => {
    const nameWords = entry.name.toLowerCase().split(/\s+/);
    // Check if every query word appears as substring in any name word
    return queryWords.every(qWord =>
      nameWords.some(nWord => nWord.includes(qWord))
    );
  }).slice(0, 10); // limit to 10 results max

  if (matches.length > 0) {
    res.json(matches);
  } else {
    res.status(404).json({ error: 'No match found' });
  }
});

// Use environment variable PORT for deployment flexibility, fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
