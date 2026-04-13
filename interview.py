from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from app.services.audio_service import audio_service
from app.services.empathy_service import empathy_service
from app.services.notification_service import notification_service
from fastapi.responses import StreamingResponse
import io

router = APIRouter()

class SpeechRequest(BaseModel):
    text: str
    voice_id: str = "JBFqnCBsd6RMkjVDRZzb"

class ReportRequest(BaseModel):
    user_email: str
    username: str
    report_link: str

@router.post("/speak")
async def text_to_speech(request: SpeechRequest):
    """
    Converts text to speech and returns the audio stream.
    """
    audio_content = await audio_service.generate_speech(request.text, request.voice_id)
    if not audio_content:
        raise HTTPException(status_code=500, detail="Failed to generate speech")
    
    return StreamingResponse(io.BytesIO(audio_content), media_type="audio/mpeg")

@router.post("/send-report")
async def send_report(request: ReportRequest, background_tasks: BackgroundTasks):
    """
    Sends the final performance report to the candidate.
    """
    background_tasks.add_task(
        notification_service.send_performance_report,
        request.user_email,
        request.username,
        request.report_link
    )
    return {"status": "Report queued for sending"}

@router.get("/metrics/{session_id}")
async def get_empathy_metrics(session_id: str):
    """
    In a real app, you'd retrieve the session audio and analyze it. 
    Here we return mock metrics or analyze a stored file.
    """
    # Mocking analysis for a specific session
    results = await empathy_service.analyze_vocal_tone("mock_audio_path")
    return results
