#!/bin/bash

# AI Interview System - New Frontend Startup Script
echo "🚀 Starting AI Interview System - New Frontend"
echo "=============================================="

# Check if we're in the right directory
if [ ! -d "new-frontend" ]; then
    echo "❌ Error: new-frontend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to new frontend directory
cd new-frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://127.0.0.1:8000/ > /dev/null; then
    echo "✅ Backend is running on http://127.0.0.1:8000"
else
    echo "⚠️  Warning: Backend not detected on http://127.0.0.1:8000"
    echo "Please make sure your FastAPI backend is running before using the frontend."
    echo ""
    echo "To start the backend, run:"
    echo "cd backend && python main.py"
    echo ""
fi

# Start the development server
echo "🎯 Starting React development server..."
echo "Frontend will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
