// One-off demo: shows every structured block type (comparisonCards, statGrid,
// timelineBlock, badgeList, calloutQuote, closingCta) on a single post so you
// can compare the structured result against the fullPageHtml version.
import { getCliClient } from "sanity/cli";

async function main() {
  const client = getCliClient();

  const doc = {
    _id: "post-readiness-structured-demo",
    _type: "post",
    title: "Why Hiring Isn't the Same as Readiness (structured demo)",
    slug: { _type: "slug", current: "readiness-structured-demo" },
    excerpt:
      "The same article, rebuilt with structured Sanity blocks instead of raw HTML — comparison cards, stat grids, a timeline, badges, and a closing CTA.",
    authorName: "KalviumX Team",
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "p1-span",
            text: "Most companies believe they've hired an engineer. What they've actually hired is potential that may take months to become productive.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2-1",
        style: "h2",
        children: [{ _type: "span", _key: "h2-1-span", text: "What companies think vs. what actually happens" }],
      },
      {
        _type: "comparisonCards",
        _key: "cards-1",
        items: [
          {
            _key: "card-1",
            tone: "red",
            label: "What companies think",
            heading: '"We hired an engineer."',
            body: "Offer accepted. Onboarding scheduled. The management calendar assumes delivery starts next month.",
          },
          {
            _key: "card-2",
            tone: "dark",
            label: "The reality",
            heading: '"We hired future potential."',
            body: "The engineering ramp is real. Costs aggregate silently across timelines before value catches up.",
          },
        ],
      },
      {
        _type: "calloutQuote",
        _key: "quote-1",
        tone: "dark",
        quote: "The upfront salary isn't the expensive part. The downstream drag is.",
        caption: "Lost velocity = nonproductive runway + distracted senior oversight",
      },
      {
        _type: "block",
        _key: "h2-2",
        style: "h2",
        children: [{ _type: "span", _key: "h2-2-span", text: "What your core team actually absorbs" }],
      },
      {
        _type: "timelineBlock",
        _key: "timeline-1",
        items: [
          {
            _key: "t1",
            tag: "Month 1",
            title: "Tooling environment & configuration",
            body: "The candidate parses setup architecture, environment vars, and CI architecture. Functional contribution stays minimal.",
          },
          {
            _key: "t2",
            tag: "Month 2",
            title: "Codebase intricacies & initial PRs",
            body: "Initial merge requests are heavily iterated. Senior engineers switch contexts often to critique design choices.",
          },
          {
            _key: "t3",
            tag: "Month 3",
            title: "Isolated feature tracking",
            body: "Comfort parameters allow scoped, low-impact tasks. Core design choices still need architectural guardrails.",
          },
          {
            _key: "t4",
            tag: "Months 4-6",
            title: "Autonomous value generation",
            body: "The hire reliably unblocks code modules without micro-reviews. Break-even starts long after capitalization begins.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2-3",
        style: "h2",
        children: [{ _type: "span", _key: "h2-3-span", text: "Ready before day one" }],
      },
      {
        _type: "statGrid",
        _key: "stats-1",
        items: [
          {
            _key: "s1",
            value: "3–6 Months",
            label: "Traditional onboarding",
            description: "Average latency before an engineer drives independent production value.",
          },
          {
            _key: "s2",
            value: "1–2 Weeks",
            label: "KalviumX alignment",
            description: "Immediate tracking to code commits, familiar with sprints and test strategy out of the box.",
          },
        ],
      },
      {
        _type: "badgeList",
        _key: "badges-1",
        items: [
          "Production code shipments",
          "Sprint cadence competency",
          "Structured CI/CD execution",
          "Cross-functional architecture logs",
        ],
      },
      {
        _type: "closingCta",
        _key: "cta-1",
        kicker: "The closing insight",
        heading: "Hiring builds capacity. Readiness creates velocity.",
        body: "The definitive lever for scaling output isn't accelerated sourcing. It's embedding engineers verified for delivery targets.",
        buttonLabel: "Integrate KalviumX Engineers",
        buttonHref: "/start-a-pilot",
      },
    ],
  };

  const result = await client.createOrReplace(doc);
  console.log(`Created/updated post "${result.title}" -> /blog/readiness-structured-demo`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
