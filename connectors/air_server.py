from airtable import Search as ac
from neon import NeonConnect as nc
from helpers import save_json
import data_chef as dc


def fetch(*, creds="private.txt", refresh=False):
    data = None
    # Initialize the Neon database connection
    n = nc(creds)
    if refresh:
        # Initialize the Airtable connection
        at_connect = ac(creds, refresh)
        raw = at_connect.get_json_data(refresh)
        data = dc.cook_data(raw)
    else:
        n.connect()
        c = n.c.cursor()
        data_list = n.get_all_data(c)
        # testing the cooking function
        data = dc.cook_data(data_list)

    save_json(data, "data.json")
    n.close_all()
    return None
