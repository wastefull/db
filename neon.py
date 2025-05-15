import os
import psycopg2 as postgres
from typing import Optional
from helpers import gf, gl

class NeonConnect:
    """
    A class to handle connections to the Neon database.
    """
    c: Optional[postgres.extensions.connection] = None
    cr: Optional[postgres.extensions.cursor] = None
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

    def connect(self) -> None:
        """
        Connect to the Neon database using the connection details.
        :return: A connection object or None if connection fails.
        """
        self.c = postgres.connect(**self.fetch_deets())
        return self.c
    
    def execute_query(self, query) -> None:
        """
        Execute a query on the Neon database.
        :param conn: The connection object.
        :param query: The SQL query to execute.
        :return: None
        """
        if self.c is None:
            raise ValueError("No connection to execute the query on.")
        if query is None:
            raise ValueError("No query to execute.") 
        cursor = self.get_cursor(self.c)
        cursor.execute(query)
        self.c.commit()
        print("The query has been executed and committed.")
        return None

    def update_neon_data(self, data: str) -> None:
        """
        Update the Neon database with the provided data.
        :param cursor: The cursor object.
        :param data: The data to update.
        :return: None
        """
        if self.cr is None:
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
                id_value = gf("id", o)
                if o is None:
                    print(f"What is going on with data? {data}")
                else:
                    raise ValueError(f"Data {data} and object is {o}.")
                json_object = self.format_row(o)
                # Check if the json_object is None
                if json_object is None:
                    # print(f"Skipping record with id {id_value} due to invalid data.")
                    skipped += 1
                    continue
                # Execute the insert query
                print("Inserting data with id:", id_value)
                self.cr.execute(insert_query, (id_value, json_object))
        except Exception as e:
            print(f"Error updating data: {e}")
            raise e
        finally:
            print(f"Data updated successfully. {skipped} records skipped.")
        return None

    def get_all_data(self, cursor: postgres.extensions.cursor) -> list[tuple[str, ...]]:
        """
        Retrieve all records from the Neon table.
        :param conn: The connection object.
        :return: A list of all records in the table.
        """
        self.cr = cursor
        if not self.cr:
            raise ValueError("No cursor to retrieve data from.")
        self.cr.execute("SELECT * FROM materials")
        records = self.cr.fetchall()
        # Data comes in as a list of tuples with the first element 
        # being the id and the second element being the JSON data, which
        # also contains the id, so we can go ahead and remove the first element
        records = [record[1:][0] for record in records]
        return records
    
    def search_data_by_name(self, name: str) -> list[tuple[str, ...]]:
        """
        Search for records in the Neon table by name.
        :param name: The name to search for.
        :return: A list of records matching the name.
        """
        if not self.cr:
            raise ValueError("No cursor to search data from.")
        if not name:
            raise ValueError("No name to search for.")
        self.cr.execute("SELECT * FROM materials WHERE data->>'name' = %s", (name,))
        records = self.cr.fetchall()
        return records       

    def close_connection(self):
        """
        Close the connection to the Neon database.
        :param conn: The connection object to close.
        :return: None
        """
        if self.c:
            self.c.close()
            print("Connection closed")
        else:
            print("No connection to close.")

    def get_connection(self):
        """
        Get the connection to the Neon database.
        :return: A connection object.
        """
        return self.c

    def get_cursor(self):
        """
        Get the cursor object from the connection.
        :return: A cursor object.
        """
        if self.c is None:
            raise ValueError("No connection to get cursor from.")
        return self.cr

    def test_connection(self, deets):
        """
        Test the connection to the Neon database using the connection details.
        :param deets: The connection details.
        :return: True if the connection is successful, False otherwise.
        """
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

    def cook_and_update_neon(self, raw: list, recipe) -> None:
        """
        Cook the raw data and update the Neon database.
        :param conn: The connection object.
        :param raw: The raw data to cook and update.
        :param recipe: The function to cook the data.
        :return: None
        """
        self.c = self.connect()
        self.cr = self.c.cursor()

        if self.cr is None:
            raise ValueError("No cursor to cook and update data.")
        
        cooked = recipe(raw)
        self.update_neon_data(cooked)
        self.c.commit()
        print("Changes committed successfully")
        return None
    
    def close_all(self):
        """
        Close the connection and cursor to the Neon database.
        :return: None
        """
        if self.cr:
            self.cr.close()
            print("Cursor closed")
        if self.c:
            self.c.close()
            print("Connection closed")
        return None