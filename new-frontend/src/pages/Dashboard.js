import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCounter from '../components/AnimatedCounter';
import ProgressRing from '../components/ProgressRing';
import ParticleBackground from '../components/ParticleBackground';
import apiService from '../utils/apiService';
import {
  Play,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Star,
  Target,
  Zap,
  Brain,
  Camera,
  Activity,
  Award,
  Calendar,
  Download,
  RefreshCw,
  Trophy,
  Flame,
  BookOpen,
  MessageSquare,
  Eye,
  Mic,
  CheckCircle,
  Plus,
  Edit,
  Bell,
  Share,
  Settings,
  HelpCircle,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sidebarCollapsed } = useTheme();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '' });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const stats = await apiService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  // Use real data from API or fallback to mock data
  const recentSessions = dashboardStats?.recent_sessions || [];
  const totalSessions = dashboardStats?.total_sessions || 0;
  const averageScore = Math.round((dashboardStats?.average_confidence || 0) * 100);
  const bestEmotion = dashboardStats?.best_emotion || 'Neutral';

  const motivationalTips = [
    "Confidence comes from preparation and practice.",
    "Every expert was once a beginner - keep going!",
    "Your body language speaks louder than words.",
    "Smile - it changes everything in an interview.",
    "Focus on progress, not perfection.",
    "Preparation breeds confidence and competence.",
    "The best way to predict the future is to create it.",
    "Success is the sum of small efforts repeated daily."
  ];
  
  const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];

  // Real data from backend
  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first interview session', icon: Trophy, earned: totalSessions > 0, progress: Math.min(100, (totalSessions / 1) * 100), color: 'from-yellow-500 to-orange-500' },
    { id: 2, title: 'Confidence Builder', description: 'Achieve 80% confidence in 5 sessions', icon: Star, earned: averageScore >= 80, progress: Math.min(100, (averageScore / 80) * 100), color: 'from-blue-500 to-cyan-500' },
    { id: 3, title: 'Streak Master', description: 'Practice for 7 consecutive days', icon: Flame, earned: false, progress: 0, color: 'from-red-500 to-pink-500' },
    { id: 4, title: 'Perfectionist', description: 'Score 90%+ in 10 sessions', icon: Award, earned: averageScore >= 90 && totalSessions >= 10, progress: Math.min(100, (averageScore / 90) * 100), color: 'from-purple-500 to-indigo-500' },
    { id: 5, title: 'Communication Expert', description: 'Master all communication skills', icon: MessageSquare, earned: false, progress: Math.min(100, (averageScore / 100) * 100), color: 'from-green-500 to-emerald-500' }
  ];

  const goals = [
    { id: 1, title: 'Improve Confidence', target: 85, current: averageScore, deadline: '2024-02-15', type: 'percentage' },
    { id: 2, title: 'Complete 20 Sessions', target: 20, current: totalSessions, deadline: '2024-03-01', type: 'count' },
    { id: 3, title: 'Master Technical Questions', target: 10, current: Math.floor(totalSessions / 2), deadline: '2024-02-28', type: 'count' }
  ];

  const notifications = [
    { id: 1, title: 'Welcome!', message: 'Start your first interview session to begin your journey.', type: 'welcome', time: 'Just now', read: totalSessions === 0 },
    { id: 2, title: 'Progress Update', message: `You've completed ${totalSessions} sessions so far!`, type: 'progress', time: '1 day ago', read: totalSessions > 0 },
    { id: 3, title: 'Keep Going!', message: 'Continue practicing to improve your skills.', type: 'reminder', time: '2 days ago', read: true }
  ];

  // Calculate performance trends from real session data
  const performanceTrends = recentSessions.slice(0, 5).map((session, index) => ({
    date: new Date(session.start_time).toISOString().split('T')[0],
    confidence: Math.round((session.average_confidence || 0) * 100),
    eyeContact: Math.round((session.average_confidence || 0) * 100), // Using confidence as proxy
    emotion: Math.round((session.average_confidence || 0) * 100)
  }));

  const skillAssessment = [
    { skill: 'Confidence', level: averageScore, improvement: '+5%', trend: 'up', color: 'from-green-500 to-emerald-500' },
    { skill: 'Eye Contact', level: Math.min(100, averageScore + 5), improvement: '+3%', trend: 'up', color: 'from-blue-500 to-cyan-500' },
    { skill: 'Body Language', level: Math.min(100, averageScore - 5), improvement: '+8%', trend: 'up', color: 'from-purple-500 to-pink-500' },
    { skill: 'Speech Clarity', level: Math.min(100, averageScore + 2), improvement: '+2%', trend: 'up', color: 'from-orange-500 to-red-500' },
    { skill: 'Emotion Control', level: Math.min(100, averageScore - 2), improvement: '+6%', trend: 'up', color: 'from-indigo-500 to-purple-500' }
  ];

  const statsCards = [
    {
      title: 'Total Sessions',
      value: totalSessions,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: '+8%'
    },
    {
      title: 'Best Emotion',
      value: bestEmotion,
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      change: 'Stable'
    },
    {
      title: 'This Week',
      value: '3',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      change: '+2'
    }
  ];

  const quickActions = [
    {
      title: 'Start Interview',
      description: 'Begin a new practice session',
      icon: Play,
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/interview')
    },
    {
      title: 'View Summary',
      description: 'Check your progress',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/summary')
    },
    {
      title: 'Settings',
      description: 'Customize your experience',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 relative overflow-hidden flex">
      <ParticleBackground particleCount={30} color="#0ea5e9" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
      <Sidebar />
      
      <div className="flex-1">
        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"
              />
              <h1 className="text-5xl font-bold gradient-text mb-2 relative">
                Welcome back, {user?.name || 'User'}! 👋
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
              </h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-lg"
              >
                Ready to improve your interview skills with AI coaching?
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-3"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="flex items-center space-x-2 px-6 py-3 glass rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-medium">Refresh</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
            </motion.div>
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

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass rounded-2xl p-6 card-hover relative overflow-hidden group"
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
                  <div className="absolute top-4 right-6 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-100" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <motion.span 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-sm text-green-400 font-medium bg-green-500/20 px-2 py-1 rounded-full"
                      >
                        {stat.change}
                      </motion.span>
                    </div>
                    
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-3xl font-bold text-white mb-2"
                    >
                      <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)} />
                    </motion.h3>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-gray-300 text-sm font-medium"
                    >
                      {stat.title}
                    </motion.p>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3"
                >
                  <Target className="w-5 h-5 text-white" />
                </motion.div>
                Your Progress
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center group"
                >
                  <div className="relative">
                    <ProgressRing 
                      progress={averageScore} 
                      size={140} 
                      label="Confidence" 
                      color="#0ea5e9"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 text-gray-300 font-medium"
                  >
                    Confidence Level
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center group"
                >
                  <div className="relative">
                    <ProgressRing 
                      progress={Math.min(100, (totalSessions / 10) * 100)} 
                      size={140} 
                      label="Sessions" 
                      color="#10b981"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 text-gray-300 font-medium"
                  >
                    Sessions Completed
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center group"
                >
                  <div className="relative">
                    <ProgressRing 
                      progress={Math.min(100, (totalSessions * 2))} 
                      size={140} 
                      label="Questions" 
                      color="#f59e0b"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 text-gray-300 font-medium"
                  >
                    Questions Answered
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-2xl p-6 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-6 flex items-center relative z-10"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3"
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </motion.div>
                  Quick Actions
                </motion.h3>
                
                <div className="space-y-4 relative z-10">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.action}
                        className={`w-full p-5 bg-gradient-to-r ${action.color} rounded-xl text-white text-left transition-all duration-300 hover:shadow-xl group relative overflow-hidden`}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        
                        <div className="flex items-center space-x-4 relative z-10">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <div>
                            <h4 className="font-bold text-lg">{action.title}</h4>
                            <p className="text-sm opacity-90">{action.description}</p>
                          </div>
                        </div>
                        
                        {/* Floating particles */}
                        <div className="absolute top-2 right-2 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
                        <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse delay-100" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-2xl p-6 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-6 flex items-center relative z-10"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3"
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </motion.div>
                  Recent Sessions
                </motion.h3>
                {recentSessions.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    {recentSessions.slice(0, 5).map((session, index) => (
                      <motion.div
                        key={session.id || index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="flex items-center justify-between p-5 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        
                        <div className="flex items-center space-x-4 relative z-10">
                          <motion.div 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
                          >
                            <Activity className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h4 className="font-bold text-white text-lg">
                              Session #{session.id || index + 1}
                            </h4>
                            <p className="text-sm text-gray-300">
                              {new Date(session.start_time || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right relative z-10">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="text-2xl font-bold text-white mb-1"
                          >
                            {Math.round((session.average_confidence || 0) * 100)}%
                          </motion.div>
                          <div className="text-sm text-gray-300 bg-gray-700/50 px-2 py-1 rounded-full">
                            {session.dominant_emotion || 'Neutral'}
                          </div>
                        </div>
                        
                        {/* Floating particles */}
                        <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                        <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center py-12 relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Activity className="w-10 h-10 text-blue-400" />
                    </motion.div>
                    
                    <motion.h4 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-2xl font-bold text-white mb-3"
                    >
                      No sessions yet
                    </motion.h4>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-gray-300 mb-8 text-lg"
                    >
                      Start your first interview session to see your progress here.
                    </motion.p>
                    
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/interview')}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                    >
                      <span className="relative z-10">Start Your First Session</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Enhanced Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {/* Achievements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl font-bold text-white flex items-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3"
                  >
                    <Trophy className="w-5 h-5 text-white" />
                  </motion.div>
                  Achievements
                </motion.h3>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-yellow-400 font-bold bg-yellow-500/20 px-3 py-1 rounded-full"
                >
                  {achievements.filter(a => a.earned).length}/{achievements.length}
                </motion.span>
              </div>
              <div className="space-y-4 relative z-10">
                {achievements.slice(0, 3).map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        achievement.earned 
                          ? 'bg-gradient-to-r ' + achievement.color + '/20 border border-yellow-500/30 shadow-lg' 
                          : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      {/* Shine effect for earned achievements */}
                      {achievement.earned && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      )}
                      
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                          achievement.earned 
                            ? 'bg-gradient-to-r ' + achievement.color 
                            : 'bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                      
                      <div className="flex-1 relative z-10">
                        <h4 className="font-bold text-white text-base mb-1">{achievement.title}</h4>
                        <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                        {!achievement.earned && (
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${achievement.progress}%` }}
                              transition={{ delay: 1 + index * 0.1, duration: 1 }}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                      <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-2xl font-bold text-white flex items-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3"
                  >
                    <Target className="w-5 h-5 text-white" />
                  </motion.div>
                  Goals
                </motion.h3>
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowGoalModal(true)}
                  className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              <div className="space-y-4 relative z-10">
                {goals.slice(0, 2).map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <h4 className="font-bold text-white text-base">{goal.title}</h4>
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="text-sm text-green-400 font-bold bg-green-500/20 px-2 py-1 rounded-full"
                      >
                        {goal.current}/{goal.target}
                      </motion.span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2 relative z-10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 1.5 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg"
                      />
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="text-sm text-gray-300"
                    >
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </motion.p>
                    
                    {/* Floating particles */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                    <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Streak & Notifications */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-2xl font-bold text-white flex items-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3"
                  >
                    <Flame className="w-5 h-5 text-white" />
                  </motion.div>
                  Streak & Updates
                </motion.h3>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center"
                >
                  <Bell className="w-5 h-5 text-orange-400" />
                </motion.div>
              </div>
              <div className="space-y-4 relative z-10">
                {/* Streak */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 shadow-lg group relative overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg relative z-10"
                  >
                    <Flame className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-white text-lg">3 Day Streak</h4>
                    <p className="text-sm text-gray-300">Keep it going!</p>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                  <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                </motion.div>
                
                {/* Recent Notifications */}
                <div className="space-y-3">
                  {notifications.slice(0, 2).map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className={`p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        !notification.read 
                          ? 'bg-blue-500/20 border border-blue-500/30 shadow-lg' 
                          : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      {/* Shine effect for unread notifications */}
                      {!notification.read && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      )}
                      
                      <div className="relative z-10">
                        <h5 className="text-base font-bold text-white mb-1">{notification.title}</h5>
                        <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                      
                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                      <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Performance Trends & Skill Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Performance Trends */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-2xl font-bold text-white mb-6 flex items-center relative z-10"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3"
                >
                  <TrendingUp className="w-5 h-5 text-white" />
                </motion.div>
                Performance Trends
              </motion.h3>
              <div className="space-y-4 relative z-10">
                {performanceTrends.slice(-3).map((trend, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    
                    <div className="relative z-10">
                      <p className="text-sm text-gray-300 font-medium mb-2">{new Date(trend.date).toLocaleDateString()}</p>
                      <div className="flex space-x-4">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full"
                        >
                          Confidence: {trend.confidence}%
                        </motion.span>
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full"
                        >
                          Eye Contact: {trend.eyeContact}%
                        </motion.span>
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                          className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full"
                        >
                          Emotion: {trend.emotion}%
                        </motion.span>
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg relative z-10"
                    >
                      <TrendingUp className="w-4 h-4 text-white" />
                    </motion.div>
                    
                    {/* Floating particles */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                    <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skill Assessment */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-bold text-white mb-6 flex items-center relative z-10"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3"
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
                Skill Assessment
              </motion.h3>
              
              <div className="space-y-4 relative z-10">
                {skillAssessment.slice(0, 3).map((skill, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    
                    <div className="flex items-center space-x-4 relative z-10">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                        className={`w-4 h-4 rounded-full bg-gradient-to-r ${skill.color} shadow-lg`} 
                      />
                      <span className="text-base text-white font-medium">{skill.skill}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 relative z-10">
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="text-lg text-white font-bold"
                      >
                        {skill.level}%
                      </motion.span>
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded-full font-medium"
                      >
                        {skill.improvement}
                      </motion.span>
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                    <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Tips and Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Daily Tip */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-bold text-white mb-6 flex items-center relative z-10"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3"
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
                Daily Tip
              </motion.h3>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 shadow-lg group relative overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-gray-200 italic text-lg relative z-10"
                >
                  "{randomTip}"
                </motion.p>
                
                {/* Floating particles */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                <div className="absolute top-4 right-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse delay-100" />
              </motion.div>
            </motion.div>

            {/* Progress Overview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-2xl font-bold text-white mb-6 flex items-center relative z-10"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3"
                >
                  <Award className="w-5 h-5 text-white" />
                </motion.div>
                Your Progress
              </motion.h3>
              
              <div className="space-y-6 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Confidence Level</span>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1 }}
                      className="text-white font-bold text-lg"
                    >
                      {averageScore}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, averageScore)}%` }}
                      transition={{ delay: 1.2, duration: 1.5 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg"
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Sessions Completed</span>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-white font-bold text-lg"
                    >
                      {totalSessions}
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (totalSessions / 10) * 100)}%` }}
                      transition={{ delay: 1.3, duration: 1.5 }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full shadow-lg"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Export & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-6 justify-center"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-5 h-5"
              >
                <Download className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10">Export Report</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-5 h-5"
              >
                <Share className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10">Share Progress</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-5 h-5"
              >
                <Settings className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10">Settings</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass rounded-2xl p-8 w-full max-w-lg relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-6 flex items-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3"
                >
                  <Target className="w-5 h-5 text-white" />
                </motion.div>
                Set New Goal
              </motion.h3>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium text-gray-300 mb-3">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Improve Confidence"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-lg font-medium text-gray-300 mb-3">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., 85"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-lg font-medium text-gray-300 mb-3">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Add goal logic here
                    setShowGoalModal(false);
                    setNewGoal({ title: '', target: '', deadline: '' });
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
                >
                  <span className="relative z-10">Create Goal</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
