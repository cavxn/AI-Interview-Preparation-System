#!/bin/bash

# 🧪 Test Google Login Fix
echo "🧪 Testing Google Login Fix..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Kill existing processes
print_status "Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Start backend
print_status "Starting backend..."
cd backend
python main.py &
BACKEND_PID=$!
print_success "Backend started (PID: $BACKEND_PID)"

# Wait for backend
sleep 3

# Test backend
if curl -s http://127.0.0.1:8000/ > /dev/null; then
    print_success "Backend is running"
else
    print_error "Backend failed to start"
    exit 1
fi

cd ..

# Start frontend
print_status "Starting frontend..."
cd new-frontend
npm start &
FRONTEND_PID=$!
print_success "Frontend started (PID: $FRONTEND_PID)"

cd ..

print_success "🎉 System is running!"
echo ""
echo "📋 Test Google Login:"
echo "  1. Open http://localhost:3000"
echo "  2. Click 'Login' or 'Sign Up'"
echo "  3. Click the Google login button"
echo "  4. Complete Google OAuth flow"
echo "  5. Check browser console (F12) for logs"
echo ""
echo "🔍 Debug Information:"
echo "  - Backend logs: Check terminal output"
echo "  - Frontend logs: Browser console (F12)"
echo "  - Network tab: Check API calls to /google-login"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep running
while true; do
    sleep 10
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend died"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend died"
        break
    fi
done
