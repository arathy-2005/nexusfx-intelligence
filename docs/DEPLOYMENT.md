# Deployment guide

## GitHub

```bash
git add -A
git commit -m "Initial NexusFX analysis platform"
git remote add origin https://github.com/<you>/forex-analysis-platform.git
git push -u origin main
```

## Vercel

1. Import the GitHub repository at https://vercel.com/new
2. Framework preset: Next.js
3. Environment variables:
   - `NEXT_PUBLIC_APP_URL` = `https://<project>.vercel.app` (update after first URL is known)
   - `JWT_SECRET` = strong secret
   - `DATABASE_URL` = Postgres URL (optional for first launch)
4. Deploy
5. Confirm production URL and rebuild if you changed `NEXT_PUBLIC_APP_URL`

Build command is `prisma generate && next build --turbopack` (`vercel.json`).

HTTPS is provided by Vercel. Session cookies set `secure` in production.
