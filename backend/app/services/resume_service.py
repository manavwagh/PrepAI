import os
from typing import Dict, Any
from affinda import AffindaAPI, TokenCredential
from pathlib import Path

class ResumeService:
    def __init__(self):
        self.api_key = os.getenv("AFFINDA_API_KEY")
        self.workspace_id = os.getenv("AFFINDA_WORKSPACE_ID")
        
        if self.api_key:
            self.credential = TokenCredential(token=self.api_key)
            self.client = AffindaAPI(credential=self.credential)
        else:
            self.client = None

    async def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Parses a resume file using Affinda API.
        Returns extracted skills, experience, and education.
        """
        if not self.client or not self.workspace_id:
            # Mock extracted data if no API key is provided
            return {
                "name": "Jane Doe",
                "skills": ["Python", "React", "FastAPI"],
                "experience": [
                    {
                        "job_title": "Software Engineer",
                        "organization": "Tech Corp",
                        "dates": "2021-Present"
                    }
                ],
                "education": [
                    {
                        "degree": "B.Tech in CS",
                        "institution": "University X"
                    }
                ]
            }

        try:
            with open(file_path, "rb") as f:
                doc = self.client.create_document(file=f, workspace=self.workspace_id)
            
            # Extract relevant fields from the nested Affinda response
            # Note: doc.data is usually a complex object provided by the SDK
            data = doc.data
            return {
                "name": data.name.raw if hasattr(data, 'name') and data.name else "Unknown",
                "skills": [s.name for s in data.skills] if hasattr(data, 'skills') else [],
                "experience": [
                    {
                        "job_title": exp.job_title,
                        "organization": exp.organization,
                        "dates": exp.dates.raw if exp.dates else ""
                    }
                    for exp in data.work_experience
                ] if hasattr(data, 'work_experience') else [],
                "education": [
                    {
                        "degree": ed.accreditation.raw if ed.accreditation else "",
                        "institution": ed.organization
                    }
                    for ed in data.education
                ] if hasattr(data, 'education') else []
            }
        except Exception as e:
            print(f"Error parsing resume with Affinda: {e}")
            return {"error": str(e)}

resume_service = ResumeService()
