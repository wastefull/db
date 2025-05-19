import os
from types import MappingProxyType as FakeImmutable
from pyairtable import Api as air  # type: ignore
from helpers import read_json, save_json


class Search:
    ignore_cache = False
    """
    A class to handle searching and retrieving data from an Airtable table.
    """

    def __init__(self, ignore_cache=False):
        self.ignore_cache = ignore_cache
        """
        Initialize the Airtable API client and table.
        Reads the API key, base ID, and table name from environment variables.
        :param ignore_cache: If True, ignore the cache and fetch data from Airtable.
        :type ignore_cache: bool
        :return: The initialized Airtable table object.
        """
        # Prefer environment variables if present
        key = os.environ.get("AIRTABLE_API_KEY")
        base_id = os.environ.get("AIRTABLE_BASE_ID")
        table = os.environ.get("AIRTABLE_TABLE")

        if key and base_id and table:
            PRIVATE = FakeImmutable({
                "key": key,
                "id": base_id,
                "table": table
            })

            # Initialize the Airtable API client and table
            self.initialize(PRIVATE["key"], PRIVATE["id"], PRIVATE["table"])

    def initialize(self, key, id, table):
        """
        Initialize the Airtable API client and table.
        :param key: The Airtable API key.
        :param id: The Airtable base ID.
        :param table: The Airtable table name.
        :return: The initialized Airtable table object.
        """
        # Check if the API key, base ID, and table name are provided
        if not key or not id or not table:
            raise ValueError(
                "Airtable API key, base ID, and/or table name is/are missing in the file.")

        # Finally initialize the Airtable client and return the correct table
        client = air(key)
        self.table = client.base(id, force=self.ignore_cache).table(
            table, force=self.ignore_cache)

    def get_all_data(self):
        """
        Retrieve all records from the Airtable table.
        :return: A list of all records in the table.
        """
        # Ensure the table exists in Airtable
        if not self.table:
            raise ValueError("Table does not exist or is not initialized.")

        # Retrieve all records from the table
        return self.table.all()

    def get_json_data(self, ignore_cache=False) -> dict:
        """
        Retrieve all records from the Airtable table and save them to data_sample.json,
        overwriting the file if it exists.
        :return: A JSON string of all records in the table.
        """
        if ignore_cache:
            return save_json(self.get_all_data(), "data.json")
        payload = read_json("data.json")
        return payload
