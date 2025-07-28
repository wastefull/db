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
    Enhanced with material cluster support.
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

        # Enhanced material cluster extraction
        material_clusters = fields.get("Material Clusters", [])
        primary_material = fields.get("Primary Material")
        category = fields.get("Category")

        # Auto-detect clusters if not set (fallback logic)
        if not material_clusters:
            material_clusters = auto_detect_material_clusters(fields)

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

        # Create enhanced row structure
        next_row = {
            "id": id,
            "meta": {
                "name": name,
                "description": description,
                "material_clusters": material_clusters,
                "primary_material": primary_material,
                "category": category
            },
            "processing": {
                "complexity": assess_processing_complexity(material_clusters),
                "facilities": get_processing_facilities(material_clusters),
                "methods_available": get_available_methods(material_clusters)
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


def auto_detect_material_clusters(fields):
    """
    Auto-detect material clusters from name/description if not manually set.
    """
    clusters = []
    name = fields.get("Name", "").lower()
    description = fields.get("Description", "").lower()
    category = fields.get("Category", "").lower()

    material_keywords = {
        "plastic": ["plastic", "polymer", "pvc", "pet", "hdpe", "pp", "ps", "resin", "polyethylene"],
        "paper": ["paper", "cardboard", "newspaper", "magazine", "book", "packaging", "carton"],
        "metal": ["metal", "aluminum", "steel", "copper", "iron", "tin", "wire", "alloy"],
        "electronics": ["electronic", "circuit", "battery", "screen", "chip", "digital", "computer"],
        "glass": ["glass", "bottle", "jar", "window", "mirror", "crystal"],
        "textile": ["fabric", "cloth", "cotton", "polyester", "wool", "clothing", "fiber"],
        "organic": ["food", "compost", "biodegradable", "organic", "plant", "wood"]
    }

    text_to_check = f"{name} {description} {category}"

    for cluster, keywords in material_keywords.items():
        if any(keyword in text_to_check for keyword in keywords):
            clusters.append(cluster.title())  # Match Airtable format

    return clusters or ["Unknown"]


def assess_processing_complexity(material_clusters):
    """
    Assess processing complexity based on number and type of materials.
    """
    if not material_clusters or len(material_clusters) == 1:
        return "Simple"
    elif len(material_clusters) <= 3:
        return "Moderate"
    else:
        return "Complex"


def get_processing_facilities(material_clusters):
    """
    Map material clusters to appropriate processing facilities.
    """
    facility_mapping = {
        "plastic": ["Recycling Center", "Plastic Processor", "Chemical Recycling"],
        "paper": ["Paper Mill", "Recycling Center", "Pulp Processor"],
        "metal": ["Scrap Yard", "Metal Recycler", "Smelting Facility"],
        "electronics": ["E-waste Facility", "Electronics Recycler", "Refurbishment Center"],
        "glass": ["Glass Recycler", "Bottle Depot", "Cullet Processor"],
        "textile": ["Textile Recycler", "Donation Center", "Fiber Processor"],
        "organic": ["Composting Facility", "Anaerobic Digester", "Biogas Plant"]
    }

    facilities = set()
    for cluster in material_clusters:
        cluster_lower = cluster.lower()
        facilities.update(facility_mapping.get(cluster_lower, []))

    return list(facilities)


def get_available_methods(material_clusters):
    """
    Get available processing methods based on material clusters.
    """
    method_mapping = {
        "plastic": ["Mechanical Recycling", "Chemical Recycling", "Incineration"],
        "paper": ["Pulping", "Mechanical Recycling", "Composting"],
        "metal": ["Melting", "Mechanical Processing", "Remanufacturing"],
        "electronics": ["Parts Recovery", "Material Separation", "Refurbishment"],
        "glass": ["Cullet Processing", "Mechanical Recycling", "Remelting"],
        "textile": ["Fiber Recovery", "Mechanical Processing", "Donation"],
        "organic": ["Composting", "Anaerobic Digestion", "Biogas Production"]
    }

    methods = set()
    for cluster in material_clusters:
        cluster_lower = cluster.lower()
        methods.update(method_mapping.get(cluster_lower, []))

    return list(methods)


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

        # Extract new fields
        equipment_required = fields.get("Equipment Required", [])
        difficulty_level = fields.get("Difficulty Level")
        time_estimate = fields.get("Time Estimate")
        success_indicators = fields.get("Success Indicators")

        cooked.append({
            "id": record["id"],
            "title": fields.get("Article ID"),
            "body": fields.get("Article Body"),
            "author": fields.get("Created By", {}).get("id"),
            "created": fields.get("Created"),
            "updated": fields.get("Last Modified"),
            # Enhanced fields
            "equipment_required": equipment_required,
            "difficulty_level": difficulty_level,
            "time_estimate": time_estimate,
            "success_indicators": success_indicators,
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
