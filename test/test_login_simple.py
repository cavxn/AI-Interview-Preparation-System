#!/usr/bin/env python3
"""
Simple login test to isolate the issue
"""
import sys
import os
sys.path.append('backend')

from backend.database import get_db
from backend.models import User
from backend.routers.auth import verify_password, create_access_token

def test_login_logic():
    """Test the login logic directly"""
    print("🔐 Testing login logic...")
    
    try:
        # Get database connection
        db = next(get_db())
        
        # Find user
        user = db.query(User).filter(User.email == "test@example.com").first()
        print(f"👤 Found user: {user.name if user else 'None'}")
        
        if not user:
            print("❌ User not found")
            return False
        
        # Test password verification
        password = "password123"
        is_valid = verify_password(password, user.hashed_password)
        print(f"🔑 Password valid: {is_valid}")
        
        if not is_valid:
            print("❌ Password verification failed")
            return False
        
        # Test token creation
        token = create_access_token(data={"sub": user.email})
        print(f"🎫 Token created: {token[:20]}...")
        
        print("✅ Login logic works!")
        return True
        
    except Exception as e:
        print(f"❌ Login logic error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        try:
            db.close()
        except:
            pass

if __name__ == "__main__":
    success = test_login_logic()
    sys.exit(0 if success else 1)
