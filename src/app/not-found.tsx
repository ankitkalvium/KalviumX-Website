import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-20 text-center">
      <div className="container-x">
        {/* SVG illustration — broken pipeline / empty funnel */}
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 320 200" fill="none" className="w-[280px] sm:w-[320px]">
            {/* Pipeline track */}
            <rect x="20" y="88" width="200" height="24" rx="4" fill="#f1f1f1" stroke="#e2e2e2" strokeWidth="1.5"/>
            {/* Flowing steps */}
            <rect x="28" y="94" width="36" height="12" rx="2" fill="#f53333" opacity="0.8"/>
            <rect x="72" y="94" width="36" height="12" rx="2" fill="#f53333" opacity="0.55"/>
            <rect x="116" y="94" width="36" height="12" rx="2" fill="#f53333" opacity="0.3"/>
            {/* Arrow */}
            <path d="M224 100 L244 100" stroke="#e2e2e2" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
            {/* 404 block — the dead end */}
            <rect x="248" y="76" width="52" height="48" rx="6" fill="#0e0e0e"/>
            <text x="274" y="105" textAnchor="middle" fill="#f53333" fontFamily="monospace" fontWeight="900" fontSize="18">404</text>
            {/* Sparks / error marks */}
            <line x1="258" y1="68" x2="262" y2="60" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="274" y1="65" x2="274" y2="57" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="290" y1="68" x2="286" y2="60" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Candidate dots falling off */}
            <circle cx="60" cy="140" r="7" fill="#f53333" opacity="0.15" stroke="#f53333" strokeWidth="1.5"/>
            <circle cx="85" cy="152" r="5" fill="#f53333" opacity="0.1" stroke="#f53333" strokeWidth="1"/>
            <circle cx="108" cy="145" r="6" fill="#f53333" opacity="0.12" stroke="#f53333" strokeWidth="1"/>
            {/* Ground line */}
            <line x1="20" y1="168" x2="300" y2="168" stroke="#e2e2e2" strokeWidth="1"/>
          </svg>
        </div>

        <h1 className="text-[clamp(28px,3.6vw,44px)] font-black tracking-[-0.05em] mb-4">
          This page didn&apos;t make the shortlist.
        </h1>
        <p className="text-[#555] text-base font-medium max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved. The
          talent pipeline, however, is very much live.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Button href="/">Back to Home</Button>
          <Button href="/start-a-pilot" variant="outline">
            Start a Pilot
          </Button>
        </div>
      </div>
    </section>
  );
}
