import json
import os
from types import MappingProxyType
# Airtable API client
from pyairtable import Api as air
# Postgres API client
import psycopg2

# class Test:
#     """
#     A class to test the Search class.
#     """
#     def __init__(self, search):
#         self.search = search
#         return None
#     def test_search(self):
#         # Example usage
#         name = "Dummy Data"
#         self.search.print_results(name)
#     def test_schema(self):
#         # Example usage
#         self.search.print_schema()
#     def test_all_data(self):
#         # Example usage
#         self.search.print_all_data()
#     def test_json_data(self):
#         # Example usage
#         self.search.get_json_data()
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


class Data:
    """
    A class to handle material data operations.
    """
    def __init__(self):
        return None

class NeonConnect:
    """
    A class to handle connections to the Neon database.
    """
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
            if(self.test_connection(deets)):
                print("Connection successful. Ready to use.")
            else:
                print("Connection failed. Please check the connection details.")
        return None

    def fetch_deets(self):
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
        with open(self.file_path, "r") as f:
            lines = f.readlines()[9:16]
            keys = ["dbname", "user", "password", "host", "port", "sslmode"]
            # Read the connection details from the file
            deets = {key: gl(lines, i).split("\n")[0] for i, key in enumerate(keys)}
            return deets
    def connect(self):
        """
        Connect to the Neon database using the connection details.
        :return: A connection object.
        """
        deets = self.fetch_deets()
        try:
            conn = psycopg2.connect(**deets)
            print("Connection successful")
            return conn
        except Exception as e:
            print(f"Error connecting to the database: {e}")
            return None
    def get_cursor(self, conn):
        """
        Get a cursor object from the connection.
        :param conn: The connection object.
        :return: A cursor object.
        """
        if conn:
            cursor = conn.cursor()
            return cursor
        else:
            print("No connection to get cursor from.")
            return None
    def execute_query(self, conn, query):
        """
        Execute a query on the Neon database.
        :param conn: The connection object.
        :param query: The SQL query to execute.
        :return: None
        """
        if conn:
            cursor = self.get_cursor(conn)
            if cursor:
                try:
                    cursor.execute(query)
                    conn.commit()
                    print("Query executed successfully")
                except Exception as e:
                    print(f"Error executing query: {e}")
            else:
                print("No cursor to execute the query.")
        else:
            print("No connection to execute the query.")
    def update_neon_data(self, cursor, data):
        """
        Update the Neon database with the provided data.
        :param cursor: The cursor object.
        :param data: The data to update.
        :return: None
        """
        if cursor:
            try:
                # Assuming data is a dictionary with keys as column names and values as the new values
                # for key, value in data.items():
                #     query = f"UPDATE table_name SET {key} = '{value}' WHERE condition"
                #     cursor.execute(query)
                # Assume json_object is your Python dictionary and id_value is its unique identifier
                insert_query = """
                INSERT INTO materials (id, data)
                VALUES (%s, %s)
                ON CONFLICT (id) DO UPDATE
                SET data = EXCLUDED.data
                """
                for o in data:
                    id_value = o["id"]
                    json_object = self.digest_data(o)
                    # Execute the insert query
                    print("Inserting data with id:", id_value)
                    cursor.execute(insert_query, (id_value, json_object))
                    print("Data updated successfully")
            except Exception as e:
                print(f"Error updating data: {e}")
        else:
            print("No cursor to update the data.")
    
    def digest_data(self, data):
        """
        Convert the data to a JSON string and clean it up.
        :param data: The data to convert.
        :return: A JSON string of the data.
        """
        try:
            # Convert the data to a JSON string
            json_data = json.dumps(data)
            return json_data
        except Exception as e:
            print(f"Error converting data to JSON: {e}")
            return None

            
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
        if not deets:
            raise ValueError("Connection details are missing.")
        try:
            conn = psycopg2.connect(**deets)
            print("Connection successful")
        except Exception as e:
            print(f"Error connecting to the database: {e}")
        finally:
            if conn:
                return True
                conn.close()    
        return False
    
if __name__ == "__main__":
    creds = "private.txt"
    # Initialize the Airtable table
    search = Search(creds, ignore_cache=False)
    # Convert data to JSON
    data = search.get_json_data(use_cache=True)

    n = NeonConnect(creds)
    if n:
        conn = n.get_connection()
        cursor = n.get_cursor(conn)
        if cursor:
            n.update_neon_data(cursor, data)
            # Commit the changes
            conn.commit()
            print("Changes committed successfully")
            # Close the cursor
            cursor.close()
            # Close the connection
            n.close_connection(conn)
    else:
        print("Failed to connect to the Neon database.")
    