import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import SessionCard from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Dashboard/SessionCard.js';
import PerformanceChart from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Dashboard/PerformanceChart.js';
import UserAvatar from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Dashboard/UserAvatar.js';
import PageWrapper from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Pagewrapper/PageWrapper.js';
import Sidebar from './Sidebar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion } from 'framer-motion'; 
import 'react-circular-progressbar/dist/styles.css';
import EmotionTrendGraph from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Dashboard/EmotionTrendGraph.js';
import apiService from '../../utils/apiService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userPic, setUserPic] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/');
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'User');
        setUserPic(user.picture || '');
        setUserEmail(user.email || '');

        // Fetch dashboard stats from API
        const stats = await apiService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="dashboard-wrapper">
          <Sidebar />
          <div className="dashboard-container" style={{ marginLeft: '220px', textAlign: 'center', padding: '50px' }}>
            <h2>🔄 Loading Dashboard...</h2>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Use real data from API or fallback to mock data
  const recentSessions = dashboardStats?.recent_sessions || [];
  const totalSessions = dashboardStats?.total_sessions || 0;
  const averageScore = Math.round((dashboardStats?.average_confidence || 0) * 100);
  const bestEmotion = dashboardStats?.best_emotion || 'Neutral';
  const lastSession = recentSessions[0] || { score: 0, emotion: 'Neutral' };

  const motivationalTips = [
    "Believe in yourself!",
    "Confidence comes from preparation.",
    "Every expert was once a beginner.",
    "Your posture speaks louder than your words.",
    "Smile. It changes everything.",
  ];
  const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <PageWrapper>
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="dashboard-container" style={{ marginLeft: '220px' }}>
          {/* Header */}
          <header className="dashboard-header">
            <div className="dashboard-left">
              <h1 className="welcome-banner">Welcome, {userName}! 👋</h1>
              <p className="email-subtext">{userEmail}</p>
            </div>
            <UserAvatar onLogout={handleLogout} userPic={userPic} />
          </header>

          {/* Stats Summary */}
          <motion.section className="summary-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Interviews</h3>
                <p>{totalSessions}</p>
              </div>
              <div className="stat-card">
                <h3>Average Score</h3>
                <p>{averageScore}%</p>
              </div>
              <div className="stat-card">
                <h3>Best Emotion</h3>
                <p>{bestEmotion}</p>
              </div>
            </div>
          </motion.section>

          <p className="tip-of-day">💡 <strong>Tip of the Day:</strong> {randomTip}</p>

          {/* Main Content Grid */}
          <div className="main-grid">
            {[
              {
                title: '🎥 Interview Analyzer',
                content: (
                  <div className="camera-box">
                    <p>[ Webcam Feed Placeholder ]</p>
                    <button className="start-btn" onClick={() => navigate('/interview')}>
                      Start Interview
                    </button>
                  </div>
                ),
                className: 'camera-section'
              },
              {
                title: '📊 Performance Overview',
                content: <PerformanceChart data={recentSessions} />,
                className: 'sessions-section'
              },
              {
                title: '🔄 Last Session Score',
                content: (
                  <div style={{ width: 120, margin: '0 auto' }}>
                    <CircularProgressbar
                      value={lastSession.score || 0}
                      text={`${lastSession.score || 0}%`}
                      styles={buildStyles({
                        textColor: '#00ffff',
                        pathColor: '#00ffff',
                        trailColor: '#003d3d',
                      })}
                    />
                  </div>
                ),
                className: 'sessions-section'
              },
              {
                title: '📁 Recent Sessions',
                content: (
                  <div className="sessions-list">
                    {recentSessions.map((session, index) => (
                      <SessionCard key={index} session={session} />
                    ))}
                  </div>
                ),
                className: 'sessions-section'
              },
              {
                title: '📝 Quick Tips',
                content: (
                  <ul>
                    <li>Maintain eye contact</li>
                    <li>Keep a calm posture</li>
                    <li>Speak clearly and confidently</li>
                  </ul>
                ),
                className: 'tips-section'
              },
              {
                title: '🧠 AI Feedback Summary',
                content: (
                  <p>
                    You're improving well! Maintain steady tone and confident posture.
                    Eye contact has improved by <strong>20%</strong> since the first session.
                  </p>
                ),
                className: 'sessions-section'
              },
              {
                title: '📈 Emotion Trend',
                content: (
                  <EmotionTrendGraph data={recentSessions} />
                ),
                className: 'sessions-section'
              },

              {
                title: '🌟 Progress Tracker',
                content: (
                  <div style={{ background: '#1a1a1a', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.max(0, averageScore)}%`,
                      background: 'linear-gradient(to right, #00ffff, #0066ff)',
                      padding: '10px',
                      color: 'black',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {Math.max(0, averageScore)}% Complete
                    </div>
                  </div>
                ),
                className: 'sessions-section'
              },
              {
                title: '📚 Quote of the Day',
                content: (
                  <blockquote style={{ fontStyle: 'italic', color: '#ccc' }}>
                    "Success is not final, failure is not fatal: it is the courage to continue that counts." – Winston Churchill
                  </blockquote>
                ),
                className: 'sessions-section'
              },
              {
                title: '📅 Upcoming Practice',
                content: (
                  <ul>
                    <li>🗓️ Aug 5 – Technical Interview Practice</li>
                    <li>🗓️ Aug 7 – HR Mock Interview</li>
                    <li>🗓️ Aug 10 – Leadership Round Drill</li>
                  </ul>
                ),
                className: 'sessions-section'
              },
              {
                title: '🧾 Export Summary',
                content: (
                  <button className="start-btn" onClick={() => alert('PDF Export Coming Soon!')}>
                    Download PDF
                  </button>
                ),
                className: 'sessions-section',
                style: { textAlign: 'center' }
              }
            ].map((section, index) => (
              <motion.section
                key={index}
                className={section.className}
                style={section.style}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h2>{section.title}</h2>
                {section.content}
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
