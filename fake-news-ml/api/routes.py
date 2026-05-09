import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.predict import predict

try:
    from src.scraper import scrape_url
except ImportError:
    scrape_url = None

router = APIRouter()


class TextInput(BaseModel):
    text: str

class UrlInput(BaseModel):
    url: str


@router.post("/predict")
def predict_text(data: TextInput):
    if not data.text or len(data.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text is too short. Please provide a full article.")

    result = predict(data.text)
    return {
        "label"       : result["label"],
        "confidence"  : result["confidence"],
        "top_keywords": result["top_keywords"],
        "status"      : "success"
    }


@router.post("/predict-url")
def predict_url(data: UrlInput):
    if scrape_url is None:
        raise HTTPException(status_code=501, detail="newspaper3k not installed. Install it to use URL prediction.")

    text = scrape_url(data.url)

    if not text or len(text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Could not extract text from the URL. Try pasting the article directly.")

    result = predict(text)
    return {
        "label"       : result["label"],
        "confidence"  : result["confidence"],
        "top_keywords": result["top_keywords"],
        "source_url"  : data.url,
        "status"      : "success"
    }


@router.get("/models")
def get_model_info():
    return {
        "model"         : "RandomForest",
        "accuracy"      : "99.78%",
        "f1_score"      : "99.76%",
        "trained_on"    : "44898 articles",
        "features"      : "TF-IDF (5000 features, bigrams)",
    }