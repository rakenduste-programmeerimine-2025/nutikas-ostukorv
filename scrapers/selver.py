import asyncio
from playwright.async_api import async_playwright
import csv

CATEGORY_ID = 5     
STORE_ID = 1        

def parse_price(price_text: str) -> float:
    clean = (
        price_text.replace("€", "").replace(" ", "").replace(",", ".").strip()
    )
    try:
        return float(clean)
    except:
        return None

async def scrape_selver():
    url = "https://www.selver.ee/puu-ja-koogiviljad/troopilised-eksootilised-viljad"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto(url)
        await page.wait_for_selector(".ProductCard__info")

        cards = await page.query_selector_all(".ProductCard__info")

        rows = []

        for card in cards:
            name_el = await card.query_selector(".ProductCard__title")
            name = (await name_el.inner_text()).strip() if name_el else "Unknown"

            price_el = await card.query_selector(".ProductPrice")
            price_text = (await price_el.inner_text()).split("\n")[0].strip()

            price = parse_price(price_text)
            rows.append([CATEGORY_ID, name, price, STORE_ID])

        with open("selver_products.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["category_id", "name", "price", "store_id"])
            writer.writerows(rows)

        print(f"Done (SELVER) — {len(rows)} products scraped!")
        await browser.close()


await scrape_selver()