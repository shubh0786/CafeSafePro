# Easy Deployment Guide - CafeSafe Pro

## Option 1: One-Click Deploy to Render (Recommended)

This is the EASIEST way to deploy. Everything in one platform.

### Step 1: Push to GitHub (I can help with this)

First, let me check if we can push your code:

```powershell
cd C:\Users\ssinghz279\CafeSafePro

# Check git status
git status

# If files are ready, push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/CafeSafePro.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Button (One Click!)

I've created a Render deploy button. Once your code is on GitHub, you can use this:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Or manually:

1. Go to https://dashboard.render.com/
2. Click "Blueprints" → "New Blueprint Instance"
3. Connect your GitHub repo
4. Render will automatically:
   - Create PostgreSQL database
   - Deploy your app
   - Set environment variables

### Step 3: Seed Database

After deployment:
1. Go to your Web Service on Render
2. Click "Shell" tab
3. Run: `npx prisma db seed`

---

## Option 2: Vercel + Railway (Better Performance)

### Step 1: Database on Railway
1. Go to https://railway.app/
2. Login with GitHub
3. New Project → Provision PostgreSQL
4. Copy the DATABASE_URL

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/
2. Import your GitHub repo
3. Add Environment Variables:
   - `DATABASE_URL` = (from Railway)
   - `NEXTAUTH_SECRET` = `cafesafe-secret-2024`
   - `NEXTAUTH_URL` = (your Vercel URL)
4. Deploy

### Step 3: Run Migrations Locally
```powershell
# Download environment variables
npx vercel env pull

# Run migrations
npx prisma migrate deploy

# Seed data
npx prisma db seed
```

---

## Option 3: Manual Copy-Paste (No GitHub Required)

If you don't want to use GitHub:

1. Zip your project folder
2. Upload to Render via drag-and-drop
3. Create PostgreSQL manually
4. Set environment variables

---

## What I Need From You

To complete the deployment, I need you to:

1. **Create a GitHub account** at https://github.com/join (if you don't have one)
2. **Tell me your GitHub username**
3. Choose which platform:
   - Render.com (easiest, everything together)
   - Vercel + Railway (better performance, separate services)

Once you provide your GitHub username, I can:
- Generate the exact commands to push your code
- Create the deployment configuration
- Guide you through each step

---

## Demo Accounts (Ready to Use)

After deployment, these accounts will work:

| Role | Email | Password |
|------|-------|----------|
| Franchise Admin | `admin@cafecentral.co.nz` | `password123` |
| Owner | `owner.auckland@cafecentral.co.nz` | `password123` |
| Manager | `manager.auckland@cafecentral.co.nz` | `password123` |
| Staff | `staff1@cafecentral.co.nz` | `password123` |

---

## Next Steps

**Please tell me:**
1. Your GitHub username (or if you need to create one)
2. Which platform you prefer: Render or Vercel+Railway

Then I can generate the exact commands and walk you through the deployment!
