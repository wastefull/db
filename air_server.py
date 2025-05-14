from http.server import BaseHTTPRequestHandler
import json, os
from types import MappingProxyType as FakeImmutable
from typing import Optional
from pyairtable import Api as air
import psycopg2 as postgres

"""
This module provides a class to handle searching and retrieving data from the Airtable table,
as well as a class to handle connections to the Neon database, which will serve as a cached backend for the app.
This module will also provide a basic API server to handle requests from the app.


TLDR:
NEXT STEPS ARE
SERVE IT
INJEST IT
"""

# Helpers
def gl(l, n):
    """
    Read a specific line from the file.
    :param l: The list of lines from the file.
    :param n: The line number to read.
    :return: The line at the specified index.
    """
    if n < 0 or n >= len(l):
        raise IndexError("Line number out of range.")
    return l[n].strip()
def gf(f, d):
    """
    Get the value of a field from a dictionary, or return None if the field is not present.
    :param f: The field name to get.
    :param d: The dictionary to get the field from.
    :return: The value of the field, or None if the field is not present.
    """
    return d.get(f, None)
def any_missing(required, provided):
    """
    Check if any required keys are missing from the provided dictionary.
    :param required: A list of required keys.
    :param provided: A dictionary of provided keys.
    :return: True if any required keys are missing, False otherwise.
    """
    result = not all(key in provided for key in required)
    if result:
        print("Missing required keys in the provided dictionary:")
        for key in required:
            if key not in provided:
                print(f"Missing key: {key}")
    return result

class Search:
    ignore_cache = False
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
                PRIVATE = FakeImmutable({
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

    def get_json_data(self, use_cache=False):
        """
        Retrieve all records from the Airtable table and save them to data_sample.json,
        overwriting the file if it exists.
        :return: A JSON string of all records in the table.
        """
        if use_cache:
            # Check if the file exists
            if os.path.exists("data_sample.json"):
                with open("data_sample.json", "r") as f:
                    payload = f.read()
                return json.loads(payload)
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
        return json.loads(payload)
        

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

class NeonConnect:
    """
    A class to handle connections to the Neon database.
    """
    # connection: Optional[postgres.extensions.connection] = None
    def __init__(self, file_path):
        """
        Initialize the NeonConnect class.
        :param file_path: The path to the file containing the connection details.
        """
        # Check if the file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(file_path + " not found.")
        else:
            self.file_path = file_path
            # Read the connection details from the file
            try:
                deets = self.fetch_deets()
            except Exception as e:
                print(f"Error reading connection details: {e}")
                return None
            # Test the connection
            if not self.test_connection(deets):
                raise ConnectionError("Connection to Neon database failed.")
        return None

    def fetch_deets(self) -> dict[str,str]:
        """
        Fetch the connection details from the file.
        :return: A dictionary containing the connection details.
        """
        # Read the connection details from the file
        # Assuming the file contains the following lines:
        # key: <API_KEY>
        # id: <BASE_ID>
        # table: <TABLE_NAME>
        # dbname: <DB_NAME>
        # user: <USER>
        # password: <PASSWORD>
        # host: <HOST>
        # port: <PORT>
        # sslmode: <SSL_MODE>

        # Check if the file exists
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(self.file_path + " not found.")
        with open(self.file_path, "r") as f:
            lines = f.readlines()[9:16]
            keys = ["dbname", "user", "password", "host", "port", "sslmode"]
            # Read the connection details from the file
            deets = {key: gl(lines, i).split("\n")[0] for i, key in enumerate(keys)}
            if not deets:
                raise ValueError("Connection details are missing in the file.")
            return deets

    def connect(self) -> postgres.extensions.connection:
        """
        Connect to the Neon database using the connection details.
        :return: A connection object or None if connection fails.
        """
        return postgres.connect(**self.fetch_deets())

    def get_cursor(self, conn: postgres.extensions.connection) -> postgres.extensions.cursor:
        """
        Get a cursor object from the connection.
        :param conn: The connection object.
        :return: A cursor object.
        """
        if conn is None:
            raise ValueError("No connection to get cursor from.")
        return conn.cursor()
    def execute_query(self, conn, query) -> None:
        """
        Execute a query on the Neon database.
        :param conn: The connection object.
        :param query: The SQL query to execute.
        :return: None
        """
        if conn is None:
            raise ValueError("No connection to execute the query on.")
        if query is None:
            raise ValueError("No query to execute.") 
        cursor = self.get_cursor(conn)
        cursor.execute(query)
        conn.commit()
        print("The query has been executed and committed.")
        return None
    def update_neon_data(self, cursor, data):
        """
        Update the Neon database with the provided data.
        :param cursor: The cursor object.
        :param data: The data to update.
        :return: None
        """
        if cursor is None:
            raise ValueError("No cursor to update the data.")
        if data is None:
            raise ValueError("No data to update.")
    
        skipped = 0 # skip records that are not "Approved"
        try:
            insert_query = """
            INSERT INTO materials (id, data)
            VALUES (%s, %s)
            ON CONFLICT (id) DO UPDATE
            SET data = EXCLUDED.data
            """
            for o in data:
                id_value = o["id"]
                json_object = self.digest_data(o)
                # Check if the json_object is None
                if json_object is None:
                    # print(f"Skipping record with id {id_value} due to invalid data.")
                    skipped += 1
                    continue
                # Execute the insert query
                print("Inserting data with id:", id_value)
                cursor.execute(insert_query, (id_value, json_object))
        except Exception as e:
            print(f"Error updating data: {e}")
            raise e
        finally:
            print(f"Data updated successfully. {skipped} records skipped.")
        # Optionally close the cursor
        cursor.close()
        return None
    def digest_data(self, data: dict) -> Optional[str]:
        """
        Convert the data to a JSON string and clean it up.
        :param data: The data to convert.
        :return: A JSON string of the data or None if the data is not Approved.
        -----
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
            raise KeyError("Missing required keys in the data.")
        elif not isinstance(data["fields"], dict):
            # Check if the fields key is a dictionary
            raise TypeError("Fields must be a dictionary.")
        
        fields = data["fields"]
        # Check if the status is "Approved"
        if fields["Status"] != "Approved":
            return None

        # Check if the required keys are present in the fields dictionary
        required_fields = ["Description", "Status", "Name", "Last Modified By", "Risks", "Image", "Last Modified"]
        if any_missing(required_fields, fields):
            raise KeyError("Missing required keys in the fields dictionary. required fields are: " + str(required_fields) + " and provided fields are: " + str(fields.keys()))
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
                json_data = json.dumps(data)
                return json_data
            except Exception as e:
                print(f"Error converting data to JSON: {e}")
                raise e
    def get_all_data(self, conn: postgres.extensions.connection) -> list[tuple[str, ...]]:
        """
        Retrieve all records from the Neon table.
        :param conn: The connection object.
        :return: A list of all records in the table.
        """
        if not conn:
            raise ConnectionError("No connection to retrieve data from.")
        cursor = self.get_cursor(conn)
        if not cursor:
            raise ValueError("No cursor to retrieve data from.")
        cursor.execute("SELECT * FROM materials")
        records = cursor.fetchall()
        return records
    def get_data_by_id(self, conn: postgres.extensions.connection, id: str) -> tuple[str, ...]:
        """
        Retrieve a record from the Neon table by ID.
        :param conn: The connection object.
        :param id: The ID of the record to retrieve.
        :return: A tuple containing the record data.
        """
        cursor = self.get_cursor(conn)
        cursor.execute("SELECT * FROM materials WHERE id = %s", (id,))
        record = cursor.fetchone()
        return record
    def search_data_by_name(self, name: str) -> list[tuple[str, ...]]:
        """
        Search for records in the Neon table by name.
        :param name: The name to search for.
        :return: A list of records matching the name.
        """
        conn = self.connect()
        cursor = self.get_cursor(conn)
        cursor.execute("SELECT * FROM materials WHERE data->>'name' = %s", (name,))
        records = cursor.fetchall()
        return records       
    def close_connection(self, conn):
        """
        Close the connection to the Neon database.
        :param conn: The connection object to close.
        :return: None
        """
        if conn:
            conn.close()
            print("Connection closed")
        else:
            print("No connection to close.")
    def get_connection(self):
        """
        Get the connection to the Neon database.
        :return: A connection object.
        """
        deets = self.fetch_deets()
        conn = self.connect()
        if conn:
            return conn
        else:
            print("Failed to connect to the database.")
            return None
    def test_connection(self, deets):
        """
        Test the connection to the Neon database using the connection details.
        :param deets: The connection details.
        :return: True if the connection is successful, False otherwise.
        """
        conn = None
        # Check if the connection details are provided
        if not deets or not isinstance(deets, dict):
            raise ValueError("Connection details are missing.")
        try:
            conn = postgres.connect(**deets)
            print("Connection successful")
        except Exception as e:
            print(f"Error connecting to the database: {e}")
            raise e
        finally:
            if conn:
                return True
                conn.close()    
        return False


if __name__ == "__main__":
    creds = "private.txt"
    refresh = True
    # Initialize the Airtable table
    search = Search(creds, ignore_cache=refresh)
    # Convert data to JSON
    data = search.get_json_data(use_cache=not refresh)
    n = NeonConnect(creds)
    if n:
        conn = n.get_connection()
        cursor = n.get_cursor(conn)
        if cursor:
            n.update_neon_data(cursor, data)
            # Commit the changes
            conn.commit()
            print("Changes committed successfully")
            # Fetch all data from the Neon table
            all_data = n.get_all_data(conn)
            print("All data from the Neon table:")
            for row in all_data:
                print(row)
            # Close the cursor
            cursor.close()
            # Close the connection
            n.close_connection(conn)
    else:
        print("Failed to connect to the Neon database.")
    