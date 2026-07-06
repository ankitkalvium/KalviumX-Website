# KalviumX Website

The marketing and operations website for **KalviumX** -- enterprise engineering intern hiring from Kalvium's work-integrated B.Tech ecosystem.

Companies share a JD, get a pre-assessed, mentor-managed intern shortlist in days. The site handles the full funnel: discovery, pilot intake, CRM push to Zoho, and an admin dashboard for the KalviumX team.

**Live:** [kalvium-x-website.vercel.app](https://kalvium-x-website.vercel.app)

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CMS | Sanity (blog, admin at `/studio`) |
| Database | Neon Postgres (serverless) |
| Auth | NextAuth.js v5, Google OAuth restricted to `@kalvium.com` |
| CRM | Zoho CRM (India DC) via REST API |
| Analytics | PostHog |
| Scheduling | Cal.com embed |
| Hosting | Vercel (auto-deploy on push to `main`) |

---

## Project structure

```
src/
  app/                   Next.js App Router pages and API routes
    api/                 Server-side API routes (lead, cal webhook, cron, blog)
    admin/               Internal dashboard (auth-gated, @kalvium.com only)
    blog/                Public blog (Sanity + HTML-import posts)
    studio/              Sanity Studio embed
  components/
    layout/              Navbar, Footer, SiteShell
    sections/            Page section components (Hero, CTA, FAQ, etc.)
    ui/                  Shared UI primitives (Button, SectionHeading, etc.)
    blog/                Blog-specific components including FullPageHtmlRenderer
    admin/               Admin dashboard UI components
  lib/
    data.ts              Nav links and role data
    css-scope.ts         PostCSS selector scoping for imported HTML blog posts
    html-to-post.ts      HTML parsing and SEO extraction for blog imports
    zoho.ts              Zoho CRM API client (lead upsert with dedup)
    lead-validation.ts   Email validation, bot detection, rate limiting
  sanity/
    schemaTypes/         Sanity content schemas (post, blocks)
    lib/                 Sanity client, queries, portable text components
public/
  images/brand/          Logo and mark assets -- always use these, never recreate in code
scripts/                 Seed scripts and Google Apps Script for sheet sync
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A Sanity account (free tier is fine)
- A Neon Postgres database (free tier)
- Google OAuth app for admin auth
- Zoho CRM account with API access

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Key variables:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity CMS project |
| `SANITY_API_WRITE_TOKEN` | Yes | Blog HTML importer and admin reads |
| `DATABASE_URL` | Yes | Neon Postgres (lead storage, opportunity intake) |
| `AUTH_SECRET` | Yes | NextAuth session signing |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Yes | Admin dashboard Google OAuth |
| `ZOHO_CLIENT_ID` / `ZOHO_CLIENT_SECRET` / `ZOHO_REFRESH_TOKEN` | Yes | CRM lead push |
| `GEMINI_API_KEY` | Yes | Ticker pipeline |
| `CAL_WEBHOOK_SECRET` | Recommended | Cal.com booking webhook verification |
| `CRON_SECRET` | Recommended | Protects cron endpoint from public calls |
| `STUDENT_SHEET_SYNC_SECRET` | Yes (for sheet sync) | Apps Script shared secret |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## Key features

### Lead intake

- `/start-a-pilot` -- public JD intake form
- Validated with free-email-domain block, honeypot, and IP rate limiting
- Pushed to Zoho CRM as a Lead with dedup (search-then-upsert)
- Transactional confirmation email via Brevo

### Blog

- Sanity-authored posts: full Portable Text structured content
- HTML-import posts: paste full article HTML into admin, SEO fields auto-extracted
- Imported post CSS is scoped server-side via PostCSS (`src/lib/css-scope.ts`) to prevent style leaks into the global page chrome
- Draft/publish workflow: posts with `published: false` are visible only to signed-in admins
- Cover image: Sanity asset upload or plain URL (for HTML imports)

### Admin dashboard (`/admin`)

- Gated behind Google OAuth, `@kalvium.com` domain only
- Blog management: import HTML, publish/unpublish, upload cover images, view/delete
- Inbound leads: view and action opportunity intake submissions
- Student pool: synced from Google Sheets via Apps Script installable trigger

### Cal.com integration

- "Let's Talk" button in Navbar and Footer opens a Cal.com booking overlay
- Booking confirmation triggers a PostHog event (`booking_confirmed`)
- Webhook at `/api/cal-webhook` receives booking payloads (HMAC verified)

---

## Deploy

Vercel auto-deploys `main`. To deploy manually:

```bash
vercel --prod
```

Environment variables are managed in the Vercel dashboard. Add new vars with:

```bash
vercel env add VARIABLE_NAME
```

---

## Design system

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the full visual language reference: colour tokens, typography scale, spacing system, component variants, layout patterns, and brand asset usage.

**Every contributor must read this before touching any UI.**

---

## Contributing

1. Branch from `main`
2. Follow the design system -- colour tokens, component variants, section rhythm
3. No em dashes in any copy, ever
4. Run `npm run build` before opening a PR -- type errors block deploy
5. Admin routes must remain behind `@kalvium.com` auth -- never expose them publicly

---

## Team

Built and maintained by the KalviumX team.
For access to the Vercel project, Sanity dataset, or Zoho API credentials, contact Ankit Singh (`ankit.singh@kalvium.com`).

**GitHub org:** [github.com/Kalvi-Education/kalviumx](https://github.com/Kalvi-Education/kalviumx)
