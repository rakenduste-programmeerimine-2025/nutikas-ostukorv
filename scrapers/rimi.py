import asyncio
from playwright.async_api import async_playwright
import csv
import time

URL = "https://www.rimi.ee/epood/ee/tooted/liha--ja-kalatooted/hakkliha/c/SH-8-2"
CATEGORY_ID = 3
STORE_ID = 2

async def scrape_rimi():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = await browser.new_page(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                " AppleWebKit/537.36 (KHTML, like Gecko)"
                " Chrome/120.0.0.0 Safari/537.36"
            )
        )

        await page.add_init_script(
            """Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"""
        )

        current_url = URL
        products = []

        while True:
            await page.goto(current_url, wait_until="networkidle")

            for _ in range(3):
                await page.mouse.wheel(0, 2000)
                await asyncio.sleep(0.5)

            cards = page.locator(".card")
            await cards.first.wait_for(timeout=60000)
            count = await cards.count()

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
                except:
                    continue

                products.append([CATEGORY_ID, name, price, STORE_ID])

            next_btn = page.locator("a[aria-label='Järgmine']")
            if not await next_btn.count():
                break

            href = await next_btn.get_attribute("href")
            if not href:
                break

            current_url = "https://www.rimi.ee" + href
            time.sleep(1)

        await browser.close()
    return products


async def save_to_csv():
    products = await scrape_rimi()

    with open("rimi_products.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["category_id", "name", "price", "store_id"])
        writer.writerows(products)

    print(f"Done! Scraped {len(products)} products into rimi_products.csv")


await save_to_csv()
