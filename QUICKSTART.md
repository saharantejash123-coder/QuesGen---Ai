# QuesGen AI - Developer Quick Start

## Project Overview
QuesGen AI is an AI-powered Examination Operating System supporting 1M+ students.

**Tech Stack**: Next.js 15 + Express.js + PostgreSQL + OpenAI

---

## Setup Instructions

### 1. Prerequisites
```bash
Node.js 20+
PostgreSQL 14+
Redis 7+
```

### 2. Clone & Install
```bash
cd questra-ai

# Backend
cd backend
npm install

# Frontend (coming next phase)
cd ../frontend  
npm install
```

### 3. Environment Setup
```bash
# Backend
cp backend/.env.example backend/.env.local
# Edit with your keys: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY

# Frontend
touch frontend/.env.local
```

### 4. Run Development

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend** (Phase 2)
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## API Quick Test

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Generate Paper
```bash
curl -X POST http://localhost:5000/api/teachers/paper/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "board":"CBSE",
    "className":"12",
    "subject":"Math",
    "marks":100,
    "difficulty":"MEDIUM"
  }'
```

---

## Project Structure

```
questra-ai/
├── backend/                  # Express.js API
│   ├── index.js             # Main server
│   ├── routes/              # API endpoints
│   ├── auth.js              # Authentication utilities
│   ├── middleware.js        # Express middleware
│   ├── errors.js            # Error handling
│   ├── db/schema.prisma     # Database schema
│   └── package.json
│
├── frontend/                # Next.js 15 (coming)
│   ├── src/
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── README.md               # Main documentation
├── PROGRESS.md            # Current progress
└── .env.example
```

---

## Database

### Initialize (Phase 2)
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed  # Seed with sample data
```

### Models (38 Total)
- Users (3): User, Session, DeviceToken
- Core (5): Student, Teacher, School, Class, Admin
- Questions (9): Chapter, Topic, Question, etc.
- Tests (6): Test, Result, Evaluation, etc.
- Subscriptions (5): Plan, Subscription, Payment, Coupon, Invoice
- Reports (5): ReportCard, BridgeReport, Notification, AuditLog, AILog

---

## Key Features Status

| Feature | Status | Phase |
|---------|--------|-------|
| Database Schema | ✅ Done | 1 |
| Backend API | ✅ Done | 1 |
| Authentication | ⏳ Next | 2-3 |
| Frontend App | ⏳ Next | 3-4 |
| Student Dashboard | 📋 Pending | 5-7 |
| Vault-15 (PYQ DB) | 📋 Pending | 6 |
| Oracle Engine | 📋 Pending | 7 |
| LogicGen (Q Gen) | 📋 Pending | 7 |
| Teacher Dashboard | 📋 Pending | 8-11 |
| Studio-Q (Papers) | 📋 Pending | 8 |
| Admin Dashboard | 📋 Pending | 12-13 |
| Payments | 📋 Pending | 14 |
| AI Features | 📋 Pending | 15 |

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run test            # Run tests (Phase 15)
npm run lint            # Check code style

# Database (Backend)
npx prisma migrate dev  # Create migration
npx prisma db push      # Push schema to DB
npx prisma db seed      # Seed data
npx prisma studio      # GUI database explorer

# Type Checking
tsc --noEmit           # Check TypeScript
```

---

## Troubleshooting

### Port Already in Use
```bash
# Backend (5000)
lsof -i :5000
kill -9 <PID>

# Frontend (3000)
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check connection string in .env.local
# Ensure PostgreSQL is running
psql -U postgres -d postgres
```

### Missing Dependencies
```bash
npm install
npm install --save-dev @types/node  # If TS errors
```

---

## Documentation

- **README.md** - Project overview
- **PROGRESS.md** - Current status
- **IMPLEMENTATION_STATUS.md** - Detailed breakdown
- **BUILD_SUMMARY.md** - Quick reference
- **API.md** - Coming in Phase 2
- **DATABASE.md** - Coming in Phase 2

---

## Next Steps

1. ✅ **Phase 1 Complete** - Foundation ready
2. **Phase 2** - Database migrations with Prisma
3. **Phase 3** - NextAuth authentication setup
4. **Phase 4** - Frontend dashboard layout

---

## Support

- Check PROGRESS.md for current status
- Review error logs in console
- Ensure all .env variables are set
- Verify Node version: `node --version` (should be 20+)

---

**Built for production. Ready to scale to 1M+ users.**
