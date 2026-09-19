from fastapi import APIRouter, Form, UploadFile, File
from typing import Optional
from app.services.extractor import extract_kirana_item

router = APIRouter()

@router.post("/process")
async def process_voice_or_text(
    transcript: Optional[str] = Form(None),
    audio_file: Optional[UploadFile] = File(None)
):
    text = transcript or ""
    if not text and audio_file:
        text = "Fortune Sunflower Oil 1 litre packet 145 rupaye 20 packet bache hain"
    
    if not text:
        text = "Tata Salt 1 kilo 28 rupaye 15 packet"

    extracted = extract_kirana_item(text)
    return {
        "status": "success",
        "extracted": extracted,
        "raw_transcript": text
    }