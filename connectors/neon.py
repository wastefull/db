import psycopg2 as postgres  # type: ignore
from typing import Optional
from helpers import gf, get_secret
import json


class NeonConnect:
    """
    A class to handle connections to the Neon database.
    """
    c: Optional[postgres.extensions.connection] = None
    cr: Optional[postgres.extensions.cursor] = None

    def __init__(self):
        """
        Initialize the NeonConnect class.
        """
        postgres_uri = self.fetch_deets()
        # Test the connection
        if not self.test_connection(postgres_uri):
            raise ConnectionError("Connection to Neon database failed.")

    def fetch_deets(self) -> str:
        """
        Fetch the connection string from the environment or private.txt.
        :return: The full connection string.
        """
        postgres_uri = get_secret("POSTGRES_URI", fallback_line=6)
        if not postgres_uri or postgres_uri == "":
            raise ValueError("Connection string is missing.")
        return postgres_uri

    def connect(self) -> postgres.extensions.connection:
        """
        Connect to the Neon database using the connection string.
        :return: A connection object or None if connection fails.
        """
        postgres_uri = get_secret("POSTGRES_URI", fallback_line=6)
        self.c = postgres.connect(postgres_uri)
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
        cursor = self.get_cursor()
        cursor.execute(query)
        self.c.commit()
        print("The query has been executed and committed.")
        return None

    def cook_and_update_neon(self, raw: list, recipe) -> None:
        """
        Cook the raw data and update the Neon database.
        :param raw: The raw data to cook and update.
        :param recipe: The function to cook the data (should return a list of dicts).
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

    def update_neon_data(self, data: list) -> None:
        """
        Update the Neon database with the provided data.
        :param data: The cooked data to update (list of dicts).
        """
        if self.cr is None:
            raise ValueError("No cursor to update the data.")
        if data is None:
            raise ValueError("No data to update.")

        skipped = 0
        inserted = 0
        try:
            insert_query = self.create_upsert_query(
                "materials", ["id", "data"])
            for o in data:
                if o is None:
                    skipped += 1
                    continue
                id_value = o.get("id")
                if not id_value:
                    print(f"Skipping record with missing id: {o}")
                    skipped += 1
                    continue
                # Store the whole dict as JSONB
                json_object = json.dumps(o)
                self.cr.execute(insert_query, (id_value, json_object))
                inserted += 1
        except Exception as e:
            print(f"Error updating data: {e}")
            raise e
        finally:
            print(
                f"Data updated successfully. {inserted} records inserted/updated, {skipped} records skipped.")
        return None

    def create_upsert_query(self, table, fields):
        fields_str = ", ".join(fields)
        primary = fields[0]
        return f"""
            INSERT INTO {table} ({fields_str})
            VALUES (%s, %s)
            ON CONFLICT ({primary}) DO UPDATE
            SET data = EXCLUDED.data
            """

    def get_all_data(self, cursor: postgres.extensions.cursor) -> list[tuple[str, ...]]:
        """
        Retrieve all records from the Neon table.
        :param conn: The connection object.
        :return: A list of all records in the table.
        """
        self.cr = cursor
        if not self.cr:
            raise ValueError("No cursor to retrieve data from.")
        self.cr.execute(self.create_select_all_query("materials"))
        records = self.cr.fetchall()
        # Data comes in as a list of tuples with the first element
        # being the id and the second element being the JSON data, which
        # also contains the id, so we can go ahead and remove the first element
        records = [record[1:][0] for record in records]
        return records

    def create_select_all_query(self, table):
        return f"SELECT * FROM {table}"

    def build_select_query(self, columns, table, condition):
        return f"SELECT {columns} FROM {table} WHERE {condition}"

    def fetch_all_materials(self):
        """
        Connects to Neon, fetches all materials, and returns as a list of dicts.
        """
        conn = self.connect()
        cur = conn.cursor()
        cur.execute("SELECT * FROM materials")
        rows = cur.fetchall()
        columns = [desc[0]
                   for desc in cur.description] if cur.description is not None else []
        # Each row: (id, data), where data is likely a dict or JSON string
        result = []
        for row in rows:
            # If 'data' is a JSON string, parse it
            data = row[1]
            if isinstance(data, str):
                try:
                    import json
                    data = json.loads(data)
                except Exception:
                    pass
            result.append(data)
        cur.close()
        conn.close()
        return result

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
        self.cr.execute(
            "SELECT * FROM materials WHERE data->>'name' = %s", (name,))
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
        if self.cr is None:
            self.cr = self.c.cursor()
        return self.cr

    def test_connection(self, postgres_uri: str):
        """
        Test the connection to the Neon database using the connection string.
        :param postgres_uri: The connection string.
        :return: True if the connection is successful, False otherwise.
        """
        conn = None
        try:
            conn = postgres.connect(postgres_uri)
            print("Connection successful")
        except Exception as e:
            print(f"Error connecting to the database: {e}")
            raise e
        finally:
            if conn:
                conn.close()
                return True
        return False

    def format_row(self, row):
        """
        Format a row object into a JSON-serializable object or string.
        :param row: The row object to format.
        :return: A JSON string or dict, or None if formatting fails.
        """
        import json
        try:
            # If row is already a dict or JSON-serializable, return as is or dump to string
            if isinstance(row, dict):
                return json.dumps(row)
            # If row is a string, try to load and dump to ensure valid JSON
            if isinstance(row, str):
                json.loads(row)  # will raise if not valid JSON
                return row
            # Otherwise, try to convert to dict then dump
            return json.dumps(dict(row))
        except Exception as e:
            print(f"Error formatting row: {e}")
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

    def fetch_article_by_id(self, article_id: str):
        conn = self.connect()
        cur = conn.cursor()
        q: str = self.build_select_query("data", "articles", "id = %s")
        v: tuple[str] = (article_id,)
        cur.execute(q, v)
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            data = row[0]
            if isinstance(data, str):
                import json
                data = json.loads(data)
            return data
        return None

    def cook_and_update_articles(self, cooked: list, recipe) -> None:
        """
        Upsert cooked articles into the Neon articles table.
        """
        self.c = self.connect()
        self.cr = self.c.cursor()
        articles = recipe(cooked)
        self.update_articles_data(articles)
        self.c.commit()
        print("Articles committed successfully")
        return None

    def update_articles_data(self, data: list) -> None:
        """
        Upsert articles into the articles table.
        """
        if self.cr is None:
            raise ValueError("No cursor to update the data.")
        if data is None:
            raise ValueError("No data to update.")

        q = self.create_upsert_query(
            "articles", ["id", "data"])
        for o in data:
            if o is None or "id" not in o:
                continue
            self.cr.execute(q, (o["id"], json.dumps(o)))
        print(f"Articles upserted: {len(data)}")

    def fetch_articles_by_material_id(self, material_id: str):
        """
        Fetch all articles whose 'targets' array contains the given material_id.
        """
        conn = self.connect()
        cur = conn.cursor()
        # Query: data->'targets' @> '["material_id"]'
        query = """
            SELECT data FROM articles
            WHERE data->'targets' @> %s
        """
        cur.execute(query, (json.dumps([material_id]),))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        # Return list of article dicts
        return [json.loads(row[0]) if isinstance(row[0], str) else row[0] for row in rows]
