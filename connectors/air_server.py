from airtable import AirtableConnector as ac
from neon import NeonConnect as nc
import data_chef as dc


def fetch(*, refresh=False, unsplash=False):
    n = nc()
    if refresh:
        # --- Material sync ---
        at_connect = ac(refresh)
        at_mats = at_connect.get_all_data()
        neon_mats = n.fetch_all_materials()

        # -- Remove stale data --
        # Cleanup: delete materials in Neon that are not in Airtable
        ids_to_delete = cleanup_list(at_mats, neon_mats)
        if ids_to_delete:
            print(
                f"Deleting {len(ids_to_delete)} records from Neon: {ids_to_delete}")
            n.delete_materials_by_ids(list(ids_to_delete))
        fresh_mats = [
            m for m in at_mats if m.get("id") not in ids_to_delete
        ]
        cooked_mats = dc.cook_data(fresh_mats, unsplash)

        n.update_neon_data(cooked_mats)
        # --- Article sync ---

        # Fetch articles
        articles_raw = fetch_articles_from_materials(at_connect, at_mats)
        cooked_articles = dc.cook_articles(articles_raw)
        n.cook_and_update_articles(cooked_articles, lambda x: x)
    else:
        n.connect()
        if n.c is None:
            raise RuntimeError("Database connection not established.")
        c = n.c.cursor()
        data_list = n.get_all_data(c)

    n.close_all()
    return None


def fetch_articles_from_materials(at_connect, at_mats):
    article_ids = set()
    for mat in at_mats:
        articles = mat.get("fields", {}).get("articles", {})
        for key in ["compost", "recycle", "upcycle"]:
            ids = articles.get(key)
            if isinstance(ids, list):
                article_ids.update(ids)
            elif isinstance(ids, str):
                article_ids.add(ids)
        # Fetch articles from all three article tables
    article_tables = ["Composting", "Recycling", "Upcycling"]
    articles_raw = []
    for table_name in article_tables:
        table = at_connect.get_table(table_name)
        try:
            records = table.all()
            # Add source_table info to each record
            for r in records:
                r["source_table"] = table_name
            articles_raw.extend(records)
        except Exception as e:
            print(f"Error fetching from {table_name}: {e}")
    return articles_raw


def cleanup_list(at_mats, neon_mats) -> set:
    # --- Deletion logic ---
    # Get all IDs from Airtable
    airtable_ids = {m["id"] for m in at_mats if "id" in m}
    # Get all IDs currently in Neon
    neon_ids = {m["id"] for m in neon_mats if "id" in m}
    # Find IDs to delete
    return neon_ids - airtable_ids
