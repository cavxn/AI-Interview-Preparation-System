import openai
import os
from typing import Dict, List, Optional
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LLMService:
    def __init__(self):
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            print("⚠️  OpenAI API key not set or using placeholder - LLM features will use fallback mode")
            self.client = None
        else:
            try:
                self.client = openai.OpenAI(api_key=api_key)
                print("✅ OpenAI client initialized successfully")
            except Exception as e:
                print(f"⚠️  Failed to initialize OpenAI client: {e} - using fallback mode")
                self.client = None
        
    def analyze_interview_response(self, question: str, answer: str) -> Dict:
        """
        Analyze an interview response using LLM to provide detailed feedback
        """
        if not self.client:
            print("OpenAI client not available, using fallback analysis")
            return self._create_fallback_feedback(question, answer)
            
        try:
            prompt = f"""
            You are an expert interview coach. Analyze this interview response and provide detailed feedback.
            
            Question: {question}
            Answer: {answer}
            
            Please provide a structured analysis in JSON format with the following fields:
            {{
                "score": <integer from 0-100>,
                "overall_feedback": "<string>",
                "strengths": ["<strength1>", "<strength2>", ...],
                "improvements": ["<improvement1>", "<improvement2>", ...],
                "communication_score": <integer from 0-100>,
                "relevance_score": <integer from 0-100>,
                "confidence_score": <integer from 0-100>,
                "specific_suggestions": ["<suggestion1>", "<suggestion2>", ...]
            }}
            
            Focus on:
            - Clarity and structure of the response
            - Relevance to the question
            - Use of specific examples
            - Communication skills
            - Confidence level
            - Areas for improvement
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert interview coach providing detailed, constructive feedback."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            # Parse the JSON response
            feedback_text = response.choices[0].message.content.strip()
            
            # Try to extract JSON from the response
            try:
                # Look for JSON in the response
                start_idx = feedback_text.find('{')
                end_idx = feedback_text.rfind('}') + 1
                if start_idx != -1 and end_idx != 0:
                    json_str = feedback_text[start_idx:end_idx]
                    feedback = json.loads(json_str)
                else:
                    # Fallback if no JSON found
                    feedback = self._create_fallback_feedback(question, answer)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                feedback = self._create_fallback_feedback(question, answer)
            
            return feedback
            
        except Exception as e:
            print(f"Error in LLM analysis: {str(e)}")
            return self._create_fallback_feedback(question, answer)
    
    def _create_fallback_feedback(self, question: str, answer: str) -> Dict:
        """Create fallback feedback when LLM fails"""
        # Simple analysis based on answer length and keywords
        score = 60  # Base score
        
        # Analyze answer length
        if len(answer) > 100:
            score += 10
        if len(answer) > 200:
            score += 10
            
        # Check for specific keywords
        positive_keywords = ['experience', 'learned', 'challenge', 'success', 'team', 'project', 'example']
        keyword_count = sum(1 for keyword in positive_keywords if keyword.lower() in answer.lower())
        score += min(keyword_count * 5, 20)
        
        return {
            "score": min(score, 100),
            "overall_feedback": "Your response shows good effort. Consider adding more specific examples and details to strengthen your answer.",
            "strengths": ["Attempted to answer the question", "Showed engagement"] if len(answer) > 50 else [],
            "improvements": [
                "Provide more specific examples",
                "Add more detail to your response",
                "Use the STAR method (Situation, Task, Action, Result)"
            ],
            "communication_score": min(score, 100),
            "relevance_score": min(score + 10, 100),
            "confidence_score": min(score - 10, 100),
            "specific_suggestions": [
                "Try to include specific examples from your experience",
                "Structure your answer with clear points",
                "Practice speaking more confidently"
            ]
        }
    
    def generate_interview_questions(self, topic: str, difficulty: str = "medium", count: int = 5) -> List[str]:
        """Generate interview questions for a specific topic"""
        if not self.client:
            print("OpenAI client not available, using fallback questions")
            return self._get_fallback_questions(topic, count)
            
        try:
            prompt = f"""
            Generate {count} interview questions for the topic: {topic}
            Difficulty level: {difficulty}
            
            The questions should be:
            - Relevant to the topic
            - Appropriate for the difficulty level
            - Designed to assess both technical knowledge and soft skills
            - Mix of behavioral and situational questions
            
            Return as a JSON array of strings.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert interviewer creating comprehensive interview questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            questions_text = response.choices[0].message.content.strip()
            
            # Try to parse as JSON array
            try:
                questions = json.loads(questions_text)
                return questions if isinstance(questions, list) else []
            except json.JSONDecodeError:
                # Fallback questions based on topic
                return self._get_fallback_questions(topic, count)
                
        except Exception as e:
            print(f"Error generating interview questions: {str(e)}")
            return self._get_fallback_questions(topic, count)
    
    def _get_fallback_questions(self, topic: str, count: int) -> List[str]:
        """Fallback questions when LLM fails"""
        topic_questions = {
            "technical": [
                "Describe a complex technical problem you solved recently.",
                "How do you approach debugging a difficult issue?",
                "What's your experience with version control and collaboration?",
                "How do you ensure code quality in your projects?",
                "Describe your process for learning new technologies."
            ],
            "behavioral": [
                "Tell me about a time you had to work with a difficult team member.",
                "Describe a situation where you had to meet a tight deadline.",
                "Give me an example of a project you're particularly proud of.",
                "How do you handle constructive criticism?",
                "Describe a time when you had to learn something new quickly."
            ],
            "leadership": [
                "Describe a time when you had to lead a team through a challenging project.",
                "How do you motivate team members who are struggling?",
                "Tell me about a difficult decision you had to make as a leader.",
                "How do you handle conflict within your team?",
                "Describe a time when you had to give difficult feedback."
            ]
        }
        
        questions = topic_questions.get(topic.lower(), topic_questions["behavioral"])
        return questions[:count]

    def generate_follow_up_questions(self, question: str, answer: str) -> List[str]:
        """Generate follow-up questions based on the response"""
        if not self.client:
            print("OpenAI client not available, using fallback follow-up questions")
            return [
                "Can you provide more details about that?",
                "What was the outcome of that situation?"
            ]
            
        try:
            prompt = f"""
            Based on this interview exchange, generate 2-3 relevant follow-up questions:
            
            Original Question: {question}
            Answer: {answer}
            
            Generate questions that would help explore the candidate's experience deeper.
            Return as a JSON array of strings.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert interviewer generating relevant follow-up questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            questions_text = response.choices[0].message.content.strip()
            
            # Try to parse as JSON array
            try:
                questions = json.loads(questions_text)
                return questions if isinstance(questions, list) else []
            except json.JSONDecodeError:
                # Fallback questions
                return [
                    "Can you tell me more about that experience?",
                    "What was the most challenging part of that situation?",
                    "How did you measure the success of that project?"
                ]
                
        except Exception as e:
            print(f"Error generating follow-up questions: {str(e)}")
            return [
                "Can you provide more details about that?",
                "What was the outcome of that situation?"
            ]
    
    def analyze_comprehensive_response(self, question: str, answer: str, emotion_data: Dict) -> Dict:
        """Comprehensive analysis combining text and emotion data"""
        if not self.client:
            print("OpenAI client not available, using fallback comprehensive analysis")
            return self._create_comprehensive_fallback(question, answer, emotion_data)
            
        try:
            prompt = f"""
            You are an expert interview coach analyzing a candidate's response. Consider both the verbal response and emotional indicators.
            
            Question: {question}
            Answer: {answer}
            Emotional State: {emotion_data.get('emotion', 'Unknown')} (Confidence: {emotion_data.get('confidence', 0):.2f})
            Eye Contact Score: {emotion_data.get('eye_contact_score', 0):.2f}
            
            Provide a comprehensive analysis in JSON format with these fields:
            {{
                "overall_score": <integer 0-100>,
                "communication_score": <integer 0-100>,
                "confidence_score": <integer 0-100>,
                "emotional_stability": <integer 0-100>,
                "overall_feedback": "<string>",
                "strengths": ["<strength1>", "<strength2>", ...],
                "improvements": ["<improvement1>", "<improvement2>", ...],
                "emotional_insights": "<string about emotional state>",
                "specific_suggestions": ["<suggestion1>", "<suggestion2>", ...]
            }}
            
            Consider:
            - Content quality and relevance
            - Communication clarity
            - Emotional indicators (confidence, stability)
            - Eye contact and engagement
            - Areas for improvement
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert interview coach providing comprehensive feedback based on both verbal and non-verbal cues."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            analysis_text = response.choices[0].message.content.strip()
            
            # Try to extract JSON from the response
            try:
                start_idx = analysis_text.find('{')
                end_idx = analysis_text.rfind('}') + 1
                if start_idx != -1 and end_idx != 0:
                    json_str = analysis_text[start_idx:end_idx]
                    analysis = json.loads(json_str)
                else:
                    analysis = self._create_comprehensive_fallback(question, answer, emotion_data)
            except json.JSONDecodeError:
                analysis = self._create_comprehensive_fallback(question, answer, emotion_data)
            
            return analysis
            
        except Exception as e:
            print(f"Error in comprehensive analysis: {str(e)}")
            return self._create_comprehensive_fallback(question, answer, emotion_data)
    
    def _create_comprehensive_fallback(self, question: str, answer: str, emotion_data: Dict) -> Dict:
        """Create fallback analysis when LLM fails"""
        # Base scores
        overall_score = 60
        communication_score = 60
        confidence_score = int(emotion_data.get('confidence', 0.5) * 100)
        emotional_stability = int(emotion_data.get('eye_contact_score', 0.5) * 100)
        
        # Adjust based on answer length and content
        if len(answer) > 100:
            overall_score += 10
            communication_score += 10
        if len(answer) > 200:
            overall_score += 10
            communication_score += 10
        
        # Check for positive keywords
        positive_keywords = ['experience', 'learned', 'challenge', 'success', 'team', 'project', 'example']
        keyword_count = sum(1 for keyword in positive_keywords if keyword.lower() in answer.lower())
        overall_score += min(keyword_count * 5, 20)
        
        # Emotional insights
        emotion = emotion_data.get('emotion', 'Neutral')
        emotional_insights = f"Your emotional state shows {emotion.lower()} with {confidence_score}% confidence. "
        if emotion in ['Happy', 'Neutral']:
            emotional_insights += "This indicates good composure during the interview."
        elif emotion in ['Sad', 'Fear']:
            emotional_insights += "Consider practicing relaxation techniques to improve confidence."
        else:
            emotional_insights += "Your emotional state is appropriate for the interview context."
        
        return {
            "overall_score": min(overall_score, 100),
            "communication_score": min(communication_score, 100),
            "confidence_score": confidence_score,
            "emotional_stability": emotional_stability,
            "overall_feedback": "Your response shows good effort. Consider adding more specific examples and details to strengthen your answer.",
            "strengths": ["Attempted to answer the question", "Showed engagement"] if len(answer) > 50 else [],
            "improvements": [
                "Provide more specific examples",
                "Add more detail to your response",
                "Use the STAR method (Situation, Task, Action, Result)"
            ],
            "emotional_insights": emotional_insights,
            "specific_suggestions": [
                "Try to include specific examples from your experience",
                "Structure your answer with clear points",
                "Practice speaking more confidently",
                "Maintain good eye contact with the interviewer"
            ]
        }

# Create singleton instance
llm_service = LLMService()
