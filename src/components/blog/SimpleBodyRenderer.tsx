import type { SimpleBlock } from "@/lib/repo/posts";

// Minimal structured-content renderer replacing Sanity's PortableText —
// covers the block types actually used by real posts (plain paragraphs,
// headings, quotes, lists). No inline marks (bold/links) since no current
// content needs them; extend here if a future post requires it.
export default function SimpleBodyRenderer({ blocks }: { blocks: SimpleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} className="mt-12 text-[clamp(24px,3vw,32px)] font-black leading-tight tracking-[-0.03em]">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="mt-9 text-[clamp(20px,2.4vw,26px)] font-extrabold leading-tight tracking-[-0.02em]">
                {block.text}
              </h3>
            );
          case "blockquote":
            return (
              <blockquote key={index} className="mt-6 border-l-4 border-red pl-5 text-lg font-semibold italic text-ink">
                {block.text}
              </blockquote>
            );
          case "bullet-list":
            return (
              <ul key={index} className="mt-5 space-y-2 pl-1">
                {(block.items ?? []).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2.5 text-[17px] leading-relaxed text-[#444] font-medium">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "number-list":
            return (
              <ol key={index} className="mt-5 space-y-2 pl-1 list-decimal list-inside">
                {(block.items ?? []).map((item, itemIndex) => (
                  <li key={itemIndex} className="text-[17px] leading-relaxed text-[#444] font-medium">
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "p":
          default:
            return (
              <p key={index} className="mt-5 text-[17px] leading-relaxed text-[#444] font-medium">
                {block.text}
              </p>
            );
        }
      })}
    </>
  );
}
