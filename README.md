# CafeSafe Pro

A comprehensive food safety compliance management application for cafes and restaurants in New Zealand, aligned with MPI (Ministry for Primary Industries) regulations.

## Features

### Multi-Tier Access System
1. **Staff Access** - Complete daily tasks, record temperatures, cleaning checks
2. **Manager Access** - All staff features + view reports, manage staff, approve records
3. **Owner Access** - All manager features + business settings, full reporting, verification prep
4. **Franchise Access** - Multi-store management, franchise-wide reporting, store creation

### MPI Compliance Modules
- **Temperature Monitoring** - Fridge, freezer, cooking temps with alerts
- **Daily Cleaning Records** - Opening, closing, and deep cleaning checklists
- **Stock Rotation & Receiving** - FIFO tracking, supplier records
- **Pest Control** - Regular checks and contractor records
- **Equipment Maintenance** - Service schedules and maintenance logs
- **Personal Hygiene** - Staff illness reporting, hygiene practices
- **Traceability** - Food sourcing and recall readiness

### Daily Task Management
- Morning opening checklist
- Throughout-the-day tasks
- Evening closing checklist
- Automated reminders and alerts

### Reporting & Verification
- MPI verification-ready reports
- Historical record export (PDF/Excel)
- Compliance analytics dashboard
- Non-conformance tracking

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Zustand
- **Charts**: Recharts
- **Notifications**: Sonner

## Getting Started

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cafesafepro"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## License

MIT
