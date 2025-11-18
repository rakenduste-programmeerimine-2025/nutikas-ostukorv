import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import csv
import time

BASE_URL = "https://www.rimi.ee"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EducationalScraper/1.0)"
}


def parse_price(euro_text: str, cents_text: str) -> float:
    """Convert Rimi price parts into float."""
    try:
        clean = f"{euro_text}.{cents_text}".replace(" ", "").replace(",", ".")
        return float(clean)
    except:
        return None


def get_category_name(soup):
    h1 = soup.find("h1")
    return h1.get_text(strip=True) if h1 else "Unknown category"


def get_products_from_page(full_url: str):
    """Scrape one Rimi page and extract products + pagination links."""
    response = requests.get(full_url, headers=HEADERS)
    if response.status_code != 200:
        return [], [], "Unknown category"

    soup = BeautifulSoup(response.text, "html.parser")

    category = get_category_name(soup)

    products = []
    for product in soup.select(".card__details"):
        name_el = product.select_one(".card__name")
        price_el = product.select_one(".card__price")

        if not name_el or not price_el:
            continue

        euro = price_el.select_one("span")
        cents = price_el.select_one("sup")

        name = name_el.get_text(strip=True)
        euro_text = euro.get_text(strip=True) if euro else "0"
        cents_text = cents.get_text(strip=True) if cents else "00"

        price = parse_price(euro_text, cents_text)

        products.append([category, name, price])

    pagination_links = [
        urljoin(BASE_URL, a["href"])
        for a in soup.select("li.pagination__item a[href]")
    ]

    return products, pagination_links, category


def scrape_all_pages(start_path: str):
    visited = set()
    to_visit = [urljoin(BASE_URL, start_path)]
    all_products = []
    category_name = "Unknown category"

    while to_visit:
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue

        products, pagination_links, category_name = get_products_from_page(current_url)
        all_products.extend(products)
        visited.add(current_url)

        for link in pagination_links:
            if link not in visited and link not in to_visit:
                to_visit.append(link)

        time.sleep(1)

    return all_products, category_name


def scrape_rimi_to_csv(category_path: str):
    products, category_name = scrape_all_pages(category_path)

    filename = "rimi_products.csv"
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["category", "name", "price"])
        writer.writerows(products)

    print(f"Done (RIMI) — {len(products)} products scraped into {filename}!")
    print(f"Category: {category_name}")
