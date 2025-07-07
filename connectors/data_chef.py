import os
from helpers import gl, gf, any_missing
from helpers import Unsplash


def remove_nulls(raw: list) -> list:
    """
    Remove null values from the raw data.
    :param conn: The connection object.
    :param raw: The raw data to remove nulls from.
    :return: None
    """
    for o in raw:
        if o is None:
            raw.remove(o)
    return raw


def cook_data(raw: list, unsplash=False) -> list:
    """
    Cook the raw data and return it.
    :param conn: The connection object.
    :param raw: The raw data to cook.
    :return: The cooked data.
    """
    imgapi = Unsplash()
    cooked = []
    for o in raw:
        new = format_row(o)
        if new is not None:
            # use unsplash to get a random image if the image is not set
            if unsplash and "image" in new and not new["image"].get("photographer"):
                img = imgapi.get_random_image(
                    query=new["meta"]["name"])
                if img and "url" in img:
                    new["image"] = img
                    print(img)

            cooked.append(new)
    return cooked


def format_row(data: dict):
    """
    Convert the data to a JSON string and clean it up.
    Only processes records with Status = "Approved"
    """
    # Check if the required keys are present in the data
    required_keys = ["id", "fields"]
    if any_missing(required_keys, data):
        raise KeyError(f"A row is missing columns: {required_keys}")
    elif not isinstance(data["fields"], dict):
        # Check if the fields key is a dictionary
        raise TypeError("Fields must be a dictionary.")

    fields = data["fields"]

    # Check if the status is "Approved" - make this more explicit
    status = fields.get("Status", "").strip()
    if status != "Approved":
        print(f"Skipping material {data.get('id')} with status: {status}")
        return None

    # Check if the required keys are present in the fields dictionary
    required_fields = ["Description", "Status", "Name",
                       "Last Modified By", "Last Modified"]
    if any_missing(required_fields, fields):
        raise KeyError("Missing required keys in the fields dictionary. required fields are: " +
                       str(required_fields) + " and provided fields are: " + str(fields.keys()))
    else:
        id = data["id"]
        fields = data["fields"]
        # meta fields
        name = gf("Name", fields)
        description = gf("Description", fields)
        # image fields
        images = gf("Image", fields)
        image = images[0] if isinstance(images, list) and images else None
        image_url = gf("url", image) if image else None
        thumb = image.get("thumbnails", {}).get(
            "small") if isinstance(image, dict) else None
        thumbnail_url = gf("url", thumb) if thumb else None
        # risk fields
        risk_types = gf("Risk Types (from Risks)", fields)
        risk_factors = gf("Risk Factors (from Hazards) (from Risks)", fields)
        risk_hazards = gf("Hazards (from Risks)", fields)
        # updated fields
        updated_datetime = fields["Last Modified"]
        last_modified_by = fields["Last Modified By"]["id"]
        # articles fields
        compost = gf("How to Compost", fields)
        recycle = gf("How to Recycle", fields)
        upcycle = gf("How to Upcycle", fields)

        # Create a new dictionary with the required keys and values
        next_row = {
            "id": id,
            "meta": {
                "name": name,
                "description": description
            },
            "image": {
                "url": image_url,
                "thumbnail_url": thumbnail_url
            },
            "risk": {
                "types": risk_types,
                "factors": risk_factors,
                "hazards": risk_hazards
            },
            "updated": {
                "datetime": updated_datetime,
                "user_id": last_modified_by
            },
            "articles": {
                "compost": compost,
                "recycle": recycle,
                "upcycle": upcycle
            }
        }
        try:

            return next_row
        except Exception as e:
            print(f"Error converting data to JSON: {e}")
            raise e


def cook_articles(raw: list) -> list:
    """
    Normalize raw Airtable article records for Neon.
    Handles Composting, Recycling, and Upcycling tables.
    Only includes articles with Status == "Approved".
    """
    cooked = []
    for record in raw:
        if not record or "id" not in record:
            continue
        fields = record.get("fields", {})
        status = fields.get("Status", "").strip()
        if status != "Approved":
            print(f"Skipping article {record.get('id')} with status: {status}")
            continue

        cooked.append({
            "id": record["id"],
            "title": fields.get("Article ID"),
            "body": fields.get("Article Body"),
            "author": fields.get("Created By", {}).get("id"),
            "created": fields.get("Created"),
            "updated": fields.get("Last Modified"),
            # targets and names for linking:
            "targets": (
                fields.get("Compost Target") or
                fields.get("Recycling Target") or
                fields.get("Upcycling Target")
            ),
            "target_names": (
                fields.get("Name (from Compost Target)") or
                fields.get("Name (from Recycling Target)") or
                fields.get("Name (from Upcycling Target)")
            ),
            "product": fields.get("Product"),
            "method": fields.get("Method"),
            # source table for linking:
            "source_table": record.get("source_table")
        })

    print(f"Filtered articles: {len(cooked)} approved out of {len(raw)} total")
    return cooked
