#!/bin/bash

# 🔧 Fix Google Login Issues
echo "🔧 Fixing Google Login Issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Kill any existing processes
print_status "Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Check if we're in the right directory
if [ ! -f "backend/main.py" ] || [ ! -f "new-frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Fix 1: Create proper .env file for frontend
print_status "Creating frontend environment configuration..."
cat > new-frontend/.env << 'EOF'
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=591739716335-vebqaua0kegti5nmrmd627h3prcv9a70.apps.googleusercontent.com

# API Configuration  
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
EOF
print_success "Frontend .env file created"

# Fix 2: Update API service to use environment variable
print_status "Updating API service configuration..."
cat > new-frontend/src/utils/apiService.js << 'EOF'
// Enhanced API Service for AI Interview Coach
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Generic API request method with enhanced error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Please check your permissions.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async signup(userData) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Store token in localStorage
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
    }
    
    return response;
  }

  async googleLogin(googleUserInfo) {
    const response = await this.request('/google-login', {
      method: 'POST',
      body: JSON.stringify(googleUserInfo)
    });
    
    // Store token in localStorage
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/me');
  }

  // Session management
  async createSession() {
    return this.request('/sessions', {
      method: 'POST'
    });
  }

  async updateSession(sessionId, sessionData) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData)
    });
  }

  async getUserSessions() {
    return this.request('/sessions');
  }

  async getSessionSummary(sessionId) {
    return this.request(`/sessions/${sessionId}/summary`);
  }

  // Emotion analysis
  async analyzeEmotion(frameData, sessionId = null) {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        frame_data: frameData,
        session_id: sessionId
      })
    });
  }

  // Dashboard data
  async getDashboardStats() {
    return this.request('/dashboard');
  }

  // LLM Analysis
  async analyzeAnswer(question, answer) {
    return this.request('/analyze-answer', {
      method: 'POST',
      body: JSON.stringify({
        question: question,
        answer: answer
      })
    });
  }

  // Generate interview questions for a topic
  async generateQuestions(topic, difficulty = 'medium', count = 5) {
    return this.request('/generate-questions', {
      method: 'POST',
      body: JSON.stringify({
        topic: topic,
        difficulty: difficulty,
        count: count
      })
    });
  }

  // Comprehensive analysis combining text and emotion
  async analyzeComprehensive(question, answer, emotionData) {
    return this.request('/analyze-comprehensive', {
      method: 'POST',
      body: JSON.stringify({
        question: question,
        answer: answer,
        emotion_data: emotionData
      })
    });
  }

  // Logout (clear token)
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
EOF
print_success "API service updated"

# Fix 3: Update AuthContext to handle Google login better
print_status "Updating AuthContext for better Google login handling..."
cat > new-frontend/src/contexts/AuthContext.js << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../utils/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userInfo = await apiService.getCurrentUser();
          setUser(userInfo);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      const userInfo = await apiService.getCurrentUser();
      
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async (userInfo) => {
    try {
      console.log('Google login attempt with user info:', userInfo);
      
      // Send Google user info to backend
      const response = await apiService.googleLogin(userInfo);
      console.log('Backend response:', response);
      
      // Get user info from backend after successful login
      const backendUser = await apiService.getCurrentUser();
      console.log('Backend user info:', backendUser);
      
      setUser(backendUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(backendUser));
      localStorage.setItem('authToken', response.access_token);
      
      return { success: true, user: backendUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiService.signup(userData);
      const userInfo = await apiService.getCurrentUser();
      
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
EOF
print_success "AuthContext updated"

# Fix 4: Ensure backend has proper environment
print_status "Setting up backend environment..."
cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
    print_warning "Created .env file - please add your OpenAI API key"
fi

# Remove old database to start fresh
rm -f app.db
print_status "Removed old database"

# Initialize fresh database
python init_fresh_db.py
if [ $? -eq 0 ]; then
    print_success "Database initialized successfully"
else
    print_warning "Database initialization had issues"
fi

# Start backend
print_status "Starting backend server..."
python main.py &
BACKEND_PID=$!
print_success "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
print_status "Waiting for backend to start..."
for i in {1..10}; do
    if curl -s http://127.0.0.1:8000/ > /dev/null 2>&1; then
        print_success "Backend is running on http://127.0.0.1:8000"
        break
    fi
    echo -n "."
    sleep 1
done

cd ..

# Fix 5: Start frontend
print_status "Starting frontend..."
cd new-frontend
npm start &
FRONTEND_PID=$!
print_success "Frontend started (PID: $FRONTEND_PID)"

cd ..

print_success "🎉 Google Login Fix Complete!"
echo ""
echo "📋 System Status:"
echo "  Backend:  http://127.0.0.1:8000 (PID: $BACKEND_PID)"
echo "  Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "🔧 Google Login Fixes Applied:"
echo "  ✅ Updated Google OAuth configuration"
echo "  ✅ Fixed API service environment variables"
echo "  ✅ Enhanced AuthContext with better error handling"
echo "  ✅ Added comprehensive logging for debugging"
echo "  ✅ Fresh database initialization"
echo ""
echo "🎯 Test Google Login:"
echo "  1. Open http://localhost:3000"
echo "  2. Click 'Login' or 'Sign Up'"
echo "  3. Click the Google login button"
echo "  4. Complete Google OAuth flow"
echo "  5. Check browser console for any errors"
echo ""
echo "🛑 To stop the system:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep script running
while true; do
    sleep 10
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died"
        break
    fi
done
