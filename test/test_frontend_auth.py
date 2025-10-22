#!/usr/bin/env python3
"""
Test frontend authentication flow
"""
import requests
import json

def test_frontend_auth_flow():
    """Test the authentication flow that the frontend uses"""
    base_url = "http://127.0.0.1:8000"
    
    print("🔐 Testing Frontend Authentication Flow...")
    
    # Step 1: Login (as frontend would)
    print("\n1️⃣ Testing login...")
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/login", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"   ❌ Login failed: {response.text}")
            return False
        
        data = response.json()
        token = data.get('access_token')
        print(f"   ✅ Login successful!")
        print(f"   Token: {token[:20]}...")
        
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False
    
    # Step 2: Test session creation (as frontend would)
    print("\n2️⃣ Testing session creation...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{base_url}/sessions", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"   ❌ Session creation failed: {response.text}")
            return False
        
        session_data = response.json()
        session_id = session_data.get('id')
        print(f"   ✅ Session created successfully!")
        print(f"   Session ID: {session_id}")
        
    except Exception as e:
        print(f"   ❌ Session creation error: {e}")
        return False
    
    # Step 3: Test without authentication (should fail)
    print("\n3️⃣ Testing session creation without auth...")
    
    try:
        response = requests.post(f"{base_url}/sessions")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 403:
            print(f"   ✅ Correctly rejected unauthenticated request")
        else:
            print(f"   ❌ Should have been rejected: {response.text}")
            return False
        
    except Exception as e:
        print(f"   ❌ Error testing unauthenticated request: {e}")
        return False
    
    print("\n🎉 Frontend authentication flow test PASSED! 🚀")
    return True

if __name__ == "__main__":
    success = test_frontend_auth_flow()
    exit(0 if success else 1)
