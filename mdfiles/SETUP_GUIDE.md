# 🚀 Complete Setup Guide - AI Interview System

## Prerequisites

Before starting, make sure you have:
- **Python 3.8+** installed
- **Node.js 16+** installed
- **OpenAI API Key** (for AI question generation and analysis)
- **Your trained emotion model** (`emotion_model.h5`) in the backend directory

## 📋 Step-by-Step Setup

### 1. **Backend Setup**

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Set Up Environment Variables
Create a `.env` file in the `backend` directory:
```bash
# Create .env file
touch .env
```

Add your OpenAI API key to the `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### Verify Emotion Model
Make sure your `emotion_model.h5` file is in the backend directory:
```bash
ls backend/emotion_model.h5
```

#### Initialize Database
```bash
cd backend
python init_fresh_db.py
```

#### Start Backend Server
```bash
cd backend
python main.py
```

The backend will start on `http://127.0.0.1:8000`

### 2. **Frontend Setup**

#### Install Node.js Dependencies
```bash
cd new-frontend
npm install
```

#### Start Frontend Development Server
```bash
cd new-frontend
npm start
```

The frontend will start on `http://localhost:3000`

### 3. **Full System Startup**

#### Option A: Manual Startup (Recommended for Development)
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend  
cd new-frontend
npm start
```

#### Option B: Using Provided Scripts
```bash
# Make scripts executable
chmod +x start-dev.sh
chmod +x start-full-system.sh

# Start full system
./start-full-system.sh
```

## 🔧 Configuration

### Backend Configuration
- **Port**: 8000 (default)
- **Database**: SQLite (`app.db`)
- **Emotion Model**: `emotion_model.h5`
- **API Endpoints**: Available at `http://127.0.0.1:8000`

### Frontend Configuration
- **Port**: 3000 (default)
- **API Base URL**: `http://127.0.0.1:8000`
- **Browser Requirements**: Modern browser with camera/microphone access

## 🎯 Usage Instructions

### 1. **Access the Application**
1. Open your browser and go to `http://localhost:3000`
2. You should see the AI Interview Coach landing page

### 2. **User Registration/Login**
1. Click "Sign Up" to create a new account
2. Or click "Login" if you already have an account
3. You can also use Google OAuth login

### 3. **Start an Interview Session**
1. Navigate to the "Interview" page
2. Select your interview topic (Software Engineering, Data Science, etc.)
3. Choose difficulty level (Beginner, Intermediate, Advanced)
4. Click "Generate Questions"
5. Allow camera and microphone access when prompted

### 4. **Interview Process**
1. **Camera Setup**: The system will detect your face and analyze emotions
2. **Question Display**: AI-generated questions will appear
3. **Answer Recording**: Click "Start Recording" and speak your answer
4. **Analysis**: Get real-time feedback on your response
5. **Progress**: Move through questions with progress tracking

## 🐛 Troubleshooting

### Common Issues

#### 1. **Backend Won't Start**
```bash
# Check if port 8000 is available
lsof -i :8000

# Kill process if needed
kill -9 $(lsof -t -i:8000)

# Try starting again
cd backend
python main.py
```

#### 2. **Frontend Won't Start**
```bash
# Clear node modules and reinstall
cd new-frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 3. **Camera/Microphone Issues**
- Ensure browser has permission to access camera/microphone
- Try refreshing the page
- Check browser console for errors

#### 4. **Emotion Model Not Loading**
```bash
# Verify model file exists
ls -la backend/emotion_model.h5

# Check file permissions
chmod 644 backend/emotion_model.h5
```

#### 5. **OpenAI API Errors**
- Verify your API key in the `.env` file
- Check your OpenAI account has sufficient credits
- Ensure API key has proper permissions

### Debug Mode

#### Backend Debug
```bash
cd backend
# Enable debug logging
export DEBUG=1
python main.py
```

#### Frontend Debug
```bash
cd new-frontend
# Start with debug mode
REACT_APP_DEBUG=true npm start
```

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (OpenAI)      │
│   Port: 3000    │    │   Port: 8000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Browser APIs  │    │   Database      │
│   - Camera      │    │   (SQLite)      │
│   - Microphone  │    │                 │
│   - Speech API  │    │                 │
└─────────────────┘    └─────────────────┘
```

## 🚀 Production Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Production Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend
cd new-frontend
npm run build
# Serve with nginx or similar
```

## 📝 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /google-login` - Google OAuth

### Interview Features
- `POST /generate-questions` - Generate AI questions
- `POST /analyze-comprehensive` - Combined analysis
- `POST /analyze` - Emotion analysis
- `POST /sessions` - Create interview session

### Data Retrieval
- `GET /dashboard` - Dashboard statistics
- `GET /sessions` - User sessions
- `GET /sessions/{id}/summary` - Session details

## 🔍 Monitoring & Logs

### Backend Logs
```bash
# View backend logs
tail -f backend/logs/app.log
```

### Frontend Logs
- Check browser console (F12)
- Network tab for API calls
- Application tab for local storage

## 📈 Performance Optimization

### Backend Optimization
- Use production WSGI server (Gunicorn)
- Enable database connection pooling
- Cache emotion model loading

### Frontend Optimization
- Enable code splitting
- Use production build
- Optimize bundle size

## 🆘 Support

### Common Commands
```bash
# Check system status
curl http://127.0.0.1:8000/

# Test emotion detection
curl -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"frame_data": "base64_image_data"}'

# Check database
sqlite3 backend/app.db ".tables"
```

### Log Files
- Backend: `backend/logs/`
- Frontend: Browser console
- System: `/var/log/` (Linux/Mac)

---

## 🎯 Quick Start Summary

1. **Install dependencies**: `pip install -r requirements.txt` (backend) + `npm install` (frontend)
2. **Set up environment**: Create `.env` file with OpenAI API key
3. **Start backend**: `python main.py` (port 8000)
4. **Start frontend**: `npm start` (port 3000)
5. **Access application**: `http://localhost:3000`
6. **Allow camera/microphone**: Grant permissions when prompted
7. **Start interviewing**: Select topic, generate questions, begin session!

The system is now ready for comprehensive AI-powered interview coaching! 🚀
