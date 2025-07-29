export const config = {
  runtime: 'edge',
}

export default function handler(req) {
  // Simple public test - no auth required
  return new Response(JSON.stringify({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}