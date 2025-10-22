#!/usr/bin/env python3
"""
Initialize a fresh database with correct schema
"""
import sys
import os
sys.path.append('.')

from database import get_db, init_db
from models import User
from routers.auth import hash_password

def init_fresh_database():
    """Initialize a fresh database with correct schema"""
    print("🗄️ Initializing fresh database...")
    
    try:
        # Initialize database (this will create the tables with correct schema)
        init_db()
        print("✅ Database initialized with correct schema")
        
        # Get database connection
        db = next(get_db())
        
        # Create test user with correct schema (shorter password to avoid bcrypt limit)
        test_user = User(
            name="Test User",
            email="test@example.com",
            hashed_password=hash_password("test123")
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print(f"   Email: test@example.com")
        print(f"   Password: test123")
        print(f"   User ID: {test_user.id}")
        
        # Verify the user was created correctly
        user_check = db.query(User).filter(User.email == "test@example.com").first()
        if user_check:
            print("✅ User verification successful!")
            print(f"   Name: {user_check.name}")
            print(f"   Email: {user_check.email}")
            print(f"   Hashed Password: {user_check.hashed_password[:20]}...")
        else:
            print("❌ User verification failed!")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        try:
            db.close()
        except:
            pass

if __name__ == "__main__":
    success = init_fresh_database()
    sys.exit(0 if success else 1)
