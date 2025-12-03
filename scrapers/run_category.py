"""Run scrapers for a logical product category across all stores.

Usage examples:

  python -m scrapers.run_category --category piimatooted

You configure per-category, per-store URLs below. This lets you hide the fact
that each store uses different naming/URLs for the same logical category.
"""

import argparse
from typing import Dict, Any

from .supabase_client import (
    get_category_id_by_slug,
    get_store_id_by_name,
)
from .coop import scrape_and_upsert_coop
from .rimi import scrape_and_upsert_rimi
from .selver import scrape_and_upsert_selver


# Map a logical category key -> Supabase category slug + per‑store URLs.
#
# NOTE: Fill in/extend these URLs as you add more categories.
CATEGORY_CONFIG: Dict[str, Dict[str, Any]] = {
    # Example: dairy products
    "piimatooted": {
        "category_slug": "piimatooted",
        "stores": {
            # store_name in DB -> scraper config
            "Coop": {
                "url": "https://coophaapsalu.ee/tootekategooria/piimatooted-munad-void/piim/",
                "scraper": "coop",
            },
            # Add Rimi / Selver dairy URLs here when you know them, e.g.:
            # "Rimi": {
            #     "url": "https://www.rimi.ee/...",
            #     "scraper": "rimi",
            # },
            # "Selver": {
            #     "url": "https://www.selver.ee/...",
            #     "scraper": "selver",
            # },
        },
    },
    # Example: meat products
    "lihatooted": {
        "category_slug": "lihatooted",
        "stores": {
            "Rimi": {
                # Current Rimi URL already used in rimi.py
                "url": "https://www.rimi.ee/epood/ee/tooted/liha--ja-kalatooted/hakkliha/c/SH-8-2",
                "scraper": "rimi",
            },
            # Add Coop / Selver meat URLs here when you know them.
        },
    },
    # Example: fruit/veg – Selver veggie page already used in selver.py
    "puu-ja-koogiviljad": {
        "category_slug": "koogiviljad",  # map logical key to Supabase slug
        "stores": {
            "Selver": {
                "url": "https://www.selver.ee/puu-ja-koogiviljad",
                "scraper": "selver",
            },
        },
    },
}


def run_for_category(category_key: str) -> None:
    if category_key not in CATEGORY_CONFIG:
        raise SystemExit(
            f"Unknown category '{category_key}'. Known: {', '.join(CATEGORY_CONFIG.keys())}"
        )

    cfg = CATEGORY_CONFIG[category_key]
    slug = cfg["category_slug"]

    # Look up category.id in Supabase by slug so we don't hard-code numeric ids.
    category_id = get_category_id_by_slug(slug)

    print(f"Using category '{slug}' with id={category_id}")

    for store_name, store_cfg in cfg["stores"].items():
        url = store_cfg["url"]
        scraper = store_cfg["scraper"]

        store_id = get_store_id_by_name(store_name)
        print(f"Running scraper '{scraper}' for store '{store_name}' (id={store_id})…")

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
            print(f"Unknown scraper key '{scraper}' for store '{store_name}', skipping.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run scrapers for a logical category")
    parser.add_argument(
        "--category",
        "-c",
        required=True,
        help=f"Logical category key (one of: {', '.join(CATEGORY_CONFIG.keys())})",
    )

    args = parser.parse_args()
    run_for_category(args.category)


if __name__ == "__main__":
    main()