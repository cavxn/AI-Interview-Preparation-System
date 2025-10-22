#!/bin/bash

# Simple startup script for AI Interview System
echo "🚀 Starting AI Interview System"
echo "==============================="

# Kill any existing processes on ports 8000 and 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start backend
echo "🔧 Starting backend..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd new-frontend
npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "🎉 System is running!"
echo "Backend: http://127.0.0.1:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ All servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
