#!/usr/bin/env python3
"""
Initialize database with mock data for testing
"""

from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, InterviewSession, EmotionData
from routers.auth import hash_password
from datetime import datetime, timedelta
import random

def create_mock_data():
    """Create mock data for testing"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_user = db.query(User).first()
        if existing_user:
            print("Mock data already exists. Skipping...")
            return
        
        # Create test user
        test_user = User(
            name="Test User",
            email="test@example.com",
            hashed_password=hash_password("password123"),
            created_at=datetime.utcnow()
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"Created test user: {test_user.email}")
        
        # Create mock interview sessions
        emotions = ["Happy", "Neutral", "Confident", "Focused", "Calm"]
        sessions_data = [
            {
                "start_time": datetime.utcnow() - timedelta(days=7),
                "duration_seconds": 1800,  # 30 minutes
                "average_confidence": 0.75,
                "dominant_emotion": "Confident",
                "total_questions": 5,
                "session_summary": "Great session! Showed excellent confidence and communication skills."
            },
            {
                "start_time": datetime.utcnow() - timedelta(days=5),
                "duration_seconds": 2100,  # 35 minutes
                "average_confidence": 0.82,
                "dominant_emotion": "Happy",
                "total_questions": 6,
                "session_summary": "Outstanding performance! Demonstrated strong leadership qualities."
            },
            {
                "start_time": datetime.utcnow() - timedelta(days=3),
                "duration_seconds": 1500,  # 25 minutes
                "average_confidence": 0.68,
                "dominant_emotion": "Focused",
                "total_questions": 4,
                "session_summary": "Good session with room for improvement in technical questions."
            },
            {
                "start_time": datetime.utcnow() - timedelta(days=1),
                "duration_seconds": 2400,  # 40 minutes
                "average_confidence": 0.88,
                "dominant_emotion": "Confident",
                "total_questions": 7,
                "session_summary": "Excellent session! Perfect balance of technical and behavioral responses."
            }
        ]
        
        sessions = []
        for session_data in sessions_data:
            session = InterviewSession(
                user_id=test_user.id,
                **session_data
            )
            db.add(session)
            db.commit()
            db.refresh(session)
            sessions.append(session)
            print(f"Created session {session.id}")
        
        # Create mock emotion data for each session
        for session in sessions:
            # Create 10-15 emotion data points per session
            num_points = random.randint(10, 15)
            session_start = session.start_time
            
            for i in range(num_points):
                # Random time within the session
                timestamp = session_start + timedelta(seconds=random.randint(0, session.duration_seconds or 1800))
                
                emotion_data = EmotionData(
                    user_id=test_user.id,
                    session_id=session.id,
                    emotion=random.choice(emotions),
                    confidence=random.uniform(0.6, 0.95),
                    eye_contact_score=random.uniform(0.7, 0.95),
                    timestamp=timestamp
                )
                db.add(emotion_data)
            
            db.commit()
            print(f"Created emotion data for session {session.id}")
        
        print("Mock data creation completed successfully!")
        
    except Exception as e:
        print(f"Error creating mock data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database with mock data...")
    init_db()
    create_mock_data()
    print("Done!")
