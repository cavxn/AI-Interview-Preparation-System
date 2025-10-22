import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestLogin = () => {
  const { login } = useAuth();

  const handleTestLogin = async () => {
    try {
      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (result.success) {
        alert('Test login successful!');
        window.location.href = '/dashboard';
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Login error: ${error.message}`);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleTestLogin}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Test Login
      </button>
    </div>
  );
};

export default TestLogin;
