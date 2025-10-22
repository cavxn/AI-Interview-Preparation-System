import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Sidebar from '../Dashboard/Sidebar';
import PageWrapper from '../Pagewrapper/PageWrapper';
import apiService from '../../utils/apiService';
import './SummaryPage.css';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Get session ID from location state or URL params
    const id = location.state?.sessionId || new URLSearchParams(location.search).get('sessionId');
    if (id) {
      setSessionId(parseInt(id));
      loadSessionData(parseInt(id));
    } else {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const loadSessionData = async (id) => {
    try {
      const data = await apiService.getSessionSummary(id);
      setSessionData(data);
    } catch (error) {
      console.error('Error loading session data:', error);
      alert('Failed to load session data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="dashboard-wrapper">
          <Sidebar />
          <div className="summary-container" style={{ marginLeft: '220px', textAlign: 'center', padding: '50px' }}>
            <h2>🔄 Loading Session Summary...</h2>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!sessionData) {
    return (
      <PageWrapper>
        <div className="dashboard-wrapper">
          <Sidebar />
          <div className="summary-container" style={{ marginLeft: '220px', textAlign: 'center', padding: '50px' }}>
            <h2>❌ Session not found</h2>
            <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Prepare chart data
  const emotionTimeline = sessionData.emotion_timeline.map((item, index) => ({
    time: index,
    emotion: item.emotion,
    confidence: item.confidence * 100,
    eyeContact: item.eye_contact_score * 100
  }));

  const emotionCounts = sessionData.emotion_timeline.reduce((acc, item) => {
    acc[item.emotion] = (acc[item.emotion] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion,
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  return (
    <PageWrapper>
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="summary-container" style={{ marginLeft: '220px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="summary-header">
              <h1>📊 Session Summary</h1>
              <p>Interview completed on {new Date(sessionData.start_time).toLocaleDateString()}</p>
            </div>

            <div className="summary-stats">
              <div className="stat-card">
                <h3>Duration</h3>
                <p>{Math.floor(sessionData.duration_seconds / 60)}m {sessionData.duration_seconds % 60}s</p>
              </div>
              <div className="stat-card">
                <h3>Average Confidence</h3>
                <p>{(sessionData.average_confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="stat-card">
                <h3>Dominant Emotion</h3>
                <p>{sessionData.dominant_emotion}</p>
              </div>
              <div className="stat-card">
                <h3>Questions Answered</h3>
                <p>{sessionData.total_questions}</p>
              </div>
            </div>

            <div className="charts-grid">
              <motion.div
                className="chart-container"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3>📈 Emotion Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={emotionTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="confidence" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                className="chart-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3>🎭 Emotion Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div
              className="summary-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3>🤖 AI Feedback</h3>
              <div className="feedback-content">
                <p>{sessionData.session_summary}</p>
              </div>
            </motion.div>

            <div className="summary-actions">
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Back to Dashboard
              </button>
              <button onClick={() => navigate('/interview')} className="btn-secondary">
                Start New Session
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SummaryPage;
