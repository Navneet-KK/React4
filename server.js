const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Load arrays from multiple JSON files and merge them
const data1 = JSON.parse(fs.readFileSync('data1.json'));
const data2 = JSON.parse(fs.readFileSync('data2.json'));
const data = [...data1, ...data2];

app.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) return res.status(400).json({ error: 'Empty query' });

  const queryWords = query.split(/\s+/); // ['doe', 'john']

  const matches = data.filter(entry => {
    const nameWords = entry.name.toLowerCase().split(/\s+/); // ['john', 'doe']
    return queryWords.every(qWord =>
      nameWords.some(nWord => nWord.includes(qWord))
    );
  }).slice(0, 10); // limit to top 10 matches

  if (matches.length > 0) {
    res.json(matches);
  } else {
    res.status(404).json({ error: 'No match found' });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
