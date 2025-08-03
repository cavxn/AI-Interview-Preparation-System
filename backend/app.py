# backend/app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import cv2

from model_loader import model, class_names  

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_emotion/")
async def analyze_emotion(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        image = image.resize((48, 48))
        gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
        img_array = gray.reshape(1, 48, 48, 1).astype("float32") / 255.0

        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]

        return {"status": "success", "emotion": predicted_class}
    except Exception as e:
        return {"status": "error", "message": str(e)}
