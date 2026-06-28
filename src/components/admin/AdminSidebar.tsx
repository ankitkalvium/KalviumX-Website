"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const INBOUNDS_ICON = "M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 13v4l9 4 9-4v-4";

const INBOUNDS_CHILDREN = [
  { href: "/admin/opportunities", label: "Kal Ai" },
  { href: "/admin/opportunities/hiring-interest", label: "Hiring Interest" },
];

const NAV_ITEMS = [
  {
    href: "/admin/meetings",
    label: "Meetings",
    icon: "M8 7V3m8 4V3M4 11h16M5 7h14a1 1 0 011 1v11a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1z",
  },
  {
    href: "/admin/deals",
    label: "Deals",
    icon: "M3 6h18M3 6l2-3h14l2 3M3 6v13a1 1 0 001 1h16a1 1 0 001-1V6M9 11h6",
  },
  {
    href: "/admin/students",
    label: "Students",
    icon: "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.42A8 8 0 0112 21a8 8 0 01-6.16-10.42L12 14z",
  },
];

export default function AdminSidebar({
  adminEmail,
  onSignOut,
}: {
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-line bg-white py-6 transition-[width] duration-200 ${
        collapsed ? "w-[72px] px-3" : "w-[220px] px-5"
      }`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-7 grid h-6 w-6 place-items-center rounded-full border border-line bg-white text-muted shadow-sm hover:text-red"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 fill-none stroke-current transition-transform ${collapsed ? "rotate-180" : ""}`}
          strokeWidth="2.5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex justify-center">
        {collapsed ? (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-red/10 text-[13px] font-black tracking-[-0.08em]">
            <span className="text-red">K</span>
            <span className="text-ink">X</span>
          </span>
        ) : (
          <Image
            src="/images/brand/logo-primary.png"
            alt="KalviumX"
            width={150}
            height={28}
            priority
            className="h-7 w-auto self-start"
            style={{ height: 28, width: "auto" }}
          />
        )}
      </div>

      <nav className="mt-8 flex flex-col gap-1 text-sm font-extrabold">
        {(() => {
          const inboundsActive = pathname.startsWith("/admin/opportunities");
          return (
            <div>
              <Link
                href={INBOUNDS_CHILDREN[0].href}
                title="Inbounds"
                className={`flex items-center gap-2 rounded-lg py-2.5 transition-colors ${
                  collapsed ? "justify-center px-2" : "px-3"
                } ${inboundsActive ? "bg-red/5 text-red" : "text-ink hover:bg-soft"}`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="2">
                  <path d={INBOUNDS_ICON} />
                </svg>
                {collapsed ? null : "Inbounds"}
              </Link>
              {!collapsed && inboundsActive ? (
                <div className="ml-[26px] mt-1 flex flex-col gap-1 border-l border-line pl-3">
                  {INBOUNDS_CHILDREN.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`rounded-lg px-3 py-2 text-xs transition-colors ${
                          childActive ? "bg-red/5 text-red" : "text-muted hover:bg-soft hover:text-ink"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })()}
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-2 rounded-lg py-2.5 transition-colors ${
                collapsed ? "justify-center px-2" : "px-3"
              } ${active ? "bg-red/5 text-red" : "text-ink hover:bg-soft"}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="2">
                <path d={item.icon} />
              </svg>
              {collapsed ? null : item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        {collapsed ? null : <p className="truncate text-xs text-muted">{adminEmail}</p>}
        {onSignOut ? (
          <form action={onSignOut} className={collapsed ? "mt-3 flex justify-center" : "mt-3"}>
            <button
              type="submit"
              title="Sign out"
              className={`flex items-center gap-2 text-sm font-extrabold text-ink hover:text-red ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              {collapsed ? null : "Sign out"}
            </button>
          </form>
        ) : null}
      </div>
    </aside>
  );
}
