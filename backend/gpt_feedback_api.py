from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()

# CORS setup (adjust allowed origins for security in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your OpenAI API key
openai.api_key = os.getenv("AIzaSyBV_98FBoLos3c1KIEi6ucxHhkcG3s8QG0")

@app.post("/gpt-feedback")
async def gpt_feedback(request: Request):
    data = await request.json()
    questions = data.get("questions", [])
    answers = data.get("answers", [])

    feedback_list = []

    for q, a in zip(questions, answers):
        prompt = (
            f"Interview Question: {q}\n"
            f"Candidate's Answer: {a}\n\n"
            f"Provide structured feedback on the candidate's answer "
            f"(highlight strengths, weaknesses, clarity, relevance, and confidence level)."
        )

        try:
            completion = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.7
            )
            feedback = completion.choices[0].message.content.strip()
        except Exception as e:
            feedback = f"Error generating feedback: {str(e)}"

        feedback_list.append(feedback)

    return {"feedback": feedback_list}
