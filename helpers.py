import os
import json

def gl(l, n):
    """
    Get a line from a list of lines.
    :param l: A list of lines.
    :param n: The line number to retrieve.
    :return: The line at the specified index.
    """
    if n < 0 or n >= len(l):
        raise IndexError("Line number out of range.")
    return l[n].strip()

def gf(f, d):
    """
    Get a field from a dictionary.
    :param f: The field to retrieve.
    :param d: The dictionary to retrieve the field from.
    :return: The value of the field in the dictionary.
    """
    return d.get(f, None)

def any_missing(required, provided):
    """
    Check if any required keys are missing in the provided dictionary.
    :param required: A list of required keys.
    :param provided: A dictionary to check against.
    :return: True if any required keys are missing, False otherwise.
    """
    result = not all(key in provided for key in required)
    if result:
        print("Missing required keys in the provided dictionary:")
        for key in required:
            if key not in provided:
                print(f"Missing key: {key}")
    return result

def read_json(file_path: str) -> dict:
    """
    Read a JSON file and return its contents as a dictionary.
    :param file_path: The path to the JSON file.
    :return: A dictionary containing the JSON data.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found.")
    with open(file_path, "r") as f:
        payload = f.read()
        return json.loads(payload)

def save_json(data, file_path):
    try:
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        raise MemoryError(f"Error saving JSON data to file: {e}")
    print(f"Data saved to {file_path}")
    return data