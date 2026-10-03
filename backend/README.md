# Enquiry portal API

The API runs on Railway and stores project requests in Neon Postgres. The Next.js app stays on Vercel and proxies browser requests to this API, keeping the Railway key and portal session out of client-side code.

## Deploy the backend

1. Create a Neon project and copy its pooled PostgreSQL connection string.
2. In Railway, create a service connected to this GitHub repository and set its **Root Directory** to `/backend`.
3. Add these Railway variables:

   - `DATABASE_URL`: the Neon pooled connection string.
   - `RAILWAY_INTERNAL_API_KEY`: a long random secret shared only with the Vercel project.
   - `PORTAL_ADMIN_EMAIL`: your portal sign-in email.
   - `PORTAL_ADMIN_PASSWORD`: a unique password of at least 16 characters.
   - `PORTAL_SESSION_SECRET`: a separate random secret with at least 32 characters.

   Railway supplies `PORT`; the service starts with `npm start`. Generate a Railway public domain and check `/health` returns `{"status":"ok"}`.

The API creates the `project_enquiries` and `blog_posts` tables on startup if they do not exist. The original articles in `blog-seed.json` are inserted into `blog_posts` the first time the service starts.

After signing in at `/portal`, use the **Blog** section to create, edit, publish, save drafts, and delete journal posts. Public blog pages show published posts only; drafts remain private to the portal.

## Connect Vercel

In Vercel **Project Settings → Environment Variables**, add:

- `RAILWAY_API_URL`: the Railway public origin, for example `https://your-api.up.railway.app` (no trailing slash).
- `RAILWAY_INTERNAL_API_KEY`: the same value configured on Railway.

Redeploy the Vercel app after saving the variables. The private portal is at `/portal` on the Vercel site.

For local development, add the same two server-only variables to the repository root `.env.local` and restart `npm run dev`. Do not prefix either variable with `NEXT_PUBLIC_` or commit `.env.local`.

Remove any old `RESEND_API_KEY` and `RESEND_FROM_EMAIL` variables from Vercel; the app no longer sends enquiries by email. EmailJS was not added to the app. The shared Railway key and admin credentials must never use `NEXT_PUBLIC_` variable names.