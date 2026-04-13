from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.evaluation_service import evaluate_response

router = APIRouter()

class EvaluationRequest(BaseModel):
    question: str
    response_text: str

class EvaluationResponse(BaseModel):
    score: int
    strengths: List[str]
    weaknesses: List[str]
    advice: str

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_interview_response(request: EvaluationRequest):
    try:
        evaluation = await evaluate_response(request.question, request.response_text)
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
