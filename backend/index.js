const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const STARLING_TOKEN = process.env.STARLING_PERSONAL_TOKEN;

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api/accounts', async (req, res) => {
  if (!STARLING_TOKEN) {
    return res.status(500).json({ error: 'STARLING_PERSONAL_TOKEN not set' });
  }
  try {
    const response = await fetch('https://api.starlingbank.com/api/v2/accounts', {
      headers: {
        Authorization: `Bearer ${STARLING_TOKEN}`,
        'User-Agent': 'openbanking-demo'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching accounts', err);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
