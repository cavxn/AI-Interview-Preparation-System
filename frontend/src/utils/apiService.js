// API Service for AI Interview Coach
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
    console.log('🔑 Auth token:', token ? token.substring(0, 20) + '...' : 'No token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    console.log(`🌐 Making request to ${endpoint}`, { url, headers: config.headers });

    try {
      const response = await fetch(url, config);
      
      console.log(`📡 Response status: ${response.status} for ${endpoint}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ API Error for ${endpoint}:`, errorData);
        
        // Provide more specific error messages
        if (response.status === 401) {
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
      console.log(`✅ Success for ${endpoint}:`, data);
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
      console.log('✅ Token stored:', response.access_token.substring(0, 20) + '...');
    } else {
      console.error('❌ No access_token in response:', response);
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
      console.log('✅ Google token stored:', response.access_token.substring(0, 20) + '...');
    } else {
      console.error('❌ No access_token in Google response:', response);
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

  // Logout (clear token)
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
