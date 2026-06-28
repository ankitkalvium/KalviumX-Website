import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "badgeList",
  title: "Badge list",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Badges",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(2),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }: { items?: string[] }) => ({
      title: "Badge list",
      subtitle: items?.join(", "),
    }),
  },
});
