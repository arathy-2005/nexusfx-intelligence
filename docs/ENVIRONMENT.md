# Environment variables

Copy `.env.example` to `.env.local` (development) or set the same keys in Vercel.

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Canonical site URL |
| `JWT_SECRET` | 32+ random characters | Signs session JWTs |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` | Optional until you persist data |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | empty | Optional Clerk |
| `CLERK_SECRET_KEY` | empty | Optional Clerk |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Prisma seed |
| `ADMIN_PASSWORD` | strong password | Prisma seed |
| `COINGECKO_API_KEY` | empty | Optional; public CoinGecko still used |
