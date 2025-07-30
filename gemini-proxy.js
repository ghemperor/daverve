const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.post('/api/gemini', async (req, res) => {
  try {
    // Check API key first
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    const { contents } = req.body;
    if (!contents) {
      return res.status(400).json({ error: "Missing 'contents' in request body" });
    }
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const body = { contents };
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.error) {
      console.error('Gemini API Error:', data.error.message);
      return res.status(500).json({ error: data.error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy server running on port ${PORT}`);
  console.log('API Key loaded:', !!GEMINI_API_KEY);
  console.log('API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
  if (GEMINI_API_KEY) {
    console.log('API Key prefix:', GEMINI_API_KEY.substring(0, 15) + '...');
  }
}); 