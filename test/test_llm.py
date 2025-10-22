#!/usr/bin/env python3
"""
Test script to verify LLM integration is working
"""
import os
import sys
sys.path.append('backend')

from backend.llm_service import llm_service

def test_llm_integration():
    """Test the LLM service with a sample interview question"""
    print("🤖 Testing LLM Integration...")
    
    try:
        # Test question and answer
        question = "Tell me about a challenging project you worked on"
        answer = "I worked on a complex e-commerce platform where I had to integrate multiple payment systems and ensure high availability. The main challenge was handling peak traffic during Black Friday sales. I implemented caching strategies and database optimization which improved performance by 40%."
        
        print(f"📝 Question: {question}")
        print(f"💬 Answer: {answer}")
        print("\n🔄 Analyzing with LLM...")
        
        # Get analysis from LLM
        analysis = llm_service.analyze_interview_response(question, answer)
        
        print("\n✅ LLM Analysis Results:")
        print(f"📊 Overall Score: {analysis.get('score', 'N/A')}/100")
        print(f"💭 Overall Feedback: {analysis.get('overall_feedback', 'N/A')}")
        
        if 'strengths' in analysis and analysis['strengths']:
            print(f"💪 Strengths:")
            for strength in analysis['strengths']:
                print(f"   • {strength}")
        
        if 'improvements' in analysis and analysis['improvements']:
            print(f"🔧 Areas for Improvement:")
            for improvement in analysis['improvements']:
                print(f"   • {improvement}")
        
        if 'specific_suggestions' in analysis and analysis['specific_suggestions']:
            print(f"💡 Specific Suggestions:")
            for suggestion in analysis['specific_suggestions']:
                print(f"   • {suggestion}")
        
        print("\n🎯 Detailed Scores:")
        print(f"   • Communication: {analysis.get('communication_score', 'N/A')}/100")
        print(f"   • Relevance: {analysis.get('relevance_score', 'N/A')}/100")
        print(f"   • Confidence: {analysis.get('confidence_score', 'N/A')}/100")
        
        # Test follow-up questions
        print("\n🔄 Generating follow-up questions...")
        follow_up_questions = llm_service.generate_follow_up_questions(question, answer)
        
        if follow_up_questions:
            print("❓ Follow-up Questions:")
            for i, q in enumerate(follow_up_questions, 1):
                print(f"   {i}. {q}")
        
        print("\n✅ LLM Integration Test PASSED! 🎉")
        return True
        
    except Exception as e:
        print(f"\n❌ LLM Integration Test FAILED: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_llm_integration()
    sys.exit(0 if success else 1)
