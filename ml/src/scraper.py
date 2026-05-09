from newspaper import Article


def scrape_url(url: str) -> str:
    try:
        article = Article(url)
        article.download()
        article.parse()
        text = article.title + ' ' + article.text
        return text.strip()
    except Exception as e:
        print(f"Scraping failed for {url}: {e}")
        return ""


if __name__ == '__main__':
    url = "https://www.reuters.com/world/us/fed-holds-rates-steady-projects-three-cuts-2024-2023-12-13/"
    text = scrape_url(url)
    print("Extracted text preview:")
    print(text[:500])