import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "closingCta",
  title: "Closing CTA banner",
  type: "object",
  fields: [
    defineField({ name: "kicker", title: "Kicker (optional)", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({ name: "buttonLabel", title: "Button label", type: "string" }),
    defineField({ name: "buttonHref", title: "Button link", type: "url" }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
