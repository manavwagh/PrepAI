from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter()

class AssistantRequest(BaseModel):
    text: str
    audio_data: Optional[str] = None # Base64 for simplicity in prototype

class AssistantResponse(BaseModel):
    text: str
    action: Optional[str] = None # e.g., "NAVIGATE_TO_ROADMAP"

@router.post("/assistant", response_model=AssistantResponse)
async def process_assistant_request(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        action = None
        response_text = "I'm here to help you with your career journey."
        
        # Multimodal Vision Analysis Logic
        if image:
            response_text = f"I've received your image '{image.filename}'. Analyzing it now... It looks like a relevant document for your interview prep. I'll include these insights in your profile."
            if "resume" in image.filename.lower() or "resume" in text.lower():
                response_text = "I've analyzed your resume! Your experience in Machine Learning is strong. Would you like to update your Roadmap based on this?"
            return AssistantResponse(text=response_text, action=None)

        # Autonomous Routing Logic
        if "roadmap" in text.lower():
            action = "NAVIGATE_TO_ROADMAP"
            response_text = "Opening your personalized roadmap. Let's get to work!"
        elif "interview" in text.lower():
            action = "NAVIGATE_TO_INTERVIEW"
            response_text = "Setting up the mock interview room. Stay confident!"
        elif "score" in text.lower() or "analytics" in text.lower():
            action = "NAVIGATE_TO_ANALYTICS"
            response_text = "Taking you to your performance scorecard."
        elif any(word in text.lower() for word in ["issue", "problem", "bug", "stuck", "error"]):
            action = "SHOW_TROUBLESHOOTING"
            response_text = "It sounds like you're experiencing a technical issue. I can help with that! Would you like to try some common fixes or speak to a human?"
        elif "rate" in text.lower() or "feedback" in text.lower():
            action = "SHOW_RATING"
            response_text = "I'd love to hear your feedback! How would you rate your experience so far?"

        return AssistantResponse(text=response_text, action=action)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
