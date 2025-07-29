// Fetch is available globally in Vercel environment

export default async function handler(req, res) {
  // Log for debugging on Vercel
  console.log('API called with method:', req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res.status(200).end();
  }

  // Chỉ cho phép POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Thiết lập CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  try {
    const { contents } = req.body;
    
    console.log('Request body:', req.body);
    
    if (!contents) {
      return res.status(400).json({ error: "Missing 'contents' in request body" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    console.log('API key exists:', !!GEMINI_API_KEY);
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log('Calling Gemini API...');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ contents })
    });

    console.log('Gemini API response status:', response.status);
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API Error:', data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    console.log('Success! Returning data...');
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}