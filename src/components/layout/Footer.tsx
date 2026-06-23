import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink text-white pt-16 pb-8">
      <div className="container-x grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <div className="md:col-span-2">
          <div className="mb-4">
            <Image
              src="/images/brand/logo-reverse.png"
              alt="KalviumX"
              width={184}
              height={34}
              className="h-[32px] w-auto"
            />
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Build your next generation of engineers with talent assessed for your roles,
            prepared for your stack, supported through delivery, and proven before
            full-time conversion.
          </p>
          <p className="text-white/35 text-xs leading-relaxed max-w-sm mt-3">
            403, 22nd Cross Rd, Parangi Palaya, BDA Layout,<br />
            HSR Layout, Bengaluru, Karnataka 560034
          </p>
        </div>
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40 mb-4">Explore</div>
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
          <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40 mb-4">Talk to Our Team</div>
          <ul className="flex flex-col gap-3 text-sm font-semibold">
            <li>
              <Link href="/start-a-pilot" className="hover:text-red transition-colors">
                Share Your JD
              </Link>
            </li>
            <li>
              <a
                href="tel:+919483200300"
                aria-label="Call KalviumX sales at +91 9483 200 300"
                className="hover:text-red transition-colors"
              >
                Call +91 9483 200 300
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
          <span>Bengaluru, India</span>
        </span>
      </div>
    </footer>
  );
}
