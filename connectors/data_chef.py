from helpers import gl, gf, any_missing, read_json, save_json


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


def cook_data(raw: list) -> list:
    """
    Cook the raw data and return it.
    :param conn: The connection object.
    :param raw: The raw data to cook.
    :return: The cooked data.
    """
    cooked = []
    for o in raw:
        new = format_row(o)
        if new is not None:
            cooked.append(new)
    return cooked


def format_row(data: dict):
    """
    Convert the data to a JSON string and clean it up.
    :param data: The data to convert.
    :return: A JSON string of the data or None if the data is not Approved.

    Data format is going to look like:
        - id
        - meta: name, description, *tags (not implemented yet), *alt_names (not implemented yet)
        - image: url, thumbnail_url
        - risk: types, factors, hazards
        - updated: datetime, user_id
        - articles: compost, recycle, upcycle
    Note: We only want the data with Status = "Approved"
    """
    # Check if the required keys are present in the data
    required_keys = ["id", "fields"]
    if any_missing(required_keys, data):
        raise KeyError(f"A row is missing columns: {required_keys}")
    elif not isinstance(data["fields"], dict):
        # Check if the fields key is a dictionary
        raise TypeError("Fields must be a dictionary.")

    fields = data["fields"]
    # Check if the status is "Approved"
    if fields["Status"] != "Approved":
        return None

    # Check if the required keys are present in the fields dictionary
    required_fields = ["Description", "Status", "Name",
                       "Last Modified By", "Risks", "Image", "Last Modified"]
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
        image = gf("Image", fields)[0] if gf("Image", fields) else None
        image_url = gf("url", image) if image else None
        thumb = gf("thumbnails", image)["small"] if image else None
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
            # Convert the data to a JSON string
            # json_data = json.dumps(next_row, indent=4)
            return next_row
        except Exception as e:
            print(f"Error converting data to JSON: {e}")
            raise e
