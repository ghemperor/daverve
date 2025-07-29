#!/bin/bash

echo "🚀 Starting MEVY Development Environment..."
echo ""
echo "📱 Starting React app on http://localhost:3000"
echo "🔗 Starting Proxy server on http://localhost:4000"
echo ""
echo "✅ Chatbot will work with real Gemini AI!"
echo "❌ To stop: Ctrl+C"
echo ""

# Kill any existing processes
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "node gemini-proxy.js" 2>/dev/null || true

# Start both servers
npm run dev