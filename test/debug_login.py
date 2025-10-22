#!/usr/bin/env python3
"""
Debug login issue
"""

import requests
import json
import traceback

BASE_URL = "http://127.0.0.1:8000"

def debug_login():
    """Debug the login process"""
    print("🔍 Debugging Login Process")
    print("=========================")
    
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        print("1. Testing login endpoint...")
        print(f"URL: {BASE_URL}/login")
        print(f"Data: {json.dumps(login_data, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
        else:
            print("❌ Login failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    debug_login()
