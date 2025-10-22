import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

const CameraFeed = ({ onEmotionUpdate, sessionId, isActive = false }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastEmotionData, setLastEmotionData] = useState({
    emotion: 'Detecting...',
    confidence: 0,
    eyeContact: 0
  });
  const emotionIntervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const [cameraPermission, setCameraPermission] = useState(null);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate fake emotions - shuffle 7 specific emotions every 6 seconds
  const emotions = ['Happy', 'Confident', 'Focused', 'Engaged', 'Calm', 'Determined', 'Neutral'];
  const [shuffledEmotions, setShuffledEmotions] = useState(() => {
    const initialShuffle = shuffleArray(emotions);
    console.log('CameraFeed: Initial shuffle:', initialShuffle);
    return initialShuffle;
  });
  const [emotionIndex, setEmotionIndex] = useState(0);
  
  const generateFakeEmotion = () => {
    // Get current emotion from shuffled array
    const currentEmotion = shuffledEmotions[emotionIndex];
    const randomConfidence = Math.random() * 0.4 + 0.6; // 60-100%
    const randomEyeContact = Math.random() * 0.3 + 0.7; // 70-100%
    
    const emotionData = {
      emotion: currentEmotion,
      confidence: randomConfidence,
      eyeContact: randomEyeContact,
      timestamp: new Date().toISOString()
    };
    
    console.log('CameraFeed: Generating emotion:', emotionData, 'Index:', emotionIndex, 'Shuffled:', shuffledEmotions);
    setLastEmotionData(emotionData);
    onEmotionUpdate(emotionData);
    
    // Move to next emotion in shuffled array
    const nextIndex = (emotionIndex + 1) % shuffledEmotions.length;
    setEmotionIndex(nextIndex);
    
    // If we've gone through all emotions, reshuffle for next cycle
    if (nextIndex === 0) {
      const newShuffled = shuffleArray(emotions);
      console.log('CameraFeed: Reshuffling emotions:', newShuffled);
      setShuffledEmotions(newShuffled);
      setEmotionIndex(0); // Reset index for new shuffled array
    }
    
    // Force a re-render to ensure state updates
    console.log('CameraFeed: Next emotion will be:', shuffledEmotions[nextIndex]);
    
    // Fallback: if somehow the emotion is still the same, force a random one
    if (currentEmotion === lastEmotionData.emotion) {
      console.log('CameraFeed: Emotion stuck, forcing random emotion');
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const fallbackData = {
        emotion: randomEmotion,
        confidence: randomConfidence,
        eyeContact: randomEyeContact,
        timestamp: new Date().toISOString()
      };
      setLastEmotionData(fallbackData);
      onEmotionUpdate(fallbackData);
    }
  };

  // Check camera permissions first
  const checkCameraPermission = useCallback(async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(permissionStatus.state);
      return permissionStatus.state;
    } catch (err) {
      console.log('CameraFeed: Permission API not supported, will check during getUserMedia');
      return 'unknown';
    }
  }, []);

  // Simple camera start - just get stream and set streaming state
  const startCameraSimple = useCallback(async () => {
    try {
      setError('');
      console.log('CameraFeed: Starting simple camera method...');
      
      // Get the stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('CameraFeed: Stream obtained successfully');
      streamRef.current = stream;
      
      // Set streaming state immediately
      setIsStreaming(true);
      setIsInitialized(true);
      
      // Try to attach to video element if it exists
      if (videoRef.current) {
        console.log('CameraFeed: Video element found, attaching stream');
        videoRef.current.srcObject = stream;
        
        // Enhanced event handlers for better video display
        videoRef.current.onloadedmetadata = () => {
          console.log('CameraFeed: Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('CameraFeed: Video started playing successfully');
            }).catch(err => {
              console.error('CameraFeed: Error playing video:', err);
            });
          }
        };
        
        videoRef.current.oncanplay = () => {
          console.log('CameraFeed: Video can play');
        };
        
        videoRef.current.onloadeddata = () => {
          console.log('CameraFeed: Video data loaded');
        };
        
        // Force play after a short delay
        setTimeout(() => {
          if (videoRef.current && videoRef.current.srcObject) {
            console.log('CameraFeed: Force playing video');
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      } else {
        console.log('CameraFeed: No video element, but camera is working');
      }
      
      // Start emotion generation
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
      
      emotionIntervalRef.current = setInterval(generateFakeEmotion, 4000);
      generateFakeEmotion();
      
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application. Please close other apps and try again.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
    }
  }, []);

  // Original camera start method (kept as fallback)
  const startCamera = useCallback(async () => {
    try {
      setError('');
      console.log('CameraFeed: Starting camera initialization...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('CameraFeed: Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('CameraFeed: Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('CameraFeed: Video started playing');
              setIsStreaming(true);
              setIsInitialized(true);
            }).catch(err => {
              console.error('CameraFeed: Error playing video:', err);
              setError('Failed to play video stream');
            });
          }
        };
        
        videoRef.current.oncanplay = () => {
          console.log('CameraFeed: Video can play');
          setIsStreaming(true);
          setIsInitialized(true);
        };
        
        videoRef.current.onerror = (err) => {
          console.error('CameraFeed: Video error:', err);
          setError('Video stream error occurred');
        };
      } else {
        console.log('CameraFeed: No video element, but stream is ready');
        setIsStreaming(true);
        setIsInitialized(true);
      }
      
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
      
      emotionIntervalRef.current = setInterval(generateFakeEmotion, 4000);
      generateFakeEmotion();
      
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application. Please close other apps and try again.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
    }
  }, []);

  // Initialize component
  useEffect(() => {
    console.log('CameraFeed: Component mounted, videoRef.current:', videoRef.current);
    
    // Check camera permissions on mount
    checkCameraPermission();
  }, [checkCameraPermission]);

  // Ensure video element gets stream when available
  useEffect(() => {
    if (isStreaming && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      console.log('CameraFeed: Attaching stream to video element');
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isStreaming]);

  // Auto-start when active
  useEffect(() => {
    if (isActive) {
      console.log('CameraFeed: Session is active, starting emotion generation');
      
      // Start emotion generation immediately, regardless of camera status
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
      
      // Generate first emotion immediately
      generateFakeEmotion();
      
      // Set up interval for continuous generation (every 4 seconds)
      emotionIntervalRef.current = setInterval(generateFakeEmotion, 4000);
      
      // Try simple camera method first
      console.log('CameraFeed: Auto-starting camera with simple method...');
      setTimeout(() => {
        console.log('CameraFeed: Attempting simple camera start');
        startCameraSimple().catch(err => {
          console.log('CameraFeed: Simple method failed, trying original method:', err);
          startCamera().catch(err2 => {
            console.log('CameraFeed: Both methods failed, but emotions will continue:', err2);
          });
        });
      }, 500);
    } else {
      console.log('CameraFeed: Session is not active, stopping emotion generation');
      // Clear emotion generation when not active
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
        emotionIntervalRef.current = null;
      }
      // Stop camera when not active
      setIsStreaming(false);
      setIsInitialized(false);
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isActive, startCameraSimple, startCamera]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* Video Feed */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
        {isStreaming ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl"
              style={{ transform: 'scaleX(-1)' }} // Mirror the video for natural selfie view
              onLoadedMetadata={() => {
                console.log('CameraFeed: Video metadata loaded in render');
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              onCanPlay={() => {
                console.log('CameraFeed: Video can play in render');
              }}
              onError={(e) => {
                console.error('CameraFeed: Video error in render:', e);
              }}
            />
            {/* Live indicator */}
            <div className="absolute top-2 left-2 flex items-center space-x-2 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-semibold">LIVE</span>
            </div>
            {/* Emotion indicator */}
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-semibold">{lastEmotionData.emotion}</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-300">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <Camera className="w-10 h-10 text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Camera Ready</h3>
            <p className="text-sm text-gray-400 mb-4">Click to start your live video feed</p>
            <button
              onClick={() => {
                console.log('CameraFeed: Manual start button clicked, trying simple method');
                startCameraSimple().catch(err => {
                  console.log('CameraFeed: Simple method failed, trying original:', err);
                  startCamera().catch(err2 => {
                    console.log('CameraFeed: Both methods failed:', err2);
                  });
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
            >
              Start Camera
            </button>
            <div className="flex items-center justify-center space-x-2 text-xs text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Live streaming available</span>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="absolute top-4 right-4">
        <button
          onClick={isStreaming ? () => {
            setIsStreaming(false);
            if (videoRef.current && videoRef.current.srcObject) {
              const tracks = videoRef.current.srcObject.getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
          } : startCamera}
          className={`p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm ${
            isStreaming
              ? 'bg-red-500/90 hover:bg-red-600/90 text-white border border-red-400/50'
              : 'bg-blue-500/90 hover:bg-blue-600/90 text-white border border-blue-400/50'
          }`}
          title={isStreaming ? 'Stop Camera' : 'Start Camera'}
        >
          {isStreaming ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
        </button>
      </div>


      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-red-300">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm mb-4">{error}</p>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setError('');
                  retryCountRef.current = 0;
                  console.log('CameraFeed: Retry button clicked, trying simple method');
                  startCameraSimple().catch(err => {
                    console.log('CameraFeed: Simple retry failed, trying original:', err);
                    startCamera().catch(err2 => {
                      console.log('CameraFeed: Both retry methods failed:', err2);
                    });
                  });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Retry
              </button>
              <button
                onClick={() => setError('')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;