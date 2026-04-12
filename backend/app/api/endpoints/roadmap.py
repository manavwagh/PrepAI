from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.roadmap_service import generate_ai_roadmap

router = APIRouter()

class RoadmapResponse(BaseModel):
    technical_pillar: List[str]
    behavioral_pillar: List[str]
    company_research: List[str]

@router.post("/generate-roadmap", response_model=RoadmapResponse)
async def create_roadmap(
    jd_text: str = Form(...),
    resume_file: Optional[UploadFile] = File(None)
):
    try:
        # In a real app, we would parse the resume file (PDF/DOCX)
        # For this prototype, we'll use the JD text to drive the generation
        roadmap = await generate_ai_roadmap(jd_text)
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
