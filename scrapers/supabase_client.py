import os
from datetime import datetime
from pathlib import Path
from typing import Any, List, Dict

from supabase.client import create_client, Client


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS_DIR = PROJECT_ROOT / "supabase" / "migrations"


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


def _sql_literal(value: Any) -> str:
    """Return a SQL literal for simple types used in product rows.

    We only expect None, int/float and short strings here.
    """

    if value is None:
        return "NULL"
    if isinstance(value, (int, float)):
        return repr(value)

    # String: escape single quotes
    s = str(value).replace("'", "''")
    return f"'{s}'"


def write_products_migration(rows: List[Dict[str, Any]]) -> str:
    """Write an INSERT/UPSERT migration for the given product rows.

    The migration is idempotent by using ON CONFLICT (name, store_id).
    Returns the path to the created migration file as a string.

    NOTE: This includes the newer unit/normalisation fields so that
    `supabase db reset` preserves quantity and price-per-unit data as well.
    """

    if not rows:
        return ""

    MIGRATIONS_DIR.mkdir(parents=True, exist_ok=True)

    # Derive category slug from the first row's category_id so that
    # the filename matches our existing pattern: datetime_seed_<category>.
    category_slug: str = "category"
    try:
        first = rows[0]
        category_id = first.get("category_id")
        if category_id is not None:
            supabase = get_supabase_client()
            resp = (
                supabase.table("category")
                .select("slug")
                .eq("id", category_id)
                .single()
                .execute()
            )
            data = getattr(resp, "data", None) or resp.get("data")
            if data and "slug" in data:
                category_slug = str(data["slug"])
    except Exception:
        # Best-effort; fall back to generic name if lookup fails.
        pass

    safe_slug = category_slug.replace(" ", "_").lower()

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_seed_{safe_slug}.sql"
    path = MIGRATIONS_DIR / filename

    # Include new unit fields and global_product_id so seeds fully
    # reproduce the product data semantics.
    columns = [
        "category_id",
        "name",
        "price",
        "store_id",
        "image_url",
        "quantity_value",
        "quantity_unit",
        "price_per_unit",
        "global_product_id",
    ]

    values_lines = []
    for r in rows:
        vals = [_sql_literal(r.get(col)) for col in columns]
        values_lines.append("    (" + ", ".join(vals) + ")")

    sql_lines = [
        "INSERT INTO public.product",
        "    (category_id, name, price, store_id, image_url, quantity_value, quantity_unit, price_per_unit, global_product_id)",
        "VALUES",
        ",\n".join(values_lines) + ",",
        "ON CONFLICT (name, store_id) DO UPDATE",
        "SET",
        "    category_id = EXCLUDED.category_id,",
        "    price = EXCLUDED.price,",
        "    image_url = EXCLUDED.image_url,",
        "    quantity_value = EXCLUDED.quantity_value,",
        "    quantity_unit = EXCLUDED.quantity_unit,",
        "    price_per_unit = EXCLUDED.price_per_unit,",
        "    global_product_id = EXCLUDED.global_product_id;",
        "",
    ]

    path.write_text("\n".join(sql_lines), encoding="utf-8")
    return str(path)


def upsert_products(rows: List[Dict[str, Any]]) -> None:
    """Upsert a list of product dicts into the public.product table.

    Expected keys per row:
      - name: str
      - price: float
      - image_url: str | None
      - category_id: int | None
      - store_id: int | None
      - quantity_value: float | None
      - quantity_unit: str | None
      - price_per_unit: float | None
      - global_product_id: int | None

    We upsert on (name, store_id) so running the same scraper again updates prices
    instead of creating duplicates.
    """

    if not rows:
        return

    supabase = get_supabase_client()

    # Ensure keys exist for all rows (Supabase upsert is strict about column sets)
    normalized: List[Dict[str, Any]] = []
    for r in rows:
        price = r.get("price")
        if price is None:
            print(f"[supabase_client] Skipping product due to null price: {r.get('name')}")
            continue

        normalized.append(
            {
                "name": r.get("name"),
                "price": price,
                "image_url": r.get("image_url"),
                "category_id": r.get("category_id"),
                "store_id": r.get("store_id"),
                "quantity_value": r.get("quantity_value"),
                "quantity_unit": r.get("quantity_unit"),
                "price_per_unit": r.get("price_per_unit"),
                "global_product_id": r.get("global_product_id"),
            }
        )

    # If all rows were filtered out (e.g. null prices), there is nothing to upsert
    # and calling Supabase with an empty payload would result in a
    # "failed to parse columns parameter ()" error.
    if not normalized:
        print("[supabase_client] No valid products to upsert; skipping Supabase upsert and migration.")
        return

    # 1) Upsert into the currently configured Supabase instance
    supabase.table("product").upsert(
        normalized,
        on_conflict="name,store_id",
    ).execute()

    # 2) Also emit a SQL migration so that running `supabase db reset`
    #    on another machine can reproduce the same data.
    write_products_migration(normalized)
