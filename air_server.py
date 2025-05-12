import os
from pyairtable import Api as air
from pyairtable.testing import MockAirtable
with open("private.txt", "r") as f:
    lines = f.readlines()
    AIRTABLE_API_KEY = lines[1].strip()
    AIRTABLE_BASE_ID = lines[7].strip()
    AIRTABLE_TABLE_NAME = lines[8].strip()

if not AIRTABLE_API_KEY or not AIRTABLE_BASE_ID or not AIRTABLE_TABLE_NAME:
    raise ValueError("Airtable API key, base ID, or table name is missing in private.txt")

# Initialize the Airtable API client
airtable = air(AIRTABLE_API_KEY)
base = airtable.base(AIRTABLE_BASE_ID)
table = base.table(AIRTABLE_TABLE_NAME)

# Print table schema using the Airtable API
print(table.schema())