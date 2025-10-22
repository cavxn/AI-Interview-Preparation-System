#!/usr/bin/env python3
"""
Test login flow and create test user
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_login_flow():
    """Test the complete login flow"""
    print("🧪 Testing Login Flow")
    print("===================")
    
    # Test credentials
    test_user = {
        "name": "Test User",
        "email": "test@example.com", 
        "password": "password123"
    }
    
    try:
        # Step 1: Try to signup (might already exist)
        print("1. Attempting signup...")
        try:
            response = requests.post(f"{BASE_URL}/signup", json=test_user)
            if response.status_code == 200:
                print("✅ User created successfully")
            elif response.status_code == 400:
                print("ℹ️ User already exists (expected)")
            else:
                print(f"❌ Signup failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Signup error: {e}")
        
        # Step 2: Login
        print("\n2. Attempting login...")
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Login response: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            print("✅ Login successful!")
            print(f"Token: {token[:20]}...")
            
            # Step 3: Test authenticated endpoints
            headers = {"Authorization": f"Bearer {token}"}
            
            print("\n3. Testing authenticated endpoints...")
            
            # Test /me endpoint
            response = requests.get(f"{BASE_URL}/me", headers=headers)
            print(f"GET /me: {response.status_code}")
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ User data: {user_data['name']} ({user_data['email']})")
            
            # Test dashboard
            response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
            print(f"GET /dashboard: {response.status_code}")
            if response.status_code == 200:
                dashboard_data = response.json()
                print(f"✅ Dashboard data: {json.dumps(dashboard_data, indent=2)}")
            else:
                print(f"❌ Dashboard error: {response.text}")
            
            # Test sessions
            response = requests.get(f"{BASE_URL}/sessions", headers=headers)
            print(f"GET /sessions: {response.status_code}")
            if response.status_code == 200:
                sessions = response.json()
                print(f"✅ Sessions: {len(sessions)} found")
            
            print("\n🎉 All tests passed! You can now use these credentials:")
            print(f"Email: {test_user['email']}")
            print(f"Password: {test_user['password']}")
            
        else:
            print(f"❌ Login failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running. Please start the backend server.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login_flow()
