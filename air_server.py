import json
import os
from pyairtable import Api as air
from types import MappingProxyType

class Search:
    """
    A class to handle searching and retrieving data from an Airtable table.
    """
    def __init__(self, file_path, ignore_cache=False):
        self.ignore_cache = ignore_cache
        """
        Initialize the Airtable API client and table.
        Reads the API key, base ID, and table name from a private file.
        :return: The initialized Airtable table object.
        """
        # Check if the file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(file_path + " not found.")
        
        else: 
            # Read the API key, base ID, and table name from the file
            with open(file_path, "r") as f:
                lines = f.readlines()
                PRIVATE = MappingProxyType({
                    "key": lines[1].strip(),
                    "id": lines[7].strip(),
                    "table": lines[8].strip()
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
            raise ValueError("Airtable API key, base ID, and/or table name is/are missing in the file.")

        # Finally initialize the Airtable client and return the correct table
        client = air(key)
        self.table = client.base(id, force=self.ignore_cache).table(table, force=self.ignore_cache)
    
    def search_data_by_name(self, name=None):
        """
        Search for records in the Airtable table by name.
        :param name: The name to search for.
        :return: A list of records that match the search criteria.
        """
        try:
            # Check if the name is provided
            if not name:
                return self.get_all_data()
            
            # Ensure the name is a string
            elif not isinstance(name, str):
                raise TypeError("Name must be a string.")
            
            # Ensure the table exists
            elif not self.table:
                raise ValueError("Table does not exist or is not initialized.")
        
            # Search for records where the 'Name' field matches the provided name
            else:
                records = self.table.all(formula=f"{{Name}} = '{name}'")
                return records
        except Exception as e:
            print(f"Error searching data by name: {e}")
            return []
    
    def get_all_data(self):
        """
        Retrieve all records from the Airtable table.
        :return: A list of all records in the table.
        """
        try:
            # Ensure the table exists
            if not self.table:
                raise ValueError("Table does not exist or is not initialized.")
            
            # Retrieve all records from the table
            records = self.table.all()
            return records
        except Exception as e:
            print(f"Error retrieving all data: {e}")
            return []
    
    def print_all_data(self):
        all_records = self.get_all_data()
        if all_records:
            print("All records:")
            for record in all_records:
                print(record)
        else:
            print("No records found.")

    def get_json_data(self):
        """
        Retrieve all records from the Airtable table and save them to data_sample.json,
        overwriting the file if it exists.
        :return: A JSON string of all records in the table.
        """
        try:
            # Ensure the table exists
            if not self.table:
                raise ValueError("Table does not exist or is not initialized.")
            
            # Retrieve all records from the table
            records = self.table.all()
            payload = json.dumps(records, indent=4)
        except Exception as e:
            print(f"Error retrieving JSON data: {e}")
            return None
        # Save the JSON data to a file
        try:
            with open("data_sample.json", "w") as f:
                f.write(payload)
            print("Data saved to data_sample.json")
        except Exception as e:
            print(f"Error saving JSON data to file: {e}")
            return None
        return payload
        

    def print_results(self, name):
        records = self.search_data_by_name(name)
        if records:
            print(f"Records found for name '{name}':")
            for record in records:
                print(record)
        else:
            print(f"No records found for name '{name}'.")
    def print_schema(self):
        """
        Print the schema of the Airtable table.
        :return: None
        """
        try:
            # Ensure the table exists
            if not self.table:
                raise ValueError("Table does not exist or is not initialized.")
            
            # Retrieve the schema of the table
            schema = self.table.schema()
            print("Table Schema:")
            for field, field_type in schema.items():
                print(f"{field}: {field_type}")
        except Exception as e:
            print(f"Error retrieving schema: {e}")

class Test:
    """
    A class to test the Search class.
    """
    def __init__(self, search):
        self.search = search
        return None
    def test_search(self):
        # Example usage
        name = "Dummy Data"
        self.search.print_results(name)
    def test_schema(self):
        # Example usage
        self.search.print_schema()
    def test_all_data(self):
        # Example usage
        self.search.print_all_data()
    def test_json_data(self):
        # Example usage
        self.search.get_json_data()


    
if __name__ == "__main__":
    # Initialize the Airtable table
    search = Search("private.txt")
    # Test the Search class
    # print(search.table.schema())
    test = Test(search)
    test.test_json_data()

    