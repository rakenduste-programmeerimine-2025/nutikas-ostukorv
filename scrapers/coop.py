import requests
from bs4 import BeautifulSoup
import csv

def parse_price(price_text: str) -> float:
    clean = (
        price_text.replace("€", "").replace(" ", "").replace(",", ".").strip()
    )
    try:
        return float(clean)
    except
        return None

def scrape_coop():
    url = "https://coophaapsalu.ee/tootekategooria/liha-ja-kalatooted/hakkliha/"

    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "lxml")

    category_el = soup.find("h1", class_="woocommerce-products-header__title")
    category = category_el.text.strip() if category_el else "Unknown category"

    products = soup.select("ul.products li.product")

    rows = []

    for product in products:
        name_el = product.select_one("h2.woocommerce-loop-product__title")
        price_el = product.select_one("span.woocommerce-Price-amount")

        name = name_el.text.strip() if name_el else "Unknown"
        price_text = price_el.text.strip() if price_el else "0"

        price = parse_price(price_text)

        rows.append([category, name, price])

    with open("coop_products.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["category", "name", "price"])
        writer.writerows(rows)

    print(f"Done (COOP) — {len(rows)} products scraped!")

if __name__ == "__main__":
    scrape_coop()