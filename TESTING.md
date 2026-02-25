# Testing CafeSafe Pro

## Local Testing (Development Mode)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git (optional)

### Step 1: Install Dependencies

```bash
cd C:\Users\ssinghz279\CafeSafePro
npm install
```

### Step 2: Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/cafesafepro"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Settings
APP_NAME="CafeSafe Pro"
APP_URL="http://localhost:3000"
```

### Step 3: Setup PostgreSQL Database

#### Option A: Local PostgreSQL (Recommended for testing)

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Open pgAdmin or psql
3. Create a new database:
```sql
CREATE DATABASE cafesafepro;
```

4. Update your `.env.local` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cafesafepro"
```

#### Option B: Docker (Easiest)

```bash
docker run --name cafesafe-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=cafesafepro -p 5432:5432 -d postgres
```

#### Option C: Cloud Database (Railway, Supabase, etc.)

Sign up for a free PostgreSQL at:
- Railway: https://railway.app/
- Supabase: https://supabase.com/
- Neon: https://neon.tech/

### Step 4: Setup Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### Step 5: Seed Demo Data

```bash
npm run db:seed
```

This creates:
- 1 Franchise (Cafe Central Group)
- 2 Stores (Auckland & Wellington)
- 4 Users with different roles (Franchise Admin, Owner, Manager, Staff)
- Equipment for temperature monitoring
- Suppliers and stock items
- Schedule templates and initial tasks

### Step 6: Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 7: Test Login

Use these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Franchise Admin | `admin@cafecentral.co.nz` | `password123` |
| Owner | `owner.auckland@cafecentral.co.nz` | `password123` |
| Manager | `manager.auckland@cafecentral.co.nz` | `password123` |
| Staff | `staff1@cafecentral.co.nz` | `password123` |

## What to Test

### As Staff:
1. ✅ Login with staff credentials
2. ✅ View Dashboard
3. ✅ Record temperatures for equipment
4. ✅ Complete assigned tasks
5. ✅ View temperature history

### As Manager:
1. ✅ All staff features
2. ✅ View reports
3. ✅ Manage staff page (view team)
4. ✅ Create tasks from templates
5. ✅ View compliance records

### As Owner:
1. ✅ All manager features
2. ✅ Access Settings page
3. ✅ View Stores page
4. ✅ Generate MPI reports
5. ✅ Export/Print reports

### As Franchise Admin:
1. ✅ All owner features
2. ✅ Access Franchise page
3. ✅ View all stores across franchise
4. ✅ Switch between stores

## Troubleshooting

### "Database connection error"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env.local
- Ensure database `cafesafepro` exists

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Migration errors"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### "Seed fails"
Check the database connection is working first:
```bash
npx prisma db seed
```

### "NextAuth errors"
- Ensure NEXTAUTH_SECRET is set
- Clear browser cookies/localStorage
- Try incognito mode

## Testing Checklist

### Core Features
- [ ] User login with different roles
- [ ] Dashboard displays correct stats
- [ ] Temperature recording
- [ ] Temperature alerts for out-of-range values
- [ ] Task completion
- [ ] Stock item recording
- [ ] Report generation
- [ ] Store switching (for multi-store users)

### Navigation
- [ ] Sidebar menu visible based on role
- [ ] Pages load without errors
- [ ] Form submissions work
- [ ] Dialogs/modals open correctly

### Data Persistence
- [ ] Records appear after refresh
- [ ] Completed tasks stay completed
- [ ] Temperature records persist
- [ ] Stock items remain in list

### Print/Export
- [ ] Reports can be printed
- [ ] Reports export successfully
