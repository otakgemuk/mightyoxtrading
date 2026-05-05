# 🚀 Deployment Guide - Prop Firms Platform

This app is ready to deploy to multiple cloud platforms. Choose your preferred option below.

---

## Quick Start: Local Development with Docker

### Prerequisites
- Docker Desktop installed
- Git

### 1. Start the App
```bash
# Copy docker environment
cp .env.docker .env.local

# Start all services (MySQL + App)
docker-compose up -d

# Wait for MySQL to be ready (30 seconds)
sleep 30

# Run migrations
docker-compose exec app npm run db:generate
docker-compose exec app npm run db:push

# Load pricing data
docker-compose exec app npx ts-node db/seed-pricing.ts
```

### 2. Access the App
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **MySQL**: localhost:3306

### 3. Stop the App
```bash
docker-compose down
```

---

## Cloud Deployment Options

### Option 1: Railway (Recommended ⭐)

Railway is the simplest option — automatic deployments on every git push.

#### Setup Steps:
1. **Create Railway Account**: https://railway.app
2. **Connect GitHub Repository**:
   - Go to Railway Dashboard → New Project
   - Select "GitHub Repo"
   - Choose your repo
   - Railway auto-detects `railway.json`

3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   APP_ID=your-app-id
   APP_SECRET=your-secret-key
   VITE_KIMI_AUTH_URL=your-railway-url.railway.app
   VITE_APP_ID=your-app-id
   KIMI_AUTH_URL=your-railway-url.railway.app
   KIMI_OPEN_URL=https://open.kimi.com
   OWNER_UNION_ID=your-admin-id
   ```

4. **Add MySQL Plugin**:
   - Dashboard → Add Services → MySQL
   - Railway auto-generates `DATABASE_URL`

5. **Deploy**:
   - Push to GitHub → Railway auto-deploys
   - Check live URL in Railway Dashboard

**Cost**: Free tier (generous) + $5/month after  
**Pros**: Easiest setup, automatic deployments, great support

---

### Option 2: Render

Render is a good alternative with simple deployment process.

#### Setup Steps:
1. **Create Render Account**: https://render.com
2. **Create New Web Service**:
   - Connect GitHub repo
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

3. **Add MySQL Database**:
   - Dashboard → New MySQL Database
   - Copy connection string to `DATABASE_URL`

4. **Set Environment Variables** (in Service Settings):
   ```
   NODE_ENV=production
   DATABASE_URL=<from MySQL service>
   APP_ID=your-app-id
   APP_SECRET=your-secret-key
   VITE_KIMI_AUTH_URL=your-render-url.onrender.com
   VITE_APP_ID=your-app-id
   ```

5. **Deploy**:
   - Push to GitHub → Render auto-deploys
   - Get URL from Render Dashboard

**Cost**: Free tier (sleep mode after 15 mins) + $7/month tier  
**Pros**: Straightforward, good documentation

---

### Option 3: Vercel (Frontend Only)

For hosting the frontend separately:

1. **Create Vercel Account**: https://vercel.com
2. **Import Project**:
   - Connect GitHub repo
   - Vercel detects `vercel.json`

3. **Set Environment Variables**:
   - Project Settings → Environment Variables
   - Add all vars from `.env.example`

4. **Deploy**:
   - Push to GitHub → auto-deploys
   - Get URL immediately

**Note**: You'll need a separate backend (use Railway for the API).

---

### Option 4: AWS (Comprehensive)

For full control and scalability:

#### Architecture:
- **RDS MySQL** for database
- **ECS/Fargate** for app container
- **ALB** for load balancing
- **CloudFront** for CDN

**Setup (Advanced)**:
```bash
# Use AWS CLI to deploy
aws ecs create-service \
  --cluster prop-firms \
  --service-name app \
  --task-definition prop-firms-app \
  --desired-count 2

# Create RDS MySQL
aws rds create-db-instance \
  --db-instance-identifier prop-firms-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username prop_user \
  --master-user-password <strong-password>
```

**Cost**: ~$20-50/month (depends on usage)  
**Pros**: Enterprise-grade, highly scalable

---

## Database Seeding

### Load Your Pricing Data

Once deployed, seed the database with your prop firm pricing:

```bash
# Local Docker
docker-compose exec app npx ts-node db/seed-pricing.ts

# Railway/Render (via Railway CLI)
railway run npx ts-node db/seed-pricing.ts

# AWS/Manual SSH
ssh your-server
cd /app
npm install
npx ts-node db/seed-pricing.ts
```

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Deployment environment | `production` |
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host/db` |
| `APP_ID` | Application identifier | `kimi-prop-firms` |
| `APP_SECRET` | JWT signing key | Random 32-char string |
| `VITE_KIMI_AUTH_URL` | Auth server URL | `https://yourdomain.com` |
| `VITE_APP_ID` | Frontend app ID | `kimi-prop-firms` |
| `OWNER_UNION_ID` | Initial admin user ID | `your-admin-id` |

---

## Monitoring & Logs

### Railway
```bash
railway logs -f
```

### Render
Dashboard → Services → Logs

### Local Docker
```bash
docker-compose logs -f app
docker-compose logs -f mysql
```

---

## Domain Setup

After deployment, connect your custom domain:

### Railway
1. Settings → Custom Domains
2. Add your domain
3. Update DNS CNAME to Railway URL

### Render
1. Settings → Custom Domains
2. Add your domain
3. Update DNS CNAME

### AWS
1. Route 53 → Create hosted zone
2. Create A record pointing to ALB
3. Update domain registrar NS records

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure `DATABASE_URL` is correct and MySQL service is running.

### Build Fails
```
npm ERR! peer dep missing
```
**Solution**: 
```bash
npm install --legacy-peer-deps
```

### App Crashes After Deploy
```
Error: DATABASE_URL environment variable not found
```
**Solution**: Verify all environment variables are set in your platform's dashboard.

---

## Next Steps

1. ✅ Choose deployment platform (recommended: **Railway**)
2. ✅ Set up database
3. ✅ Deploy app
4. ✅ Load pricing data with seed script
5. ✅ Configure custom domain
6. ✅ Set up monitoring/alerts

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **AWS Docs**: https://docs.aws.amazon.com

---

**Questions?** Open an issue or check deployment logs for error details.
# Deployment fix - complete project structure
