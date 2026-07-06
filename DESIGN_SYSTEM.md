# KalviumX Design System

This document is the single source of truth for the KalviumX website's visual language. Every contributor must follow these rules so the brand stays consistent across every page, component, and pull request.

---

## Brand Identity

**Product:** KalviumX  
**Tagline:** Enterprise engineering intern hiring, built for teams that care what ships.  
**Voice:** Direct, confident, no-fluff. Speaks to engineering leaders, not HR.  
**Tone:** Like a senior engineer who also knows how to close a deal.

### Writing rules (apply everywhere -- copy, UI labels, error messages)

- Never use em dashes (--). Use commas, periods, or "..." instead.
- No filler words: just, really, basically, actually, simply
- No AI-speak: robust, comprehensive, nuanced, leverage, foster, delve
- Sentence case for all headings and labels (not Title Case)
- Numbers under 10: spell out. 10 and above: numerals.
- CTA copy is imperative: "Get Shortlist", "Share Your JD", "Let's Talk"

---

## Colour Palette

Defined as CSS custom properties in `src/app/globals.css`.

| Token | CSS var | Hex | Use |
|---|---|---|---|
| Red | `--red` | `#f53333` | Primary brand, CTAs, active states, eyebrows, accents |
| Red Dark | `--red-dark` | `#d91f27` | Hover state on red elements |
| Black / Ink | `--black` / `--ink` | `#0e0e0e` | Headings, nav border, dark backgrounds, `bg-ink` sections |
| Charcoal | `--charcoal` | `#1f1f1f` | Secondary dark backgrounds |
| Text | `--text` | `#0a0a0a` | Body copy default |
| Muted | `--muted` | `#555555` | Secondary/supporting text |
| Soft | `--soft` | `#f7f7f7` | Light section backgrounds (alternating) |
| Line | `--line` | `#e2e2e2` | Dividers, card borders, subtle separators |
| White | `--white` | `#ffffff` | Page background, reverse text on dark |

### Tailwind aliases (use these in components)

```
bg-red         text-red         border-red        (--red)
bg-ink         text-ink         border-ink        (--black)
bg-charcoal                                       (--charcoal)
text-muted                                        (--muted)
bg-soft                                           (--soft)
border-line                                       (--line)
```

### Colour usage rules

- **Red** is reserved for: primary CTAs, active nav indicators, eyebrow labels, `.red-pill` highlights, blockquote borders, link hover.
- **Never use red for body copy or decorative purposes.** It signals action or importance.
- **Section alternation:** White (`bg-white`) and Soft (`bg-soft`) sections alternate. Dark sections use `bg-ink`.
- **Footer is always `bg-ink text-white`.**
- **Navbar is always `bg-white border-b border-ink`.**

---

## Typography

### Font

**Inter** -- loaded via `next/font/google` at all weights 400--900.

```tsx
// src/app/layout.tsx
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
```

Applied globally:
```css
body {
  font-family: var(--font-inter), Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### Type scale

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| H1 (hero) | `clamp(40px, 4.8vw, 66px)` | 900 (black) | `-0.06em` | `1.03` |
| H1 (section heading) | `clamp(32px, 4.5vw, 56px)` | 900 (black) | `-0.04em` | `1.08` |
| H2 (blog) | `clamp(24px, 3vw, 32px)` | 900 | `-0.03em` | `1.2` |
| H3 (blog) | `clamp(20px, 2.4vw, 26px)` | 800 | `-0.02em` | `1.2` |
| Body (primary) | `17px` | 500 | normal | `1.7` |
| Body (secondary) | `16px` | 500--600 | normal | `1.6` |
| Small / label | `13px--14px` | 700--800 | normal | normal |
| Eyebrow | `11px--12px` | 800 (extrabold) | `0.16em--0.18em` | normal |
| Caption / legal | `12px` | 500--600 | normal | normal |

### Eyebrow pattern

All section labels above a heading use this pattern:

```tsx
<span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
  Label
</span>
```

### Red pill highlight

Inline bold emphasis on key headline words:

```tsx
<span className="red-pill">ship.</span>
```

CSS:
```css
.red-pill {
  display: inline-block;
  background: var(--red);
  color: #fff;
  border-radius: 6px;
  padding: 0.03em 0.22em 0.1em;
  line-height: 1.05;
}
```

Use sparingly -- one per headline maximum. Always the most important word or phrase.

---

## Spacing System

### Container

All page content lives inside `.container-x`:

```css
.container-x {
  width: min(1180px, calc(100% - 48px));
  margin-left: auto;
  margin-right: auto;
}
```

Max width: **1180px**. Side padding: **24px each side** (48px total). Never break out of `.container-x` for content -- only full-bleed backgrounds do that.

### Section padding

```css
section {
  padding: 78px 0;
}
```

All `<section>` elements get **78px top and bottom** by default. Override only when the design explicitly calls for a different rhythm (e.g. the hero has its own sizing via the grid).

### Common spacing values

| Use | Value |
|---|---|
| Gap between section heading and copy | `mt-5` (20px) |
| Gap between heading and CTA buttons | `mb-9` (36px) to `mb-10` (40px) |
| Gap between eyebrow and heading | `mb-3` (12px) |
| Card internal padding | `p-6` to `p-8` |
| Button gap row | `gap-3` to `gap-3.5` |
| Grid column gap | `gap-12` to `gap-14` (desktop), `gap-6` to `gap-8` (mobile) |
| Footer top padding | `pt-16` |
| Footer bottom padding | `pb-8` |
| Navbar height | `h-[72px]` |

---

## Layout Patterns

### Page structure

```
<Navbar />           sticky top-0 z-50, bg-white, border-b border-ink, h-[72px]
<main>
  <section>          78px top/bottom padding, alternating bg-white / bg-soft
  <section>
  ...
  <CTASection />     bg-soft, always near bottom of page
</main>
<Footer />           bg-ink, text-white
```

### Two-column section (standard)

```tsx
<section className="bg-white">  {/* or bg-soft */}
  <div className="container-x grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
    <div>{/* copy */}</div>
    <div>{/* visual */}</div>
  </div>
</section>
```

### Single-column centred section

```tsx
<section className="bg-soft">
  <div className="container-x">
    <SectionHeading align="center" ... />
    {/* content */}
  </div>
</section>
```

### Dark (ink) sections

Used for contrast breaks, testimonial strips, or full-bleed CTAs:

```tsx
<section className="bg-ink text-white">
  <div className="container-x">
    {/* all text uses text-white, text-white/60, text-white/40 */}
  </div>
</section>
```

---

## Components

### Button (`src/components/ui/Button.tsx`)

Four variants. Always `border-2`, `rounded-md`, `min-h-12` (48px), `font-extrabold`, `text-[15px]`.

```tsx
<Button href="/start-a-pilot">Get Shortlist</Button>                  // primary (red)
<Button href="/..." variant="dark">See How It Works</Button>           // dark (ink)
<Button href="/..." variant="outline">Learn More</Button>              // outline (red border)
<Button href="/..." variant="ghost">Secondary</Button>                 // ghost (white border, for dark bg)
```

| Variant | Default | Hover |
|---|---|---|
| `primary` | `bg-red text-white border-red` | `bg-ink border-ink` |
| `dark` | `bg-ink text-white border-ink` | `bg-red border-red` |
| `outline` | `bg-white text-red border-red` | `bg-red text-white` |
| `ghost` | `bg-transparent text-white border-white/40` | `bg-white text-ink` |

Always animate: `transition-all duration-150 hover:-translate-y-0.5`

### SectionHeading (`src/components/ui/SectionHeading.tsx`)

```tsx
<SectionHeading
  eyebrow="Optional label"          // red, uppercase, tracked
  title={<>Headline with <span className="red-pill">accent</span></>}
  copy="Supporting paragraph text."
  align="left"                      // or "center"
  as="h2"                           // or "h1"
/>
```

Heading size: `clamp(32px, 4.5vw, 56px)` weight 900. Copy: `text-lg leading-[1.6] text-[#303030] font-medium`.

### CalBookingButton (`src/components/ui/CalBookingButton.tsx`)

Use for all "Let's Talk" / "Book a call" CTAs. Accepts same variants as Button. Wires up Cal.com embed automatically.

```tsx
<CalBookingButton variant="dark">Let's Talk</CalBookingButton>
```

### "Let's Talk" in Navbar

Separate `LetsTalkButton` inside Navbar -- outline style, `border-2 border-ink`, min-h `42px`, smaller than the main CTA.

### TrackableButton (`src/components/ui/TrackableButton.tsx`)

Wraps Button with PostHog event capture. Use on primary CTAs when tracking is needed.

---

## Navigation

### Nav links (defined in `src/lib/data.ts`)

```
Home         /
For Companies   /for-companies
Deployment   /deployment-model
Roles        /roles
Case Studies /case-studies
Blog         /blog
```

Active state: `text-red` + `after:` underline pseudo-element in red.

### Navbar rules

- Logo: `logo-primary.png`, `h-[34px] w-auto`
- Desktop: logo left, nav centred, CTA buttons right
- Mobile: hamburger, full-width overlay nav, buttons stacked
- Sticky: `sticky top-0 z-50`
- Border: `border-b border-ink`

---

## Brand Assets

All brand files live in `public/images/brand/`.

| File | Use |
|---|---|
| `logo-primary.png` | Light backgrounds (Navbar, sign-in page) |
| `logo-reverse.png` | Dark backgrounds (Footer) |
| `logo-mono-black.png` | Single-colour print / monochrome contexts |
| `logo-mono-red.png` | Red variant |
| `mark-black.png` | Icon/favicon variant, black |
| `mark-red.png` | Icon/favicon variant, red |
| `mark-white.png` | Icon/favicon variant, white (dark bg) |
| `avatar-black.png` | Avatar/profile contexts, dark |
| `avatar-cream.png` | Avatar/profile contexts, light |
| `avatar-red.png` | Avatar/profile contexts, brand red |
| `icon-192.png` | PWA icon |
| `icon-512.png` | PWA icon large |

Never recreate the logo in SVG/code. Always use the PNG assets above.

---

## Blog Post Layout

### Sanity-authored posts (structured body)

Full-width reading container, max-width `760px` centred, `padding: 48px 24px 80px`.

Typography via `src/sanity/lib/portableTextComponents.tsx`:
- H1: font-black, `clamp(32px, 5vw, 48px)`, tracking `-0.04em`
- H2: font-black, `clamp(24px, 3vw, 32px)`, tracking `-0.03em`
- Body: `17px`, `font-medium`, `leading-[1.7]`, `color: #444`
- Blockquote: `border-l-4 border-red`, red accent

### HTML-import posts

Rendered by `FullPageHtmlRenderer`. The imported HTML's own CSS is scoped at server render time via `src/lib/css-scope.ts` -- all selectors prefixed with `.kx-post-{slug}` to prevent global leaks.

The breadcrumb bar and "Back to blog" link always render at the top inside `.container-x`, consistent with the site chrome.

The HTML body renders inside `<div class="container-x py-2">` -- full page-width content with standard side padding.

**Never** allow unscoped `<style>` tags from imported HTML to reach the page -- they will override the Navbar and Footer.

---

## Animations

### Marquee (logo/partner ticker)

```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 50s linear infinite; }
.animate-marquee-logos { animation: marquee-logos 30s linear infinite; }
```

### Reveal (scroll-triggered)

`src/components/ui/Reveal.tsx` -- wraps content with an intersection observer fade-up. Use on section content, not on above-the-fold hero elements.

### CountUp

`src/components/ui/CountUp.tsx` -- animated number counter. Used for proof-point stats.

### Hover on buttons

All buttons: `transition-all duration-150 hover:-translate-y-0.5`

---

## Image conventions

- Hero image: `src="/images/hero-team.png"`, `fill` + `object-cover`, overlaid with `bg-gradient-to-t from-ink/70`
- All images: `next/image` with `alt` text
- External images (blog OG): use `unoptimized` prop
- Border radius on card images: `rounded-2xl` (16px)
- Subtle shadow on image cards: `0 20px 56px rgba(14,14,14,0.14), 0 4px 14px rgba(14,14,14,0.06)`
- Border on images: `border border-line`

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `.container-x` for all page content | Break out of the container for content (only backgrounds are full-bleed) |
| Alternate `bg-white` and `bg-soft` sections | Use random background colours |
| Use `text-red` for active, accent, and CTA elements only | Use red for decorative or body text |
| Use `font-black` (900) for all display headings | Mix weights inconsistently -- headings are always 900 |
| Use the PNG brand assets from `/public/images/brand/` | Recreate or approximate the logo in code |
| Keep buttons `border-2 rounded-md min-h-12` | Create one-off button styles outside the Button component |
| Scope all imported HTML `<style>` via `css-scope.ts` | Inject unscoped CSS from third-party HTML |
| Write CTAs in imperative form ("Get Shortlist") | Write passive CTAs ("Learn more about our interns") |
| Use `section { padding: 78px 0 }` for vertical rhythm | Add random `py-*` classes on sections |

---

## File structure reference

```
src/
  app/
    globals.css          -- CSS custom properties, container-x, red-pill, section padding
    layout.tsx           -- Inter font, metadata, schema.org
  components/
    layout/
      Navbar.tsx         -- sticky nav, logo, nav links, CTA buttons
      Footer.tsx         -- dark footer, logo-reverse, nav links, address
      SiteShell.tsx      -- wraps Navbar + children + Footer
    ui/
      Button.tsx         -- 4-variant button component
      SectionHeading.tsx -- eyebrow + heading + copy pattern
      CalBookingButton.tsx -- Cal.com booking CTA
      TrackableButton.tsx  -- Button + PostHog event
      Reveal.tsx         -- scroll fade-up animation
      CountUp.tsx        -- animated stat counter
    sections/
      Hero.tsx           -- above-the-fold hero
      CTASection.tsx     -- form CTA (soft background)
      ...
  lib/
    css-scope.ts         -- PostCSS selector scoping for imported HTML
    data.ts              -- nav links, role data
public/
  images/
    brand/               -- all logo and mark assets (use these, don't recreate)
```
