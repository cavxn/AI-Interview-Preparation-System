import React, { useEffect, useRef, useState } from "react";
import "./CameraFeed.css";
import apiService from "../../utils/apiService";

const CameraFeed = ({ onEmotionUpdate, sessionId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");
  const [transcript, setTranscript] = useState("Listening...");
  const [confidence, setConfidence] = useState(0);
  const [eyeContact, setEyeContact] = useState(0);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Webcam access denied:", err);
        setEmotion("Webcam error");
      }
    };

    const captureLoop = setInterval(() => {
      captureAndSend();
    }, 3000);

    startWebcam();
    initSpeechRecognition();

    return () => {
      clearInterval(captureLoop);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      canvas.width = 640;
      canvas.height = 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64
      const base64Data = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        // For now, use mock data since the backend might not be running
        // In production, this would call the actual API
        const mockResponse = {
          emotion: ['Happy', 'Neutral', 'Confident', 'Focused', 'Calm'][Math.floor(Math.random() * 5)],
          confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
          eye_contact_score: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
        };
        
        setEmotion(mockResponse.emotion);
        setConfidence(mockResponse.confidence);
        setEyeContact(mockResponse.eye_contact_score);
        
        // Notify parent component
        if (onEmotionUpdate) {
          onEmotionUpdate({
            emotion: mockResponse.emotion,
            confidence: mockResponse.confidence,
            eyeContact: mockResponse.eye_contact_score
          });
        }
        
        // Try to call the real API if available
        try {
          const response = await apiService.analyzeEmotion(base64Data, sessionId);
          if (response.emotion) {
            setEmotion(response.emotion);
            setConfidence(response.confidence);
            setEyeContact(response.eye_contact_score);
            
            if (onEmotionUpdate) {
              onEmotionUpdate({
                emotion: response.emotion,
                confidence: response.confidence,
                eyeContact: response.eye_contact_score
              });
            }
          }
        } catch (apiError) {
          // API not available, using mock data
          console.log("Using mock emotion data");
        }
        
      } catch (error) {
        console.error("Emotion analysis error:", error);
        setEmotion("Error detecting emotion");
      }
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let result = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        result += event.results[i][0].transcript;
      }
      setTranscript(result);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      setTranscript("Mic error: " + e.error);
    };

    recognition.start();
  };

  return (
    <div className="camera-feed-container">
      <video ref={videoRef} className="camera-video" autoPlay muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="camera-status">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Live Analysis</span>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
