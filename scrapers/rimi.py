import asyncio
import re
from typing import List, Dict, Any

from playwright.async_api import async_playwright
import time
import nest_asyncio

from .supabase_client import upsert_products

nest_asyncio.apply()

BASE_URL = "https://www.rimi.ee"
URL = "https://www.rimi.ee/epood/ee/tooted/liha--ja-kalatooted/hakkliha/c/SH-8-2"

CATEGORY_ID = 3
STORE_ID = 2


def parse_quantity_from_name(name: str) -> tuple[float | None, str | None]:
    """Extract quantity and unit from Rimi product names.

    Handles patterns like "1kg", "1 kg", "500g", "0,5 l", "0.5l".

    Returns (value, unit) where value is normalised to base units:
      - mass in kg ("kg" or "g" → kg)
      - volume in litres ("l" or "ml" → l)
    If nothing can be parsed, returns (None, None).
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


async def scrape_rimi(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> List[Dict[str, Any]]:
    """Scrape Rimi products and return a list of product dicts."""

    products: List[Dict[str, Any]] = []

    print("Launching Playwright...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = await browser.new_page(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        )

        await page.add_init_script(
            """Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"""
        )

        current_url = url

        while True:
            print("Opening:", current_url)

            await page.goto(current_url, wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(2000)

            for _ in range(3):
                await page.mouse.wheel(0, 2000)
                await asyncio.sleep(0.5)

            cards = page.locator(".card")
            await cards.first.wait_for(timeout=60000)
            count = await cards.count()
            print("Found", count, "products")

            for i in range(count):
                card = cards.nth(i)

                name_loc = card.locator(".card__name")
                if await name_loc.count() == 0:
                    continue
                name = (await name_loc.inner_text()).strip()

                euro_loc = card.locator(".card__price span")
                cents_loc = card.locator(".card__price sup")
                if await euro_loc.count() == 0:
                    continue
                euro = (await euro_loc.inner_text()).strip()
                cents = (await cents_loc.inner_text()).strip() if await cents_loc.count() else "00"

                try:
                    price = float(f"{euro}.{cents}")
                except Exception:
                    continue

                img_wrapper = card.locator(".card__image-wrapper img").first
                image_url = None

                if await img_wrapper.count():
                    src = await img_wrapper.get_attribute("src")
                    data_src = await img_wrapper.get_attribute("data-src")
                    image_url = data_src or src

                    if image_url:
                        image_url = image_url.strip()
                        if image_url.startswith("//"):
                            image_url = "https:" + image_url
                        elif image_url.startswith("/"):
                            image_url = BASE_URL + image_url

                # Try to infer quantity and compute price per unit
                quantity_value, quantity_unit = parse_quantity_from_name(name)
                if quantity_value is not None and price is not None:
                    try:
                        price_per_unit = price / quantity_value if quantity_value > 0 else None
                    except Exception:
                        price_per_unit = None
                else:
                    price_per_unit = None

                products.append(
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

            next_btn = page.locator("a[aria-label='Järgmine']")
            if not await next_btn.count():
                print("No next button → done.")
                break

            href = await next_btn.get_attribute("href")
            if not href:
                break

            if href.startswith("http"):
                current_url = href
            else:
                current_url = BASE_URL + href

            time.sleep(1)

        await browser.close()

    print("Scraping done.")
    return products


async def scrape_and_upsert_rimi(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> None:
    """Convenience function: scrape Rimi and upsert into Supabase."""

    rows = await scrape_rimi(url=url, category_id=category_id, store_id=store_id)
    upsert_products(rows)
    print(f"Upserted {len(rows)} Rimi products into Supabase.")


if __name__ == "__main__":
    asyncio.run(scrape_and_upsert_rimi())
