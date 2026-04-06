## Deployment

This project uses an automated CI/CD pipeline that deploys to Vercel via GitHub Actions.

### Initial Setup

#### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import the `niklaus0x/mission-control` repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"** (this first deployment creates the project)

#### 2. Configure GitHub Secrets

After your first Vercel deployment, add these three secrets to your GitHub repository:

**To find your Vercel credentials:**

1. **VERCEL_TOKEN**
   - Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
   - Click **"Create Token"**
   - Name it (e.g., "GitHub Actions")
   - Copy the token immediately (shown only once)

2. **VERCEL_ORG_ID**
   - Go to [Vercel Account Settings](https://vercel.com/account)
   - Scroll to **"Your ID"** section
   - Copy the alphanumeric ID

3. **VERCEL_PROJECT_ID**
   - Open your project in Vercel Dashboard
   - Go to **Settings** → **General**
   - Scroll to **"Project ID"** section
   - Copy the project ID

**To add secrets to GitHub:**

1. Go to your repository: `https://github.com/niklaus0x/mission-control`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each of the three secrets
4. Name them exactly: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### How the Pipeline Works

#### Production Deployments
- **Trigger:** Push to `main` branch
- **Action:** Automatic deployment to Vercel production

#### Preview Deployments
- **Trigger:** Pull request opened/updated targeting `main`
- **Action:** Automatic preview deployment with URL posted as PR comment

### Manual Deployment (Optional)

```bash
npm i -g vercel
vercel link
vercel --prod
```