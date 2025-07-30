#!/bin/bash

echo "🚀 Starting MEVY Development Environment with Hot Reload..."
echo ""
echo "📱 React app: http://localhost:3000 (Hot Reload Enabled)"
echo "🔗 Proxy server: http://localhost:4000"
echo ""
echo "✅ Chatbot will work with real Gemini AI!"
echo "🔥 Auto-reload: File changes will refresh automatically"
echo "❌ To stop: Ctrl+C"
echo ""
echo "💡 Tips:"
echo "   - Changes to JS/CSS files auto-reload instantly"
echo "   - No need to restart server for code changes"
echo "   - Browser will auto-refresh on file saves"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "node gemini-proxy.js" 2>/dev/null || true
sleep 2

# Set environment variables for better development experience
export FAST_REFRESH=true
export CHOKIDAR_USEPOLLING=false
export BROWSER=none
export WDS_SOCKET_PORT=0

echo "🎯 Starting development servers..."
# Start both servers with enhanced hot-reload
npm run dev