import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "timelineBlock",
  title: "Timeline",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Steps",
      type: "array",
      validation: (rule) => rule.min(2),
      of: [
        defineArrayMember({
          type: "object",
          name: "timelineStep",
          fields: [
            defineField({ name: "tag", title: "Tag (e.g. Month 1)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "tag" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }: { items?: unknown[] }) => ({
      title: "Timeline",
      subtitle: `${items?.length ?? 0} steps`,
    }),
  },
});
