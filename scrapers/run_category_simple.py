"""Simple entrypoint for running scrapers from npm.

Edit the CONFIG section below to choose which logical category to scrape
and which stores/URLs to include. Then run:

  npm run scraper

This will use SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from your env.
"""

from typing import Dict, Any

from .supabase_client import get_category_id_by_slug, get_store_id_by_name
from .coop import scrape_and_upsert_coop
from .rimi import scrape_and_upsert_rimi
from .selver import scrape_and_upsert_selver


# =====================
# CONFIG – EDIT THIS
# =====================

# Logical category key -> Supabase category slug and per‑store URLs.
CONFIG: Dict[str, Any] = {
    "category_key": "maitseained",  # change this
    "category_slug": "maitseained",  # must match slug in public.category
    "stores": {
        # store_name in DB -> scraper + URL
        # Enable/disable stores by commenting them in/out.
        "Coop": {
            "enabled": False,
            "scraper": "coop",
            "url": "https://coophaapsalu.ee/tootekategooria/kuivained-kastmed/maitseained/",
        },
        "Rimi": {
            "enabled": False,
            "scraper": "rimi",
            "url": "https://www.rimi.ee/epood/ee/tooted/kauasailivad-toidukaubad/maitseained/c/SH-13-12",
        },
        "Selver": {
            "enabled": True,
            "scraper": "selver",
            "url": "https://www.selver.ee/maitseained-ja-puljongid/maitseained",
        },
    },
}


def main() -> None:
    category_key = CONFIG["category_key"]
    slug = CONFIG["category_slug"]

    category_id = get_category_id_by_slug(slug)
    print(f"[scraper] Category '{category_key}' -> slug='{slug}', id={category_id}")

    for store_name, store_cfg in CONFIG["stores"].items():
        if not store_cfg.get("enabled", True):
            continue

        url = store_cfg["url"]
        scraper = store_cfg["scraper"]
        store_id = get_store_id_by_name(store_name)

        print(
            f"[scraper] Running '{scraper}' for store '{store_name}' "
            f"(id={store_id}) at URL: {url}"
        )

        if scraper == "coop":
            scrape_and_upsert_coop(url=url, category_id=category_id, store_id=store_id)
        elif scraper == "rimi":
            import asyncio

            asyncio.run(
                scrape_and_upsert_rimi(url=url, category_id=category_id, store_id=store_id)
            )
        elif scraper == "selver":
            import asyncio

            asyncio.run(
                scrape_and_upsert_selver(url=url, category_id=category_id, store_id=store_id)
            )
        else:
            print(f"[scraper] Unknown scraper '{scraper}' for store '{store_name}', skipping.")


if __name__ == "__main__":
    main()
