@echo off
echo 🚀 Starting MEVY Development Environment with Hot Reload (Windows)...
echo.
echo 📱 React app: http://localhost:3000 (Hot Reload Enabled)
echo 🔗 Proxy server: http://localhost:4000
echo.
echo ✅ Chatbot will work with real Gemini AI!
echo 🔥 Auto-reload: File changes will refresh automatically
echo ❌ To stop: Ctrl+C
echo.
echo 💡 Tips:
echo    - Changes to JS/CSS files auto-reload instantly
echo    - No need to restart server for code changes
echo    - Browser will auto-refresh on file saves
echo.

REM Kill any existing processes
echo 🧹 Cleaning up existing processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Set environment variables for better development experience
set FAST_REFRESH=true
set CHOKIDAR_USEPOLLING=false
set BROWSER=none
set WDS_SOCKET_PORT=0
set GENERATE_SOURCEMAP=true

echo 🎯 Starting development servers...
REM Start both servers with enhanced hot-reload
npm run dev:win