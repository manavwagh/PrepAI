import os
from typing import Dict, Any, List
from firecrawl import FirecrawlApp
from app.services.llm_service import llm_service
from langchain_core.prompts import ChatPromptTemplate

class ResearchService:
    def __init__(self):
        self.api_key = os.getenv("FIRECRAWL_API_KEY")
        if self.api_key:
            self.app = FirecrawlApp(api_key=self.api_key)
        else:
            self.app = None

    async def get_company_insights(self, company_url: str) -> Dict[str, Any]:
        """
        Crawls a company website using Firecrawl and summarizes insights using Gemini.
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
            # Scrape the main landing page
            scrape_result = self.app.scrape_url(company_url, params={'formats': ['markdown']})
            markdown_content = scrape_result.get('markdown', '')

            llm = llm_service.get_llm(temperature=0.2)
            if not llm:
                return {
                    "source_url": company_url,
                    "summary": "Content extracted but LLM unavailable for summarization.",
                    "raw_content_preview": markdown_content[:500] if markdown_content else "No content found"
                }

            prompt = ChatPromptTemplate.from_template(
                "Analyze the following company website content and provide a summary of their core business, culture, and recent news.\n\nContent:\n{content}\n\nRespond in JSON format: "
                '{"summary": "...", "culture": "...", "recent_updates": ["...", "..."]}'
            )
            
            chain = prompt | llm
            ai_response = await chain.ainvoke({"content": markdown_content[:4000]}) # Limit content for context window
            
            import json
            try:
                data = json.loads(ai_response.content)
                data["source_url"] = company_url
                return data
            except:
                return {
                    "source_url": company_url,
                    "summary": ai_response.content
                }

        except Exception as e:
            print(f"Error researching company: {e}")
            return {"error": str(e)}

research_service = ResearchService()
