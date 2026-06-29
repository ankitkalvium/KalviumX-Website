import type { PortableTextBlock } from "@portabletext/react";
import type { BlogPost } from "@/sanity/lib/queries";

// Shown only when Sanity isn't configured yet (see isSanityConfigured()),
// so the team can see the full blog UI — list card, hero, every Portable
// Text block type — before finishing the CMS setup. Disappears automatically
// the moment NEXT_PUBLIC_SANITY_PROJECT_ID is set; never shown alongside
// real posts.
const previewBody: PortableTextBlock[] = [
  {
    _type: "block",
    _key: "intro",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "intro-span",
        text: "This is preview content rendered locally. It disappears the moment a real Sanity project is connected. Use it to check every part of the blog template before writing your first real post.",
      },
    ],
  },
  {
    _type: "block",
    _key: "h2-1",
    style: "h2",
    children: [{ _type: "span", _key: "h2-1-span", text: "Why work-integrated hiring changes the ramp curve" }],
  },
  {
    _type: "block",
    _key: "p1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "p1-span",
        text: "Most engineering teams lose the first six to eight weeks of an intern's tenure to onboarding. ",
      },
      { _type: "span", _key: "p1-span-bold", marks: ["strong"], text: "Work-integrated programs flip that" },
      {
        _type: "span",
        _key: "p1-span-2",
        text: ", candidates are already shipping against real sprint cadences before day one.",
      },
    ],
  },
  {
    _type: "block",
    _key: "h3-1",
    style: "h3",
    children: [{ _type: "span", _key: "h3-1-span", text: "What we look for in an assessment" }],
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
    _key: "h3-2",
    style: "h3",
    children: [{ _type: "span", _key: "h3-2-span", text: "A typical four-week ramp" }],
  },
  {
    _type: "block",
    _key: "olist-1",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [{ _type: "span", _key: "olist-1-span", text: "Week 1: shadowed PRs, mentor-paired commits" }],
  },
  {
    _type: "block",
    _key: "olist-2",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [{ _type: "span", _key: "olist-2-span", text: "Week 2: first solo ticket, reviewed same-day" }],
  },
  {
    _type: "block",
    _key: "olist-3",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [{ _type: "span", _key: "olist-3-span", text: "Week 3: sprint-load parity with full-time engineers" }],
  },
  {
    _type: "block",
    _key: "quote-1",
    style: "blockquote",
    children: [
      {
        _type: "span",
        _key: "quote-1-span",
        text: "The interns we deployed were producing reviewable PRs by week two, which isn't what we expected going in.",
      },
    ],
  },
  {
    _type: "block",
    _key: "p2",
    style: "normal",
    children: [
      { _type: "span", _key: "p2-span", text: "Read the full breakdown in our " },
      {
        _type: "span",
        _key: "p2-span-link",
        marks: ["link-1"],
        text: "case studies",
      },
      { _type: "span", _key: "p2-span-end", text: "." },
    ],
    markDefs: [{ _type: "link", _key: "link-1", href: "/case-studies" }],
  },
];

export const previewPost: BlogPost = {
  _id: "preview-post",
  title: "What changes when interns are work-integrated from day one",
  slug: "preview-work-integrated-hiring",
  excerpt:
    "A look at why work-integrated engineering programs compress the ramp curve, what we actually assess, and what a four-week deployment looks like in practice.",
  coverImage: {},
  coverImageUrl: "/images/hero-team.png",
  authorName: "KalviumX Team",
  publishedAt: new Date().toISOString(),
  published: true,
  body: previewBody,
};
