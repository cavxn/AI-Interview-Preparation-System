#!/bin/bash

# 🚀 AI Interview System - Fixed Startup Script
echo "🎤 Starting AI Interview System (Fixed Version)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/main.py" ] || [ ! -f "new-frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Kill any existing processes on ports 8000 and 3000
print_status "Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    print_warning "No .env file found. Creating one..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > backend/.env
    print_warning "Please edit backend/.env and add your OpenAI API key"
fi

# Check if emotion model exists
if [ ! -f "backend/emotion_model.h5" ]; then
    print_error "emotion_model.h5 not found in backend directory"
    print_error "Please ensure your trained emotion model is in backend/emotion_model.h5"
    exit 1
fi

print_status "Setting up backend..."

# Install Python dependencies
cd backend
if [ -f "requirements.txt" ]; then
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        print_success "Python dependencies installed"
    else
        print_error "Failed to install Python dependencies"
        exit 1
    fi
else
    print_error "requirements.txt not found in backend directory"
    exit 1
fi

# Remove old database if it exists
if [ -f "app.db" ]; then
    print_status "Removing old database..."
    rm app.db
fi

# Initialize database with fixed script
print_status "Initializing database with fixed script..."
python init_fresh_db.py
if [ $? -eq 0 ]; then
    print_success "Database initialized successfully"
else
    print_warning "Database initialization had issues, but continuing..."
fi

# Start backend in background
print_status "Starting backend server..."
python main.py &
BACKEND_PID=$!
print_success "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
print_status "Waiting for backend to start..."
for i in {1..10}; do
    if curl -s http://127.0.0.1:8000/ > /dev/null 2>&1; then
        print_success "Backend is running on http://127.0.0.1:8000"
        break
    fi
    echo -n "."
    sleep 1
done

cd ..

print_status "Setting up frontend..."

# Install Node.js dependencies
cd new-frontend
if [ -f "package.json" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Node.js dependencies installed"
    else
        print_error "Failed to install Node.js dependencies"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
else
    print_error "package.json not found in new-frontend directory"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
print_status "Starting frontend server..."
npm start &
FRONTEND_PID=$!
print_success "Frontend started (PID: $FRONTEND_PID)"

cd ..

# Wait for frontend to start
print_status "Waiting for frontend to start..."
sleep 5

print_success "🎤 AI Interview System is running!"
echo ""
echo "📋 System Status:"
echo "  Backend:  http://127.0.0.1:8000 (PID: $BACKEND_PID)"
echo "  Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "🎯 Next Steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Login with test account:"
echo "     Email: test@example.com"
echo "     Password: test123"
echo "  3. Navigate to the Interview page"
echo "  4. Select your topic and start practicing!"
echo ""
echo "⚠️  Important Notes:"
echo "  - Allow camera and microphone access when prompted"
echo "  - Make sure your OpenAI API key is set in backend/.env"
echo "  - The emotion model (emotion_model.h5) should be in backend/"
echo ""
echo "🛑 To stop the system:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    print_success "AI Interview System stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Keep script running and monitor processes
while true; do
    sleep 10
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died"
        break
    fi
done
