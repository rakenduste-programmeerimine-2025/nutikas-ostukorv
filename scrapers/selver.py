import asyncio
from typing import List, Dict, Any

from playwright.async_api import async_playwright

from .supabase_client import upsert_products

CATEGORY_ID = 5
STORE_ID = 1
URL = "https://www.selver.ee/puu-ja-koogiviljad"


def parse_price(text: str | None) -> float | None:
    if not text:
        return None
    clean = text.replace("€", "").replace(",", ".").strip()
    try:
        return float(clean)
    except Exception:
        return None


async def scrape_selver(
    url: str = URL,
    category_id: int = CATEGORY_ID,
    store_id: int = STORE_ID,
) -> List[Dict[str, Any]]:
    """Scrape Selver products and return a list of product dicts."""

    rows: List[Dict[str, Any]] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = await browser.new_page()

        print("Opening Selver…")
        await page.goto(url, timeout=60000, wait_until="networkidle")

        for _ in range(20):
            await page.mouse.wheel(0, 2000)
            await asyncio.sleep(0.3)

        cards = page.locator(".ProductCard")
        images = page.locator("img.product-image__thumb")

        count_cards = await cards.count()
        count_imgs = await images.count()

        print("Cards:", count_cards, "| Images:", count_imgs)

        for i in range(count_cards):
            card = cards.nth(i)

            name_el = card.locator(".ProductCard__name")
            name = await name_el.inner_text() if await name_el.count() else None
            if name:
                name = name.strip()

            price_el = card.locator(".Price__value")
            price_text = await price_el.inner_text() if await price_el.count() else None
            price = parse_price(price_text)

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
                }
            )

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
