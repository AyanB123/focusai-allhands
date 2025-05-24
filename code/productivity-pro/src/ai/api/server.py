from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Any, Optional
import json
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import AI models (placeholders for now)
# from models.transformer import ChatModel
# from models.lstm import PredictiveModel

app = FastAPI(title="ProductivityPro AI API")

class ActivityData(BaseModel):
    timestamp: int
    app: str
    title: Optional[str] = None
    url: Optional[str] = None
    duration: int
    category: Optional[str] = None

class ChatQuery(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

@app.get("/")
async def root():
    return {"message": "ProductivityPro AI API is running"}

@app.post("/api/chat")
async def chat_endpoint(query: ChatQuery):
    """
    Process a chat query using the Transformer model
    """
    # Placeholder - will be replaced with actual model inference
    response = f"You asked: {query.query}. This is a placeholder response."
    return {"response": response}

@app.post("/api/predict/focus")
async def predict_focus(activities: List[ActivityData]):
    """
    Predict focus times based on historical activities using LSTM
    """
    # Placeholder - will be replaced with actual model inference
    predictions = [
        {"hour": 9, "focus_score": 0.85},
        {"hour": 10, "focus_score": 0.92},
        {"hour": 11, "focus_score": 0.88},
        {"hour": 14, "focus_score": 0.75},
        {"hour": 15, "focus_score": 0.65}
    ]
    return {"predictions": predictions}

@app.post("/api/categorize")
async def categorize_activity(activity: ActivityData):
    """
    Categorize an activity using ML model
    """
    # Placeholder - will be replaced with actual model inference
    categories = {
        "Visual Studio Code": "Work",
        "Chrome - GitHub": "Work",
        "Chrome - YouTube": "Entertainment",
        "Slack": "Communication",
        "Outlook": "Communication",
        "Chrome - Twitter": "Social"
    }
    
    # Simple rule-based categorization for now
    app_name = activity.app.lower()
    
    if "code" in app_name or "github" in activity.title.lower():
        category = "Work"
    elif "youtube" in activity.title.lower() or "netflix" in activity.title.lower():
        category = "Entertainment"
    elif "slack" in app_name or "outlook" in app_name or "gmail" in activity.title.lower():
        category = "Communication"
    elif "twitter" in activity.title.lower() or "facebook" in activity.title.lower():
        category = "Social"
    else:
        category = "Uncategorized"
    
    return {"category": category, "confidence": 0.85}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)