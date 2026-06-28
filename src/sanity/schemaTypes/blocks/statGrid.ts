import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "statGrid",
  title: "Stat grid",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Stats",
      type: "array",
      validation: (rule) => rule.min(2).max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value (e.g. 1–2 Weeks)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }: { items?: { value?: string }[] }) => ({
      title: "Stat grid",
      subtitle: items?.map((i) => i.value).filter(Boolean).join(" / "),
    }),
  },
});
