# What this Python server does:

1. ## Periodically Fetch from Airtable and Update Neon
   Use a background thread or timer to fetch and update every hour.
   On startup, also fetch/update once.
2. ## Serve Data from Neon on API Requests
   When a GET request comes in, query Neon and return the data as JSON.

# Local testing

Populate secrets in your local .env file by running populate_env.sh in /connectors.

```bash
docker run --env-file .env -p 8000:8000 us-docker.pkg.dev/wastefull-db/my-repo/wdb-middleware
```

## Building

To build the project in the cloud run the following while authenticated and in the /connectors directory:

```bash
gcloud auth login
cd connectors
gcloud builds submit --tag us-docker.pkg.dev/wastefull-db/my-repo/wdb-middleware
```

## Deploying

```bash
gcloud run deploy wdb-middleware \
    --image us-docker.pkg.dev/wastefull-db/my-repo/wdb-middleware \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --update-secrets AIRTABLE_API_KEY=projects/251769284793/secrets/AIRTABLE_API_KEY:latest \
    --set-env-vars AIRTABLE_BASE_ID=app35YvKXrBhupoeN,AIRTABLE_TABLE=Materials \
    --update-secrets POSTGRES_URI=projects/251769284793/secrets/POSTGRES_URI:latest
```
