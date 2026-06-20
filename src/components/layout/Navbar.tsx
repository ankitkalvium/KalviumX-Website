"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink">
      <div className="container-x flex items-center justify-between gap-7 h-[72px]">
        <Link href="/" aria-label="KalviumX home">
          <Image
            src="/images/logo.png"
            alt="KalviumX"
            width={184}
            height={34}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-8 flex-1 text-sm font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative py-1 transition-colors hover:text-red ${
                isActive(link.href)
                  ? "text-red after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-red"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <a
            href="tel:+919483200300"
            className="flex items-center gap-2 text-[15px] font-bold whitespace-nowrap hover:text-red transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-red">
              <path d="M6.6 10.8c1.7 3.3 3.3 4.9 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.4 22 2 13.6 2 3.4 2 2.7 2.5 2.2 3.2 2.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-1.6 2.2z" />
            </svg>
            +91 9483 200 300
          </a>
          <Button href="/start-a-pilot">Get Shortlist</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center w-10 h-10 border-2 border-ink rounded-md"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink fill-none" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-white">
          <nav className="container-x flex flex-col gap-1 py-4 text-base font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`py-3 border-b border-line last:border-none ${
                  isActive(link.href) ? "text-red" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a href="tel:+919483200300" className="py-3 border-b border-line">
              +91 9483 200 300
            </a>
            <Button href="/start-a-pilot" className="mt-4 w-full">
              Get Shortlist
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
