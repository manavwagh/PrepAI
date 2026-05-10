import os
from typing import Optional, Any
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.language_models.chat_models import BaseChatModel

class LLMService:
    def __init__(self):
        self.default_llm = os.getenv("DEFAULT_LLM", "gemini").lower()
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.google_key = os.getenv("GOOGLE_API_KEY")
        
        # Clean placeholders
        if self.openai_key == "your_openai_key": self.openai_key = None
        if self.google_key == "your_gemini_key": self.google_key = None

    def get_llm(self, temperature: float = 0.7) -> Optional[BaseChatModel]:
        """
        Returns an LLM instance based on availability and preference.
        """
        # Try preferred LLM first
        if self.default_llm == "gemini" and self.google_key:
            return ChatGoogleGenerativeAI(
                model="gemini-1.5-pro", 
                google_api_key=self.google_key,
                temperature=temperature
            )
        elif self.default_llm == "openai" and self.openai_key:
            return ChatOpenAI(
                model="gpt-4o", 
                openai_api_key=self.openai_key,
                temperature=temperature
            )
        
        # Fallback to whatever is available
        if self.google_key:
            return ChatGoogleGenerativeAI(
                model="gemini-1.5-pro", 
                google_api_key=self.google_key,
                temperature=temperature
            )
        elif self.openai_key:
            return ChatOpenAI(
                model="gpt-4o", 
                openai_api_key=self.openai_key,
                temperature=temperature
            )
        
        return None

llm_service = LLMService()
