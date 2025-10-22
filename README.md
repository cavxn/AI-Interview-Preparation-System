# 🎤 AI Interview Preparation System

A comprehensive AI-powered interview preparation system that helps users practice interviews with real-time feedback, emotion analysis, and intelligent question generation.

## ✨ Features

- **🤖 AI-Powered Analysis**: Get intelligent feedback on your interview responses
- **😊 Emotion Detection**: Real-time emotion analysis during interviews
- **📊 Performance Tracking**: Track your progress with detailed analytics
- **🎯 Smart Questions**: AI-generated questions based on your chosen topic
- **📱 Modern UI**: Beautiful, responsive interface with smooth animations
- **🔐 User Authentication**: Secure login with Google OAuth support
- **📈 Dashboard**: Comprehensive analytics and session history

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Database (production-ready for PostgreSQL)
- **OpenAI GPT** - AI analysis and question generation
- **JWT** - Authentication

### Frontend
- **React 19** - Modern React with latest features
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cavxn/AI-Interview-Preparation-System.git
   cd AI-Interview-Preparation-System
   ```

2. **Deploy with one command:**
   ```bash
   # Simple deployment (no Docker required)
   ./deploy-simple.sh
   
   # Or with Docker
   ./deploy.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
ai-interview-system/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── llm_service.py      # AI service integration
│   └── requirements.txt    # Python dependencies
├── new-frontend/           # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Utility functions
│   └── package.json       # Node.js dependencies
├── docker-compose.yml     # Docker configuration
├── deploy.sh             # Docker deployment
├── deploy-simple.sh      # Simple deployment
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./app.db
OPENAI_API_KEY=your-openai-api-key-here
```

### OpenAI Setup

1. Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to `backend/.env`
3. The system will use AI for question generation and analysis

## 🚀 Deployment Options

### 1. Local Development
```bash
./deploy-simple.sh
```

### 2. Docker Deployment
```bash
./deploy.sh
```

### 3. Cloud Deployment

#### Railway (Recommended)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Heroku
```bash
# Backend
heroku create your-app-backend
git subtree push --prefix=backend heroku main

# Frontend
heroku create your-app-frontend
git subtree push --prefix=new-frontend heroku main
```

#### Vercel (Frontend) + Railway (Backend)
1. Deploy frontend to [Vercel](https://vercel.com)
2. Deploy backend to [Railway](https://railway.app)

## 📊 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /google-login` - Google OAuth login

### Interview Management
- `POST /sessions` - Create interview session
- `PUT /sessions/{id}` - Update session
- `GET /sessions` - Get user sessions
- `GET /sessions/{id}/summary` - Get session summary

### AI Analysis
- `POST /analyze` - Emotion analysis
- `POST /analyze-comprehensive` - Full response analysis
- `POST /generate-questions` - Generate interview questions

### Dashboard
- `GET /dashboard` - Get user statistics
- `GET /me` - Get current user info

## 🎯 Usage

1. **Create Account**: Sign up or login with Google
2. **Choose Topic**: Select your interview topic (e.g., "Python", "React", "Data Science")
3. **Start Interview**: Begin your practice session
4. **Get Feedback**: Receive real-time AI feedback and emotion analysis
5. **Track Progress**: View your performance in the dashboard

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## 📈 Performance

- FastAPI for high-performance backend
- React with optimized rendering
- Efficient database queries
- Caching for better performance
- Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](DEPLOYMENT.md)
2. Review the API documentation at http://localhost:8000/docs
3. Create an issue on GitHub

## 🎉 Acknowledgments

- OpenAI for AI capabilities
- FastAPI for the excellent backend framework
- React team for the amazing frontend library
- Tailwind CSS for beautiful styling

---

**Made with ❤️ for better interview preparation**
