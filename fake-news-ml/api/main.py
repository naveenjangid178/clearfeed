import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from src.predict import load_model

app = FastAPI(
    title="Fake News Detector API",
    description="ML microservice for fake news classification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    model_path      = os.path.join(os.path.dirname(__file__), '..', 'model', 'model.pkl')
    vectorizer_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'vectorizer.pkl')
    load_model(model_path, vectorizer_path)
    print("FastAPI started. Model is ready.")

@app.get("/")
def root():
    return {"message": "Fake News Detector API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(router, prefix="/api")