#!/bin/bash

# 🚀 AI Interview System - Update GitHub Repository Script
echo "🚀 Updating GitHub Repository with Complete AI Interview System..."
echo "================================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "backend/main.py" ] || [ ! -f "new-frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Setting up Git repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    print_status "Initializing Git repository..."
    git init
fi

# Add remote origin
print_status "Setting up remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/cavxn/AI-Interview-Preparation-System.git

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_status "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
backend/venv/
backend/__pycache__/
backend/*.pyc
backend/*.pyo
backend/*.pyd
backend/.Python
backend/env/
backend/pip-log.txt
backend/pip-delete-this-directory.txt
backend/.tox/
backend/.coverage
backend/.coverage.*
backend/.cache
backend/nosetests.xml
backend/coverage.xml
backend/*.cover
backend/*.log
backend/.git
backend/.mypy_cache
backend/.pytest_cache
backend/.hypothesis

# Database
*.db
*.sqlite
*.sqlite3
backend/app.db
app.db

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build outputs
build/
dist/
*.tgz
*.tar.gz

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/
EOF
fi

# Add all files
print_status "Adding all files to Git..."
git add .

# Commit changes
print_status "Committing changes..."
git commit -m "🚀 Complete AI Interview System - Full Stack Application

✨ Features:
- FastAPI Backend with SQLAlchemy
- React Frontend with Modern UI
- AI-powered Interview Analysis
- Emotion Detection
- Session Management
- User Authentication
- Real-time Feedback
- Comprehensive Dashboard

🛠️ Tech Stack:
- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, Tailwind CSS, Framer Motion
- AI: OpenAI GPT Integration
- Database: SQLite (production ready for PostgreSQL)

🚀 Deployment:
- Docker support included
- Simple deployment scripts
- Cloud-ready configuration

📁 Structure:
- backend/: FastAPI application
- new-frontend/: React application
- Docker configuration
- Deployment scripts
- Complete documentation"

# Push to repository
print_status "Pushing to GitHub repository..."
git branch -M main
git push -u origin main --force

if [ $? -eq 0 ]; then
    print_success "🎉 Repository updated successfully!"
    echo ""
    echo "📋 Your AI Interview System is now available at:"
    echo "  https://github.com/cavxn/AI-Interview-Preparation-System"
    echo ""
    echo "🎯 Next Steps:"
    echo "  1. Clone the repository:"
    echo "     git clone https://github.com/cavxn/AI-Interview-Preparation-System.git"
    echo "  2. Navigate to the project:"
    echo "     cd AI-Interview-Preparation-System"
    echo "  3. Deploy locally:"
    echo "     ./deploy-simple.sh"
    echo "  4. Or deploy with Docker:"
    echo "     ./deploy.sh"
    echo ""
    echo "📚 Documentation:"
    echo "  - README.md: Complete setup guide"
    echo "  - DEPLOYMENT.md: Deployment options"
    echo "  - API docs: http://localhost:8000/docs"
    echo ""
else
    print_error "Failed to push to repository. Please check your Git credentials."
    echo ""
    echo "🔧 Manual steps:"
    echo "  1. git add ."
    echo "  2. git commit -m 'Complete AI Interview System'"
    echo "  3. git push origin main --force"
fi
