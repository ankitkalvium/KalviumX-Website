interface CaseStudyVisualProps {
  accent: "retention" | "efficiency" | "genai";
  compact?: boolean;
}

export default function CaseStudyVisual({ accent, compact = false }: CaseStudyVisualProps) {
  const size = compact ? "min-h-40" : "min-h-[250px]";

  if (accent === "retention") {
    return (
      <div className={`${size} relative overflow-hidden bg-ink text-white grid place-items-center`}>
        <DotField />
        <svg viewBox="0 0 240 190" className="relative z-10 w-52 h-44" fill="none" aria-hidden>
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="72" cy="49" r="14" />
            <circle cx="120" cy="38" r="16" />
            <circle cx="168" cy="49" r="14" />
            <path d="M45 90c5-22 17-31 27-31s22 9 27 31M91 80c5-25 17-36 29-36s24 11 29 36M141 90c5-22 17-31 27-31s22 9 27 31" />
            <path d="M120 77 165 94v32c0 28-20 44-45 57-25-13-45-29-45-57V94l45-17Z" stroke="#f53333" />
            <path d="m101 128 13 13 27-31" />
          </g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-16 border-t border-red/60 rounded-[50%_50%_0_0/100%_100%_0_0]" />
      </div>
    );
  }

  if (accent === "efficiency") {
    return (
      <div className={`${size} relative overflow-hidden bg-[#f7f7f7] text-ink grid place-items-center`}>
        <DotField dark />
        <svg viewBox="0 0 260 180" className="relative z-10 w-56 h-40" fill="none" aria-hidden>
          <path d="M24 155h212" stroke="#bdbdbd" strokeWidth="2" />
          <rect x="45" y="83" width="30" height="72" fill="#f53333" />
          <rect x="91" y="35" width="30" height="120" fill="#111" />
          <rect x="137" y="98" width="30" height="57" fill="#d7d7d7" />
          <path d="m26 56 66 56 44-30 73 58" stroke="#f53333" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m192 139 17 1-2-17" stroke="#f53333" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${size} relative overflow-hidden bg-ink text-white grid place-items-center`}>
      <DotField />
      <svg viewBox="0 0 240 190" className="relative z-10 w-52 h-44" fill="none" aria-hidden>
        <path
          d="M116 33c-15-19-45-13-48 10-20-3-31 23-17 37-18 13-7 42 14 40-3 22 25 35 41 19 7 12 29 12 36-1 17 15 44 1 39-21 21 1 31-27 14-40 14-15 2-40-17-36-4-23-34-28-49-10Z"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M120 30v113M120 53c-13-12-29-6-31 8M120 80c-18-10-35 2-32 18M120 112c-17 1-24 13-20 26" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M121 55h28l12 14h19M121 83h20l13 13h26M121 112h30l12-13h17M121 137h20l13-14h26" stroke="#f53333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="183" cy="69" r="5" fill="#f53333" />
        <circle cx="183" cy="96" r="5" fill="#f53333" />
        <circle cx="183" cy="99" r="5" fill="#f53333" />
        <circle cx="183" cy="123" r="5" fill="#f53333" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-16 border-t border-red/60 rounded-[50%_50%_0_0/100%_100%_0_0]" />
    </div>
  );
}

function DotField({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`absolute inset-0 ${dark ? "opacity-20" : "opacity-25"}`}
      style={{
        backgroundImage: `radial-gradient(${dark ? "#111" : "#fff"} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
        maskImage: "linear-gradient(to bottom, transparent 5%, black 45%, transparent 95%)",
      }}
    />
  );
}
