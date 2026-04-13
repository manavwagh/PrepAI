from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.db.mongodb import db

router = APIRouter()

class FeedbackRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    issue_type: Optional[str] = None # e.g., "UI_BUG", "AI_ERROR", "OTHER"
    status: str = "pending"

@router.get("/feedback")
async def get_feedback_stats():
    """ Returns a summary of feedback for visual verification. """
    try:
        count = await db.feedback.count_documents({})
        recent = await db.feedback.find().sort("created_at", -1).limit(5).to_list(length=5)
        # Convert ObjectId to string for JSON serialization
        for r in recent:
            r["_id"] = str(r["_id"])
        
        return {
            "total_feedback_count": count,
            "recent_entries": recent,
            "status": "API is active and receiving data"
        }
    except Exception as e:
        return {"status": "error", "message": f"MongoDB not connected: {str(e)}"}

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    try:
        feedback_data = feedback.dict()
        feedback_data["created_at"] = datetime.utcnow()
        
        result = await db.feedback.insert_one(feedback_data)
        return {"status": "success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
