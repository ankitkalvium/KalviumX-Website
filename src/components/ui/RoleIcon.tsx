interface RoleIconProps {
  type: string;
  className?: string;
}

export default function RoleIcon({ type, className = "w-10 h-10" }: RoleIconProps) {
  const icons: Record<string, React.ReactNode> = {
    "Full-Stack": (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <rect x="6" y="8" width="28" height="7" rx="2" fill="#f53333" opacity="0.15" stroke="#f53333" strokeWidth="1.5"/>
        <rect x="6" y="17" width="28" height="7" rx="2" fill="#f53333" opacity="0.08" stroke="#f53333" strokeWidth="1.5"/>
        <rect x="6" y="26" width="28" height="7" rx="2" fill="#f53333" opacity="0.04" stroke="#f53333" strokeWidth="1.5"/>
        <circle cx="10.5" cy="11.5" r="1.5" fill="#f53333"/>
        <circle cx="10.5" cy="20.5" r="1.5" fill="#f53333" opacity="0.5"/>
        <circle cx="10.5" cy="29.5" r="1.5" fill="#f53333" opacity="0.3"/>
      </svg>
    ),
    "Backend": (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <ellipse cx="20" cy="12" rx="12" ry="5" stroke="#f53333" strokeWidth="1.5"/>
        <path d="M8 12v8c0 2.76 5.37 5 12 5s12-2.24 12-5v-8" stroke="#f53333" strokeWidth="1.5"/>
        <path d="M8 20v8c0 2.76 5.37 5 12 5s12-2.24 12-5v-8" stroke="#f53333" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="20" cy="12" r="2" fill="#f53333"/>
      </svg>
    ),
    "Frontend": (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <rect x="5" y="7" width="30" height="20" rx="3" stroke="#f53333" strokeWidth="1.5"/>
        <line x1="13" y1="33" x2="27" y2="33" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="27" x2="20" y2="33" stroke="#f53333" strokeWidth="1.5"/>
        <polyline points="11,19 16,14 20,18 25,12 29,16" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "QA & Automation": (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <path d="M20 5L6 11v10c0 7.7 5.96 14.9 14 17 8.04-2.1 14-9.3 14-17V11L20 5z" stroke="#f53333" strokeWidth="1.5" strokeLinejoin="round"/>
        <polyline points="14,20 18,24 27,15" stroke="#f53333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "Product Engineering": (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <circle cx="20" cy="20" r="5" stroke="#f53333" strokeWidth="1.5"/>
        <path d="M20 7v4M20 29v4M7 20h4M29 20h4" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10.5 10.5l2.8 2.8M26.7 26.7l2.8 2.8M10.5 29.5l2.8-2.8M26.7 13.3l2.8-2.8" stroke="#f53333" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  };

  return <>{icons[type] ?? icons["Full-Stack"]}</>;
}
