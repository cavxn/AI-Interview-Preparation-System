import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import {
  User,
  Bell,
  Shield,
  Palette,
  Camera,
  Mic,
  Volume2,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Tablet,
  Lock,
  Key,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Settings2,
  Zap,
  Clock,
  Globe,
  Database,
  Code,
  Bug,
  Cpu,
  Wifi,
  HardDrive,
  Users,
  Link,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { sidebarCollapsed } = useTheme();
  
  const [settings, setSettings] = useState({
    // Profile Settings
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: '',
    timezone: 'UTC',
    language: 'en',
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    },
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    weeklyReports: true,
    
    // Privacy Settings
    dataSharing: false,
    analyticsTracking: true,
    sessionRecording: true,
    
    // Appearance Settings
    theme: theme,
    fontSize: 'medium',
    animations: true,
    
    // Audio/Video Settings
    microphone: 'default',
    camera: 'default',
    audioQuality: 'high',
    videoQuality: 'high',
    
    // Interview Settings
    questionCategories: ['behavioral', 'technical', 'leadership'],
    sessionDuration: 30,
    autoAdvance: true,
    realTimeFeedback: true,
    difficultyLevel: 'medium',
    customPrompts: [],
    scoringPreferences: {
      showScores: true,
      detailedFeedback: true,
      compareToAverage: false
    },
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordStrength: 'strong',
    
    // Accessibility Settings
    screenReader: false,
    keyboardNavigation: true,
    highContrast: false,
    reducedMotion: false,
    
    // Data Management
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: '1year',
    
    // Advanced Settings
    debugMode: false,
    performanceMode: 'balanced',
    apiRateLimit: 1000,
    cacheEnabled: true,
    
    // Keyboard Shortcuts
    shortcuts: {
      'ctrl+k': 'search',
      'ctrl+shift+s': 'settings',
      'ctrl+n': 'new-interview'
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on macOS', location: 'San Francisco, CA', active: true, lastActive: new Date() },
    { id: 2, device: 'iOS App', location: 'New York, NY', active: false, lastActive: new Date(Date.now() - 86400000) }
  ]);
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 45,
    memoryUsage: 68,
    storage: '2.1 GB used',
    network: 'Connected',
    uptime: '2 days, 14 hours'
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Password validation
  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.special = 'Password must contain at least one special character';
    }
    return errors;
  };

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordErrors({});
    
    // Validate new password
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (Object.keys(passwordValidation).length > 0) {
      setPasswordErrors(passwordValidation);
      return;
    }

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors({ match: 'Passwords do not match' });
      return;
    }

    // Check if current password is provided
    if (!passwordData.currentPassword) {
      setPasswordErrors({ current: 'Current password is required' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage('Password updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle data export
  const handleDataExport = async (type) => {
    setExportLoading(true);
    try {
      // Simulate API call to get data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock data based on type
      const exportData = type === 'all' ? {
        profile: {
          name: settings.name,
          email: settings.email,
          bio: settings.bio,
          timezone: settings.timezone,
          language: settings.language,
          socialLinks: settings.socialLinks
        },
        settings: settings,
        interviews: [
          { id: 1, date: '2024-01-15', score: 85, duration: 30 },
          { id: 2, date: '2024-01-10', score: 92, duration: 45 }
        ]
      } : {
        interviews: [
          { id: 1, date: '2024-01-15', score: 85, duration: 30, questions: ['Tell me about yourself', 'What are your strengths?'] },
          { id: 2, date: '2024-01-10', score: 92, duration: 45, questions: ['Describe a challenging project', 'How do you handle stress?'] }
        ]
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type === 'all' ? 'all-data' : 'interview-history'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage(`${type === 'all' ? 'All data' : 'Interview history'} exported successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // Handle session revocation
  const handleRevokeSession = async (sessionId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove session from list
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      setMessage('Session revoked successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to revoke session. Please try again.');
    }
  };

  // Handle 2FA setup
  const handle2FASetup = async () => {
    try {
      // Simulate API call to generate 2FA QR code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would open a modal with QR code
      setMessage('2FA setup initiated. Please check your authenticator app.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Failed to setup 2FA. Please try again.');
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('avatar', e.target.result);
        setMessage('Avatar updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle keyboard shortcut editing
  const handleShortcutEdit = (shortcut, newKey) => {
    const newShortcuts = { ...settings.shortcuts };
    delete newShortcuts[shortcut];
    newShortcuts[newKey] = settings.shortcuts[shortcut];
    handleInputChange('shortcuts', newShortcuts);
    setMessage('Shortcut updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Handle settings backup
  const handleSettingsBackup = async () => {
    try {
      const backupData = {
        settings: settings,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage('Settings backed up successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to backup settings. Please try again.');
    }
  };

  // Handle settings restore
  const handleSettingsRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target.result);
          if (backupData.settings) {
            setSettings(prev => ({ ...prev, ...backupData.settings }));
            setMessage('Settings restored successfully!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            setMessage('Invalid backup file format.');
          }
        } catch (error) {
          setMessage('Failed to restore settings. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle account deletion
  const handleAccountDeletion = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        setLoading(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          setMessage('Account deletion initiated. You will be logged out shortly.');
          // In a real app, this would redirect to logout
        } catch (error) {
          setMessage('Failed to delete account. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = `${event.ctrlKey ? 'ctrl+' : ''}${event.shiftKey ? 'shift+' : ''}${event.key.toLowerCase()}`;
      
      if (settings.shortcuts[key]) {
        event.preventDefault();
        const action = settings.shortcuts[key];
        
        switch (action) {
          case 'search':
            setMessage('Search shortcut activated!');
            setTimeout(() => setMessage(''), 2000);
            break;
          case 'settings':
            // Already on settings page
            setMessage('Settings page shortcut activated!');
            setTimeout(() => setMessage(''), 2000);
            break;
          case 'new-interview':
            setMessage('New interview shortcut activated!');
            setTimeout(() => setMessage(''), 2000);
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.shortcuts]);

  // Sync settings theme with context theme
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: theme
    }));
  }, [theme]);

  // Update system information periodically
  useEffect(() => {
    const updateSystemInfo = () => {
      setSystemInfo(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 30, // Random between 30-60%
        memoryUsage: Math.floor(Math.random() * 20) + 60, // Random between 60-80%
        uptime: `${Math.floor(Math.random() * 7)} days, ${Math.floor(Math.random() * 24)} hours`
      }));
    };

    // Update immediately and then every 30 seconds
    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      updateUser({
        ...user,
        name: settings.name,
        email: settings.email,
        bio: settings.bio
      });
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'audio-video', label: 'Audio/Video', icon: Camera },
    { id: 'interview', label: 'Interview', icon: Mic },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'advanced', label: 'Advanced', icon: Settings2 },
    { id: 'shortcuts', label: 'Shortcuts', icon: Zap }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            {settings.avatar ? (
              <img src={settings.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
            >
              Upload
            </label>
            <button
              onClick={() => handleInputChange('avatar', '')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
        <input
          type="text"
          value={settings.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
        <textarea
          value={settings.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
        <select
          value={settings.timezone}
          onChange={(e) => handleInputChange('timezone', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
        <select
          value={settings.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Social Links</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Link className="w-5 h-5 text-blue-400" />
            <input
              type="url"
              value={settings.socialLinks.linkedin}
              onChange={(e) => handleInputChange('socialLinks', { ...settings.socialLinks, linkedin: e.target.value })}
              placeholder="LinkedIn URL"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={settings.socialLinks.github}
              onChange={(e) => handleInputChange('socialLinks', { ...settings.socialLinks, github: e.target.value })}
              placeholder="GitHub URL"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-green-400" />
            <input
              type="url"
              value={settings.socialLinks.website}
              onChange={(e) => handleInputChange('socialLinks', { ...settings.socialLinks, website: e.target.value })}
              placeholder="Personal Website"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {[
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Get notified in your browser' },
        { key: 'sessionReminders', label: 'Session Reminders', description: 'Reminders for scheduled sessions' },
        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly progress summaries' }
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="font-semibold text-white">{item.label}</h4>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
          <button
            onClick={() => handleInputChange(item.key, !settings[item.key])}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings[item.key] ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings[item.key] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {[
        { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing anonymized data for research' },
        { key: 'analyticsTracking', label: 'Analytics Tracking', description: 'Help improve the service with usage analytics' },
        { key: 'sessionRecording', label: 'Session Recording', description: 'Allow recording of interview sessions' }
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="font-semibold text-white">{item.label}</h4>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
          <button
            onClick={() => handleInputChange(item.key, !settings[item.key])}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings[item.key] ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings[item.key] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>
          <button 
            onClick={handlePasswordChange}
            disabled={loading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          
          {/* Password validation errors */}
          {Object.keys(passwordErrors).length > 0 && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h4 className="text-red-300 font-semibold mb-2">Password Requirements:</h4>
              <ul className="text-red-400 text-sm space-y-1">
                {Object.entries(passwordErrors).map(([key, error]) => (
                  <li key={key} className="flex items-center space-x-2">
                    <span className="text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="font-semibold text-white">Enable 2FA</h4>
            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => {
              if (!settings.twoFactorAuth) {
                handle2FASetup();
              }
              handleInputChange('twoFactorAuth', !settings.twoFactorAuth);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.twoFactorAuth ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Session Settings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Session Security</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">Login Notifications</h4>
              <p className="text-sm text-gray-400">Get notified when someone logs into your account</p>
            </div>
            <button
              onClick={() => handleInputChange('loginNotifications', !settings.loginNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.loginNotifications ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{session.device}</h4>
                  <p className="text-sm text-gray-400">
                    {session.location} • Last active: {session.lastActive.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {session.active ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Active</span>
                  ) : (
                    <button 
                      onClick={() => handleRevokeSession(session.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Theme 
          <span className="ml-2 px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs">
            Current: {theme === 'dark' ? '🌙 Dark' : theme === 'light' ? '☀️ Light' : '🔄 Auto'}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'auto', label: 'Auto', icon: Monitor }
          ].map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.id}
                onClick={() => {
                  if (themeOption.id === 'light') {
                    if (theme !== 'light') {
                      toggleTheme(); // This will switch to light
                      setMessage('Theme changed to Light mode!');
                      setTimeout(() => setMessage(''), 3000);
                    }
                  } else if (themeOption.id === 'dark') {
                    if (theme !== 'dark') {
                      toggleTheme(); // This will switch to dark
                      setMessage('Theme changed to Dark mode!');
                      setTimeout(() => setMessage(''), 3000);
                    }
                  } else if (themeOption.id === 'auto') {
                    // For auto theme, we could implement system preference detection
                    // For now, we'll just update the setting without changing the actual theme
                    handleInputChange('theme', 'auto');
                    setMessage('Auto theme will follow system preferences');
                    setTimeout(() => setMessage(''), 3000);
                    return;
                  }
                  handleInputChange('theme', themeOption.id);
                }}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  theme === themeOption.id
                    ? 'border-primary-500 bg-primary-500/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <Icon className="w-6 h-6 mb-2 text-white" />
                <span className="text-sm text-white">{themeOption.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
        <select
          value={settings.fontSize}
          onChange={(e) => handleInputChange('fontSize', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
        <div>
          <h4 className="font-semibold text-white">Animations</h4>
          <p className="text-sm text-gray-400">Enable smooth animations and transitions</p>
        </div>
        <button
          onClick={() => handleInputChange('animations', !settings.animations)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.animations ? 'bg-primary-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.animations ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderAudioVideoSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Microphone</label>
        <select
          value={settings.microphone}
          onChange={(e) => handleInputChange('microphone', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="default">Default</option>
          <option value="external">External Microphone</option>
          <option value="bluetooth">Bluetooth</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Camera</label>
        <select
          value={settings.camera}
          onChange={(e) => handleInputChange('camera', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="default">Default</option>
          <option value="external">External Camera</option>
          <option value="hd">HD Camera</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Audio Quality</label>
        <select
          value={settings.audioQuality}
          onChange={(e) => handleInputChange('audioQuality', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Video Quality</label>
        <select
          value={settings.videoQuality}
          onChange={(e) => handleInputChange('videoQuality', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );

  const renderInterviewSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Question Categories</label>
        <div className="space-y-2">
          {[
            { id: 'behavioral', label: 'Behavioral Questions' },
            { id: 'technical', label: 'Technical Questions' },
            { id: 'leadership', label: 'Leadership Questions' },
            { id: 'situational', label: 'Situational Questions' },
            { id: 'case-study', label: 'Case Study Questions' }
          ].map((category) => (
            <label key={category.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.questionCategories.includes(category.id)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...settings.questionCategories, category.id]
                    : settings.questionCategories.filter(c => c !== category.id);
                  handleInputChange('questionCategories', newCategories);
                }}
                className="w-4 h-4 text-primary-500 bg-gray-800 border-gray-600 rounded focus:ring-primary-500"
              />
              <span className="text-white">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
        <select
          value={settings.difficultyLevel}
          onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Session Duration (minutes)</label>
        <select
          value={settings.sessionDuration}
          onChange={(e) => handleInputChange('sessionDuration', parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>60 minutes</option>
          <option value={90}>90 minutes</option>
        </select>
      </div>

      {/* Scoring Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Scoring Preferences</label>
        <div className="space-y-3">
          {[
            { key: 'showScores', label: 'Show Scores', description: 'Display scores during and after interviews' },
            { key: 'detailedFeedback', label: 'Detailed Feedback', description: 'Provide comprehensive feedback on responses' },
            { key: 'compareToAverage', label: 'Compare to Average', description: 'Compare your performance to other users' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h4 className="font-semibold text-white">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <button
                onClick={() => handleInputChange('scoringPreferences', { 
                  ...settings.scoringPreferences, 
                  [item.key]: !settings.scoringPreferences[item.key] 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.scoringPreferences[item.key] ? 'bg-primary-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.scoringPreferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'autoAdvance', label: 'Auto Advance', description: 'Automatically move to next question' },
          { key: 'realTimeFeedback', label: 'Real-time Feedback', description: 'Get instant feedback during sessions' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">{item.label}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
            <button
              onClick={() => handleInputChange(item.key, !settings[item.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[item.key] ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      {[
        { key: 'screenReader', label: 'Screen Reader Support', description: 'Optimize for screen reader compatibility' },
        { key: 'keyboardNavigation', label: 'Keyboard Navigation', description: 'Enable full keyboard navigation support' },
        { key: 'highContrast', label: 'High Contrast Mode', description: 'Increase color contrast for better visibility' },
        { key: 'reducedMotion', label: 'Reduce Motion', description: 'Minimize animations and transitions' }
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="font-semibold text-white">{item.label}</h4>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
          <button
            onClick={() => handleInputChange(item.key, !settings[item.key])}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings[item.key] ? 'bg-primary-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings[item.key] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      {/* Backup Settings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Backup</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">Auto Backup</h4>
              <p className="text-sm text-gray-400">Automatically backup your data</p>
            </div>
            <button
              onClick={() => handleInputChange('autoBackup', !settings.autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoBackup ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Export</h3>
        <div className="space-y-3">
          <button 
            onClick={() => handleDataExport('all')}
            disabled={exportLoading}
            className="flex items-center space-x-3 w-full p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 text-primary-400" />
            <div className="text-left">
              <h4 className="font-semibold text-white">Export All Data</h4>
              <p className="text-sm text-gray-400">Download your complete data as JSON</p>
            </div>
          </button>
          <button 
            onClick={() => handleDataExport('interviews')}
            disabled={exportLoading}
            className="flex items-center space-x-3 w-full p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <h4 className="font-semibold text-white">Export Interview History</h4>
              <p className="text-sm text-gray-400">Download your interview sessions</p>
            </div>
          </button>
        </div>
      </div>

      {/* Data Retention */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Retention</h3>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Keep data for</label>
          <select
            value={settings.dataRetention}
            onChange={(e) => handleInputChange('dataRetention', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
          >
            <option value="6months">6 months</option>
            <option value="1year">1 year</option>
            <option value="2years">2 years</option>
            <option value="forever">Forever</option>
          </select>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/30 rounded-lg p-6 bg-red-900/10">
        <h3 className="text-lg font-semibold text-red-300 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
                setMessage('Data deletion initiated. This process cannot be undone.');
                setTimeout(() => setMessage(''), 5000);
              }
            }}
            className="flex items-center space-x-3 w-full p-4 bg-red-900/20 rounded-lg hover:bg-red-900/30 transition-colors border border-red-500/30"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
            <div className="text-left">
              <h4 className="font-semibold text-red-300">Delete All Data</h4>
              <p className="text-sm text-red-400">Permanently delete all your data</p>
            </div>
          </button>
          <button 
            onClick={handleAccountDeletion}
            disabled={loading}
            className="flex items-center space-x-3 w-full p-4 bg-red-900/20 rounded-lg hover:bg-red-900/30 transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
            <div className="text-left">
              <h4 className="font-semibold text-red-300">Delete Account</h4>
              <p className="text-sm text-red-400">Permanently delete your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      {/* Debug Settings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Debug & Development</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">Debug Mode</h4>
              <p className="text-sm text-gray-400">Enable detailed logging and debugging tools</p>
            </div>
            <button
              onClick={() => handleInputChange('debugMode', !settings.debugMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.debugMode ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">Cache Enabled</h4>
              <p className="text-sm text-gray-400">Enable caching for better performance</p>
            </div>
            <button
              onClick={() => handleInputChange('cacheEnabled', !settings.cacheEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.cacheEnabled ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.cacheEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Performance Mode</label>
            <select
              value={settings.performanceMode}
              onChange={(e) => handleInputChange('performanceMode', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            >
              <option value="power-save">Power Save</option>
              <option value="balanced">Balanced</option>
              <option value="performance">High Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">API Rate Limit (requests/hour)</label>
            <input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              min="100"
              max="10000"
            />
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Backup & Restore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleSettingsBackup}
            className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <Download className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <h4 className="font-semibold text-white">Backup Settings</h4>
              <p className="text-sm text-gray-400">Download settings backup</p>
            </div>
          </button>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Upload className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Restore Settings</h4>
            </div>
            <p className="text-sm text-gray-400 mb-3">Upload settings backup</p>
            <input
              type="file"
              accept=".json"
              onChange={handleSettingsRestore}
              className="hidden"
              id="restore-settings"
            />
            <label
              htmlFor="restore-settings"
              className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Restore
            </label>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">CPU Usage</h4>
            </div>
            <p className="text-sm text-gray-400">{systemInfo.cpuUsage}%</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <HardDrive className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">Memory</h4>
            </div>
            <p className="text-sm text-gray-400">{systemInfo.memoryUsage}%</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <HardDrive className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">Storage</h4>
            </div>
            <p className="text-sm text-gray-400">{systemInfo.storage}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Wifi className="w-5 h-5 text-purple-400" />
              <h4 className="font-semibold text-white">Network</h4>
            </div>
            <p className="text-sm text-gray-400">{systemInfo.network}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Uptime</h4>
            </div>
            <p className="text-sm text-gray-400">{systemInfo.uptime}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShortcutsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-4">
          {Object.entries(settings.shortcuts).map(([key, action]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h4 className="font-semibold text-white">{action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                <p className="text-sm text-gray-400">Keyboard shortcut</p>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">{key}</kbd>
                <button 
                  onClick={() => {
                    const newKey = prompt('Enter new keyboard shortcut (e.g., ctrl+shift+n):');
                    if (newKey && newKey !== key) {
                      handleShortcutEdit(key, newKey);
                    }
                  }}
                  className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Reset to Defaults</h4>
            </div>
            <p className="text-sm text-gray-400 mb-3">Reset all shortcuts to default values</p>
            <button 
              onClick={() => {
                const defaultShortcuts = {
                  'ctrl+k': 'search',
                  'ctrl+shift+s': 'settings',
                  'ctrl+n': 'new-interview'
                };
                handleInputChange('shortcuts', defaultShortcuts);
                setMessage('Shortcuts reset to defaults!');
                setTimeout(() => setMessage(''), 3000);
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Upload className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Import Shortcuts</h4>
            </div>
            <p className="text-sm text-gray-400 mb-3">Import shortcuts from a file</p>
            <input
              type="file"
              accept=".json"
              onChange={handleSettingsRestore}
              className="hidden"
              id="import-shortcuts"
            />
            <label
              htmlFor="import-shortcuts"
              className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Import
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'accessibility':
        return renderAccessibilitySettings();
      case 'audio-video':
        return renderAudioVideoSettings();
      case 'interview':
        return renderInterviewSettings();
      case 'data':
        return renderDataSettings();
      case 'advanced':
        return renderAdvancedSettings();
      case 'shortcuts':
        return renderShortcutsSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 transition-colors duration-300 flex">
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
                ⚙️ Settings
              </h1>
              <p className="text-gray-400">
                Customize your AI Interview Coach experience
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  toggleTheme();
                  setMessage(`Theme changed to ${theme === 'dark' ? 'Light' : 'Dark'} mode!`);
                  setTimeout(() => setMessage(''), 3000);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Dark</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-900/20 border border-green-500/30 text-green-300'
                  : 'bg-red-900/20 border border-red-500/30 text-red-300'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-xl p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {tabs.find(tab => tab.id === activeTab)?.label} Settings
                  </h2>
                </div>

                {renderTabContent()}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
