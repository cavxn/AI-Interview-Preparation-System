import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';

const DebugAuth = () => {
  const [authStatus, setAuthStatus] = useState('');
  const [token, setToken] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    // Check authentication status
    const isAuth = apiService.isAuthenticated();
    const storedToken = localStorage.getItem('authToken');
    
    setAuthStatus(isAuth ? 'Authenticated' : 'Not Authenticated');
    setToken(storedToken ? storedToken.substring(0, 20) + '...' : 'No token');
  }, []);

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      const response = await apiService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      setTestResult(`Login successful: ${JSON.stringify(response)}`);
      
      // Update auth status
      const isAuth = apiService.isAuthenticated();
      setAuthStatus(isAuth ? 'Authenticated' : 'Not Authenticated');
    } catch (error) {
      setTestResult(`Login failed: ${error.message}`);
    }
  };

  const testSession = async () => {
    try {
      setTestResult('Testing session creation...');
      const session = await apiService.createSession();
      setTestResult(`Session created: ${JSON.stringify(session)}`);
    } catch (error) {
      setTestResult(`Session creation failed: ${error.message}`);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthStatus('Not Authenticated');
    setToken('No token');
    setTestResult('Auth cleared');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔧 Authentication Debug</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Status:</h3>
        <p><strong>Auth Status:</strong> {authStatus}</p>
        <p><strong>Token:</strong> {token}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Actions:</h3>
        <button onClick={testLogin} style={{ margin: '5px', padding: '10px' }}>
          Test Login
        </button>
        <button onClick={testSession} style={{ margin: '5px', padding: '10px' }}>
          Test Session Creation
        </button>
        <button onClick={clearAuth} style={{ margin: '5px', padding: '10px' }}>
          Clear Auth
        </button>
      </div>

      <div>
        <h3>Test Result:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {testResult}
        </pre>
      </div>
    </div>
  );
};

export default DebugAuth;
