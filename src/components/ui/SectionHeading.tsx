import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  copy?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  className = "",
  as = "h2",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const Heading = as;
  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
          {eyebrow}
        </span>
      )}
      <Heading className="text-[clamp(32px,4.5vw,56px)] font-black leading-[1.08] tracking-[-0.04em]">
        {title}
      </Heading>
      {copy && (
        <p
          className={`mt-5 text-lg leading-[1.6] text-[#303030] font-medium ${
            align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"
          }`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
