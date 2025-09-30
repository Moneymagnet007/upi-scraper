# UPI Scraper API (Google Cloud Run)

## Deploy Instructions

1. Authenticate with Google Cloud:
   gcloud auth login

2. Set project:
   gcloud config set project PROJECT_ID

3. Enable APIs:
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com

4. Build image and push:
   gcloud builds submit --tag gcr.io/PROJECT_ID/upi-scraper

5. Deploy to Cloud Run:
   gcloud run deploy upi-scraper      --image gcr.io/PROJECT_ID/upi-scraper      --platform managed      --region us-central1      --allow-unauthenticated      --memory 512Mi      --set-env-vars SHARED_SECRET=your_secret,UPDATE_UPI_ENDPOINT=https://yourdomain.com/bigsle/update_upi.php,UPDATE_UPI_SECRET=your_upi_secret

6. You will get a Cloud Run URL. Use it in your PHP code to call /scrape.
