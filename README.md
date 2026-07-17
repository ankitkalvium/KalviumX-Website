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
| Data storage | Google Sheets (one tab per table, via `src/lib/repo/*`) |
| Blog | Sheets-backed posts (`src/lib/repo/posts.ts`) -- HTML-import or simple structured content, no CMS vendor |
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
    blog/                Public blog (HTML-import + simple structured posts)
  components/
    layout/              Navbar, Footer, SiteShell
    sections/            Page section components (Hero, CTA, FAQ, etc.)
    ui/                  Shared UI primitives (Button, SectionHeading, etc.)
    blog/                Blog-specific components (FullPageHtmlRenderer, SimpleBodyRenderer)
    admin/               Admin dashboard UI components
  lib/
    data.ts              Nav links and role data
    css-scope.ts         PostCSS selector scoping for imported HTML blog posts
    html-to-post.ts      HTML parsing and SEO extraction for blog imports
    zoho.ts              Zoho CRM API client (lead upsert with dedup)
    lead-validation.ts   Email validation, bot detection, rate limiting
    repo/                Google Sheets-backed data layer -- one file per table
      _sheets.ts         Shared Sheets API client (JWT auth, read/write/ensureTab)
      posts.ts           Blog posts (title/excerpt/body or fullPageHtml)
      leads.ts, deals.ts, students.ts, meetings.ts, opportunities.ts, admin-users.ts
public/
  images/brand/          Logo and mark assets -- always use these, never recreate in code
scripts/                 Google Apps Script for student sheet sync, smoke tests
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A Google Cloud service account with Sheets API access, and a Google Sheet shared with it (Editor role)
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
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Yes | The spreadsheet every `src/lib/repo/*` module reads/writes |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Yes | Service account credentials (JSON), Editor access on that spreadsheet |
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

---

## Key features

### Lead intake

- `/start-a-pilot` -- public JD intake form
- Validated with free-email-domain block, honeypot, and IP rate limiting
- Pushed to Zoho CRM as a Lead with dedup (search-then-upsert)
- Transactional confirmation email via Brevo

### Blog

- Posts live in a "Posts" tab in the same Google Sheet as everything else (`src/lib/repo/posts.ts`) -- no CMS vendor, deliberately left open for whatever integration is picked next
- Two content shapes: a complete standalone `fullPageHtml` document (HTML importer), or a plain array of typed blocks (`SimpleBlock`: h2/h3/p/blockquote/bullet-list/number-list) rendered by `SimpleBodyRenderer`
- Imported post CSS is scoped server-side via PostCSS (`src/lib/css-scope.ts`) to prevent style leaks into the global page chrome
- Draft/publish workflow: posts with `published: false` are visible only to signed-in admins
- Cover image: plain URL only (paste a link, or commit an image under `public/images/blog/`)

### Admin dashboard (`/admin`)

- Gated behind Google OAuth, `@kalvium.com` domain only
- Blog management: import HTML, publish/unpublish, view/delete (structured non-HTML posts are edited directly in the Posts sheet)
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
For access to the Vercel project, Google Sheet, or Zoho API credentials, contact Ankit Singh (`ankit.singh@kalvium.com`).

**GitHub org:** [github.com/Kalvi-Education/kalviumx](https://github.com/Kalvi-Education/kalviumx)
