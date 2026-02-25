# Deploy In Control Online - Step by Step

## Recommended: Render.com (Free Tier)

### Step 1: Push Code to GitHub (5 minutes)

Open PowerShell and run these commands:

```powershell
# Navigate to project
cd C:\Users\ssinghz279\CafeSafePro

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - In Control ready for deployment"
```

Now go to GitHub:
1. Open https://github.com/new in your browser
2. Repository name: `CafeSafePro`
3. Make it Public or Private
4. Click "Create repository"

Back in PowerShell, run the commands shown on GitHub:

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/CafeSafePro.git
git branch -M main
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Railway (3 minutes)

1. Go to https://railway.app/
2. Sign up with GitHub (click "Login with GitHub")
3. Click "New Project"
4. Select "Provision PostgreSQL"
5. Wait for it to be created
6. Click on the PostgreSQL service
7. Go to "Variables" tab
8. Copy the `DATABASE_URL` (looks like: `postgresql://postgres:password@roundhouse.proxy.rlwy.net:12345/railway`)

**Save this URL somewhere - you'll need it!**

### Step 3: Deploy to Vercel (5 minutes)

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "Add New Project"
4. Click "Import Git Repository"
5. Find and select your `CafeSafePro` repo
6. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm install && npx prisma migrate deploy && npm run build`
   - Output Directory: (leave default)
7. Expand "Environment Variables" and add:
   - `DATABASE_URL` = (paste from Railway step 2)
   - `NEXTAUTH_SECRET` = (generate at https://generate-secret.vercel.app/32 or use any random string)
   - `NEXTAUTH_URL` = (leave blank for now, Vercel will set this automatically)
8. Click "Deploy"

Wait 2-3 minutes for deployment to complete.

### Step 4: Run Migrations and Seed Database (2 minutes)

After Vercel deployment finishes:

1. Copy your Vercel deployment URL (e.g., `https://cafesafepro.vercel.app`)
2. Go to Vercel Dashboard → Select your project → Settings → Environment Variables
3. Update `NEXTAUTH_URL` with your actual URL (e.g., `https://cafesafepro.vercel.app`)
4. Click Save

Now seed the database. Open your terminal and run:

```powershell
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Download env variables to local
vercel env pull

# Run migrations on production database
npx prisma migrate deploy

# Seed with demo data
npx prisma db seed
```

### Step 5: Test Your Deployed App!

Open your Vercel URL in browser and test with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Franchise Admin | `admin@cafecentral.co.nz` | `password123` |
| Owner | `owner.auckland@cafecentral.co.nz` | `password123` |
| Manager | `manager.auckland@cafecentral.co.nz` | `password123` |
| Staff | `staff1@cafecentral.co.nz` | `password123` |

## Alternative: Deploy to Render.com (Even Easier)

If you prefer everything in one platform:

### Step 1: Push to GitHub (same as above)

### Step 2: Create PostgreSQL on Render

1. Go to https://dashboard.render.com/
2. Sign up with GitHub
3. Click "New +" → "PostgreSQL"
4. Name: `cafesafepro-db`
5. Select "Free" plan
6. Click "Create"
7. Wait for it to be ready
8. Copy the "Internal Database URL"

### Step 3: Create Web Service on Render

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `cafesafepro`
   - **Environment**: Node
   - **Region**: (choose closest to you)
   - **Branch**: main
   - **Build Command**: `npm install && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
4. Click "Advanced" and add Environment Variables:
   - `DATABASE_URL` = (paste from step 2)
   - `NEXTAUTH_SECRET` = (random string, e.g., `my-super-secret-key-123`)
   - `NEXTAUTH_URL` = (will be `https://cafesafepro.onrender.com` - update after first deploy)
5. Select "Free" plan
6. Click "Create Web Service"

### Step 4: Update NEXTAUTH_URL

After first deployment:
1. Copy your Render URL (e.g., `https://cafesafepro.onrender.com`)
2. Go to Environment Variables
3. Update `NEXTAUTH_URL` with this URL
4. Redeploy

### Step 5: Seed Database

Once deployed:
1. Go to your Web Service on Render dashboard
2. Click "Shell" tab
3. Run: `npx prisma db seed`

## Share with Others!

Once deployed, share your URL and these test accounts with anyone who wants to try the app.

## Troubleshooting

### "Build failed - Cannot find module"
Add to your package.json scripts:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

### "Database connection error"
- Check DATABASE_URL is correct
- Make sure database is "Available" in Railway/Render dashboard

### "NextAuth URL mismatch"
- Ensure NEXTAUTH_URL matches your actual domain exactly
- Include https:// prefix
- No trailing slash

### "Prisma migration fails"
Run locally with production URL:
```powershell
$env:DATABASE_URL="your-production-url"
npx prisma migrate deploy
```

## Next Steps After Deployment

1. **Invite your team** - Share the URL and demo accounts
2. **Create real accounts** - Replace demo data with real staff
3. **Customize** - Add your actual store details and equipment
4. **Go live** - Start using for daily MPI compliance!

## Free Tier Limits

| Platform | Database | Hosting | Notes |
|----------|----------|---------|-------|
| Railway | 500 MB | 5$ credit/month | Sleeps after inactivity |
| Vercel | - | Free | Hobby tier limits apply |
| Render | 1 GB | Free | Sleeps after 15 min inactivity |

All are perfectly fine for testing and small-scale use!
