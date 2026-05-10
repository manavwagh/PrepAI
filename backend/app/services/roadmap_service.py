from typing import List, Dict
from app.services.llm_service import llm_service
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

class Roadmap(BaseModel):
    technical_pillar: List[str] = Field(description="List of technical topics to study")
    behavioral_pillar: List[str] = Field(description="List of behavioral preparation tasks")
    company_research: List[str] = Field(description="List of company-specific research tasks")

async def generate_ai_roadmap(jd_text: str, resume_text: str = "") -> Dict:
    llm = llm_service.get_llm(temperature=0.3)

    # Fallback Mock Logic if no keys are provided
    if not llm:
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

    parser = JsonOutputParser(pydantic_object=Roadmap)
    
    prompt_content = "You are an expert career coach. Generate a detailed interview preparation roadmap based on this job description: {jd}\n"
    if resume_text:
        prompt_content += "Consider the candidate's resume to identify gaps and focus areas: {resume}\n"
    prompt_content += "{format_instructions}"
    
    prompt = ChatPromptTemplate.from_template(prompt_content).partial(format_instructions=parser.get_format_instructions())
    
    chain = prompt | llm | parser
    
    invoke_params = {"jd": jd_text}
    if resume_text:
        invoke_params["resume"] = resume_text
        
    result = await chain.ainvoke(invoke_params)
    return result
