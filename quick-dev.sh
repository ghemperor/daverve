#!/bin/bash

# MEVY Quick Development Script
# Usage: ./quick-dev.sh [start|restart|stop|status]

ACTION=${1:-start}

case $ACTION in
  "start")
    echo "🚀 Quick Start - MEVY Development..."
    ./start-dev.sh
    ;;
    
  "restart")
    echo "🔄 Restarting development servers..."
    pkill -f "react-scripts start" 2>/dev/null || true
    pkill -f "node gemini-proxy.js" 2>/dev/null || true
    sleep 2
    echo "✅ Servers stopped, starting fresh..."
    ./start-dev.sh
    ;;
    
  "stop")
    echo "🛑 Stopping development servers..."
    pkill -f "react-scripts start" 2>/dev/null || true
    pkill -f "node gemini-proxy.js" 2>/dev/null || true
    echo "✅ All development servers stopped"
    ;;
    
  "status")
    echo "📊 Development Server Status:"
    if pgrep -f "react-scripts start" > /dev/null; then
      echo "✅ React Server: Running"
    else
      echo "❌ React Server: Not running"
    fi
    
    if pgrep -f "node gemini-proxy.js" > /dev/null; then
      echo "✅ Proxy Server: Running"
    else
      echo "❌ Proxy Server: Not running"
    fi
    
    echo ""
    echo "🌐 URLs:"
    echo "   React App: http://localhost:3000"
    echo "   Proxy API: http://localhost:4000"
    ;;
    
  *)
    echo "❓ Usage: ./quick-dev.sh [start|restart|stop|status]"
    echo ""
    echo "Commands:"
    echo "  start   - Start development servers"
    echo "  restart - Restart development servers" 
    echo "  stop    - Stop all development servers"
    echo "  status  - Check server status"
    ;;
esac