export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contents } = req.body;
    
    if (!contents) {
      return res.status(400).json({ error: "Missing 'contents' in request body" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // Use dynamic import for fetch in Node.js
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}