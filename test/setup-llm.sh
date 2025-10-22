#!/bin/bash

echo "🚀 Setting up AI Interview System with LLM Integration..."

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from example..."
    cp backend/env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your OpenAI API key!"
    echo "   Set OPENAI_API_KEY=your_actual_openai_api_key"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Edit backend/.env and add your OpenAI API key"
echo "2. Start the backend: cd backend && python main.py"
echo "3. Start the frontend: cd frontend && npm start"
echo ""
echo "🔑 Get your OpenAI API key from: https://platform.openai.com/api-keys"
