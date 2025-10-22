import React, { useState } from 'react';
import CameraFeed from './CameraFeed';

const CameraTest = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotionData, setEmotionData] = useState({ emotion: 'None', confidence: 0, eyeContact: 0 });

  const handleEmotionUpdate = (data) => {
    console.log('CameraTest: Received emotion data:', data);
    setEmotionData(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Camera Test</h1>
        
        <div className="mb-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? 'Stop Test' : 'Start Test'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Camera Feed</h2>
            <CameraFeed
              onEmotionUpdate={handleEmotionUpdate}
              sessionId="test-session"
              isActive={isActive}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Emotion Data</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <span className="text-gray-300">Current Emotion:</span>
                  <span className="text-white font-semibold ml-2">{emotionData.emotion}</span>
                </div>
                <div>
                  <span className="text-gray-300">Confidence:</span>
                  <span className="text-white font-semibold ml-2">{(emotionData.confidence * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-300">Eye Contact:</span>
                  <span className="text-white font-semibold ml-2">{(emotionData.eyeContact * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraTest;
