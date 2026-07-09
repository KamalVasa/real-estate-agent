import json

from .config import settings
from .schemas import MarketingContent, PropertyOut


def generate_marketing_content(property_data: PropertyOut) -> MarketingContent:
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not configured")

    try:
        from google import genai
    except ImportError as exc:
        raise ValueError("Install google-genai to use marketing generation") from exc

    client = genai.Client(api_key=settings.gemini_api_key)
    prompt = f"""
You are a local real estate marketer for Dombivli and Thakurli, Maharashtra.
Create accurate, warm, non-spammy marketing copy for this property:
{property_data.model_dump_json()}

Return ONLY valid JSON with these string keys:
instagram_caption, facebook_post, whatsapp_status, reel_script, property_description.
Mention the location naturally, use Indian price context, avoid invented facts,
and include a simple enquiry call-to-action. Keep the WhatsApp status under 500 characters.
"""
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    text = (response.text or "").strip().removeprefix("```json").removesuffix("```").strip()
    return MarketingContent.model_validate(json.loads(text))
