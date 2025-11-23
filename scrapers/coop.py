import requests
from bs4 import BeautifulSoup
import csv

CATEGORY_ID = 1
STORE_ID = 1

def parse_price(price_text: str) -> float:
    clean = (
        price_text.replace("€", "").replace(" ", "").replace(",", ".").strip()
    )
    try:
        return float(clean)
    except:
        return None


def scrape_coop():
    url = "https://coophaapsalu.ee/tootekategooria/piimatooted-munad-void/piim/"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "lxml")

    products = soup.select("ul.products li.product")

    rows = []

    for product in products:
        name_el = product.select_one("h2.woocommerce-loop-product__title")
        price_el = product.select_one("span.woocommerce-Price-amount")

        # 🖼️ image
        img_el = product.select_one("img")
        image_url = None
        if img_el:
            # Some WooCommerce sites use lazy-loading
            image_url = img_el.get("data-src") or img_el.get("src")

        name = name_el.text.strip() if name_el else "Unknown"
        price_text = price_el.text.strip() if price_el else "0"
        price = parse_price(price_text)

        rows.append([CATEGORY_ID, name, price, STORE_ID, image_url])

    # 📝 include image_url column
    with open("coop_products.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["category_id", "name", "price", "store_id", "image_url"])
        writer.writerows(rows)

    print(f"Done (COOP) — {len(rows)} products scraped into coop_products.csv")


if __name__ == "__main__":
    scrape_coop()
