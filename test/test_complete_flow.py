#!/usr/bin/env python3
"""
Test the complete flow from login to interview analysis
"""
import requests
import json

def test_complete_flow():
    """Test the complete user flow"""
    base_url = "http://127.0.0.1:8000"
    
    print("🚀 Testing Complete AI Interview System Flow...")
    
    # Step 1: Login
    print("\n1️⃣ Login...")
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Login failed: {response.text}")
            return False
        
        data = response.json()
        token = data.get('access_token')
        print(f"✅ Login successful! Token: {token[:20]}...")
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    # Step 2: Create session
    print("\n2️⃣ Creating interview session...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{base_url}/sessions", headers=headers)
        if response.status_code != 200:
            print(f"❌ Session creation failed: {response.text}")
            return False
        
        session_data = response.json()
        session_id = session_data.get('id')
        print(f"✅ Session created! ID: {session_id}")
        
    except Exception as e:
        print(f"❌ Session creation error: {e}")
        return False
    
    # Step 3: Test LLM analysis
    print("\n3️⃣ Testing LLM analysis...")
    question = "Tell me about a challenging project you worked on"
    answer = "I worked on a complex e-commerce platform where I had to integrate multiple payment systems and ensure high availability. The main challenge was handling peak traffic during Black Friday sales. I implemented caching strategies and database optimization which improved performance by 40%."
    
    try:
        response = requests.post(f"{base_url}/analyze-answer", 
                               params={"question": question, "answer": answer},
                               headers=headers)
        if response.status_code != 200:
            print(f"❌ LLM analysis failed: {response.text}")
            return False
        
        analysis_result = response.json()
        print(f"✅ LLM analysis successful!")
        print(f"   Score: {analysis_result.get('analysis', {}).get('score', 'N/A')}/100")
        print(f"   Feedback: {analysis_result.get('analysis', {}).get('overall_feedback', 'N/A')[:100]}...")
        
    except Exception as e:
        print(f"❌ LLM analysis error: {e}")
        return False
    
    # Step 4: Test session update
    print("\n4️⃣ Testing session update...")
    update_data = {
        "end_time": "2024-01-01T12:00:00Z",
        "duration_seconds": 300,
        "total_questions": 1
    }
    
    try:
        response = requests.put(f"{base_url}/sessions/{session_id}", 
                               json=update_data, 
                               headers=headers)
        if response.status_code != 200:
            print(f"❌ Session update failed: {response.text}")
            return False
        
        print(f"✅ Session updated successfully!")
        
    except Exception as e:
        print(f"❌ Session update error: {e}")
        return False
    
    # Step 5: Test dashboard
    print("\n5️⃣ Testing dashboard...")
    
    try:
        response = requests.get(f"{base_url}/dashboard", headers=headers)
        if response.status_code != 200:
            print(f"❌ Dashboard failed: {response.text}")
            return False
        
        dashboard_data = response.json()
        print(f"✅ Dashboard data retrieved!")
        print(f"   Total sessions: {dashboard_data.get('total_sessions', 'N/A')}")
        print(f"   Average confidence: {dashboard_data.get('average_confidence', 'N/A')}")
        
    except Exception as e:
        print(f"❌ Dashboard error: {e}")
        return False
    
    print("\n🎉 Complete flow test PASSED! All systems working! 🚀")
    return True

if __name__ == "__main__":
    success = test_complete_flow()
    exit(0 if success else 1)
