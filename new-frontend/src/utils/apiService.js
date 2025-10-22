// Enhanced API Service for AI Interview Coach
const API_BASE_URL = 'http://127.0.0.1:8000';

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
