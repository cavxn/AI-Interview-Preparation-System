#!/usr/bin/env python3
"""
Create a test user directly in the database
"""

import sys
import os
sys.path.append('backend')

from backend.database import SessionLocal
from backend.models import User
from backend.routers.auth import hash_password
from datetime import datetime

def create_test_user():
    """Create a test user in the database"""
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if existing_user:
            print("✅ Test user already exists")
            print(f"Name: {existing_user.name}")
            print(f"Email: {existing_user.email}")
            print(f"ID: {existing_user.id}")
            return existing_user
        
        # Create new test user
        test_user = User(
            name="Test User",
            email="test@example.com",
            hashed_password=hash_password("password123"),
            created_at=datetime.utcnow()
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print(f"Name: {test_user.name}")
        print(f"Email: {test_user.email}")
        print(f"ID: {test_user.id}")
        print(f"Password: password123")
        
        return test_user
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
        return None
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()