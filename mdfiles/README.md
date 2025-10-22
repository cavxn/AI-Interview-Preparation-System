# AI Interview System

A comprehensive AI-powered interview training platform with real-time emotion detection, performance analytics, and personalized coaching.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Modern Dashboard**: Comprehensive analytics and progress tracking
- **Real-time Interview Practice**: AI-powered interview sessions
- **Achievement System**: Gamified learning with badges and streaks
- **Goal Setting**: Personal goal tracking and progress monitoring
- **Performance Analytics**: Detailed insights and trend analysis
- **Responsive Design**: Works on desktop and mobile devices

### Backend (FastAPI + SQLite)
- **RESTful API**: Clean and well-documented endpoints
- **Authentication**: Secure JWT-based authentication
- **Emotion Detection**: Real-time facial emotion analysis
- **Session Management**: Track and analyze interview sessions
- **Database**: SQLite with SQLAlchemy ORM

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (animations)
- React Router (navigation)
- Lucide React (icons)
- React OAuth Google (authentication)

### Backend
- FastAPI
- SQLAlchemy (ORM)
- SQLite (database)
- JWT (authentication)
- OpenCV (emotion detection)
- TensorFlow (AI models)

## 🚀 Quick Start

### Option 1: Full System (Recommended)
```bash
# Start both backend and frontend
./start-full-system.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_mock_data.py  # Initialize with test data
python main.py
```

#### Frontend Setup
```bash
cd new-frontend
npm install
npm start
```

## 📊 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /me` - Get current user

### Interview Sessions
- `POST /sessions` - Create new session
- `GET /sessions` - Get user sessions
- `PUT /sessions/{id}` - Update session
- `GET /sessions/{id}/summary` - Get session details

### Analytics
- `GET /dashboard` - Dashboard statistics
- `POST /analyze` - Emotion analysis
- `POST /analyze-answer` - Answer analysis

## 🎯 Usage

1. **Sign Up/Login**: Create an account or login
2. **Dashboard**: View your progress and statistics
3. **Start Interview**: Begin a practice session
4. **Track Progress**: Monitor your improvement over time
5. **Set Goals**: Create and track personal objectives
6. **Earn Achievements**: Unlock badges for milestones

## 🧪 Testing

### Backend Testing
```bash
python test_backend.py
```

### Frontend Testing
```bash
cd new-frontend
npm test
```

## 📁 Project Structure

```
ai-interview-system/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── routers/             # API routers
│   ├── init_mock_data.py    # Mock data initialization
│   └── requirements.txt     # Python dependencies
├── new-frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   └── utils/           # Utility functions
│   └── package.json         # Node dependencies
├── start-full-system.sh     # Full system startup
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./app.db
```

### Database
The system uses SQLite by default. To use PostgreSQL:
1. Update `DATABASE_URL` in `database.py`
2. Install PostgreSQL dependencies
3. Run database migrations

## 🚀 Deployment

### Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Serve static files with backend
3. Configure production database
4. Set up reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the code comments and documentation

## 🎉 Acknowledgments

- FastAPI for the excellent backend framework
- React and Tailwind CSS for the frontend
- TensorFlow for AI capabilities
- The open-source community for inspiration