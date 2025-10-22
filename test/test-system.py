#!/usr/bin/env python3
"""
AI Interview Coach - System Test Script
Tests the complete system functionality
"""

import requests
import json
import time
import base64
import io
from PIL import Image
import numpy as np

# Configuration
API_BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def create_test_image():
    """Create a simple test image for emotion analysis"""
    # Create a simple colored image
    img = Image.new('RGB', (640, 480), color='red')
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return img_str

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        return False

def test_user_registration():
    """Test user registration"""
    print("\n🧪 Testing user registration...")
    
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/signup", json=user_data)
        if response.status_code == 200:
            print("✅ User registration successful")
            return True
        else:
            print(f"❌ User registration failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User registration error: {e}")
        return False

def test_user_login():
    """Test user login"""
    print("\n🧪 Testing user login...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print("✅ User login successful")
                return data["access_token"]
            else:
                print("❌ No access token in response")
                return None
        else:
            print(f"❌ User login failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ User login error: {e}")
        return None

def test_session_creation(token):
    """Test interview session creation"""
    print("\n🧪 Testing session creation...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{API_BASE_URL}/sessions", json={}, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Session creation successful")
            return data["id"]
        else:
            print(f"❌ Session creation failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Session creation error: {e}")
        return None

def test_emotion_analysis(token, session_id):
    """Test emotion analysis endpoint"""
    print("\n🧪 Testing emotion analysis...")
    
    headers = {"Authorization": f"Bearer {token}"}
    test_image = create_test_image()
    
    analysis_data = {
        "frame_data": test_image,
        "session_id": session_id
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/analyze", json=analysis_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Emotion analysis successful: {data['emotion']} (confidence: {data['confidence']:.2f})")
            return True
        else:
            print(f"❌ Emotion analysis failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Emotion analysis error: {e}")
        return False

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    print("\n🧪 Testing dashboard stats...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE_URL}/dashboard", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboard stats retrieved: {data['total_sessions']} sessions")
            return True
        else:
            print(f"❌ Dashboard stats failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Dashboard stats error: {e}")
        return False

def test_frontend_health():
    """Test if frontend is running"""
    try:
        response = requests.get(FRONTEND_URL)
        if response.status_code == 200:
            print("✅ Frontend is running")
            return True
        else:
            print(f"❌ Frontend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running")
        return False

def main():
    """Run all tests"""
    print("🚀 AI Interview Coach - System Test")
    print("=" * 50)
    
    # Test backend health
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start the backend server first.")
        return
    
    # Test user registration
    if not test_user_registration():
        print("\n❌ User registration failed. Check backend logs.")
        return
    
    # Test user login
    token = test_user_login()
    if not token:
        print("\n❌ User login failed. Check backend logs.")
        return
    
    # Test session creation
    session_id = test_session_creation(token)
    if not session_id:
        print("\n❌ Session creation failed. Check backend logs.")
        return
    
    # Test emotion analysis
    if not test_emotion_analysis(token, session_id):
        print("\n❌ Emotion analysis failed. Check backend logs.")
        return
    
    # Test dashboard stats
    if not test_dashboard_stats(token):
        print("\n❌ Dashboard stats failed. Check backend logs.")
        return
    
    # Test frontend health
    test_frontend_health()
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed!")
    print("\n📊 System Status:")
    print("✅ Backend API: Running")
    print("✅ Database: Connected")
    print("✅ Authentication: Working")
    print("✅ Session Management: Working")
    print("✅ Emotion Analysis: Working")
    print("✅ Dashboard: Working")
    
    print(f"\n🌐 Access URLs:")
    print(f"Frontend: {FRONTEND_URL}")
    print(f"Backend API: {API_BASE_URL}")
    print(f"API Documentation: {API_BASE_URL}/docs")

if __name__ == "__main__":
    main()
