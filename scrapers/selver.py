import asyncio
from playwright.async_api import async_playwright
import csv

CATEGORY_ID = 5
STORE_ID = 1
URL = "https://www.selver.ee/puu-ja-koogiviljad"


def parse_price(text):
    if not text:
        return None
    clean = text.replace("€", "").replace(",", ".").strip()
    try:
        return float(clean)
    except:
        return None


async def scrape_selver():
    rows = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = await browser.new_page()

        print("Opening Selver…")
        await page.goto(URL, timeout=60000, wait_until="networkidle")

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

            rows.append([CATEGORY_ID, name, price, STORE_ID, image_url])

        await browser.close()
        return rows


async def save_to_csv(filename="selver_products.csv"):
    rows = await scrape_selver()

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["category_id", "name", "price", "store_id", "image_url"]
        )
        writer.writerows(rows)

    print(f"Done — {len(rows)} products saved into {filename}")


await save_to_csv()
