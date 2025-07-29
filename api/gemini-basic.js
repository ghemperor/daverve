export default async function handler(req, res) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get request body
    const { contents } = req.body || {};
    
    if (!contents) {
      res.status(400).json({ error: "Missing 'contents'" });
      return;
    }

    // Get API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      res.status(500).json({ error: 'API key not configured' });
      return;
    }

    // Call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `Gemini API error: ${response.status}` });
      return;
    }

    const data = await response.json();
    
    // Return success
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}