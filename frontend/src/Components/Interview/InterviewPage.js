import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar';
import PageWrapper from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Pagewrapper/PageWrapper.js';
import CameraFeed from '../Camera/CameraFeed';
import './InterviewPage.css';
import apiService from '../../utils/apiService';

// AI-generated interview questions
const questionCategories = {
  technical: [
    "Explain a complex technical concept you've worked with recently.",
    "How do you approach debugging a difficult problem?",
    "Describe your experience with version control and collaboration tools.",
    "What's your process for learning new technologies?"
  ],
  behavioral: [
    "Tell me about a time you had to work with a difficult team member.",
    "Describe a situation where you had to meet a tight deadline.",
    "Give me an example of a project you're particularly proud of.",
    "How do you handle constructive criticism?"
  ],
  leadership: [
    "Describe a time when you had to lead a team through a challenging project.",
    "How do you motivate team members who are struggling?",
    "Tell me about a difficult decision you had to make as a leader.",
    "How do you handle conflict within your team?"
  ]
};

const InterviewPage = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState('behavioral');
  const [timer, setTimer] = useState(120); // 2 minutes per question
  const [sessionId, setSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [emotionData, setEmotionData] = useState({ emotion: 'Detecting...', confidence: 0, eyeContact: 0 });
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    averageConfidence: 0,
    totalTime: 0
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      console.log('❌ User not authenticated, redirecting to login');
      navigate('/');
      return;
    }
    console.log('✅ User authenticated, interview page loaded');
  }, [navigate]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isSessionActive && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isSessionActive, timer]);

  const startSession = async () => {
    try {
      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        alert('Please login first to start a session.');
        navigate('/');
        return;
      }

      console.log('🚀 Starting interview session...');
      const session = await apiService.createSession();
      console.log('✅ Session created:', session);
      
      setSessionId(session.id);
      setIsSessionActive(true);
      generateNewQuestion();
      
      console.log('🎉 Session started successfully!');
    } catch (error) {
      console.error('❌ Error starting session:', error);
      
      // Provide more specific error messages
      if (error.message.includes('401') || error.message.includes('403')) {
        alert('Authentication failed. Please login again.');
        navigate('/');
      } else if (error.message.includes('Network')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(`Failed to start session: ${error.message}`);
      }
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    
    try {
      await apiService.updateSession(sessionId, {
        end_time: new Date().toISOString(),
        duration_seconds: sessionStats.totalTime,
        total_questions: sessionStats.questionsAnswered
      });
      alert('Session ended successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending session:', error);
      alert('Failed to end session properly.');
    }
  };

  const generateNewQuestion = () => {
    const categoryQuestions = questionCategories[currentCategory];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const newQuestion = categoryQuestions[randomIndex];
    setCurrentQuestion(newQuestion);
    setTimer(120); // Reset timer for new question
    setTranscript('');
    setAiFeedback('');
  };

  const nextQuestion = () => {
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      totalTime: prev.totalTime + (120 - timer)
    }));
    generateNewQuestion();
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!transcript.trim()) {
      alert('Please provide an answer before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Call the real LLM analysis API
      const response = await apiService.analyzeAnswer(currentQuestion, transcript);
      setAiFeedback(response.analysis);
    } catch (error) {
      console.error('Error analyzing answer:', error);
      // Fallback to local analysis if API fails
      const feedback = generateAIFeedback(transcript, currentQuestion);
      setAiFeedback(feedback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIFeedback = (answer, question) => {
    // Simple AI feedback generation (replace with actual AI service)
    const feedback = {
      strengths: [],
      improvements: [],
      score: Math.floor(Math.random() * 40) + 60, // 60-100 score
      overall: ''
    };

    // Analyze answer length
    if (answer.length > 200) {
      feedback.strengths.push('Good detail and depth in your response');
    } else {
      feedback.improvements.push('Try to provide more specific examples and details');
    }

    // Analyze keywords
    const positiveKeywords = ['experience', 'learned', 'challenge', 'success', 'team', 'project'];
    const hasPositiveKeywords = positiveKeywords.some(keyword => 
      answer.toLowerCase().includes(keyword)
    );

    if (hasPositiveKeywords) {
      feedback.strengths.push('Good use of relevant keywords and examples');
    } else {
      feedback.improvements.push('Include more specific examples from your experience');
    }

    // Generate overall feedback
    if (feedback.score >= 80) {
      feedback.overall = 'Excellent answer! You demonstrated strong communication skills and provided relevant examples.';
    } else if (feedback.score >= 70) {
      feedback.overall = 'Good answer with room for improvement. Consider adding more specific examples.';
    } else {
      feedback.overall = 'Your answer could be stronger. Try to be more specific and provide concrete examples.';
    }

    return feedback;
  };

  const handleEmotionUpdate = (data) => {
    setEmotionData(data);
    // Update session stats with emotion data
    setSessionStats(prev => ({
      ...prev,
      averageConfidence: (prev.averageConfidence + data.confidence) / 2
    }));
  };

  return (
    <PageWrapper>
      <div className="dashboard-wrapper">
        <Sidebar collapsedByDefault={true} />

        <div className="interview-container" style={{ marginLeft: '60px' }}>
          <div className="interview-header">
            <h1>🎤 AI Interview Coach</h1>
            <p>Real-time analysis with AI feedback and emotion detection</p>
            <div className="session-stats">
              <span>Questions: {sessionStats.questionsAnswered}</span>
              <span>Confidence: {(sessionStats.averageConfidence * 100).toFixed(1)}%</span>
              <span>Time: {Math.floor(sessionStats.totalTime / 60)}m {sessionStats.totalTime % 60}s</span>
            </div>
          </div>

          <div className="interview-main-grid">
            {/* Real-time Emotion Analysis */}
            <div className="emotion-panel left">
              <h4>🎭 Real-time Analysis</h4>
              <div className="emotion-display">
                <div className="emotion-item">
                  <span className="label">Emotion:</span>
                  <span className="value emotion">{emotionData.emotion}</span>
                </div>
                <div className="emotion-item">
                  <span className="label">Confidence:</span>
                  <span className="value confidence">{(emotionData.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="emotion-item">
                  <span className="label">Eye Contact:</span>
                  <span className="value eye-contact">{(emotionData.eyeContact * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Camera Feed */}
            <div className="camera-wrapper">
              <CameraFeed onEmotionUpdate={handleEmotionUpdate} sessionId={sessionId} />
            </div>

            {/* AI Feedback Panel */}
            <div className="ai-feedback-panel right">
              <h4>🤖 AI Feedback</h4>
              {aiFeedback ? (
                <div className="feedback-content">
                  <div className="feedback-score">
                    Score: {aiFeedback.score}/100
                  </div>
                  <div className="feedback-overall">
                    {aiFeedback.overall}
                  </div>
                  {aiFeedback.strengths.length > 0 && (
                    <div className="feedback-strengths">
                      <strong>Strengths:</strong>
                      <ul>
                        {aiFeedback.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiFeedback.improvements.length > 0 && (
                    <div className="feedback-improvements">
                      <strong>Improvements:</strong>
                      <ul>
                        {aiFeedback.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>Complete your answer to get AI feedback</p>
              )}
            </div>
          </div>

          {/* Question Section */}
          <div className="question-section">
            <div className="question-header">
              <div className="question-category">
                <label>Category:</label>
                <select 
                  value={currentCategory} 
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  disabled={isSessionActive}
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="leadership">Leadership</option>
                </select>
              </div>
              <div className="timer-display">
                <span className="timer">⏱ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="question-box">
              <h3>📝 Current Question</h3>
              <p className="question-text">{currentQuestion || "Click 'Start Session' to begin"}</p>
            </div>

            {/* Speech Recognition Section */}
            <div className="speech-section">
              <h4>🎙️ Your Answer</h4>
              <div className="speech-controls">
                <button 
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!isSessionActive}
                >
                  {isListening ? '🛑 Stop Recording' : '🎤 Start Recording'}
                </button>
                <button 
                  className="analyze-btn"
                  onClick={analyzeAnswer}
                  disabled={!transcript.trim() || isAnalyzing}
                >
                  {isAnalyzing ? '🔄 Analyzing...' : '🤖 Analyze Answer'}
                </button>
              </div>
              
              <div className="transcript-display">
                <h5>Your Response:</h5>
                <div className="transcript-text">
                  {transcript || "Start speaking to see your response here..."}
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="session-controls">
              {!isSessionActive ? (
                <button className="start-btn" onClick={startSession}>
                  🚀 Start Interview Session
                </button>
              ) : (
                <div className="active-session-controls">
                  <button className="next-btn" onClick={nextQuestion}>
                    ➡️ Next Question
                  </button>
                  <button className="end-btn" onClick={endSession}>
                    🏁 End Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default InterviewPage;
