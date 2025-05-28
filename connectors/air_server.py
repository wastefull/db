from airtable import AirtableConnector as ac
from neon import NeonConnect as nc
import data_chef as dc


def fetch(*, refresh=False):
    n = nc()
    if refresh:
        # --- Material sync ---
        at_connect = ac(refresh)
        # Gather all article IDs from materials
        raw_materials = at_connect.get_all_data()
        cooked_materials = dc.cook_data(raw_materials)
        n.cook_and_update_neon(cooked_materials, lambda x: x)

        # --- Deletion logic ---
        # Get all IDs from Airtable
        airtable_ids = {m["id"] for m in raw_materials if "id" in m}
        # Get all IDs currently in Neon
        neon_ids = {m["id"] for m in n.fetch_all_materials() if "id" in m}
        # Find IDs to delete
        ids_to_delete = neon_ids - airtable_ids
        if ids_to_delete:
            print(
                f"Deleting {len(ids_to_delete)} records from Neon: {ids_to_delete}")
            n.delete_materials_by_ids(list(ids_to_delete))

        article_ids = set()
        for mat in raw_materials:
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
                for rec in records:
                    rec["source_table"] = table_name
                articles_raw.extend(records)
            except Exception as e:
                print(f"Error fetching from {table_name}: {e}")
        # Cook and upsert all articles
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
