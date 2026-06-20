import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TickerItem {
  category: string;
  copy: string;
}

const FEEDS: { url: string; label: string }[] = [
  // HR & workforce intelligence
  { url: 'https://hr.economictimes.indiatimes.com/rss/topstories', label: 'ET HR' },
  { url: 'https://www.hrdive.com/feeds/news/', label: 'HR Dive' },
  { url: 'https://news.google.com/rss/search?q=site:peoplematters.in+HR+talent+hiring&hl=en-IN&gl=IN&ceid=IN:en', label: 'People Matters' },
  // India startup funding signals
  { url: 'https://yourstory.com/category/funding/feed', label: 'YourStory Funding' },
  { url: 'https://news.google.com/rss/search?q=site:entrackr.com+funding+startup+raises&hl=en-IN&gl=IN&ceid=IN:en', label: 'Entrackr' },
  { url: 'https://inc42.com/feed/', label: 'Inc42' },
  // Tech hiring & industry
  { url: 'https://techcrunch.com/feed/', label: 'TechCrunch' },
  { url: 'https://yourstory.com/feed', label: 'YourStory' },
];

export const STATIC_FALLBACK: TickerItem[] = [
  { category: 'KALVIUMX', copy: 'Campus drives give you volume. We give you signal.' },
  { category: 'KALVIUMX', copy: 'Share one JD. Assessed shortlist in under 48 hours.' },
  { category: 'KALVIUMX', copy: '0% intern attrition across 36 months of deployment.' },
  { category: 'KALVIUMX', copy: 'Year 2 interns: 30 hrs/week, mentor-managed.' },
  { category: 'KALVIUMX', copy: 'AI/ML and Cloud/DevOps interns now available.' },
  { category: 'MARKET INTEL', copy: '~60% cost efficiency vs Tier-1 engineering talent.' },
];

const PROMPT = (headlines: string[]) => `You are a content curator for KalviumX, a B2B platform that deploys pre-assessed engineering interns (B.Tech students, Sem 3-8) to product tech companies in India and globally.

Our ICP (who reads this ticker): Engineering managers, CTOs, VPs of Engineering, and HR leaders at product companies actively hiring or planning to hire engineering talent.

Here are ${headlines.length} recent headlines from HR, startup, and tech publications:
${headlines.map((t, i) => `${i + 1}. ${t}`).join('\n')}

STRICT FILTERING RULES — include a headline ONLY if it relates to at least one of these:
✓ Engineering talent hiring, layoffs, or workforce planning
✓ HR technology, recruitment tech, or talent acquisition trends
✓ Indian startup funding rounds (signals of engineering hiring ahead)
✓ Tech salary, talent cost benchmarks, or compensation trends
✓ GCC / captive centre growth in India
✓ AI/ML engineering demand or GenAI in the workplace
✓ Intern programs, campus hiring, or early talent

EXCLUDE everything else — especially:
✗ Consumer products, gadgets, or app launches
✗ Aviation, transport, sports, entertainment
✗ Political news, government policy unless directly about jobs
✗ Individual company financial results unless it signals hiring
✗ Medical, health, or pharma unless it is about tech workforce

ALSO weave in exactly 2 KalviumX-specific items from these facts:
- JD to deployed engineering intern in 12 days
- 0% intern attrition across 36 months
- ~60% cost efficiency vs Tier-1 engineering talent
- Available roles: Full-Stack, Backend, Frontend, AI/ML, Cloud/DevOps
- Work-integrated B.Tech students, Sem 3-8

OUTPUT RULES:
- Return exactly 7-8 items total (5-6 from news + 2 KalviumX)
- Each copy field: under 70 characters, no em dashes, present tense, punchy
- Category must be exactly one of: HIRING SIGNAL | MARKET INTEL | HR TECH | LAYOFF WATCH | CAMPUS PULSE | KALVIUMX | FUNDING SIGNAL
- Use FUNDING SIGNAL for India startup funding rounds that imply upcoming engineering hiring
- Return ONLY a raw JSON array, no markdown fences, no explanation:

[{"category":"HIRING SIGNAL","copy":"Fintech headcount expanding across APAC in Q3"},...]`;

export async function runTickerPipeline(): Promise<TickerItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[ticker-agent] GEMINI_API_KEY not set, using fallback');
    return STATIC_FALLBACK;
  }

  try {
    const parser = new Parser({ timeout: 6000, headers: { 'User-Agent': 'KalviumX/1.0' } });

    const feedResults = await Promise.allSettled(
      FEEDS.map(f => parser.parseURL(f.url))
    );

    const headlines: string[] = [];
    feedResults.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        const items = result.value.items.slice(0, 8);
        for (const item of items) {
          if (item.title) {
            // Strip source suffix from Google News titles (e.g. " - Entrackr")
            const title = item.title.replace(/\s*-\s*[^-]+$/, '').trim();
            if (title.length > 10) headlines.push(title);
          }
        }
      } else {
        console.warn(`[ticker-agent] feed failed: ${FEEDS[i].label}`, result.reason?.message);
      }
    });

    if (headlines.length === 0) {
      console.warn('[ticker-agent] all feeds failed, using fallback');
      return STATIC_FALLBACK;
    }

    console.log(`[ticker-agent] fetched ${headlines.length} headlines from ${feedResults.filter(r => r.status === 'fulfilled').length}/${FEEDS.length} feeds`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const result = await model.generateContent(PROMPT(headlines));
    const raw = result.response.text().trim();

    const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const items = JSON.parse(json) as TickerItem[];

    if (!Array.isArray(items) || items.length === 0) return STATIC_FALLBACK;

    return items.slice(0, 8);
  } catch (err) {
    console.error('[ticker-agent] pipeline error:', err);
    return STATIC_FALLBACK;
  }
}
