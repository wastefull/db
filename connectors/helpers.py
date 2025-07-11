from typing import Optional
import os
import requests
import re


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


def gf(f, d) -> str:
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


def get_secret(name: str, fallback_line: Optional[int] = None, file_path: str = "../private.txt"):
    """
    Try to get a secret from the environment, otherwise from a line in private.txt.
    :param name: The environment variable name.
    :param fallback_line: The line number (0-based) in private.txt to use if env var is not set.
    :param file_path: Path to private.txt.
    :return: The secret value as a string.
    TODO: Replace private.txt fallback with /connectors/.env
    """
    value = os.environ.get(name)
    if value:
        return value
    if fallback_line is not None:
        try:
            with open(file_path) as f:
                lines = [line.strip() for line in f.readlines()]
                return lines[fallback_line]
        except Exception as e:
            raise RuntimeError(
                f"Could not read {name} from env or {file_path}: {e}")
    raise RuntimeError(f"Secret {name} not found in env or {file_path}")


class Unsplash:
    """
    A class to interact with the Unsplash API.
    """

    def __init__(self):
        self.access_key = get_secret("UNSPLASH_AK")
        self.headers = {
            "Accept-Version": "v1",
            "Accept": "application/json"
        }

    def clean_query(self, query: str) -> str:
        """
        Clean the query by removing content in parentheses and limiting length.
        :param query: The original search query.
        :return: Cleaned query (max 36 characters, no parentheses content).
        """
        if not query:
            return ""

        # Remove everything in parentheses (including the parentheses)
        cleaned = re.sub(r'\([^)]*\)', '', query)

        # Remove extra whitespace and strip
        cleaned = ' '.join(cleaned.split())

        # Limit to 36 characters
        if len(cleaned) > 36:
            cleaned = cleaned[:36].strip()

        return cleaned

    def get_random_image(self, query: str) -> dict:
        """
        Get a random image URL from Unsplash based on a query.
        :param query: The search query for the image.
        :return: A URL of a random image.
        """
        # Clean the query first
        clean_query = self.clean_query(query)

        where = "https://api.unsplash.com"
        what = "photos/random"
        description = f"query={clean_query}"
        pick_one = "count=1"
        auth = f"client_id={self.access_key}"
        orientation = "orientation=squarish"

        url = f"{where}/{what}?{description}&{pick_one}&{orientation}&{auth}"

        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            image = response.json()[0]
            # the fields we want are user.username, user.links.self, urls.small, urls.thumb
            return {
                "url": image["urls"]["small"] or image["urls"]["regular"],
                "thumbnail_url": image["urls"]["thumb"],
                "photographer": {
                    "username": image["user"]["username"],
                    "profile_url": image["user"]["links"]["self"]
                }
            }

        else:
            raise RuntimeError(
                f"Unsplash API request failed with status {response.status_code}")
