import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from preprocess import load_and_prepare_data


def train(fake_path='data/Fake.csv', true_path='data/True.csv'):

    # ── 1. Load & clean data ──────────────────────────────────────
    df = load_and_prepare_data(fake_path, true_path)

    X = df['cleaned']
    y = df['label']

    # ── 2. Split — 80% train / 20% test ──────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\nTrain size : {len(X_train)}")
    print(f"Test size  : {len(X_test)}")

    # ── 3. TF-IDF vectorization ───────────────────────────────────
    print("\nFitting TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec  = vectorizer.transform(X_test)

    # ── 4. Train Logistic Regression ─────────────────────────────
    print("Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, C=1.0)
    lr_model.fit(X_train_vec, y_train)
    lr_acc = lr_model.score(X_test_vec, y_test)
    print(f"  LR accuracy : {lr_acc * 100:.2f}%")

    # ── 5. Train Random Forest ────────────────────────────────────
    print("Training Random Forest (takes ~2 min)...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rf_model.fit(X_train_vec, y_train)
    rf_acc = rf_model.score(X_test_vec, y_test)
    print(f"  RF accuracy : {rf_acc * 100:.2f}%")

    # ── 6. Pick the best model ────────────────────────────────────
    best_model      = lr_model if lr_acc >= rf_acc else rf_model
    best_model_name = 'LogisticRegression' if lr_acc >= rf_acc else 'RandomForest'
    print(f"\nBest model  : {best_model_name}")

    # ── 7. Save model + vectorizer + test split ───────────────────
    os.makedirs('model', exist_ok=True)
    joblib.dump(best_model,  'model/model.pkl')
    joblib.dump(vectorizer,  'model/vectorizer.pkl')
    joblib.dump((X_test_vec, y_test), 'model/test_data.pkl')
    print("Saved: model/model.pkl")
    print("Saved: model/vectorizer.pkl")
    print("Saved: model/test_data.pkl")

    return best_model, vectorizer, X_test_vec, y_test


if __name__ == '__main__':
    train()