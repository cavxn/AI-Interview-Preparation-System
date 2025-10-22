import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import {
  Home,
  Video,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  Bell,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Activity,
  Star,
  HelpCircle,
  MessageSquare,
  Download,
  Share,
  Play,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, sidebarCollapsed, toggleSidebar, toggleTheme } = useTheme();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [showRecentActivity, setShowRecentActivity] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', badge: null },
    { path: '/interview', icon: Video, label: 'Interview', badge: 'New' },
    { path: '/summary', icon: BarChart3, label: 'Summary', badge: null },
    { path: '/profile', icon: User, label: 'Profile', badge: null },
    { path: '/settings', icon: Settings, label: 'Settings', badge: null },
  ];

  // Load real data from backend
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const stats = await apiService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error loading sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Real data from backend
  const totalSessions = dashboardStats?.total_sessions || 0;
  const averageConfidence = Math.round((dashboardStats?.average_confidence || 0) * 100);
  const recentSessions = dashboardStats?.recent_sessions || [];

  const quickStats = {
    sessions: totalSessions,
    streak: 0, // TODO: Implement streak calculation
    confidence: averageConfidence,
    achievements: totalSessions > 0 ? 1 : 0 // Basic achievement count
  };

  const recentActivity = recentSessions.slice(0, 3).map((session, index) => ({
    id: session.id,
    action: 'Completed Interview Session',
    time: new Date(session.start_time).toLocaleDateString(),
    icon: Video,
    color: 'text-green-400'
  }));

  const achievements = [
    { id: 1, title: 'First Steps', earned: totalSessions > 0, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
    { id: 2, title: 'Confidence Builder', earned: averageConfidence >= 80, icon: Star, color: 'from-blue-500 to-cyan-500' },
    { id: 3, title: 'Streak Master', earned: false, icon: Flame, color: 'from-red-500 to-pink-500' }
  ];

  const notifications = [
    { id: 1, title: 'Welcome!', message: totalSessions === 0 ? 'Start your first interview session!' : `You've completed ${totalSessions} sessions!`, time: 'Just now', read: false, type: 'welcome' },
    { id: 2, title: 'Progress Update', message: `Your confidence score is ${averageConfidence}%`, time: '1 day ago', read: true, type: 'progress' },
    { id: 3, title: 'Keep Going!', message: 'Continue practicing to improve your skills.', time: '2 days ago', read: true, type: 'reminder' }
  ];

  const quickActions = [
    { icon: Play, label: 'Start Interview', action: () => window.location.href = '/interview', color: 'from-green-500 to-emerald-500' },
    { icon: Target, label: 'Set Goal', action: () => {}, color: 'from-blue-500 to-cyan-500' },
    { icon: Download, label: 'Export Data', action: () => {}, color: 'from-purple-500 to-pink-500' },
    { icon: Share, label: 'Share Progress', action: () => {}, color: 'from-orange-500 to-red-500' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? '80px' : '320px',
          x: '0px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full bg-dark-900/95 backdrop-blur-md glass-dark z-50 border-r border-gray-700/50 overflow-y-auto relative shadow-2xl"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Background decoration with enhanced transparency */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
        {/* Additional glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/30 relative z-10">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">AI Coach</h2>
                <p className="text-xs text-gray-400">Interview System</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-2">
            {!sidebarCollapsed && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-700/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-700/30"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        {!sidebarCollapsed && showQuickStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-700/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                Quick Stats
              </h3>
              <button
                onClick={() => setShowQuickStats(!showQuickStats)}
                className="text-gray-400 hover:text-white"
              >
                {showQuickStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{quickStats.sessions}</div>
                <div className="text-xs text-gray-400">Sessions</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-400">{quickStats.streak}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">{quickStats.confidence}%</div>
                <div className="text-xs text-gray-400">Confidence</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-yellow-400">{quickStats.achievements}</div>
                <div className="text-xs text-gray-400">Badges</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="p-4 relative z-10">
          <ul className="space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-lg'
                    }`}
                  >
                    {/* Shine effect for active items */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    )}
                    <div className="flex items-center space-x-3 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      {!sidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="px-2 py-1 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Recent Activity */}
        {!sidebarCollapsed && showRecentActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-700/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-400" />
                Recent Activity
              </h3>
              <button
                onClick={() => setShowRecentActivity(!showRecentActivity)}
                className="text-gray-400 hover:text-white"
              >
                {showRecentActivity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-2">
              {recentActivity.slice(0, 3).map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg"
                  >
                    <Icon className={`w-4 h-4 ${activity.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Achievements Preview */}
        {!sidebarCollapsed && showAchievements && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-700/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                Achievements
              </h3>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="text-gray-400 hover:text-white"
              >
                {showAchievements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex space-x-2">
              {achievements.slice(0, 3).map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned 
                        ? `bg-gradient-to-r ${achievement.color}` 
                        : 'bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-700/30"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white text-xs font-medium hover:shadow-lg transition-all duration-200`}
                  >
                    <Icon className="w-3 h-3 mx-auto mb-1" />
                    <div className="text-center">{action.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Notifications Panel */}
        {!sidebarCollapsed && showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-700 bg-gray-800/50"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-400" />
              Notifications
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-2 rounded-lg ${!notification.read ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-700/50'}`}
                >
                  <h5 className="text-xs font-semibold text-white">{notification.title}</h5>
                  <p className="text-xs text-gray-400">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/30 space-y-2">
          {/* Help & Support */}
          {!sidebarCollapsed && (
            <div className="flex space-x-2 mb-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs">Help</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">Support</span>
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!sidebarCollapsed && <span>Toggle Theme</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

    </>
  );
};

export default Sidebar;
