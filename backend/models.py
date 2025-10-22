from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    google_id = Column(String, unique=True, index=True, nullable=True)  # Google ID for OAuth
    hashed_password = Column(String, nullable=True)  # Optional for Google users
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    sessions = relationship("InterviewSession", back_populates="user")
    emotions = relationship("EmotionData", back_populates="user")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    duration_seconds = Column(Integer)
    average_confidence = Column(Float)
    dominant_emotion = Column(String)
    total_questions = Column(Integer, default=0)
    session_summary = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    emotions = relationship("EmotionData", back_populates="session")

class EmotionData(Base):
    __tablename__ = "emotion_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    emotion = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    eye_contact_score = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="emotions")
    session = relationship("InterviewSession", back_populates="emotions")
