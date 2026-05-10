from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import os
from app.services.llm_service import llm_service
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter()

class AssistantResponse(BaseModel):
    text: str
    action: Optional[str] = None # e.g., "NAVIGATE_TO_ROADMAP"

@router.post("/assistant", response_model=AssistantResponse)
async def process_assistant_request(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        llm = llm_service.get_llm(temperature=0.4)
        
        if not llm:
            # Fallback Mock Logic
            action = None
            response_text = "I'm here to help you with your career journey."
            if "roadmap" in text.lower():
                action = "NAVIGATE_TO_ROADMAP"
                response_text = "Opening your personalized roadmap."
            return AssistantResponse(text=response_text, action=action)

        messages = [
            SystemMessage(content="""You are PrepAI, an autonomous career assistant. 
            Analyze the user's input and determine if they need to navigate to a specific part of the app.
            Actions available: NAVIGATE_TO_ROADMAP, NAVIGATE_TO_INTERVIEW, NAVIGATE_TO_ANALYTICS, SHOW_TROUBLESHOOTING, SHOW_RATING.
            Respond in JSON format: {"text": "your response", "action": "ACTION_NAME or null"}""")
        ]

        if image:
            # For multimodal, we need to pass the image to the LLM
            image_data = await image.read()
            # Note: In a production app, you'd convert this to base64 for Gemini/GPT-4o
            # For this integration, we'll simulate the multimodal prompt
            messages.append(HumanMessage(content=[
                {"type": "text", "text": text},
                {"type": "text", "text": "[Image attached: " + image.filename + "] Analyze this document and respond."}
            ]))
        else:
            messages.append(HumanMessage(content=text))

        # Use the LLM to get the response and action
        # Note: We use a simple call here, but ideally we'd use a structured output parser
        ai_response = await llm.ainvoke(messages)
        
        # Simple parsing of the AI response (assuming JSON or text)
        content = ai_response.content
        import json
        try:
            data = json.loads(content)
            return AssistantResponse(text=data.get("text", "I'm not sure how to help with that."), action=data.get("action"))
        except:
            return AssistantResponse(text=content, action=None)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
