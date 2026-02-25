# Deploying CafeSafe Pro

## Recommended: Free Deployment for Testing

### Option 1: Deploy to Vercel (Frontend) + Railway (Database) - FREE

This is the best free option for testing with others.

#### Step 1: Setup Database (Railway - Free Tier)

1. Go to https://railway.app/ and sign up with GitHub
2. Click "New Project"
3. Select "Provision PostgreSQL"
4. Wait for database to be created
5. Go to "Variables" tab and copy the `DATABASE_URL`

The URL will look like:
```
postgresql://postgres:password@roundhouse.proxy.rlwy.net:12345/railway
```

#### Step 2: Deploy to Vercel

1. Push your code to GitHub:
```bash
cd C:\Users\ssinghz279\CafeSafePro
# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
# Go to https://github.com/new and create a repo
git remote add origin https://github.com/YOUR_USERNAME/CafeSafePro.git
git push -u origin main
```

2. Go to https://vercel.com/ and sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `DATABASE_URL` = (paste from Railway)
   - `NEXTAUTH_SECRET` = (generate at https://generate-secret.vercel.app/32)
   - `NEXTAUTH_URL` = (will be your Vercel URL, e.g., `https://cafesafepro.vercel.app`)
6. Click "Deploy"

#### Step 3: Run Migrations & Seed

After deployment, run migrations using Vercel CLI or Railway's console:

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull  # Download env variables
npx prisma migrate deploy
npx prisma db seed
```

**Option B: Using Railway Console**
1. Go to Railway project
2. Click on your PostgreSQL service
3. Go to "Query" tab
4. Run SQL to check connection, then run migrations locally with the production URL

```bash
# Locally with production database
DATABASE_URL="your-railway-url" npx prisma migrate deploy
DATABASE_URL="your-railway-url" npx prisma db seed
```

### Option 2: Deploy Everything to Render.com - FREE

Render provides both database and hosting in one platform.

#### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com/
2. Sign up with GitHub
3. Click "New +" → "PostgreSQL"
4. Name it: `cafesafepro-db`
5. Select "Free" plan
6. Click "Create"
7. Copy the "Internal Database URL"

#### Step 2: Create Web Service

1. Push code to GitHub (same as Option 1)
2. On Render, click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `cafesafepro`
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `DATABASE_URL` = (from step 1)
   - `NEXTAUTH_SECRET` = (generate random string)
   - `NEXTAUTH_URL` = (will be `https://cafesafepro.onrender.com`)
6. Click "Create Web Service"

#### Step 3: Seed Database

Once deployed, use Render's shell:
1. Go to your Web Service
2. Click "Shell" tab
3. Run: `npx prisma db seed`

### Option 3: Deploy to Railway (Everything) - Paid but Easiest

Railway can host both database and app together.

1. Push code to GitHub
2. Go to https://railway.app/
3. New Project → Deploy from GitHub repo
4. Add PostgreSQL to the project
5. Railway automatically sets `DATABASE_URL`
6. Add environment variables:
   - `NEXTAUTH_SECRET` = random string
   - `NEXTAUTH_URL` = your Railway domain
7. Deploy

## Deployment Checklist

### Before Deploying
- [ ] Code pushed to GitHub
- [ ] `.env.local` NOT committed (should be in `.gitignore`)
- [ ] `DATABASE_URL` configured in hosting platform
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] `NEXTAUTH_URL` set to production URL

### After Deploying
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed database: `npx prisma db seed`
- [ ] Test login with demo credentials
- [ ] Verify all pages load correctly
- [ ] Test temperature recording
- [ ] Test task completion

### Troubleshooting Deployment

#### "Build failed: Cannot find module"
```bash
# Ensure prisma generate runs during build
# Add to package.json build script:
"build": "prisma generate && next build"
```

#### "Database connection refused"
- Check DATABASE_URL is correct
- Ensure database allows connections from your hosting IP
- Some hosts require SSL: add `?sslmode=require` to URL

#### "Prisma migrate fails"
```bash
# Use deploy instead of dev for production
npx prisma migrate deploy
```

#### "NextAuth URL mismatch"
- Ensure NEXTAUTH_URL matches your actual domain
- Include `https://` prefix
- No trailing slash

## Free Tier Limits

| Platform | Database | Hosting | Limitations |
|----------|----------|---------|-------------|
| Railway | 500 MB | 5$ credit/month | Sleeps after inactivity |
| Render | Free tier | Free tier | Sleeps after 15 min inactivity |
| Vercel | - | Free tier | Function timeout 10s |
| Supabase | 500 MB | - | 50,000 requests/day |

## Production Considerations

### Security
1. Change default passwords before inviting users
2. Use strong NEXTAUTH_SECRET
3. Enable 2FA if available
4. Use environment-specific secrets

### Performance
1. Add caching headers for static assets
2. Use CDN for images
3. Enable database connection pooling

### Backups
1. Enable automated database backups
2. Export reports regularly
3. Keep local copies of critical records

## Quick Deploy Command Summary

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/CafeSafePro.git
git push -u origin main

# 2. Deploy on Vercel (after connecting GitHub)
# - Go to vercel.com
# - Import project
# - Add env vars
# - Deploy

# 3. Run migrations (with production DATABASE_URL)
DATABASE_URL="prod-url" npx prisma migrate deploy
DATABASE_URL="prod-url" npx prisma db seed
```

## Custom Domain (Optional)

Both Vercel and Render support custom domains:

1. Buy domain (e.g., from Namecheap, GoDaddy)
2. Add domain in hosting dashboard
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain
