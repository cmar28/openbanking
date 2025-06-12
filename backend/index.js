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

// Fetch transactions for a specific account
app.get('/api/accounts/:accountUid/transactions', async (req, res) => {
  if (!STARLING_TOKEN) {
    return res.status(500).json({ error: 'STARLING_PERSONAL_TOKEN not set' });
  }
  const { accountUid } = req.params;
  try {
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const url = `https://api.starlingbank.com/api/v2/transactions/account/${accountUid}/settled-transactions?from=${from}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STARLING_TOKEN}`,
        'User-Agent': 'openbanking-demo'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching transactions', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
