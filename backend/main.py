from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.api.endpoints import roadmap, evaluation, assistant, feedback, resume, research, interview

app = FastAPI(title="PrepAI API", version="1.0.0")

# CORS Configuration
# In production, you should specify the exact frontend URL
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to PrepAI Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

app.include_router(roadmap.router, prefix="/api", tags=["roadmap"])
app.include_router(evaluation.router, prefix="/api", tags=["evaluation"])
app.include_router(assistant.router, prefix="/api", tags=["assistant"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
