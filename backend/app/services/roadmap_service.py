import os
from typing import Dict, List
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

class Roadmap(BaseModel):
    technical_pillar: List[str] = Field(description="List of technical topics to study")
    behavioral_pillar: List[str] = Field(description="List of behavioral preparation tasks")
    company_research: List[str] = Field(description="List of company-specific research tasks")

async def generate_ai_roadmap(jd_text: str) -> Dict:
    # Service Selection
    openai_key = os.getenv("OPENAI_API_KEY")
    google_key = os.getenv("GOOGLE_API_KEY")
    llm_preference = os.getenv("DEFAULT_LLM", "openai").lower()

    # Fallback Mock Logic if no keys are provided
    if not openai_key and not google_key:
        return {
            "technical_pillar": [
                "Practice Core Data Structures (Arrays, HashMaps, Trees)",
                "Review System Design principles for Scalability",
                "Study specific technologies mentioned in JD (e.g., React, Python)"
            ],
            "behavioral_pillar": [
                "Prepare STAR stories for Conflict Resolution",
                "Practice 'Tell me about yourself' for this specific role",
                "Prepare answers for 'Why this company?'"
            ],
            "company_research": [
                "Research recent news and innovations from the company",
                "Understand the company's culture and values",
                "Check the interviewer patterns if available"
            ]
        }

    # Model Selection logic
    if llm_preference == "gemini" and google_key:
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=google_key)
    elif openai_key:
        llm = ChatOpenAI(model="gpt-4o", openai_api_key=openai_key)
    else:
        # Fallback to whatever is available
        if google_key:
            llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=google_key)
        else:
            llm = ChatOpenAI(model="gpt-4o", openai_api_key=openai_key)

    parser = JsonOutputParser(pydantic_object=Roadmap)
    
    prompt = ChatPromptTemplate.from_template(
        "You are an expert career coach. Generate a detailed interview preparation roadmap based on this job description: {jd}\n{format_instructions}"
    ).partial(format_instructions=parser.get_format_instructions())
    
    chain = prompt | llm | parser
    result = await chain.ainvoke({"jd": jd_text})
    return result
