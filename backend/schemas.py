from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    google_id: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleUserInfo(BaseModel):
    sub: str  # Google ID
    name: str
    email: EmailStr
    picture: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Emotion analysis schemas
class EmotionAnalysisRequest(BaseModel):
    frame_data: str  # base64 encoded image
    session_id: Optional[int] = None

class EmotionAnalysisResponse(BaseModel):
    emotion: str
    confidence: float
    eye_contact_score: float
    timestamp: datetime

# Session schemas
class SessionCreate(BaseModel):
    start_time: Optional[datetime] = None

class SessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    average_confidence: Optional[float] = None
    dominant_emotion: Optional[str] = None
    total_questions: Optional[int] = None
    session_summary: Optional[str] = None

class SessionResponse(BaseModel):
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime]
    duration_seconds: Optional[int]
    average_confidence: Optional[float]
    dominant_emotion: Optional[str]
    total_questions: int
    session_summary: Optional[str]
    
    class Config:
        from_attributes = True

class SessionSummary(BaseModel):
    session_id: int
    start_time: datetime
    duration_seconds: Optional[int] = 0
    average_confidence: Optional[float] = 0.0
    dominant_emotion: Optional[str] = "Neutral"
    total_questions: Optional[int] = 0
    emotion_timeline: List[EmotionAnalysisResponse] = []
    session_summary: Optional[str] = "No summary available"

# Dashboard schemas
class DashboardStats(BaseModel):
    total_sessions: int
    average_confidence: float
    best_emotion: str
    recent_sessions: List[SessionResponse]

class QuestionRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    count: int = 5
