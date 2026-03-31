# 🚀 Deployment Guide - Online Library Management System

## Overview
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Database**: PostgreSQL (managed by Railway)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free tier available)

### Step 2: Deploy Backend API
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account and select the `Online-library-management-system` repo
4. Click "Add Services" → "PostgreSQL"
5. Click "Add" on your repo again to add the Node.js service

### Step 3: Configure Environment Variables
In Railway dashboard, go to Variables tab and add:
```
NODE_ENV=production
PORT=3000
DB_HOST=<railway-postgres-host>
DB_PORT=<railway-postgres-port>
DB_NAME=<database-name>
DB_USER=postgres
DB_PASSWORD=<your-postgres-password>
JWT_SECRET=your_super_secret_jwt_key_change_in_production_environment_12345
JWT_EXPIRE=7d
```

**To get PostgreSQL variables:**
1. Click the PostgreSQL service in Railway
2. Go to "Connect" tab
3. Copy the connection string details

### Step 4: Setup Database on Railway
1. Connect to Railway PostgreSQL using a tool or run migrations
2. Run your migrations on the Railway database:
   ```bash
   psql <railway-connection-string> -f database/migrations/001_create_users_table.sql
   psql <railway-connection-string> -f database/migrations/002_create_books_table.sql
   psql <railway-connection-string> -f database/migrations/003_create_transactions_table.sql
   psql <railway-connection-string> -f database/migrations/004_create_reservations_table.sql
   ```
3. Seed the database:
   ```bash
   psql <railway-connection-string> -f database/seeds/001_seed_users.sql
   psql <railway-connection-string> -f database/seeds/002_seed_books.sql
   ```

### Step 5: Get Your Backend URL
In Railway, go to your Node.js service → Settings → Domains
You'll get a URL like: `https://online-library-api-prod.up.railway.app`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click "New Project"
2. Import your `Online-library-management-system` GitHub repo
3. Set Framework as "Vite"
4. Set Root Directory as "frontend"

### Step 3: Add Environment Variables
In Vercel deployment settings, add:
```
VITE_API_BASE_URL=https://online-library-api-prod.up.railway.app/api
```
(Replace with your actual Railway backend URL)

### Step 4: Manual Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 5: Deploy!
Click "Deploy" and wait for it to complete.

Your frontend will be live at: `https://your-project.vercel.app`

---

## Step 3: Update Git Remote and Push

Commit your deployment configurations:
```bash
cd "path/to/Online Library Management System"
git add .
git commit -m "Add deployment configurations for Vercel and Railway"
git push origin main
```

---

## Testing Production

After deployment:

1. **Test API**: Visit `https://your-backend.up.railway.app/api/health`
2. **Test Frontend**: Visit `https://your-frontend.vercel.app`
3. **Login**: Use test credentials:
   - Email: `admin@lms.com`
   - Password: `Admin123`

---

## Troubleshooting

### Frontend not connecting to backend?
- Verify the `VITE_API_BASE_URL` environment variable in Vercel
- Check CORS settings in backend `server.js`

### Database connection errors on Railway?
- Verify all environment variables are set correctly
- Check that migrations have run on production database
- Verify PostgreSQL service is running in Railway

### 502 Bad Gateway errors?
- Check Railway logs for backend service
- Verify the Node.js service is running

---

## Monitoring

### Railway Dashboard
- View logs: Services → Logs
- Monitor resources: Deployments tab
- Check health: Status indicator

### Vercel Dashboard
- View logs: Deployments → logs
- Monitor performance: Analytics tab
- Set up alerts: Settings → Alerts

---

## Rollback

If something goes wrong:

**Railway**: Go to Deployments → select previous version
**Vercel**: Go to Deployments → select previous version and promote

---

## Next Steps

1. Set up custom domains (optional)
2. Configure auto-deployments on git push
3. Set up monitoring and alerts
4. Plan database backups
