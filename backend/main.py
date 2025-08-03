from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model_loader import predict_emotion

app = FastAPI()

# Enable frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_emotion/")
async def analyze_emotion(file: UploadFile = File(...)):
    contents = await file.read()
    emotion = predict_emotion(contents)
    return {"emotion": emotion}
