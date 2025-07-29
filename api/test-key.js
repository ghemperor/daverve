export default async function handler(req, res) {
  // Simple test endpoint to verify API key configuration
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  return res.status(200).json({
    keyExists: !!GEMINI_API_KEY,
    keyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
    keyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'Not found',
    timestamp: new Date().toISOString()
  });
}