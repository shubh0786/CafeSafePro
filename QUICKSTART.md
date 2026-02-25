# Quick Start Guide

## 5-Minute Local Testing

### 1. Install Dependencies (2 minutes)

Open PowerShell or Command Prompt:

```powershell
cd C:\Users\ssinghz279\CafeSafePro
npm install
```

### 2. Setup Database (2 minutes)

**Easiest Option - Docker:**
```powershell
docker run --name cafesafe-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=cafesafepro -p 5432:5432 -d postgres
```

**Or install PostgreSQL:**
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Set password to `password`
4. Open pgAdmin and create database `cafesafepro`

### 3. Configure Environment (30 seconds)

Create file `C:\Users\ssinghz279\CafeSafePro\.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cafesafepro"
NEXTAUTH_SECRET="test-secret-key-for-development"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database (1 minute)

```powershell
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Start App (30 seconds)

```powershell
npm run dev
```

Open browser: **http://localhost:3000**

### 6. Login with Demo Account

| Email | Password |
|-------|----------|
| `admin@cafecentral.co.nz` | `password123` |

## Common Issues & Fixes

### "Cannot find module 'prisma'"
```powershell
npm install -g prisma
npx prisma generate
```

### "Database connection error"
- Make sure PostgreSQL is running (check Services in Windows)
- Verify password in DATABASE_URL matches what you set

### "Port 3000 already in use"
```powershell
npm run dev -- --port 3001
```

## Quick Deploy for Others to Test

### Free Option - Render.com (15 minutes setup)

1. **Create GitHub repo:**
```powershell
cd C:\Users\ssinghz279\CafeSafePro
git init
git add .
git commit -m "Initial commit"
```
- Go to https://github.com/new
- Create repo named `CafeSafePro`
- Copy the git push commands and run them

2. **Create Database:**
- Go to https://dashboard.render.com/
- Sign up with GitHub
- New + → PostgreSQL → Free plan
- Copy the "Internal Database URL"

3. **Deploy App:**
- On Render: New + → Web Service
- Connect your GitHub repo
- Build Command: `npm install && npx prisma migrate deploy && npm run build`
- Start Command: `npm start`
- Add Environment Variables:
  - `DATABASE_URL` = (paste from step 2)
  - `NEXTAUTH_SECRET` = `random-secret-string-here`
  - `NEXTAUTH_URL` = (your render URL, like `https://cafesafepro.onrender.com`)
- Click Create

4. **Seed Database:**
- Once deployed, go to your service
- Click "Shell" tab
- Run: `npx prisma db seed`

5. **Share the URL!**

### Alternative - Vercel + Railway (Free)

**Database (Railway):**
- https://railway.app/
- New Project → Provision PostgreSQL
- Copy DATABASE_URL

**Hosting (Vercel):**
- https://vercel.com/
- Import your GitHub repo
- Add DATABASE_URL and NEXTAUTH_SECRET
- Deploy

## Test Accounts for Others

Once deployed, share these accounts:

| Role | Email | Password |
|------|-------|----------|
| Franchise Admin | `admin@cafecentral.co.nz` | `password123` |
| Owner | `owner.auckland@cafecentral.co.nz` | `password123` |
| Manager | `manager.auckland@cafesafepro.co.nz` | `password123` |
| Staff | `staff1@cafecentral.co.nz` | `password123` |

## What to Test

### Basic Flow:
1. Login as different users
2. Record a temperature check
3. Complete a task
4. Add a stock item
5. View reports

### Key Features:
- ✅ Temperature recording with alerts
- ✅ Task completion tracking
- ✅ Stock management with expiry warnings
- ✅ MPI-ready reports
- ✅ Role-based access (Staff/Manager/Owner/Franchise)

## Support

If you get stuck:
1. Read TESTING.md for detailed troubleshooting
2. Read DEPLOYMENT.md for hosting options
3. Check README.md for architecture info

## Next Steps

After testing locally:
1. Invite others to test on your deployed version
2. Create real accounts with proper passwords
3. Add your actual store information
4. Set up real equipment and suppliers
5. Start using it daily for MPI compliance!
