import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedCounter from '../components/AnimatedCounter';
import ProgressRing from '../components/ProgressRing';
import FeatureCard from '../components/FeatureCard';
import TestLogin from '../components/TestLogin';
import {
  Brain,
  Camera,
  Mic,
  BarChart3,
  Users,
  Award,
  Zap,
  Shield,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced emotion detection and real-time feedback using cutting-edge AI technology.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Camera,
      title: 'Real-time Video Analysis',
      description: 'Continuous monitoring of facial expressions, eye contact, and body language.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      title: 'Speech Recognition',
      description: 'Advanced speech-to-text with natural language processing for comprehensive feedback.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Detailed analytics and insights to track your improvement over time.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: 10000, label: 'Users Trained', suffix: '+' },
    { value: 95, label: 'Success Rate', suffix: '%' },
    { value: 50, label: 'Countries', suffix: '+' },
    { value: 4.9, label: 'Rating', suffix: '/5' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Google',
      content: 'This platform transformed my interview skills. I landed my dream job at Google!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Microsoft',
      content: 'The AI feedback is incredibly accurate. It helped me identify areas I never knew needed improvement.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      company: 'Amazon',
      content: 'The real-time analysis gave me confidence like never before. Highly recommended!',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 relative overflow-hidden">
      <ParticleBackground particleCount={30} color="#0ea5e9" />
      <TestLogin />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">AI-Powered Interview Training</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
              Master Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Interview Skills
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Practice interviews with AI-powered feedback, real-time emotion detection, 
              and personalized coaching to land your dream job.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl text-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-primary-500 text-primary-400 font-bold rounded-xl text-lg hover:bg-primary-500/10 transition-all duration-300"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix}
                    color="text-white"
                  />
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to ace your interviews with AI-powered insights and real-time feedback.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Try Our AI Analysis</h3>
            <p className="text-gray-400 mb-6">Experience real-time emotion detection and feedback</p>
            
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <ProgressRing progress={87} size={100} label="Confidence" />
              </div>
              <div className="text-center">
                <ProgressRing progress={92} size={100} label="Eye Contact" color="#10b981" />
              </div>
              <div className="text-center">
                <ProgressRing progress={78} size={100} label="Emotion" color="#f59e0b" />
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? '/interview' : '/login')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              {isAuthenticated ? 'Start Practice Session' : 'Login to Start Practice'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of professionals who've improved their interview skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of professionals who've already improved their interview skills
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl text-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey Today'}
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
