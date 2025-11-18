from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time

app = FastAPI(
    title="Rimi Product Scraper API",
    description="Fetch product names, prices, and units from Rimi.ee product categories",
    version="1.0.0"
)

BASE_URL = "https://www.rimi.ee"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EducationalScraper/1.0; +https://example.com/contact)"
}


def get_products_from_page(full_url: str):
    """Scrape one Rimi page."""
    response = requests.get(full_url, headers=HEADERS)
    if response.status_code != 200:
        return [], []

    soup = BeautifulSoup(response.text, "html.parser")
    products = []

    for product in soup.select(".card__details"):
        name_el = product.select_one(".card__name")
        price_el = product.select_one(".card__price")

        if not name_el or not price_el:
            continue

        euro = price_el.select_one("span")
        cents = price_el.select_one("sup")
        unit = price_el.select_one("sub")

        name = name_el.get_text(strip=True)
        euro_text = euro.get_text(strip=True) if euro else "0"
        cents_text = cents.get_text(strip=True) if cents else "00"
        unit_text = unit.get_text(strip=True) if unit else ""
        price = f"{euro_text}.{cents_text} {unit_text}"

        products.append({
            "name": name,
            "price": price
        })

    # Detect pagination links
    pagination_links = [
        urljoin(BASE_URL, a["href"])
        for a in soup.select("li.pagination__item a[href]")
        if a.get("href")
    ]

    return products, pagination_links


def scrape_all_pages(start_path: str):
    """Scrape all pages of a category."""
    visited = set()
    to_visit = [urljoin(BASE_URL, start_path)]
    all_products = []

    while to_visit:
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue

        products, pagination_links = get_products_from_page(current_url)
        all_products.extend(products)
        visited.add(current_url)

        # Add unvisited links
        for link in pagination_links:
            if link not in visited and link not in to_visit:
                to_visit.append(link)

        time.sleep(1)  # polite delay

    return all_products


@app.get("/scrape")
def scrape_rimi(category: str = "/epood/ee/tooted/puuviljad-koogiviljad-lilled/c/SH-12"):
    """
    Scrape a Rimi.ee category (provide relative path).
    Example:
      /scrape?category=/epood/ee/tooted/piimatooted/c/SH-21
    """
    products = scrape_all_pages(category)
    return JSONResponse(content={"count": len(products), "products": products})
