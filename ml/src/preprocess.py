import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('stopwords', quiet=True)

ps = PorterStemmer()
stop_words = set(stopwords.words('english'))


def clean_text(text):
    # Step 1: Lowercase
    text = str(text).lower()

    # Step 2: Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)

    # Step 3: Remove punctuation and numbers
    text = re.sub(r'[^a-z\s]', '', text)

    # Step 4: Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    # Step 5: Remove stopwords and apply stemming
    words = text.split()
    words = [ps.stem(w) for w in words if w not in stop_words]

    return ' '.join(words)


def load_and_prepare_data(fake_path, true_path):
    # Load both CSV files
    fake_df = pd.read_csv(fake_path)
    true_df = pd.read_csv(true_path)

    # Add labels — 0 = FAKE, 1 = REAL
    fake_df['label'] = 0
    true_df['label'] = 1

    # Combine into one dataframe
    df = pd.concat([fake_df, true_df], ignore_index=True)

    # Combine title + text into one column for richer features
    df['content'] = df['title'] + ' ' + df['text']

    # Drop rows with missing content
    df = df.dropna(subset=['content'])

    # Apply cleaning
    print("Cleaning text... this may take a minute.")
    df['cleaned'] = df['content'].apply(clean_text)

    # Keep only what we need
    df = df[['cleaned', 'label']]

    print(f"Dataset ready: {len(df)} articles")
    print(f"  Fake: {len(df[df['label'] == 0])}")
    print(f"  Real: {len(df[df['label'] == 1])}")

    return df


if __name__ == '__main__':
    df = load_and_prepare_data(
        fake_path='data/Fake.csv',
        true_path='data/True.csv'
    )
    print("\nSample cleaned text:")
    print(df['cleaned'].iloc[0][:300])