## code to run the project 
`
 python -m uvicorn api.main:app --port 8000
`

### Things complete 

✅ preprocess.py   — cleans and normalizes raw text
✅ train.py        — trains LR + Random Forest, saves best model
✅ evaluate.py     — 99.78% accuracy, 99.76% F1 score
✅ predict.py      — predicts label + confidence + keywords
✅ scraper.py      — extracts text from news URLs
✅ main.py         — FastAPI app with CORS and startup model loading
✅ routes.py       — /api/predict, /api/predict-url, /api/models