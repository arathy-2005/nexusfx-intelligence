# NexusFX — Forex Trading Analysis Platform

Educational market analysis, probability-based study ideas, and risk tools.

**This application provides market analysis only and is not financial advice.**

NexusFX does **not** execute trades, hold funds, or connect to broker order routing.

## Folder structure

```
forex-analysis-platform/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/                  # App Router pages + API
│   │   ├── api/
│   │   ├── analysis/
│   │   ├── admin/
│   │   ├── calendar/
│   │   ├── calculators/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── docs/
│   │   ├── market/
│   │   ├── news/
│   │   ├── signals/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   ├── lib/
│   └── store/
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

## Database schema

PostgreSQL via Prisma. Models: `User`, `UserSettings`, `Signal`, `WatchlistItem`, `FavoritePair`, `JournalEntry`, `SavedAnalysis`, `NewsArticle`, `CalendarEvent`, `Notification`, `AppSetting`.

See `prisma/schema.prisma`.

The UI and APIs run without a database using in-memory / demo datasets so Vercel builds succeed before you attach Postgres.

## Installation

```bash
git clone <your-repo>
cd forex-analysis-platform
cp .env.example .env.local
npm install
npx prisma generate
npm run dev
```

Open http://localhost:3000

Demo logins:

- Analyst: `analyst@nexusfx.local` / `analyst123`
- Admin: `admin@nexusfx.local` / `admin123`

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical URL for SEO, sitemap, CORS/origin checks |
| `JWT_SECRET` | Production | HS256 secret for session cookies (32+ chars) |
| `DATABASE_URL` | Optional | PostgreSQL connection for Prisma persistence |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Swap in Clerk later |
| `CLERK_SECRET_KEY` | Optional | Clerk server key |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional | Seeded admin when using Prisma |

## PostgreSQL (production)

1. Create a database (Neon, Supabase, RDS, or Vercel Postgres).
2. Set `DATABASE_URL`.
3. Run `npx prisma db push` or `npx prisma migrate dev --name init`.
4. Run `npm run db:seed`.

## Authentication

Built-in JWT in an httpOnly `SameSite=Lax` cookie. Clerk/Supabase keys are reserved in `.env.example` if you want to replace the adapter later.

## Security

- Rate limiting on market, analysis, and auth routes
- Origin check on mutating requests (CSRF mitigation)
- Zod validation (injection-safe inputs)
- Prisma parameterized queries
- XSS: React escaping + CSP headers
- `X-Frame-Options`, `nosniff`, `Referrer-Policy`
- HTTPS on Vercel

## Deployment (Vercel)

1. Push the repo to GitHub (or Cursor Origin).
2. Import the project in Vercel.
3. Set environment variables above.
4. Deploy. `postinstall` runs `prisma generate`.

Build command: `prisma generate && next build --turbopack`

## API documentation

See [docs/API.md](docs/API.md) and `/docs` in the app.

## License

Private educational software. Not a broker. Not financial advice.
