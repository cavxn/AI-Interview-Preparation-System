from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
import os

# Import our modules
from database import get_db, init_db
from models import User, InterviewSession, EmotionData
from schemas import (
    UserCreate, UserLogin, UserResponse, Token, GoogleUserInfo,
    EmotionAnalysisRequest, EmotionAnalysisResponse,
    SessionCreate, SessionUpdate, SessionResponse, SessionSummary,
    DashboardStats
)
from routers.auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

# Initialize FastAPI app
app = FastAPI(title="AI Interview Coach API", version="1.0.0")

# Security
security = HTTPBearer()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Authentication dependencies
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_identifier = payload.get("sub")  # Can be email or Google ID
        auth_type = payload.get("auth_type", "email")  # "email" or "google"
        
        if user_identifier is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Find user by email or Google ID based on auth type
    if auth_type == "google":
        user = db.query(User).filter(User.google_id == user_identifier).first()
    else:
        user = db.query(User).filter(User.email == user_identifier).first()
    
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.get("/")
async def root():
    return {"message": "AI Interview Coach API", "status": "running"}

@app.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "auth_type": "email"})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/google-login", response_model=Token)
async def google_login(google_user: GoogleUserInfo, db: Session = Depends(get_db)):
    """Handle Google OAuth login"""
    try:
        print(f"Google login attempt for: {google_user.email}")
        
        # Check if user exists by Google ID
        user = db.query(User).filter(User.google_id == google_user.sub).first()
        
        if not user:
            # Check if user exists by email (in case they signed up with email first)
            existing_user = db.query(User).filter(User.email == google_user.email).first()
            if existing_user:
                # Link Google ID to existing user
                existing_user.google_id = google_user.sub
                existing_user.name = google_user.name  # Update name from Google
                db.commit()
                user = existing_user
                print(f"Linked Google ID to existing user: {user.email}")
            else:
                # Create new user with Google ID
                user = User(
                    name=google_user.name,
                    email=google_user.email,
                    google_id=google_user.sub,
                    hashed_password=None  # No password for Google users
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                print(f"Created new Google user: {user.email}")
        
        # Create token with Google ID
        access_token = create_access_token(data={"sub": user.google_id, "auth_type": "google"})
        print(f"Google login successful for: {user.email}")
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        print(f"Google login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google login failed: {str(e)}"
        )

@app.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Simple emotion analysis without model loading
@app.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_emotion(
    analysis_request: EmotionAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Simple emotion analysis without model loading"""
    try:
        # Return mock emotion data for now
        return EmotionAnalysisResponse(
            emotion="Neutral",
            confidence=0.7,
            eye_contact_score=0.8,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing emotion: {str(e)}"
        )

# Session management
@app.post("/sessions", response_model=SessionResponse)
async def create_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new interview session"""
    db_session = InterviewSession(
        user_id=current_user.id,
        start_time=datetime.utcnow()
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return db_session

@app.put("/sessions/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: int,
    session_update: SessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update session with end data and summary"""
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Update session fields
    for field, value in session_update.dict(exclude_unset=True).items():
        setattr(session, field, value)
    
    db.commit()
    db.refresh(session)
    
    return session

@app.get("/sessions", response_model=List[SessionResponse])
async def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sessions for the current user"""
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.start_time.desc()).all()
    
    return sessions

@app.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for the user"""
    # Get user's sessions
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.start_time.desc()).limit(10).all()
    
    # Calculate statistics
    total_sessions = len(sessions)
    average_confidence = 0.0
    best_emotion = "Neutral"
    
    if sessions:
        # Calculate average confidence from completed sessions
        completed_sessions = [s for s in sessions if s.average_confidence is not None]
        if completed_sessions:
            average_confidence = sum(s.average_confidence for s in completed_sessions) / len(completed_sessions)
            
            # Find most common emotion
            emotion_counts = {}
            for session in completed_sessions:
                if session.dominant_emotion:
                    emotion_counts[session.dominant_emotion] = emotion_counts.get(session.dominant_emotion, 0) + 1
            
            if emotion_counts:
                best_emotion = max(emotion_counts, key=emotion_counts.get)
    
    return DashboardStats(
        total_sessions=total_sessions,
        average_confidence=average_confidence,
        best_emotion=best_emotion,
        recent_sessions=sessions
    )

# Mock LLM endpoints for now
@app.post("/analyze-answer")
async def analyze_answer(
    question: str,
    answer: str,
    current_user: User = Depends(get_current_user)
):
    """Mock analyze interview answer"""
    return {
        "status": "success",
        "analysis": {
            "score": 75,
            "overall_feedback": "Good response with room for improvement",
            "strengths": ["Clear communication", "Relevant examples"],
            "improvements": ["Add more specific details", "Use STAR method"]
        },
        "timestamp": datetime.utcnow().isoformat()
    }

from pydantic import BaseModel

class QuestionRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    count: int = 5

@app.post("/generate-questions")
async def generate_questions(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate interview questions using LLM"""
    try:
        # Import LLM service
        from llm_service import llm_service
        
        # Generate questions using LLM
        questions = llm_service.generate_interview_questions(request.topic, request.difficulty, request.count)
        
        return {
            "status": "success",
            "topic": request.topic,
            "difficulty": request.difficulty,
            "questions": questions,
            "count": len(questions)
        }
    except Exception as e:
        print(f"Error generating questions: {e}")
        # Fallback to mock questions
        mock_questions = [
            f"Tell me about your experience with {request.topic}",
            f"How do you approach {request.topic} challenges?",
            f"What's your biggest {request.topic} achievement?",
            f"How do you stay updated with {request.topic} trends?",
            f"Describe a difficult {request.topic} problem you solved",
            f"What are the key skills needed for {request.topic}?",
            f"How do you handle {request.topic} project management?",
            f"What's your approach to {request.topic} problem-solving?"
        ]
        
        return {
            "status": "success",
            "topic": request.topic,
            "difficulty": request.difficulty,
            "questions": mock_questions[:request.count],
            "count": len(mock_questions[:request.count])
        }

@app.post("/analyze-comprehensive")
async def analyze_comprehensive(
    question: str,
    answer: str,
    emotion_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Comprehensive analysis using LLM"""
    try:
        # Import LLM service
        from llm_service import llm_service
        
        # Use real LLM analysis
        analysis = llm_service.analyze_comprehensive_response(question, answer, emotion_data)
        
        return {
            "status": "success",
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Error in comprehensive analysis: {e}")
        # Fallback to mock analysis
        return {
            "status": "success",
            "analysis": {
                "overall_score": 80,
                "communication_score": 85,
                "confidence_score": 75,
                "emotional_stability": 80,
                "overall_feedback": "Strong response with good emotional composure",
                "strengths": ["Clear communication", "Good examples", "Confident delivery"],
                "improvements": ["Add more specific metrics", "Use more technical terms"],
                "emotional_insights": "You showed good confidence and engagement during the response",
                "specific_suggestions": ["Practice with more technical questions", "Work on eye contact"]
            },
            "timestamp": datetime.utcnow().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)