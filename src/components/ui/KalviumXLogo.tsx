interface KalviumXLogoProps {
  variant?: "default" | "reverse";
  height?: number;
  className?: string;
}

// Default: filled red square + white inner elements (matches the actual logo)
// Reverse: white-outlined mark for use on dark backgrounds
function Mark({ variant }: { variant: "default" | "reverse" }) {
  if (variant === "reverse") {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <g transform="translate(7,7)" stroke="white" strokeWidth="6" fill="none">
          <rect width="50" height="50" />
          <path d="M10 12L43 12L10 37L43 48" strokeLinejoin="miter" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="64" height="64" fill="#FF3535" />
      <g transform="translate(7,7)" stroke="white" strokeWidth="6" fill="none">
        <rect width="50" height="50" />
        <path d="M10 12L43 12L10 37L43 48" strokeLinejoin="miter" />
      </g>
    </svg>
  );
}

export default function KalviumXLogo({
  variant = "default",
  height = 36,
  className = "",
}: KalviumXLogoProps) {
  const isReverse = variant === "reverse";
  const textRed = isReverse ? "#FFFFFF" : "#FF3535";
  const textX = isReverse ? "#FFFFFF" : "#101010";
  const fontSize = Math.round(height * 0.72);
  const gap = Math.round(height * 0.38);

  return (
    <span
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap, height }}
    >
      <span style={{ width: height, height, flexShrink: 0 }}>
        <Mark variant={variant} />
      </span>
      <span
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: textRed,
        }}
      >
        Kalvium
      </span>
      <span
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          marginLeft: Math.round(height * -0.06),
          color: textX,
        }}
      >
        X
      </span>
    </span>
  );
}
