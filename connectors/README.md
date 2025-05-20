# What this Python server does:

1. ## Periodically Fetch from Airtable and Update Neon
   Use a background thread or timer to fetch and update every hour.
   On startup, also fetch/update once.
2. ## Serve Data from Neon on API Requests
   When a GET request comes in, query Neon and return the data as JSON.
