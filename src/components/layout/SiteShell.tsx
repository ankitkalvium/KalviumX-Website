"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import KalChatWidget from "@/components/layout/KalChatWidget";
import Navbar from "@/components/layout/Navbar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare =
    pathname.startsWith("/admin") || pathname.startsWith("/studio") || pathname.startsWith("/hiring-form");

  if (isBare) return <>{children}</>;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <KalChatWidget />
    </>
  );
}
