// Edge runtime has fetch available globally
export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  // Log for debugging on Vercel
  console.log('API called with method:', req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  // Chỉ cho phép POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const body = await req.json();
    const { contents } = body;
    
    console.log('Request body:', body);
    
    if (!contents) {
      return new Response(JSON.stringify({ error: "Missing 'contents' in request body" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    console.log('API key exists:', !!GEMINI_API_KEY);
    console.log('API key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'Gemini API key not configured',
        debug: {
          nodeEnv: process.env.NODE_ENV || 'undefined'
        }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
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
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('Success! Returning data...');
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}