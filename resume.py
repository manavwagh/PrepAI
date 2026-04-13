import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_service import resume_service

router = APIRouter()

@router.post("/parse")
async def upload_resume(file: UploadFile = File(...)):
    """
    Uploads a resume file and extracts structured data.
    """
    if not file.filename.endswith(('.pdf', '.docx', '.txt')):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Temporary storage
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse using service
        extracted_data = await resume_service.parse_resume(temp_path)
        
        if "error" in extracted_data:
            raise HTTPException(status_code=500, detail=extracted_data["error"])
            
        return extracted_data
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
