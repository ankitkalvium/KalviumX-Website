import { defineArrayMember, defineField } from "sanity";

export default defineArrayMember({
  name: "calloutQuote",
  title: "Callout quote",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({ name: "caption", title: "Caption (optional)", type: "string" }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: ["dark", "red", "light"] },
      initialValue: "dark",
    }),
  ],
  preview: {
    select: { quote: "quote" },
    prepare: ({ quote }: { quote?: string }) => ({ title: "Callout quote", subtitle: quote }),
  },
});
