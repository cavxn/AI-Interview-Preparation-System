from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from database import get_db
from routers.auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM
import numpy as np
import cv2
from PIL import Image
from io import BytesIO
from model_loader import model, class_names

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- USER SIGNUP ---
@app.post("/signup")
def signup(name: str = Form(...), email: str = Form(...), password: str = Form(...)):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                    (name, email, hash_password(password)))
        conn.commit()
        return {"status": "success", "message": "User created"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Email already exists")

# --- USER LOGIN ---
@app.post("/login")
def login(email: str = Form(...), password: str = Form(...)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cur.fetchone()
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["email"]})
    return {"status": "success", "token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

# --- EMOTION ANALYSIS ---
@app.post("/analyze_emotion")
async def analyze_emotion(file: UploadFile = File(...), token: str = Form(...)):
    try:
        # Verify JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get user
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email=?", (email,))
    user = cur.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Process image
    contents = await file.read()
    image = Image.open(BytesIO(contents)).convert("RGB").resize((48, 48))
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    img_array = gray.reshape(1, 48, 48, 1).astype("float32") / 255.0

    # Predict
    predictions = model.predict(img_array)
    idx = int(np.argmax(predictions))
    emotion = class_names[idx]
    confidence = float(np.max(predictions))

    # Save to DB
    cur.execute("INSERT INTO emotions (user_id, emotion, confidence) VALUES (?, ?, ?)",
                (user["id"], emotion, confidence))
    conn.commit()

    return {"status": "success", "emotion": emotion, "confidence": confidence}

# --- DASHBOARD HISTORY ---
@app.get("/history")
def get_history(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email=?", (email,))
    user = cur.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cur.execute("SELECT emotion, confidence, timestamp FROM emotions WHERE user_id=? ORDER BY timestamp DESC", (user["id"],))
    history = cur.fetchall()
    return {"status": "success", "history": [dict(row) for row in history]}
