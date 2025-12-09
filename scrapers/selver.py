import asyncio
import re
from typing import List, Dict, Any

from playwright.async_api import async_playwright

from .supabase_client import upsert_products

CATEGORY_ID = 5
STORE_ID = 1
URL = "https://www.selver.ee/puu-ja-koogiviljad"
BASE_URL = "https://www.selver.ee"


def parse_price_and_unit(text: str | None) -> tuple[float | None, str | None]:
    """Parse a price string from Selver into (value, unit).

    Examples of supported inputs:
      "0,74 €/kg"  -> (0.74, "kg")
      "1,29 €/tk"  -> (1.29, "tk")

    If the unit cannot be detected, returns (value, None).
    """
    if not text:
        return None, None

    base = text.replace("\xa0", " ").strip()

    m = re.search(r"(\d+[.,]\d+|\d+)", base)
    if not m:
        return None, None

    number_str = m.group(1).replace(",", ".")
    try:
        value = float(number_str)
    except ValueError:
        return None, None

    unit = None
    m_unit = re.search(r"/\s*([a-zA-Z]+)", base)
    if m_unit:
        unit_raw = m_unit.group(1).lower()
        if unit_raw in {"kg", "g", "l", "ml", "tk", "pcs"}:
            unit = unit_raw

    return value, unit


def parse_quantity_from_name(name: str) -> tuple[float | None, str | None]:
    """Try to infer pack quantity from the product name.

    Patterns: "1kg", "1 kg", "500g", "0,5 l", etc. Normalised to kg/l.
    """
    lower = name.lower()

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


async def scrape_selver(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> List[Dict[str, Any]]:
    """Scrape Selver products across all pages and return a list of product dicts."""

    rows: List[Dict[str, Any]] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = await browser.new_page()

        current_url = url

        while True:
            print("Opening Selver", current_url)
            await page.goto(current_url, timeout=60000, wait_until="networkidle")

            # Scroll to trigger lazy loading / infinite scroll on the current page
            for _ in range(20):
                await page.mouse.wheel(0, 2000)
                await asyncio.sleep(0.3)

            cards = page.locator(".ProductCard")
            images = page.locator("img.product-image__thumb")

            count_cards = await cards.count()
            count_imgs = await images.count()

            print("Cards on page:", count_cards, "| Images:", count_imgs)

            if count_cards == 0:
                # No products at all on this page – stop.
                break

            for i in range(count_cards):
                card = cards.nth(i)

                name_el = card.locator(".ProductCard__name")
                name = await name_el.inner_text() if await name_el.count() else None
                if name:
                    name = name.strip()

                # Selver currently exposes prices via ProductPrice__unit-price (e.g. "0,74 d/kg").
                # There can be multiple unit-price spans (e.g. original + discounted), so
                # take the first one. Fall back to Price__main if needed.
                unit_prices = card.locator(".ProductPrice__unit-price")
                if await unit_prices.count():
                    price_el = unit_prices.first
                else:
                    price_el = card.locator(".Price__main").first

                price_text = await price_el.inner_text() if await price_el.count() else None
                unit_price, unit_from_price = parse_price_and_unit(price_text)

                # For loose items (e.g. fruit/veg), price on the site is already
                # a unit price (d/kg, d/l, d/tk). We treat that as price_per_unit
                # and assume a notional quantity of 1 unit for comparison.
                quantity_value_name, quantity_unit_name = parse_quantity_from_name(name or "")

                canonical_unit = None
                if unit_from_price:
                    if unit_from_price in {"tk", "pcs"}:
                        canonical_unit = "pcs"
                    elif unit_from_price in {"kg", "g"}:
                        canonical_unit = "kg"
                    elif unit_from_price in {"l", "ml"}:
                        canonical_unit = "l"
                    else:
                        canonical_unit = unit_from_price.lower()
                elif quantity_unit_name:
                    canonical_unit = quantity_unit_name

                if quantity_value_name is not None:
                    quantity_value = quantity_value_name
                    quantity_unit = canonical_unit or quantity_unit_name
                elif canonical_unit is not None:
                    quantity_value = 1.0
                    quantity_unit = canonical_unit
                else:
                    quantity_value = None
                    quantity_unit = None

                if unit_price is not None:
                    price_per_unit = unit_price
                    if quantity_value is not None:
                        price = unit_price * quantity_value
                    else:
                        price = unit_price
                else:
                    price_per_unit = None
                    price = None

                image_url = None
                if i < count_imgs:
                    img = images.nth(i)
                    src = await img.get_attribute("src")
                    data_src = await img.get_attribute("data-src")
                    image_url = data_src or src

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
                        "global_product_id": None,
                    }
                )

            # Try to find a "next page" control. Adjust selectors here if Selver changes
            # its pagination markup.
            next_btn = page.locator(
                "a[rel='next'], button[aria-label*='Jdrgmine'], .pagination a.next"
            ).first
            if not await next_btn.count():
                print("No next page 4a9 done.")
                break

            href = await next_btn.get_attribute("href")
            if href:
                if href.startswith("http"):
                    current_url = href
                else:
                    current_url = BASE_URL + href
            else:
                # Fallback: click the button (if it is a button) and rely on URL change
                await next_btn.click()
                await page.wait_for_load_state("networkidle")
                current_url = page.url

        await browser.close()
        return rows


async def scrape_and_upsert_selver(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> None:
    """Convenience function: scrape Selver and upsert into Supabase."""

    rows = await scrape_selver(url=url, category_id=category_id, store_id=store_id)
    upsert_products(rows)
    print(f"Upserted {len(rows)} Selver products into Supabase.")


if __name__ == "__main__":
    asyncio.run(scrape_and_upsert_selver())
