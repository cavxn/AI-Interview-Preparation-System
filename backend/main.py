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
    DashboardStats, QuestionRequest
)
from pydantic import BaseModel
from routers.auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM
# from emotion_detector import emotion_detector
from llm_service import llm_service

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

@app.post("/test-analyze")
async def test_analyze(request: dict):
    """Test endpoint for comprehensive analysis without authentication"""
    import random
    
    try:
        question = request.get('question', 'Test question')
        answer = request.get('answer', 'Test answer')
        emotion_data = request.get('emotion_data', {})
        
        # Generate random analysis
        overall_score = random.randint(72, 94)
        
        analysis = {
            "overall_score": overall_score,
            "communication_score": random.randint(70, 95),
            "confidence_score": random.randint(75, 90),
            "emotional_stability": random.randint(78, 92),
            "overall_feedback": f"Great job! You scored {overall_score}/100.",
            "strengths": ["Good communication", "Clear answers"],
            "improvements": ["Add more examples"],
            "emotional_insights": f"Emotion: {emotion_data.get('emotion', 'Neutral')}",
            "specific_suggestions": ["Keep practicing"]
        }
        
        return {
            "status": "success",
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/test-generate-questions")
async def test_generate_questions(request: QuestionRequest):
    """Test endpoint for question generation without authentication"""
    try:
        # Try to use LLM service first
        questions = llm_service.generate_interview_questions(request.topic, request.difficulty, request.count)
        
        if questions and len(questions) > 0:
            return {
                "status": "success",
                "topic": request.topic,
                "difficulty": request.difficulty,
                "questions": questions,
                "count": len(questions)
            }
        else:
            # Fallback to mock questions if LLM fails
            mock_questions = [
                f"Tell me about your experience with {request.topic}",
                f"What challenges have you faced in {request.topic}?",
                f"How do you stay updated with {request.topic} trends?",
                f"Describe a project where you used {request.topic}",
                f"What is your approach to learning new {request.topic} concepts?",
                f"How do you handle complex {request.topic} problems?",
                f"What are the key principles of {request.topic}?",
                f"Describe a time when you had to troubleshoot {request.topic} issues?"
            ]
            
            return {
                "status": "success",
                "topic": request.topic,
                "difficulty": request.difficulty,
                "questions": mock_questions[:request.count],
                "count": len(mock_questions[:request.count])
            }
        
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        # Fallback to mock questions on error
        mock_questions = [
            f"Tell me about your experience with {request.topic}",
            f"What challenges have you faced in {request.topic}?",
            f"How do you stay updated with {request.topic} trends?",
            f"Describe a project where you used {request.topic}",
            f"What is your approach to learning new {request.topic} concepts?",
            f"How do you handle complex {request.topic} problems?",
            f"What are the key principles of {request.topic}?",
            f"Describe a time when you had to troubleshoot {request.topic} issues?"
        ]
        
        return {
            "status": "success",
            "topic": request.topic,
            "difficulty": request.difficulty,
            "questions": mock_questions[:request.count],
            "count": len(mock_questions[:request.count])
        }

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

@app.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_emotion(
    analysis_request: EmotionAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Hardcoded emotion analysis with random scoring"""
    import random
    
    try:
        print(f"Analyzing emotion for user {current_user.id}, session {analysis_request.session_id}")
        
        # Generate random but realistic emotion data
        emotions = ["Happy", "Neutral", "Confident", "Focused", "Calm"]
        emotion = random.choice(emotions)
        
        # Generate random confidence and eye contact scores (higher for better emotions)
        if emotion in ["Happy", "Confident"]:
            confidence = random.uniform(0.7, 0.95)
            eye_contact = random.uniform(0.75, 0.9)
        elif emotion == "Focused":
            confidence = random.uniform(0.65, 0.85)
            eye_contact = random.uniform(0.8, 0.95)
        else:  # Neutral, Calm
            confidence = random.uniform(0.6, 0.8)
            eye_contact = random.uniform(0.7, 0.85)
        
        result = {
            "emotion": emotion,
            "confidence": round(confidence, 2),
            "eye_contact_score": round(eye_contact, 2)
        }
        
        print(f"Generated emotion analysis result: {result}")
        
        # Create emotion data record
        emotion_data = EmotionData(
            user_id=current_user.id,
            session_id=analysis_request.session_id,
            emotion=result["emotion"],
            confidence=result["confidence"],
            eye_contact_score=result["eye_contact_score"]
        )
        
        db.add(emotion_data)
        db.commit()
        db.refresh(emotion_data)
        
        print(f"Emotion data saved with ID: {emotion_data.id}")
        
        return EmotionAnalysisResponse(
            emotion=result["emotion"],
            confidence=result["confidence"],
            eye_contact_score=result["eye_contact_score"],
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        print(f"Error in emotion analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing emotion: {str(e)}"
        )

@app.post("/sessions", response_model=SessionResponse)
async def create_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new interview session"""
    print(f"Creating session for user {current_user.id}")
    
    try:
        db_session = InterviewSession(
            user_id=current_user.id,
            start_time=datetime.utcnow()
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        print(f"Session created with ID: {db_session.id}")
        return db_session
    except Exception as e:
        print(f"Error creating session: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating session: {str(e)}"
        )

@app.put("/sessions/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: int,
    session_update: SessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update session with end data and random scoring"""
    import random
    
    print(f"Updating session {session_id} for user {current_user.id}")
    print(f"Update data: {session_update.dict()}")
    
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    
    if not session:
        print(f"Session {session_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Generate random scores for the session
    random_confidence = round(random.uniform(0.65, 0.92), 2)
    random_emotion = random.choice(["Happy", "Confident", "Focused", "Neutral", "Calm"])
    
    # Update session fields
    update_data = session_update.dict(exclude_unset=True)
    
    # Always add random scoring (override any existing values)
    update_data['average_confidence'] = random_confidence
    update_data['dominant_emotion'] = random_emotion
    
    # Generate session summary
    total_questions = update_data.get('total_questions', 0)
    confidence_percent = int(random_confidence * 100)
    update_data['session_summary'] = f"Completed {total_questions} questions with {confidence_percent}% average confidence. Dominant emotion: {random_emotion}."
    
    for field, value in update_data.items():
        print(f"Setting {field} = {value}")
        setattr(session, field, value)
    
    db.commit()
    db.refresh(session)
    
    print(f"Session {session_id} updated successfully with random scores: confidence={random_confidence}, emotion={random_emotion}")
    print(f"Updated session data: average_confidence={session.average_confidence}, dominant_emotion={session.dominant_emotion}")
    
    # Return the updated session with all fields
    return SessionResponse(
        id=session.id,
        user_id=session.user_id,
        start_time=session.start_time,
        end_time=session.end_time,
        duration_seconds=session.duration_seconds,
        average_confidence=session.average_confidence,
        dominant_emotion=session.dominant_emotion,
        total_questions=session.total_questions,
        session_summary=session.session_summary
    )

@app.get("/sessions/{session_id}/summary")
async def get_session_summary(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed summary of a specific session"""
    print(f"Getting session summary for session {session_id}, user {current_user.id}")
    
    # First check if session exists at all
    all_sessions = db.query(InterviewSession).all()
    print(f"All sessions in database: {[(s.id, s.user_id) for s in all_sessions]}")
    
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == current_user.id
    ).first()
    
    print(f"Found session: {session}")
    if session:
        print(f"Session details: id={session.id}, user_id={session.user_id}, start_time={session.start_time}")
    
    if not session:
        print(f"Session {session_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get emotion timeline for this session
    emotions = db.query(EmotionData).filter(
        EmotionData.session_id == session_id
    ).order_by(EmotionData.timestamp).all()
    
    emotion_timeline = [
        {
            "emotion": emotion.emotion,
            "confidence": emotion.confidence,
            "eye_contact_score": emotion.eye_contact_score,
            "timestamp": emotion.timestamp.isoformat()
        } for emotion in emotions
    ]
    
    return {
        "session_id": session.id,
        "start_time": session.start_time.isoformat(),
        "duration_seconds": session.duration_seconds or 0,
        "average_confidence": session.average_confidence or 0.0,
        "dominant_emotion": session.dominant_emotion or "Neutral",
        "total_questions": session.total_questions or 0,
        "emotion_timeline": emotion_timeline,
        "session_summary": session.session_summary or "No summary available"
    }

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
    print(f"Getting dashboard stats for user {current_user.id}")
    
    # Get user's sessions
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.start_time.desc()).limit(10).all()
    
    print(f"Found {len(sessions)} sessions for user {current_user.id}")
    
    # Calculate statistics
    total_sessions = len(sessions)
    average_confidence = 0.0
    best_emotion = "Neutral"
    
    if sessions:
        # Calculate average confidence from completed sessions
        completed_sessions = [s for s in sessions if s.average_confidence is not None]
        print(f"Found {len(completed_sessions)} completed sessions")
        
        if completed_sessions:
            average_confidence = sum(s.average_confidence for s in completed_sessions) / len(completed_sessions)
            print(f"Average confidence: {average_confidence}")
            
            # Find most common emotion
            emotion_counts = {}
            for session in completed_sessions:
                if session.dominant_emotion:
                    emotion_counts[session.dominant_emotion] = emotion_counts.get(session.dominant_emotion, 0) + 1
            
            if emotion_counts:
                best_emotion = max(emotion_counts, key=emotion_counts.get)
                print(f"Best emotion: {best_emotion}")
    
    stats = DashboardStats(
        total_sessions=total_sessions,
        average_confidence=average_confidence,
        best_emotion=best_emotion,
        recent_sessions=sessions
    )
    
    print(f"Returning dashboard stats: {stats}")
    return stats

@app.post("/analyze-answer")
async def analyze_answer(
    question: str,
    answer: str,
    current_user: User = Depends(get_current_user)
):
    """Analyze interview answer using LLM"""
    try:
        # Use LLM service to analyze the response
        # analysis = llm_service.analyze_interview_response(question, answer)
        # Generate follow-up questions
        # follow_up_questions = llm_service.generate_follow_up_questions(question, answer)
        
        # Temporary mock analysis for testing
        analysis = {
            "overall_score": 75,
            "strengths": ["Good communication", "Clear structure"],
            "improvements": ["Add more examples", "Be more specific"],
            "overall_feedback": "Good answer with room for improvement."
        }
        follow_up_questions = [
            "Can you provide a specific example?",
            "How would you handle this situation differently?"
        ]
        
        return {
            "status": "success",
            "analysis": analysis,
            "follow_up_questions": follow_up_questions,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing answer: {str(e)}"
        )

@app.post("/generate-questions")
async def generate_questions(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate interview questions for a specific topic"""
    try:
        # Try to use LLM service first
        questions = llm_service.generate_interview_questions(request.topic, request.difficulty, request.count)
        
        if questions and len(questions) > 0:
            return {
                "status": "success",
                "topic": request.topic,
                "difficulty": request.difficulty,
                "questions": questions,
                "count": len(questions)
            }
        else:
            # Fallback to mock questions if LLM fails
            mock_questions = [
                f"Tell me about your experience with {request.topic}",
                f"What challenges have you faced in {request.topic}?",
                f"How do you stay updated with {request.topic} trends?",
                f"Describe a project where you used {request.topic}",
                f"What is your approach to learning new {request.topic} concepts?",
                f"How do you handle complex {request.topic} problems?",
                f"What are the key principles of {request.topic}?",
                f"Describe a time when you had to troubleshoot {request.topic} issues?"
            ]
            
            return {
                "status": "success",
                "topic": request.topic,
                "difficulty": request.difficulty,
                "questions": mock_questions[:request.count],
                "count": len(mock_questions[:request.count])
            }
        
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        # Fallback to mock questions on error
        mock_questions = [
            f"Tell me about your experience with {request.topic}",
            f"What challenges have you faced in {request.topic}?",
            f"How do you stay updated with {request.topic} trends?",
            f"Describe a project where you used {request.topic}",
            f"What is your approach to learning new {request.topic} concepts?",
            f"How do you handle complex {request.topic} problems?",
            f"What are the key principles of {request.topic}?",
            f"Describe a time when you had to troubleshoot {request.topic} issues?"
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
    request: dict,
    current_user: User = Depends(get_current_user)
):
    """Comprehensive analysis with random scoring and hardcoded feedback"""
    import random
    
    try:
        # Extract data from request
        question = request.get('question', '')
        answer = request.get('answer', '')
        emotion_data = request.get('emotion_data', {})
        # Generate random but realistic analysis scores
        overall_score = random.randint(72, 94)
        communication_score = random.randint(70, 95)
        confidence_score = random.randint(75, 90)
        emotional_stability = random.randint(78, 92)
        
        # Generate random feedback based on score ranges
        if overall_score >= 85:
            feedback_templates = [
                "Excellent answer! You demonstrated strong communication skills and provided relevant examples.",
                "Outstanding response! Your answer was well-structured and showed great confidence.",
                "Great job! You provided clear, detailed answers with good examples."
            ]
            strengths = [
                "Excellent communication skills",
                "Clear and structured responses", 
                "Strong use of specific examples",
                "Good confidence level"
            ]
            improvements = [
                "Continue building on your strengths",
                "Consider expanding on technical details"
            ]
        elif overall_score >= 75:
            feedback_templates = [
                "Good answer with room for improvement. Consider adding more specific examples.",
                "Solid response! You showed good understanding with some areas to enhance.",
                "Well done! Your answer was clear but could benefit from more detail."
            ]
            strengths = [
                "Good communication skills",
                "Clear understanding of the topic",
                "Attempted to provide examples"
            ]
            improvements = [
                "Provide more specific examples",
                "Add more detail to your response",
                "Use the STAR method (Situation, Task, Action, Result)"
            ]
        else:
            feedback_templates = [
                "Your answer could be stronger. Try to be more specific and provide concrete examples.",
                "There's room for improvement. Focus on providing more detailed responses.",
                "Consider expanding your answer with specific examples and more detail."
            ]
            strengths = [
                "Attempted to answer the question",
                "Showed engagement"
            ]
            improvements = [
                "Provide more specific examples",
                "Add more detail to your response",
                "Use the STAR method (Situation, Task, Action, Result)",
                "Practice speaking more confidently"
            ]
        
        analysis = {
            "overall_score": overall_score,
            "communication_score": communication_score,
            "confidence_score": confidence_score,
            "emotional_stability": emotional_stability,
            "overall_feedback": random.choice(feedback_templates),
            "strengths": strengths,
            "improvements": improvements,
            "emotional_insights": f"Your emotional state shows {emotion_data.get('emotion', 'Neutral')} with {int(emotion_data.get('confidence', 0.75) * 100)}% confidence. This indicates good composure during the interview.",
            "specific_suggestions": [
                "Try to include specific examples from your experience",
                "Structure your answer with clear points",
                "Practice speaking more confidently",
                "Maintain good eye contact with the interviewer"
            ]
        }
        
        print(f"Generated comprehensive analysis with scores: overall={overall_score}, communication={communication_score}")
        
        return {
            "status": "success",
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"Error in comprehensive analysis: {str(e)}")
        # Fallback to basic analysis
        analysis = {
            "overall_score": 75,
            "communication_score": 70,
            "confidence_score": 75,
            "emotional_stability": 80,
            "overall_feedback": "Good response with room for improvement. Consider adding more specific examples.",
            "strengths": ["Attempted to answer the question", "Showed engagement"],
            "improvements": [
                "Provide more specific examples",
                "Add more detail to your response",
                "Use the STAR method (Situation, Task, Action, Result)"
            ],
            "emotional_insights": f"Your emotional state shows {emotion_data.get('emotion', 'Neutral')} with good confidence.",
            "specific_suggestions": [
                "Try to include specific examples from your experience",
                "Structure your answer with clear points",
                "Practice speaking more confidently"
            ]
        }
        
        return {
            "status": "success",
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
