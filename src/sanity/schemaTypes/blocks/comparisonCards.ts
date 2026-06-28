import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "comparisonCards",
  title: "Comparison cards",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      validation: (rule) => rule.min(2).max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonCard",
          fields: [
            defineField({
              name: "tone",
              title: "Tone",
              type: "string",
              options: { list: ["red", "dark", "light"] },
              initialValue: "light",
            }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "heading", subtitle: "label" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }: { items?: { heading?: string }[] }) => ({
      title: "Comparison cards",
      subtitle: items?.map((i) => i.heading).filter(Boolean).join(" / "),
    }),
  },
});
