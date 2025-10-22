import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../utils/apiService';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  Brain,
  Eye,
  Smile,
  Frown,
  Meh,
  Download,
  RefreshCw,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const SummaryPage = () => {
  const { user } = useAuth();
  const { sidebarCollapsed } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionData = await apiService.getUserSessions();
        setSessions(sessionData);
        if (sessionData.length > 0) {
          setSelectedSession(sessionData[0]);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        setError('Failed to load session data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const loadSessionDetails = async (sessionId) => {
    try {
      const details = await apiService.getSessionSummary(sessionId);
      setSelectedSession(details);
    } catch (error) {
      console.error('Error loading session details:', error);
      setError('Failed to load session details.');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionData = await apiService.getUserSessions();
      setSessions(sessionData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data.');
    } finally {
      setLoading(false);
    }
  };

  const getEmotionIcon = (emotion) => {
    switch (emotion?.toLowerCase()) {
      case 'happy':
      case 'joy':
        return <Smile className="w-5 h-5 text-green-400" />;
      case 'sad':
      case 'sorrow':
        return <Frown className="w-5 h-5 text-blue-400" />;
      case 'neutral':
        return <Meh className="w-5 h-5 text-gray-400" />;
      default:
        return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const getEmotionColor = (emotion) => {
    switch (emotion?.toLowerCase()) {
      case 'happy':
      case 'joy':
        return 'from-green-500 to-emerald-500';
      case 'sad':
      case 'sorrow':
        return 'from-blue-500 to-cyan-500';
      case 'neutral':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your session summaries..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex">
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                📊 Session Summary
              </h1>
              <p className="text-gray-400">
                Analyze your interview performance and track progress
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}

          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <BarChart3 className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-300 mb-4">No Sessions Yet</h3>
              <p className="text-gray-400 mb-8">Complete your first interview session to see detailed analytics here.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sessions List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                    Your Sessions
                  </h3>
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <motion.button
                        key={session.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => loadSessionDetails(session.id)}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                          selectedSession?.id === session.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Session #{session.id}</h4>
                          <div className="flex items-center space-x-1">
                            {getEmotionIcon(session.dominant_emotion)}
                          </div>
                        </div>
                        <div className="text-sm opacity-75">
                          {new Date(session.start_time).toLocaleDateString()}
                        </div>
                        <div className="text-sm opacity-75">
                          Score: {Math.round((session.average_confidence || 0) * 100)}%
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Session Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                {selectedSession ? (
                  <div className="space-y-6">
                    {/* Session Overview */}
                    <div className="glass rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-yellow-400" />
                        Session Overview
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                          <div className="text-2xl font-bold text-white mb-1">
                            {Math.round((selectedSession.average_confidence || 0) * 100)}%
                          </div>
                          <div className="text-sm text-gray-400">Average Score</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                          <div className="text-2xl font-bold text-white mb-1">
                            {selectedSession.total_questions || 0}
                          </div>
                          <div className="text-sm text-gray-400">Questions</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                          <div className="text-2xl font-bold text-white mb-1">
                            {Math.floor((selectedSession.duration_seconds || 0) / 60)}m
                          </div>
                          <div className="text-sm text-gray-400">Duration</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="text-gray-300">Dominant Emotion:</span>
                        <div className={`flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getEmotionColor(selectedSession.dominant_emotion)} rounded-full text-white`}>
                          {getEmotionIcon(selectedSession.dominant_emotion)}
                          <span className="font-semibold">{selectedSession.dominant_emotion || 'Neutral'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Emotion Timeline */}
                    {selectedSession.emotion_timeline && selectedSession.emotion_timeline.length > 0 && (
                      <div className="glass rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                          Emotion Timeline
                        </h3>
                        <div className="space-y-3">
                          {selectedSession.emotion_timeline.slice(0, 10).map((emotion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {getEmotionIcon(emotion.emotion)}
                                <span className="text-white font-medium">{emotion.emotion}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-300">
                                  {Math.round(emotion.confidence * 100)}%
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(emotion.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Session Summary */}
                    {selectedSession.session_summary && (
                      <div className="glass rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-purple-400" />
                          AI Summary
                        </h3>
                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-gray-200 leading-relaxed">
                            {selectedSession.session_summary}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Export Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-center"
                    >
                      <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 mx-auto">
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="glass rounded-xl p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Session</h3>
                    <p className="text-gray-400">Choose a session from the list to view detailed analytics.</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
