import os
from typing import Dict, Any, List
from firecrawl import FirecrawlApp

class ResearchService:
    def __init__(self):
        self.api_key = os.getenv("FIRECRAWL_API_KEY")
        if self.api_key:
            self.app = FirecrawlApp(api_key=self.api_key)
        else:
            self.app = None

    async def get_company_insights(self, company_url: str) -> Dict[str, Any]:
        """
        Crawls a company website using Firecrawl to extract key highlights,
        culture, and recent updates.
        """
        if not self.app:
            # Mock insights if no API key
            return {
                "summary": "Example Tech is leading in AI and cloud solutions.",
                "culture": "Fast-paced, innovative, and remote-friendly.",
                "recent_updates": [
                    "Launched new AI platform in Q1",
                    "Expanded operations to 3 more countries"
                ]
            }

        try:
            # Scrape the main landing page or career page
            scrape_result = self.app.scrape_url(company_url, params={'formats': ['markdown']})
            markdown_content = scrape_result.get('markdown', '')

            # In a real scenario, you'd pass this markdown content to an LLM 
            # to summarize it into structured insights.
            # For brevity, we return a summary placeholder or use the markdown directly.
            return {
                "source_url": company_url,
                "raw_content_preview": markdown_content[:1000] if markdown_content else "No content found",
                "status": "success"
            }
        except Exception as e:
            print(f"Error researching company with Firecrawl: {e}")
            return {"error": str(e)}

research_service = ResearchService()
