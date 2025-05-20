# What this Python server does:

1. ## Periodically Fetch from Airtable and Update Neon
   Use a background thread or timer to fetch and update every hour.
   On startup, also fetch/update once.
2. ## Serve Data from Neon on API Requests
   When a GET request comes in, query Neon and return the data as JSON.

# Local testing

Populate secrets in the .env file by running populate_env.sh.
`docker run --env-file .env -p 8000:8000 us-docker.pkg.dev/wastefull-db/my-repo/wdb-middleware`

- Dev URI localhost:8000

# Prod URI (requires auth)

https://wdb-middleware-251769284793.us-central1.run.app/
Can only be accessed with gcloud auth or by the wastefull.org domain.
