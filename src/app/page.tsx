import Hero from "@/components/sections/Hero";
import ProofBand from "@/components/sections/ProofBand";
import MetricsBand from "@/components/sections/MetricsBand";
import ProblemSection from "@/components/sections/ProblemSection";
import GradeSection from "@/components/sections/GradeSection";
import ModelSteps from "@/components/sections/ModelSteps";
import SampleProfile from "@/components/sections/SampleProfile";
import RolesGrid from "@/components/sections/RolesGrid";
import DeploymentStrip from "@/components/sections/DeploymentStrip";
import WhyItWorks from "@/components/sections/WhyItWorks";
import BackersSection from "@/components/sections/BackersSection";
import Testimonials from "@/components/sections/Testimonials";
import CompareSection from "@/components/sections/CompareSection";
import RiskCommercial from "@/components/sections/RiskCommercial";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CTASection from "@/components/sections/CTASection";
import { faqsGeneral } from "@/lib/data";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsGeneral.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <ProofBand />
      <MetricsBand />
      <ProblemSection />
      <GradeSection />
      <ModelSteps />
      <SampleProfile />
      <RolesGrid />
      <DeploymentStrip />
      <WhyItWorks />
      <BackersSection />
      <Testimonials />
      <CompareSection />
      <RiskCommercial />
      <FaqAccordion
        faqs={faqsGeneral}
        title={
          <>
            Questions hiring teams <span className="red-pill">ask us</span>
          </>
        }
      />
      <CTASection />
    </>
  );
}
