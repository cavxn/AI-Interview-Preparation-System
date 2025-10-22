// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Import

import LoginPage from './Components/Pages/LoginPage';
import SignupPage from './Components/Pages/SignupPage';
import Dashboard from './Components/Dashboard/Dashboard';
import InterviewPage from './Components/Interview/InterviewPage';
import SummaryPage from './Components/Pages/SummaryPage';
import SettingsPage from './Components/Settings/SettingsPage';
import DebugAuth from './Components/DebugAuth';

function App() {
  return (
    <GoogleOAuthProvider clientId="591739716335-vebqaua0kegti5nmrmd627h3prcv9a70.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/debug" element={<DebugAuth />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
