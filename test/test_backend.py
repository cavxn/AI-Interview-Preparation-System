#!/usr/bin/env python3
"""
Test backend endpoints
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_backend():
    """Test backend endpoints"""
    print("Testing backend endpoints...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
        
        # Test signup
        signup_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/signup", json=signup_data)
            print(f"Signup: {response.status_code}")
            if response.status_code == 200:
                print("User created successfully")
            elif response.status_code == 400:
                print("User already exists (expected)")
        except Exception as e:
            print(f"Signup error: {e}")
        
        # Test login
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Login: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test dashboard
            response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
            print(f"Dashboard: {response.status_code}")
            if response.status_code == 200:
                dashboard_data = response.json()
                print(f"Dashboard data: {json.dumps(dashboard_data, indent=2)}")
            else:
                print(f"Dashboard error: {response.text}")
            
            # Test sessions
            response = requests.get(f"{BASE_URL}/sessions", headers=headers)
            print(f"Sessions: {response.status_code}")
            if response.status_code == 200:
                sessions_data = response.json()
                print(f"Sessions count: {len(sessions_data)}")
        
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running. Please start the backend server.")
    except Exception as e:
        print(f"❌ Error testing backend: {e}")

if __name__ == "__main__":
    test_backend()
