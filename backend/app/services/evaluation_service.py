import os
from typing import Dict, List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

class Evaluation(BaseModel):
    score: int = Field(description="Readiness score from 0 to 100")
    strengths: List[str] = Field(description="List of key strengths in the response")
    weaknesses: List[str] = Field(description="List of areas for improvement")
    advice: str = Field(description="Actionable advice for the candidate")

async def evaluate_response(question: str, response_text: str) -> Dict:
    # Check for API Key
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        # Fallback Mock Logic
        return {
            "score": 85,
            "strengths": [
                "Good technical explanation",
                "Concise storytelling"
            ],
            "weaknesses": [
                "Could use more metrics",
                "Body language (simulated) suggested slight nervousness"
            ],
            "advice": "Focus on the STAR framework to structure your impact clearly."
        }

    # Actual AI Logic
    llm = ChatOpenAI(model="gpt-4-turbo-preview", temperature=0.5)
    parser = JsonOutputParser(pydantic_object=Evaluation)
    
    prompt = ChatPromptTemplate.from_template(
        "Evaluate this interview response.\nQuestion: {question}\nResponse: {response}\n{format_instructions}"
    ).partial(format_instructions=parser.get_format_instructions())
    
    chain = prompt | llm | parser
    result = await chain.ainvoke({"question": question, "response": response_text})
    return result
