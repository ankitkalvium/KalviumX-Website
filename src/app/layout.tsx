import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StickyCTA from "@/components/layout/StickyCTA";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE_URL = "https://x.kalvium.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KalviumX | Hire Engineering Interns Your Tech Teams Can Trust",
    template: "%s | KalviumX",
  },
  description:
    "Enterprise intern hiring from Kalvium's work-integrated B.Tech ecosystem - pre-assessed, JD-matched, mentor-managed, and built for intern-to-FTE conversion.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "KalviumX",
    title: "KalviumX | Hire Engineering Interns Your Tech Teams Can Trust",
    description:
      "Share one JD. Get a curated, assessed intern shortlist with project proof, skill fit, availability and mentor notes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KalviumX | Hire Engineering Interns Your Tech Teams Can Trust",
    description:
      "Share one JD. Get a curated, assessed intern shortlist in 7-12 days.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KalviumX",
  url: SITE_URL,
  parentOrganization: {
    "@type": "Organization",
    name: "Kalvium",
    url: "https://kalvium.com",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9483-200-300",
    contactType: "sales",
  },
  description:
    "Enterprise intern hiring from Kalvium's work-integrated B.Tech ecosystem - pre-assessed, JD-matched, mentor-managed engineering talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
