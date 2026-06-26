import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StickyCTA from "@/components/layout/StickyCTA";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// x.kalvium.com is an unrelated WordPress site, not this project — there is
// no custom domain wired up yet, so metadataBase must point at the actual
// live URL or every absolute OG/Twitter image link 404s.
const SITE_URL = "https://kalvium-x-website.vercel.app";

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
      "Share one JD. Get a curated, assessed intern shortlist in under 48 hours.",
  },
  verification: {
    google: "rl0rXr2IaOXcX5wlLWupdrXIjz4bnfv7fEUGm_DlgbA",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KalviumX",
  url: SITE_URL,
  sameAs: [
    "https://kalvium.com",
    "https://www.linkedin.com/company/kalvium",
  ],
  parentOrganization: {
    "@type": "Organization",
    name: "Kalvium",
    url: "https://kalvium.com",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9483-200-300",
    contactType: "sales",
    areaServed: ["IN", "US", "GB", "JP"],
    availableLanguage: "English",
  },
  description:
    "Enterprise intern hiring from Kalvium's work-integrated B.Tech ecosystem - pre-assessed, JD-matched, mentor-managed engineering talent.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "KalviumX Engineering Intern Deployment",
  provider: {
    "@type": "Organization",
    name: "KalviumX",
    url: SITE_URL,
  },
  description:
    "Curated, pre-assessed engineering interns deployed with mentor management, monthly feedback loops, and intern-to-FTE conversion paths. JD to deployed intern in 12 days.",
  serviceType: "Engineering Intern Hiring Platform",
  areaServed: ["IN", "US", "GB", "JP"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Engineering Intern Roles",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full-Stack Engineering Interns" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Backend Engineering Interns" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Frontend Engineering Interns" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI/ML Engineering Interns" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cloud/DevOps Engineering Interns" } },
    ],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyCTA />
        <SpeedInsights />
      </body>
    </html>
  );
}
