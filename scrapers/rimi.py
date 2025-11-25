import asyncio
from playwright.async_api import async_playwright
import csv
import time
import nest_asyncio

nest_asyncio.apply()

BASE_URL = "https://www.rimi.ee"
URL = "https://www.rimi.ee/epood/ee/tooted/liha--ja-kalatooted/hakkliha/c/SH-8-2"

CATEGORY_ID = 3
STORE_ID = 2


async def scrape_rimi():
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

        current_url = URL
        products = []

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
                except:
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

                products.append([CATEGORY_ID, name, price, STORE_ID, image_url])

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

async def save_to_csv(filename="rimi_products.csv"):
    rows = await scrape_rimi()

    print("Saving CSV...")
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["category_id", "name", "price", "store_id", "image_url"])
        writer.writerows(rows)

    print(f"Done — {len(rows)} products saved into {filename}")

await save_to_csv()
