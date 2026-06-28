import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

async function main() {
  const client = getCliClient();

  const imagePath = path.join(process.cwd(), "public/images/hero-team.png");
  const imageAsset = await client.assets.upload("image", fs.createReadStream(imagePath), {
    filename: "hero-team.png",
  });

  const doc = {
    _type: "post",
    title: "What changes when interns are work-integrated from day one",
    slug: { _type: "slug", current: "work-integrated-hiring" },
    excerpt:
      "A look at why work-integrated engineering programs compress the ramp curve, what we actually assess, and what a four-week deployment looks like in practice.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: imageAsset._id },
      alt: "Engineering team collaborating",
    },
    authorName: "KalviumX Team",
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: "block",
        _key: "intro",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "intro-span",
            text: "Most engineering teams lose the first six to eight weeks of an intern's tenure to onboarding. Work-integrated programs flip that — candidates are already shipping against real sprint cadences before day one.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2-1",
        style: "h2",
        children: [{ _type: "span", _key: "h2-1-span", text: "What we look for in an assessment" }],
      },
      {
        _type: "block",
        _key: "list-1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _type: "span", _key: "list-1-span", text: "Debugging an unfamiliar codebase under time pressure" }],
      },
      {
        _type: "block",
        _key: "list-2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _type: "span", _key: "list-2-span", text: "API design decisions, not just implementation speed" }],
      },
      {
        _type: "block",
        _key: "list-3",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _type: "span", _key: "list-3-span", text: "Communication when a requirement is ambiguous" }],
      },
      {
        _type: "block",
        _key: "h2-2",
        style: "h2",
        children: [{ _type: "span", _key: "h2-2-span", text: "A typical four-week ramp" }],
      },
      {
        _type: "block",
        _key: "olist-1",
        style: "normal",
        listItem: "number",
        level: 1,
        children: [{ _type: "span", _key: "olist-1-span", text: "Week 1 — shadowed PRs, mentor-paired commits" }],
      },
      {
        _type: "block",
        _key: "olist-2",
        style: "normal",
        listItem: "number",
        level: 1,
        children: [{ _type: "span", _key: "olist-2-span", text: "Week 2 — first solo ticket, reviewed same-day" }],
      },
      {
        _type: "block",
        _key: "olist-3",
        style: "normal",
        listItem: "number",
        level: 1,
        children: [{ _type: "span", _key: "olist-3-span", text: "Week 3 — sprint-load parity with full-time engineers" }],
      },
      {
        _type: "block",
        _key: "quote-1",
        style: "blockquote",
        children: [
          {
            _type: "span",
            _key: "quote-1-span",
            text: "The interns we deployed were producing reviewable PRs by week two — that's not what we expected going in.",
          },
        ],
      },
    ],
  };

  const created = await client.create(doc);
  console.log("Created post:", created._id, created.slug?.current);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
