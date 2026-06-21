import type { Metadata } from "next";
import { faqsProcess } from "@/lib/data";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How KalviumX Works: Deployment Model + Talent Model",
  description:
    "Two interlocking models. The Talent Model builds engineers inside 18 partner universities from Semester 3. The Deployment Model puts them in your team in 12 days.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsProcess.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function DeploymentModelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HowItWorksClient />
    </>
  );
}
