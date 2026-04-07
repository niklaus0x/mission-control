# Deploy to Google Cloud Run

## Prerequisites
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed
- GCP project created
- Cloud Run API and Container Registry API enabled

## One-time setup

```bash
# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# Configure Docker to use gcloud credentials
gcloud auth configure-docker
```

## Deploy

```bash
# Build and push Docker image
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://lhnitdbruyunpmnjhkoe.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_VSPDY9ybkJXHZgSjM3ei7A_ZAHOdgCk \
  -t gcr.io/YOUR_PROJECT_ID/mission-control .

docker push gcr.io/YOUR_PROJECT_ID/mission-control

# Deploy to Cloud Run
gcloud run deploy mission-control \
  --image gcr.io/YOUR_PROJECT_ID/mission-control \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=https://lhnitdbruyunpmnjhkoe.supabase.co,NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_VSPDY9ybkJXHZgSjM3ei7A_ZAHOdgCk
```

## Auto-deploy via GitHub Actions (optional)

Add these secrets to your GitHub repo:
- `GCP_PROJECT_ID` — your GCP project ID
- `GCP_SA_KEY` — your service account JSON key (base64 encoded)

Then the `.github/workflows/deploy-cloudrun.yml` workflow will auto-deploy on every push to main.
