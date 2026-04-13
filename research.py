from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from app.services.research_service import research_service

router = APIRouter()

class ResearchRequest(BaseModel):
    company_url: HttpUrl

@router.post("/")
async def research_company(request: ResearchRequest):
    """
    Crawls a company website and returns insights.
    """
    results = await research_service.get_company_insights(str(request.company_url))
    
    if "error" in results:
        raise HTTPException(status_code=500, detail=results["error"])
        
    return results
