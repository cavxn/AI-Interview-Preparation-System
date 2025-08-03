import random

def mock_analyze(frame):
    # Stub/mock detection logic
    emotions = ["Happy", "Neutral", "Stressed", "Sad", "Confident"]
    postures = ["Confident", "Slouching", "Attentive", "Distracted"]

    return random.choice(emotions), random.choice(postures)
