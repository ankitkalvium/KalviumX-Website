import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TickerItem {
  category: string;
  copy: string;
}

const FEEDS = [
  'https://techcrunch.com/feed/',
  'https://www.hrdive.com/feeds/news/',
  'https://inc42.com/feed/',
  'https://yourstory.com/feed',
];

export const STATIC_FALLBACK: TickerItem[] = [
  { category: 'KALVIUMX', copy: 'Campus drives give you volume. We give you signal.' },
  { category: 'KALVIUMX', copy: 'Share one JD. Assessed shortlist in 7-12 days.' },
  { category: 'KALVIUMX', copy: '0% intern attrition across 36 months of deployment.' },
  { category: 'KALVIUMX', copy: 'Year 2 interns: 30 hrs/week, mentor-managed.' },
  { category: 'KALVIUMX', copy: 'AI/ML and Cloud/DevOps interns now available.' },
  { category: 'MARKET INTEL', copy: '~60% cost efficiency vs Tier-1 engineering talent.' },
];

const PROMPT = (headlines: string[]) => `You are a content curator for KalviumX, a B2B platform that deploys pre-assessed engineering interns (B.Tech students, Sem 3-8) to product tech companies.

Our ICP: Engineering managers, CTOs, and HR heads at product companies who hire engineering talent.

Here are recent news headlines from tech and HR publications:
${headlines.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Also weave in 2-3 KalviumX-specific signals:
- Deploy engineering interns in 12 days from JD share
- 0% intern attrition across 36 months in deployments
- ~60% cost efficiency vs Tier-1 engineering talent
- Available: Full-Stack, Backend, Frontend, AI/ML, Cloud/DevOps interns

Task: Return 7-8 ticker items mixing the most relevant news + KalviumX facts for our ICP.

Rules:
- Each copy under 70 characters
- Category must be exactly one of: HIRING SIGNAL, MARKET INTEL, HR TECH, LAYOFF WATCH, CAMPUS PULSE, KALVIUMX
- Only include items relevant to engineering hiring, talent costs, HR trends, or startup growth
- Rewrite headlines as punchy present-tense insights. Skip irrelevant consumer tech stories.
- No em dashes anywhere

Return ONLY a raw JSON array with no markdown fences:
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
      FEEDS.map(url => parser.parseURL(url))
    );

    const headlines: string[] = [];
    for (const result of feedResults) {
      if (result.status === 'fulfilled') {
        for (const item of result.value.items.slice(0, 12)) {
          if (item.title) headlines.push(item.title.trim());
        }
      }
    }

    if (headlines.length === 0) {
      console.warn('[ticker-agent] all feeds failed, using fallback');
      return STATIC_FALLBACK;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const result = await model.generateContent(PROMPT(headlines));
    const raw = result.response.text().trim();

    // Strip markdown code fences if present
    const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const items = JSON.parse(json) as TickerItem[];

    if (!Array.isArray(items) || items.length === 0) return STATIC_FALLBACK;

    return items.slice(0, 8);
  } catch (err) {
    console.error('[ticker-agent] pipeline error:', err);
    return STATIC_FALLBACK;
  }
}
