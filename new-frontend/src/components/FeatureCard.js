import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = 'from-blue-500 to-cyan-500',
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass rounded-xl p-6 card-hover ${className}`}
    >
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
