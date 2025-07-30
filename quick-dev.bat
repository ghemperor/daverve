@echo off
setlocal

REM MEVY Quick Development Script for Windows
REM Usage: quick-dev.bat [start|restart|stop|status]

set ACTION=%1
if "%ACTION%"=="" set ACTION=start

if "%ACTION%"=="start" goto start
if "%ACTION%"=="restart" goto restart
if "%ACTION%"=="stop" goto stop
if "%ACTION%"=="status" goto status
goto help

:start
echo 🚀 Quick Start - MEVY Development (Windows)...
call start-dev.bat
goto end

:restart
echo 🔄 Restarting development servers...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ Servers stopped, starting fresh...
call start-dev.bat
goto end

:stop
echo 🛑 Stopping development servers...
taskkill /f /im node.exe 2>nul
echo ✅ All development servers stopped
goto end

:status
echo 📊 Development Server Status:
tasklist /fi "imagename eq node.exe" 2>nul | find /i "node.exe" >nul
if %errorlevel%==0 (
    echo ✅ Node Servers: Running
) else (
    echo ❌ Node Servers: Not running
)
echo.
echo 🌐 URLs:
echo    React App: http://localhost:3000
echo    Proxy API: http://localhost:4000
goto end

:help
echo ❓ Usage: quick-dev.bat [start^|restart^|stop^|status]
echo.
echo Commands:
echo   start   - Start development servers
echo   restart - Restart development servers
echo   stop    - Stop all development servers
echo   status  - Check server status
goto end

:end