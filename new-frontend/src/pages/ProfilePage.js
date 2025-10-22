import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import apiService from '../utils/apiService';
import {
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Edit,
  Save,
  X,
  Camera,
  Download,
  Share2,
  Bell,
  Shield,
  Star,
  Linkedin,
  Github,
  Twitter,
  Globe,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Heart,
  Code,
  Zap,
  Trophy,
  Clock,
  BarChart3,
  Filter,
  Search,
  Plus,
  Minus,
  CheckCircle,
  Circle,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  Copy,
  QrCode
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { sidebarCollapsed } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    phone: user?.phone || '',
    company: user?.company || '',
    title: user?.title || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    careerGoals: user?.careerGoals || '',
    socialLinks: user?.socialLinks || {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [showProfileCompleteness, setShowProfileCompleteness] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Load real data from backend
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        const [stats, sessionData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getUserSessions()
        ]);
        setDashboardStats(stats);
        setSessions(sessionData);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        ...user,
        ...editData
      });
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    });
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Avatar upload handler
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        setMessage('Avatar updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add skill handler
  const handleAddSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove skill handler
  const handleRemoveSkill = (skillToRemove) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Add interest handler
  const handleAddInterest = () => {
    if (newInterest.trim() && !editData.interests.includes(newInterest.trim())) {
      setEditData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  // Remove interest handler
  const handleRemoveInterest = (interestToRemove) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    const fields = [
      editData.name,
      editData.bio,
      editData.location,
      editData.phone,
      editData.company,
      editData.title,
      editData.careerGoals,
      editData.skills.length > 0,
      editData.interests.length > 0,
      Object.values(editData.socialLinks).some(link => link.trim() !== ''),
      avatar
    ];
    
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  // Share profile handler
  const handleShareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.id}`;
      await navigator.clipboard.writeText(profileUrl);
      setMessage('Profile link copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to copy profile link.');
    }
  };

  // Export profile data
  const handleExportProfile = async () => {
    try {
      const profileData = {
        personalInfo: {
          name: editData.name,
          email: user?.email,
          bio: editData.bio,
          location: editData.location,
          phone: editData.phone,
          avatar: avatar
        },
        professionalInfo: {
          company: editData.company,
          title: editData.title,
          careerGoals: editData.careerGoals
        },
        skills: editData.skills,
        interests: editData.interests,
        socialLinks: editData.socialLinks,
        stats: dashboardStats,
        sessions: sessions.slice(0, 10), // Last 10 sessions
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(profileData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-${editData.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage('Profile data exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to export profile data.');
    }
  };

  // Real data from backend
  const totalSessions = dashboardStats?.total_sessions || 0;
  const averageConfidence = Math.round((dashboardStats?.average_confidence || 0) * 100);
  const bestEmotion = dashboardStats?.best_emotion || 'Neutral';
  const recentSessions = dashboardStats?.recent_sessions || [];

  // Calculate total time from sessions
  const totalTimeMinutes = sessions.reduce((total, session) => {
    return total + (session.duration_seconds || 0) / 60;
  }, 0);
  const totalHours = Math.floor(totalTimeMinutes / 60);
  const totalMinutes = Math.floor(totalTimeMinutes % 60);

  const achievements = [
    { id: 1, title: 'First Interview', description: 'Completed your first interview session', icon: Star, earned: totalSessions > 0, category: 'milestone' },
    { id: 2, title: 'Confidence Builder', description: 'Achieved 80%+ confidence in 5 sessions', icon: TrendingUp, earned: averageConfidence >= 80, category: 'performance' },
    { id: 3, title: 'Consistent Performer', description: 'Completed 10 interview sessions', icon: Target, earned: totalSessions >= 10, category: 'milestone' },
    { id: 4, title: 'Emotion Master', description: 'Maintained positive emotions in 90% of sessions', icon: Award, earned: bestEmotion === 'Confident' || bestEmotion === 'Happy', category: 'performance' },
    { id: 5, title: 'Profile Complete', description: 'Completed 100% of your profile', icon: CheckCircle, earned: calculateProfileCompleteness() === 100, category: 'profile' },
    { id: 6, title: 'Skill Collector', description: 'Added 5+ skills to your profile', icon: Code, earned: editData.skills.length >= 5, category: 'profile' },
    { id: 7, title: 'Social Butterfly', description: 'Connected all social media accounts', icon: Share2, earned: Object.values(editData.socialLinks).every(link => link.trim() !== ''), category: 'social' },
    { id: 8, title: 'Practice Champion', description: 'Completed 50+ interview sessions', icon: Trophy, earned: totalSessions >= 50, category: 'milestone' },
    { id: 9, title: 'Time Master', description: 'Spent 10+ hours practicing', icon: Clock, earned: totalTimeMinutes >= 600, category: 'time' },
    { id: 10, title: 'Goal Setter', description: 'Set career goals and objectives', icon: Target, earned: editData.careerGoals.trim() !== '', category: 'profile' }
  ];

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  const stats = [
    { label: 'Total Sessions', value: totalSessions.toString(), change: `+${recentSessions.length} recent` },
    { label: 'Average Score', value: `${averageConfidence}%`, change: averageConfidence > 0 ? 'Good progress' : 'Start practicing' },
    { label: 'Best Emotion', value: bestEmotion, change: 'Dominant emotion' },
    { label: 'Total Time', value: `${totalHours}h ${totalMinutes}m`, change: totalTimeMinutes > 0 ? 'Practice time' : 'No sessions yet' }
  ];

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
                👤 Profile
              </h1>
              <p className="text-gray-400">
                Manage your profile and view your achievements
              </p>
            </div>
          </motion.div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300"
            >
              {message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-xl p-6">
                {/* Profile Completeness Indicator */}
                {showProfileCompleteness && (
                  <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-300">Profile Completeness</span>
                      <span className="text-sm text-blue-400">{calculateProfileCompleteness()}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProfileCompleteness()}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => setShowProfileCompleteness(false)}
                      className="text-xs text-gray-400 hover:text-gray-300 mt-1"
                    >
                      Hide
                    </button>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </label>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white text-center font-semibold"
                        placeholder="Full Name"
                      />
                      <textarea
                        value={editData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white text-center resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white text-center"
                          placeholder="Location"
                        />
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white text-center"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white text-center"
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white text-center"
                          placeholder="Job Title"
                        />
                      </div>
                      
                      {/* Skills Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editData.skills.map((skill, index) => (
                            <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                              <span>{skill}</span>
                              <button onClick={() => handleRemoveSkill(skill)} className="text-primary-400 hover:text-primary-200">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                            placeholder="Add skill..."
                          />
                          <button
                            onClick={handleAddSkill}
                            className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Interests Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editData.interests.map((interest, index) => (
                            <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                              <span>{interest}</span>
                              <button onClick={() => handleRemoveInterest(interest)} className="text-green-400 hover:text-green-200">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                            placeholder="Add interest..."
                          />
                          <button
                            onClick={handleAddInterest}
                            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Career Goals */}
                      <textarea
                        value={editData.careerGoals}
                        onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white resize-none"
                        placeholder="Career goals and objectives..."
                      />

                      {/* Social Links */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Social Links</label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Linkedin className="w-4 h-4 text-blue-400" />
                            <input
                              type="url"
                              value={editData.socialLinks.linkedin}
                              onChange={(e) => handleInputChange('socialLinks', { ...editData.socialLinks, linkedin: e.target.value })}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                              placeholder="LinkedIn URL"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Github className="w-4 h-4 text-gray-400" />
                            <input
                              type="url"
                              value={editData.socialLinks.github}
                              onChange={(e) => handleInputChange('socialLinks', { ...editData.socialLinks, github: e.target.value })}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                              placeholder="GitHub URL"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Twitter className="w-4 h-4 text-blue-400" />
                            <input
                              type="url"
                              value={editData.socialLinks.twitter}
                              onChange={(e) => handleInputChange('socialLinks', { ...editData.socialLinks, twitter: e.target.value })}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                              placeholder="Twitter URL"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-green-400" />
                            <input
                              type="url"
                              value={editData.socialLinks.website}
                              onChange={(e) => handleInputChange('socialLinks', { ...editData.socialLinks, website: e.target.value })}
                              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                              placeholder="Personal Website"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{editData.name || user?.name || 'User'}</h2>
                      <p className="text-gray-400 mb-2">{editData.bio || user?.bio || 'No bio yet'}</p>
                      
                      {/* Professional Info */}
                      {(editData.company || editData.title) && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-300">
                            {editData.title && editData.company 
                              ? `${editData.title} at ${editData.company}`
                              : editData.title || editData.company
                            }
                          </p>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex items-center justify-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {user?.email || 'user@example.com'}
                        </div>
                        {editData.location && (
                          <div className="flex items-center justify-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {editData.location}
                          </div>
                        )}
                        {editData.phone && (
                          <div className="flex items-center justify-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {editData.phone}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {editData.skills.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {editData.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                            {editData.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
                                +{editData.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {Object.values(editData.socialLinks).some(link => link.trim() !== '') && (
                        <div className="mt-4 flex justify-center space-x-3">
                          {editData.socialLinks.linkedin && (
                            <a href={editData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              <Linkedin className="w-5 h-5" />
                            </a>
                          )}
                          {editData.socialLinks.github && (
                            <a href={editData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          {editData.socialLinks.twitter && (
                            <a href={editData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              <Twitter className="w-5 h-5" />
                            </a>
                          )}
                          {editData.socialLinks.website && (
                            <a href={editData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                              <Globe className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save'}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats and Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass rounded-xl p-4"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                      <div className="text-xs text-green-400">{stat.change}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Achievements */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.earned
                            ? 'border-yellow-500/30 bg-yellow-500/10'
                            : 'border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            achievement.earned
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-600 text-gray-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              {achievement.title}
                            </h4>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                            {achievement.earned && (
                              <div className="text-xs text-yellow-400 mt-1">✓ Earned</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Interview History */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Recent Sessions
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          session.score >= 80 ? 'bg-green-500/20 text-green-400' :
                          session.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Interview Session #{session.id}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(session.created_at).toLocaleDateString()} • {Math.floor(session.duration_seconds / 60)} minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{session.score || 'N/A'}%</div>
                        <div className="text-xs text-gray-400">Score</div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No interview sessions yet</p>
                      <p className="text-sm">Start your first interview to see your progress here</p>
                    </div>
                  )}
                </div>
                
                {sessions.length > 5 && (
                  <div className="mt-4 text-center">
                    <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                      View All Sessions
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Analytics */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Progress Analytics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Confidence Trend</h4>
                    <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-gray-400">Confidence improving over time</p>
                        <p className="text-sm text-gray-500">+15% this month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Skill Development</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Communication</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm text-gray-400">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Technical Skills</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                          </div>
                          <span className="text-sm text-gray-400">72%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Problem Solving</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                          <span className="text-sm text-gray-400">68%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportProfile}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareProfile}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Profile</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </motion.button>
                </div>
                
                {/* QR Code Display */}
                {showQRCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-800/50 rounded-lg text-center"
                  >
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-black" />
                    </div>
                    <p className="text-sm text-gray-400">Scan to view profile</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
