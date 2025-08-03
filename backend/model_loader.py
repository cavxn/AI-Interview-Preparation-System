import numpy as np
import cv2
from tensorflow.keras.models import load_model

model = load_model("/Users/cavins/Desktop/project/ai-interview-system/backend/emotion_model.h5", compile=False)

# Emotion labels used during training
class_names = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def predict_emotion(image_bytes):
    # Decode image from bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        return "Invalid image"
    
    # Resize to 48x48 if needed
    img = cv2.resize(img, (48, 48))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    emotion = class_names[np.argmax(preds)]
    return emotion
