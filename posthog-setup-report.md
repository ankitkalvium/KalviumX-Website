# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the KalviumX website. The setup covers client-side initialization via `instrumentation-client.ts` (the recommended approach for Next.js 16+), a reverse proxy in `next.config.ts` to route PostHog requests through the app domain, a server-side PostHog client in `src/lib/posthog-server.ts`, 14 tracked events across 10 files, user identification on lead form submission, and PostHog error tracking on form failures. Two new utility components were introduced (`TrackableButton` and an extended `Button` with optional `onClick`) to enable tracking in server-rendered pages.

| Event | Description | File |
|---|---|---|
| `lead_form_submitted` | User successfully submitted the pilot request form from any source page. | `src/components/sections/CTAForm.tsx` |
| `lead_form_failed` | The lead form submission returned an error from the server. | `src/components/sections/CTAForm.tsx` |
| `sticky_cta_clicked` | User clicked the sticky floating "Share a JD, get a shortlist" CTA button. | `src/components/layout/StickyCTA.tsx` |
| `navbar_cta_clicked` | User clicked the "Get Shortlist" button in the main navigation bar. | `src/components/layout/Navbar.tsx` |
| `phone_number_clicked` | User clicked the phone number link in the navigation bar. | `src/components/layout/Navbar.tsx` |
| `cost_calculator_interacted` | User adjusted the cost calculator sliders or tier selection (fires once per session). | `src/components/sections/CostCalculator.tsx` |
| `cost_calculator_cta_clicked` | User clicked "Get Exact Commercials" from the cost calculator savings output. | `src/components/sections/CostCalculator.tsx` |
| `role_card_clicked` | User clicked a role card in the RoleExplorer to view role details. | `src/components/sections/RoleExplorer.tsx` |
| `role_filter_applied` | User toggled a technology stack filter in the role explorer. | `src/components/sections/RoleExplorer.tsx` |
| `faq_expanded` | User expanded a FAQ accordion item to read the answer. | `src/components/sections/FaqAccordion.tsx` |
| `role_page_cta_clicked` | User clicked a "Get Shortlist" or "Share a JD" CTA on an individual role detail page. | `src/app/roles/[slug]/page.tsx` |
| `case_study_cta_clicked` | User clicked "Start a Pilot" from the case study page sidebar CTA. | `src/app/case-studies/[slug]/page.tsx` |
| `lead_api_received` | Server-side: a valid lead was received and passed to Zoho CRM. | `src/app/api/lead/route.ts` |
| `lead_api_bot_dropped` | Server-side: a lead submission was silently dropped due to bot detection signals. | `src/app/api/lead/route.ts` |

## LLM analytics

The ticker agent (`src/lib/ticker-agent.ts`) calls Google Gemini (`gemini-3.1-flash-lite`) to curate RSS headlines into website ticker items. LLM observability is instrumented via **manual `$ai_generation` capture** using the existing `posthog-node` server client — no new packages required.

Each time `runTickerPipeline()` runs (via `/api/ticker` or the `/api/cron/ticker` cron route), PostHog records:

| Property | Value captured |
|---|---|
| `$ai_model` | `gemini-3.1-flash-lite` |
| `$ai_provider` | `google` |
| `$ai_input` | Full prompt (system instructions + RSS headlines) |
| `$ai_input_tokens` | From `response.usageMetadata.promptTokenCount` |
| `$ai_output_choices` | Raw JSON text from Gemini |
| `$ai_output_tokens` | From `response.usageMetadata.candidatesTokenCount` |
| `$ai_latency` | Wall-clock seconds for the `generateContent` call |
| `$ai_span_name` | `ticker_pipeline` |
| `$ai_is_error` / `$ai_error` | Populated on LLM call failure |

Events are visible under **AI Observability → Generations** in PostHog. Cost is auto-calculated by PostHog from model + token counts.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/206378/dashboard/762648)
- [Lead submissions](https://eu.posthog.com/project/206378/insights/Y6CBiOw1)
- [CTA to lead conversion funnel](https://eu.posthog.com/project/206378/insights/Lrsay5fb)
- [Lead form success vs failure](https://eu.posthog.com/project/206378/insights/HOFozP8R)
- [Content engagement](https://eu.posthog.com/project/206378/insights/0rzvnBOh)
- [CTA clicks by source](https://eu.posthog.com/project/206378/insights/zOfk9zKK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `posthog.identify()` only fires on lead form submission; returning users who haven't submitted a form will remain on anonymous distinct IDs.
- [ ] Trigger the ticker pipeline (`/api/cron/ticker`) and confirm `$ai_generation` events appear in PostHog AI Observability with correct token counts and latency.

### Agent skill

We've left agent skill folders in your project at `.claude/skills/integration-nextjs-app-router/` and `.claude/skills/llm-analytics-setup/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
