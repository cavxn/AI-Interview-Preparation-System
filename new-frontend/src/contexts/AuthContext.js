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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Verify token is still valid (optional - don't logout if backend is down)
          try {
            await apiService.getCurrentUser();
          } catch (error) {
            console.warn('Token validation failed, but keeping user logged in:', error);
            // Don't logout immediately - let the user try to use the app
            // Individual API calls will handle authentication errors
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
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
      
      // For testing purposes, if backend fails, create a mock user
      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        const mockUser = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          created_at: new Date().toISOString()
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'mock-token-for-testing');
        
        return { success: true, user: mockUser };
      }
      
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
      return { success: true, user: response };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    apiService.logout();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
