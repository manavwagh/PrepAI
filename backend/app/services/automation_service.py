from typing import Dict, List
import os

async def generate_auto_alt_text(image_name: str) -> str:
    """
    Simulates AI-driven alt-text generation for accessibility.
    In a real app, this would call GPT-4o-vision or similar.
    """
    return f"A detailed screenshot analysis of {image_name} for interview preparation."

async def generate_json_ld_schema(page_type: str, data: Dict) -> Dict:
    """
    Generates structured SEO data for AI agents to easily crawl.
    """
    schema = {
        "@context": "https://schema.org",
        "@type": "Course" if page_type == "roadmap" else "WebPage",
        "name": data.get("title", "AI Interview Platforms"),
        "description": data.get("description", "Master your next interview with AI."),
        "provider": {
            "@type": "Organization",
            "name": "PrepAI"
        }
    }
    return schema
