import Link from "next/link";
import { navLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink text-white pt-16 pb-8">
      <div className="container-x grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-2xl font-black tracking-[-0.065em] mb-4">
            <span className="text-red">Kalvium</span>
            <span className="text-white -ml-1">X</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Enterprise intern hiring from Kalvium&apos;s work-integrated B.Tech ecosystem -
            pre-assessed, JD-matched, mentor-managed, and built for intern-to-FTE conversion.
          </p>
          <p className="text-white/35 text-xs leading-relaxed max-w-sm mt-3">
            403, 22nd Cross Rd, Parangi Palaya, BDA Layout,<br />
            HSR Layout, Bengaluru, Karnataka 560034
          </p>
        </div>
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40 mb-4">For Companies</div>
          <ul className="flex flex-col gap-3 text-sm font-semibold">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-red transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40 mb-4">Get Started</div>
          <ul className="flex flex-col gap-3 text-sm font-semibold">
            <li>
              <Link href="/start-a-pilot" className="hover:text-red transition-colors">
                Start a Pilot
              </Link>
            </li>
            <li>
              <a href="tel:+919483200300" className="hover:text-red transition-colors">
                +91 9483 200 300
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/40 font-semibold">
        <span>&copy; {new Date().getFullYear()} KalviumX. Enterprise Intern Hiring.</span>
        <span className="flex gap-5">
          <Link href="/privacy" className="hover:text-red transition-colors">
            Privacy Policy
          </Link>
          <span>x.kalvium.com</span>
        </span>
      </div>
    </footer>
  );
}
