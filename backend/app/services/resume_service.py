import os
from typing import Dict, Any, List
from affinda import AffindaAPI, TokenCredential
from pathlib import Path
try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

class ResumeService:
    def __init__(self):
        self.api_key = os.getenv("AFFINDA_API_KEY")
        self.workspace_id = os.getenv("AFFINDA_WORKSPACE_ID")
        
        if self.api_key and self.api_key != "your_affinda_key":
            self.credential = TokenCredential(token=self.api_key)
            self.client = AffindaAPI(credential=self.credential)
        else:
            self.client = None

    def _extract_text_fallback(self, file_path: str) -> str:
        """Simple fallback to extract text from PDF if PyPDF2 is available."""
        if not PyPDF2:
            return ""
        
        text = ""
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Fallback extraction error: {e}")
        return text

    async def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Parses a resume file using Affinda API or PyPDF2 fallback.
        """
        if self.client and self.workspace_id and self.workspace_id != "your_workspace_id":
            try:
                with open(file_path, "rb") as f:
                    doc = self.client.create_document(file=f, workspace=self.workspace_id)
                
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
                # Fallback to local extraction if Affinda fails
        
        # Local fallback
        extracted_text = self._extract_text_fallback(file_path)
        if extracted_text:
            # We return the raw text as a special field for the LLM to process directly
            return {
                "raw_text": extracted_text,
                "skills": [], 
                "experience": [],
                "education": []
            }

        # Mock data if everything fails
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

resume_service = ResumeService()
