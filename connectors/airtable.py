import json
import os
from types import MappingProxyType as FakeImmutable
from pyairtable import Api  # type: ignore
from helpers import get_secret


class AirtableConnector:
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
        key = get_secret("AIRTABLE_API_KEY", fallback_line=1)
        base_id = get_secret("AIRTABLE_BASE_ID", fallback_line=7)
        table = get_secret("AIRTABLE_TABLE", fallback_line=8)

        if key and base_id and table:
            PRIVATE = FakeImmutable({
                "key": key,
                "id": base_id,
                "table": table
            })

            # Initialize the Airtable API client and table
            self.api = Api(PRIVATE["key"])
            self.base_id = PRIVATE["id"]
            self.table_name = PRIVATE["table"]
            self.table = self.api.base(self.base_id).table(self.table_name)

    def get_all_data(self, filter_approved_only=True):
        """
        Retrieve all records from the Airtable table.
        :param filter_approved_only: If True, only fetch records with Status = "Approved"
        :return: A list of all records in the table.
        """
        # Ensure the table exists in Airtable
        if not self.table:
            raise ValueError("Table does not exist or is not initialized.")

        # Add filter for approved records only
        if filter_approved_only:
            formula = "Status = 'Approved'"
            records = self.table.all(formula=formula)
            print(
                f"Fetched {len(records)} approved records from {self.table_name}")
            return records
        else:
            # Retrieve all records from the table
            return self.table.all()

    def get_table(self, table_name):
        """
        Retrieve a specific table from the Airtable base.
        :param table_name: The name of the table to retrieve.
        :return: The Airtable table object.
        """
        return self.api.base(self.base_id).table(table_name)

    def get_table_data(self, table_name, filter_approved_only=True):
        """
        Retrieve records from a specific table with optional status filtering.
        :param table_name: The name of the table to retrieve.
        :param filter_approved_only: If True, only fetch approved records
        :return: List of records from the table.
        """
        table = self.get_table(table_name)
        if filter_approved_only:
            formula = "Status = 'Approved'"
            records = table.all(formula=formula)
            print(f"Fetched {len(records)} approved records from {table_name}")
            return records
        else:
            return table.all()
