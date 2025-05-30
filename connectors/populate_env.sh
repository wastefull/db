# Create or overwrite the .env file with your secrets and env vars
echo "AIRTABLE_API_KEY=$(gcloud secrets versions access latest --secret="AIRTABLE_API_KEY")" > .env
echo "AIRTABLE_BASE_ID=app35YvKXrBhupoeN" >> .env
echo "AIRTABLE_TABLE=Materials" >> .env
echo "POSTGRES_URI=$(gcloud secrets versions access latest --secret="POSTGRES_URI")" >> .env
echo "UNSPLASH_AID=$(gcloud secrets versions access latest --secret="UNSPLASH_AID")" >> .env
echo "UNSPLASH_AK=$(gcloud secrets versions access latest --secret="UNSPLASH_AK")" >> .env
echo "UNSPLASH_SK=$(gcloud secrets versions access latest --secret="UNSPLASH_SK")" >> .env