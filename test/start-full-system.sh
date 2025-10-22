#!/bin/bash

# AI Interview System - Full System Startup Script
echo "🚀 Starting AI Interview System - Full Stack"
echo "=============================================="

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "new-frontend" ]; then
    echo "❌ Error: backend or new-frontend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Check if backend is already running
if check_port 8000; then
    echo "✅ Backend already running on port 8000"
else
    echo "🔧 Starting backend server..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies if needed
    if [ ! -f "venv/pyvenv.cfg" ] || [ ! -d "venv/lib" ]; then
        echo "📦 Installing Python dependencies..."
        pip install -r requirements.txt
    fi
    
    # Initialize database with mock data
    echo "🗄️ Initializing database..."
    python init_mock_data.py
    
    # Start backend server
    echo "🎯 Starting FastAPI backend server..."
    echo "Backend will be available at: http://127.0.0.1:8000"
    echo "API docs will be available at: http://127.0.0.1:8000/docs"
    echo ""
    
    # Start backend in background
    python main.py &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait a moment for backend to start
    sleep 3
    
    # Test backend
    echo "🧪 Testing backend..."
    cd ..
    python test_backend.py
    
    cd backend
fi

# Check if frontend is already running
if check_port 3000; then
    echo "✅ Frontend already running on port 3000"
else
    echo "🎨 Starting frontend server..."
    cd new-frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ Error: Failed to install frontend dependencies"
            exit 1
        fi
        echo "✅ Frontend dependencies installed successfully"
    else
        echo "✅ Frontend dependencies already installed"
    fi
    
    # Start frontend development server
    echo "🎯 Starting React development server..."
    echo "Frontend will be available at: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    echo ""
    
    # Start frontend
    npm start &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend server stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "Frontend server stopped"
    fi
    echo "✅ All servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo ""
echo "🎉 AI Interview System is running!"
echo "=================================="
echo "📊 Backend API: http://127.0.0.1:8000"
echo "📚 API Documentation: http://127.0.0.1:8000/docs"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
