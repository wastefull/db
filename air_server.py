from http.server import BaseHTTPRequestHandler
from airtable import Search as ac
from neon import NeonConnect as nc
from helpers import gl, gf, any_missing, read_json, save_json
import json
import data_chef as dc

"""
This module uses a class to handle searching and retrieving data from the Airtable table,
as well as a class to handle connections to the Neon database, which will serve as a cached backend for the app.
This module will also provide a basic API server to handle requests from the app.

TLDR:
NEXT STEPS ARE
SERVE IT
INJEST IT
"""
CREDS = "private.txt"
REFRESH = False
data = None
if __name__ == "__main__":
    # Initialize the Neon database connection
    n = nc(CREDS)
    if REFRESH:
        # Initialize the Airtable connection
        at_connect = ac(CREDS, REFRESH)
        raw = at_connect.get_json_data(REFRESH)
        data = dc.cook_data(raw)
    else:
        n.connect()
        c = n.c.cursor()
        data_list = n.get_all_data(c)
        # testing the cooking function
        data = dc.cook_data(data_list)

    save_json(data, "data.json")
    n.close_all()
    