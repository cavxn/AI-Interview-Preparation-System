#!/usr/bin/env python3
"""
Check database and user table
"""
import sys
import os
sys.path.append('backend')

from backend.database import get_db, init_db
from backend.models import User

def check_database():
    """Check database and user table"""
    print("🔍 Checking database...")
    
    try:
        # Initialize database
        init_db()
        print("✅ Database initialized")
        
        # Get database connection
        db = next(get_db())
        print("✅ Database connection established")
        
        # Check if users table exists and has data
        users = db.query(User).all()
        print(f"📊 Found {len(users)} users in database")
        
        for user in users:
            print(f"   👤 User: {user.name} ({user.email}) - ID: {user.id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        try:
            db.close()
        except:
            pass

if __name__ == "__main__":
    success = check_database()
    sys.exit(0 if success else 1)
