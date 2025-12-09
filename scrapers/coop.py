import re
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any

from .supabase_client import upsert_products

CATEGORY_ID = 1
STORE_ID = 1
URL = "https://coophaapsalu.ee/tootekategooria/piimatooted-munad-void/piim/"


def parse_price(price_text: str) -> float | None:
    clean = (
        price_text.replace("€", "").replace(" ", "").replace(",", ".").strip()
    )
    try:
        return float(clean)
    except Exception:
        return None


def parse_quantity_from_name(name: str) -> tuple[float | None, str | None]:
    """Extract quantity and unit from Coop product names.

    Handles patterns like "1kg", "1 kg", "500g", "0,5 l", "0.5l".

    Returns (value, unit) where value is normalised to base units:
      - mass in kg ("kg" or "g" → kg)
      - volume in litres ("l" or "ml" → l)
    If nothing can be parsed, returns (None, None).
    """

    lower = name.lower()

    # Match "number + optional decimal" followed by a unit
    m = re.search(r"(\d+[.,]?\d*)\s*(kg|g|l|ml)\b", lower)
    if not m:
        return None, None

    raw_val, raw_unit = m.groups()
    try:
        val = float(raw_val.replace(",", "."))
    except ValueError:
        return None, None

    unit = raw_unit
    if unit == "g":
        return val / 1000.0, "kg"
    if unit == "ml":
        return val / 1000.0, "l"

    return val, unit


def scrape_coop(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> List[Dict[str, Any]]:
    """Scrape Coop products and return a list of product dicts.

    Each dict has keys: name, price, image_url, category_id, store_id.
    """

    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "lxml")

    products = soup.select("ul.products li.product")

    rows: List[Dict[str, Any]] = []

    for product in products:
        name_el = product.select_one("h2.woocommerce-loop-product__title")
        price_el = product.select_one("span.woocommerce-Price-amount")

        # image
        img_el = product.select_one("img")
        image_url = None
        if img_el:
            # Some WooCommerce sites use lazy-loading
            image_url = img_el.get("data-src") or img_el.get("src")

        name = name_el.text.strip() if name_el else "Unknown"
        price_text = price_el.text.strip() if price_el else "0"
        price = parse_price(price_text)

        # Try to infer quantity and compute price per unit
        quantity_value, quantity_unit = parse_quantity_from_name(name)
        if quantity_value is not None and price is not None:
            try:
                price_per_unit = price / quantity_value if quantity_value > 0 else None
            except Exception:
                price_per_unit = None
        else:
            price_per_unit = None

        rows.append(
            {
                "category_id": category_id,
                "name": name,
                "price": price,
                "store_id": store_id,
                "image_url": image_url,
                "quantity_value": quantity_value,
                "quantity_unit": quantity_unit,
                "price_per_unit": price_per_unit,
                # global_product_id will be assigned later by a separate
                # normalisation/matching step.
                "global_product_id": None,
            }
        )

    print(f"Done (COOP) — {len(rows)} products scraped from Coop")
    return rows


def scrape_and_upsert_coop(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> None:
    """Convenience function: scrape Coop and upsert into Supabase."""

    rows = scrape_coop(url=url, category_id=category_id, store_id=store_id)
    upsert_products(rows)
    print(f"Upserted {len(rows)} Coop products into Supabase.")


if __name__ == "__main__":
    scrape_and_upsert_coop()
