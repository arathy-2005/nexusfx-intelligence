# Installation guide

## Prerequisites

- Node.js 20+
- npm 10+
- Optional: PostgreSQL 14+ for persistent users/signals/news

## Local setup

```bash
cd forex-analysis-platform
cp .env.example .env.local
```

Edit `.env.local`:

- `JWT_SECRET` — long random string
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`
- `DATABASE_URL` — only if you have Postgres

```bash
npm install
npx prisma generate
npm run dev
```

The app is fully usable without Postgres (demo data + JWT demo users).

## Optional database

```bash
npx prisma db push
npm run db:seed
```
