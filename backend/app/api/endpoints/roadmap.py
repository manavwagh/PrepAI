from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.roadmap_service import generate_ai_roadmap

router = APIRouter()

class RoadmapResponse(BaseModel):
    technical_pillar: List[str]
    behavioral_pillar: List[str]
    company_research: List[str]

import os
import shutil
from tempfile import NamedTemporaryFile
from app.services.resume_service import resume_service

@router.post("/generate-roadmap", response_model=RoadmapResponse)
async def create_roadmap(
    jd_text: str = Form(...),
    resume_file: Optional[UploadFile] = File(None)
):
    try:
        resume_text = ""
        if resume_file:
            # Save temporary file for parsing
            suffix = os.path.splitext(resume_file.filename)[1]
            with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                shutil.copyfileobj(resume_file.file, tmp)
                tmp_path = tmp.name
            
            try:
                # Parse resume using resume_service
                resume_data = await resume_service.parse_resume(tmp_path)
                # Convert resume data dict to a simplified string for the LLM
                if "error" not in resume_data:
                    if resume_data.get("raw_text"):
                        resume_text = resume_data["raw_text"]
                    else:
                        resume_text = f"Skills: {', '.join(resume_data.get('skills', []))}. "
                        experience = resume_data.get('experience', [])
                        if experience:
                            exp_str = "; ".join([f"{e.get('job_title')} at {e.get('organization')}" for e in experience])
                            resume_text += f"Experience: {exp_str}."
                else:
                    # If parsing fails, we could try a simple text extraction or just ignore
                    pass
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        
        roadmap = await generate_ai_roadmap(jd_text, resume_text)
        return roadmap
    except Exception as e:
        print(f"Roadmap generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
