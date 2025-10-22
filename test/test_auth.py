#!/usr/bin/env python3
"""
Test authentication flow
"""
import requests
import json

def test_auth_flow():
    """Test the complete authentication flow"""
    base_url = "http://127.0.0.1:8000"
    
    print("🔐 Testing Authentication Flow...")
    
    # Test 1: Login
    print("\n1️⃣ Testing login...")
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/login", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful!")
            print(f"   Token: {data.get('access_token', 'No token')[:20]}...")
            token = data.get('access_token')
        else:
            print(f"   ❌ Login failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False
    
    # Test 2: Get current user
    print("\n2️⃣ Testing get current user...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{base_url}/me", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"   ✅ User data retrieved!")
            print(f"   User: {user_data.get('name')} ({user_data.get('email')})")
        else:
            print(f"   ❌ Get user failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Get user error: {e}")
        return False
    
    # Test 3: Create session
    print("\n3️⃣ Testing create session...")
    
    try:
        response = requests.post(f"{base_url}/sessions", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            session_data = response.json()
            print(f"   ✅ Session created!")
            print(f"   Session ID: {session_data.get('id')}")
        else:
            print(f"   ❌ Create session failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Create session error: {e}")
        return False
    
    print("\n✅ All authentication tests passed! 🎉")
    return True

if __name__ == "__main__":
    success = test_auth_flow()
    exit(0 if success else 1)
