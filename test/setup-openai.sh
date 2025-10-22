#!/bin/bash

# Setup script for OpenAI API key
echo "🔧 Setting up OpenAI API key for AI Interview System..."

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from template..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔑 To complete the setup, you need to:"
echo "1. Get your OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Edit backend/.env file and replace 'your_openai_api_key_here' with your actual API key"
echo ""
echo "Example:"
echo "OPENAI_API_KEY=sk-proj-your-actual-key-here"
echo ""
echo "⚠️  Without a valid OpenAI API key, the system will use fallback mock questions."
echo "   The AI features (question generation and analysis) will work with basic functionality."
echo ""
echo "🚀 After setting up the API key, restart the backend server:"
echo "   cd backend && python main.py"
