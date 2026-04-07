# Deploy to AWS

Two options: **App Runner** (easiest) or **ECS Fargate** (more control).

---

## Option 1 — AWS App Runner (Recommended)

App Runner deploys directly from your GitHub repo — no Docker needed.

### Steps
1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner)
2. Click **Create service**
3. Source: **Source code repository** → connect GitHub → select `niklaus0x/mission-control`
4. Branch: `main`, Configuration file: `apprunner.yaml`
5. Service name: `mission-control`
6. Click **Create & deploy**

App Runner will build and deploy automatically on every push to `main`.

---

## Option 2 — ECS Fargate (via Docker)

### Prerequisites
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured (`aws configure`)
- Docker installed

### Deploy steps

```bash
# Set your AWS account ID and region
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# Create ECR repository
aws ecr create-repository --repository-name mission-control --region $AWS_REGION

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push image
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://lhnitdbruyunpmnjhkoe.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_VSPDY9ybkJXHZgSjM3ei7A_ZAHOdgCk \
  -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/mission-control:latest .

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/mission-control:latest

# Deploy using the task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
aws ecs create-cluster --cluster-name mission-control
aws ecs create-service \
  --cluster mission-control \
  --service-name mission-control-svc \
  --task-definition mission-control \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[YOUR_SUBNET_ID],securityGroups=[YOUR_SG_ID],assignPublicIp=ENABLED}"
```

---

## Auto-deploy via GitHub Actions

Add these secrets to your GitHub repo for automatic deploys:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g. `us-east-1`)
- `AWS_ACCOUNT_ID`

The `.github/workflows/deploy-aws.yml` workflow handles the rest.
