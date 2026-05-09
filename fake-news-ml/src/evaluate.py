import sys
import os
import joblib

sys.path.append(os.path.dirname(__file__))
from preprocess import clean_text


model      = None
vectorizer = None


def load_model(model_path='model/model.pkl', vectorizer_path='model/vectorizer.pkl'):
    global model, vectorizer
    if model is None or vectorizer is None:
        print("Loading model and vectorizer...")
        model      = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        print("Model loaded successfully.")


def predict(text: str) -> dict:
    load_model()

    # Clean the input text
    cleaned = clean_text(text)

    # Vectorize
    features = vectorizer.transform([cleaned])

    # Predict label
    label_num  = model.predict(features)[0]
    label      = 'REAL' if label_num == 1 else 'FAKE'

    # Confidence score
    proba      = model.predict_proba(features)[0]
    confidence = round(float(max(proba)) * 100, 2)

    # Top keywords that influenced the prediction (from TF-IDF weights)
    feature_names  = vectorizer.get_feature_names_out()
    feature_values = features.toarray()[0]
    top_indices    = feature_values.argsort()[::-1][:10]
    top_keywords   = [feature_names[i] for i in top_indices if feature_values[i] > 0]

    return {
        'label'       : label,
        'confidence'  : confidence,
        'top_keywords': top_keywords,
        'cleaned_text': cleaned[:300]
    }


if __name__ == '__main__':
    test_articles = [
        "Scientists confirm that the COVID-19 vaccine is safe and effective after extensive clinical trials.",
        "SHOCKING: Obama secretly controls the government through a underground bunker with reptilian aliens!!",
    ]

    for article in test_articles:
        print("\nArticle:", article[:80], "...")
        result = predict(article)
        print(f"  Label      : {result['label']}")
        print(f"  Confidence : {result['confidence']}%")
        print(f"  Keywords   : {', '.join(result['top_keywords'])}")