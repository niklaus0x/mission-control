# Railway Deployment Guide

This project is deployed on [Railway](https://railway.app), a modern hosting platform with automatic deployments from GitHub.

## Initial Setup

### 1. Create a Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **Login with GitHub**
3. Authorize Railway to access your GitHub account

### 2. Create a New Railway Project
1. From the Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `niklaus0x/mission-control`
4. Railway auto-detects Next.js and deploys automatically

### 3. Get Your Railway Token
1. Go to [Railway Account Settings](https://railway.app/account)
2. Navigate to the **Tokens** tab
3. Click **Create Token**, name it (e.g. `github-actions`)
4. Copy the token immediately

### 4. Add Token to GitHub Secrets
1. Go to `https://github.com/niklaus0x/mission-control/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `RAILWAY_TOKEN`, Value: paste your token

## How CI/CD Works

- **Push to `main`** → automatic production deployment to Railway
- **Pull request** → PR comment with deployment info

## Manual Deployment

```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

## Configuration

See `railway.json` at the repo root — uses Nixpacks builder, `npm run build` / `npm start`, health check on `/`.