import os
from typing import Any, List, Dict

from supabase.client import create_client, Client


def get_supabase_client() -> Client:
    """Return a Supabase client using server-side env vars.

    Required env vars (set these in your environment or Colab before running scrapers):
      - SUPABASE_URL
      - SUPABASE_SERVICE_ROLE_KEY

    NOTE: Only the *service role* key has permission to insert/update without RLS
    restrictions. Never expose this key to the browser / frontend.
    """

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment "
            "before running scrapers."
        )

    return create_client(url, key)


def get_category_id_by_slug(slug: str) -> int:
    """Look up category.id by slug in Supabase.

    Raises RuntimeError if not found.
    """

    supabase = get_supabase_client()
    resp = supabase.table("category").select("id").eq("slug", slug).single().execute()
    data = getattr(resp, "data", None) or resp.get("data")  # supabase-py versions differ
    if not data or "id" not in data:
        raise RuntimeError(f"Category with slug '{slug}' not found in Supabase.")
    return int(data["id"])


def get_store_id_by_name(name: str) -> int:
    """Look up store.id by name in Supabase.

    Raises RuntimeError if not found.
    """

    supabase = get_supabase_client()
    resp = supabase.table("store").select("id").eq("name", name).single().execute()
    data = getattr(resp, "data", None) or resp.get("data")
    if not data or "id" not in data:
        raise RuntimeError(f"Store with name '{name}' not found in Supabase.")
    return int(data["id"])


def upsert_products(rows: List[Dict[str, Any]]) -> None:
    """Upsert a list of product dicts into the public.product table.

    Expected keys per row:
      - name: str
      - price: float
      - image_url: str | None
      - category_id: int | None
      - store_id: int | None

    We upsert on (name, store_id) so running the same scraper again updates prices
    instead of creating duplicates.
    """

    if not rows:
        return

    supabase = get_supabase_client()

    # Ensure keys exist for all rows (Supabase upsert is strict about column sets)
    normalized: List[Dict[str, Any]] = []
    for r in rows:
        normalized.append(
            {
                "name": r.get("name"),
                "price": r.get("price"),
                "image_url": r.get("image_url"),
                "category_id": r.get("category_id"),
                "store_id": r.get("store_id"),
            }
        )

    supabase.table("product").upsert(
        normalized,
        on_conflict="name,store_id",
    ).execute()
