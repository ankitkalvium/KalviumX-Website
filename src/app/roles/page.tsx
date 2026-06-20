import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import RoleExplorer from "@/components/sections/RoleExplorer";
import HerosSection from "@/components/sections/HerosSection";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Roles | KalviumX",
  description:
    "Explore engineering intern roles available through KalviumX - filter by stack across full-stack, backend, frontend, QA and product engineering.",
};

export default function RolesPage() {
  return (
    <>
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <SectionHeading
            eyebrow="Role Explorer"
            title={
              <>
                Find the exact talent your team needs.{" "}
                <span className="red-pill">Filter by stack.</span>
              </>
            }
            copy="Search and filter the KalviumX role catalog. Every profile behind these roles is mapped against your JD before it reaches your shortlist."
          />
          <div className="mt-7">
            <Button href="/start-a-pilot">Share a JD</Button>
          </div>
        </div>
      </section>
      <RoleExplorer />

      <section className="border-y border-line bg-soft">
        <div className="container-x">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line text-center">
            <div className="px-6 py-8">
              <strong className="block text-4xl font-black tracking-[-0.05em] text-red">0%</strong>
              <span className="block text-xs font-bold text-[#555] mt-1.5 uppercase tracking-[0.12em]">intern attrition across 36 months</span>
            </div>
            <div className="px-6 py-8">
              <strong className="block text-4xl font-black tracking-[-0.05em] text-red">~60%</strong>
              <span className="block text-xs font-bold text-[#555] mt-1.5 uppercase tracking-[0.12em]">cost efficiency vs Tier-1 benchmark</span>
            </div>
            <div className="px-6 py-8">
              <strong className="block text-4xl font-black tracking-[-0.05em] text-red">12 days</strong>
              <span className="block text-xs font-bold text-[#555] mt-1.5 uppercase tracking-[0.12em]">JD to deployed intern</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x grid md:grid-cols-2 gap-6">
          <div className="border border-line rounded-lg p-8 bg-white">
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-4">Pre-deployment bootcamp</div>
            <h3 className="text-xl font-extrabold tracking-[-0.03em] mb-3">Every intern is context-ready before Day 1.</h3>
            <p className="text-[15px] font-medium text-[#444] leading-relaxed">A 2-3 week company-specific sprint covering your stack, codebase conventions, tooling, and any compliance training you require. No ramp-up tax on your team.</p>
          </div>
          <div className="border border-line rounded-lg p-8 bg-white">
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-4">FTE conversion path</div>
            <h3 className="text-xl font-extrabold tracking-[-0.03em] mb-3">The engagement is built for conversion.</h3>
            <p className="text-[15px] font-medium text-[#444] leading-relaxed">Performance notes from the monthly feedback loop feed directly into your FTE decision. Year 3 students transition to full-time onsite. Conversion terms are covered in the commercial sheet.</p>
          </div>
        </div>
      </section>

      <HerosSection />
    </>
  );
}
