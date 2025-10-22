#!/usr/bin/env python3
"""
Test minimal FastAPI endpoint
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Test API", "status": "running"}

@app.post("/test-login")
async def test_login(email: str, password: str):
    return {"email": email, "password": password, "status": "received"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
