import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How KalviumX collects, uses and protects the information you share with us.",
};

const sections = [
  {
    title: "What we collect",
    body: "When you submit a form on this site we collect the details you provide: work email, role requirements, intern count, internship duration and any notes you add. We also collect standard technical data such as pages visited, in aggregate.",
  },
  {
    title: "How we use it",
    body: "Your information is used solely to respond to your enquiry - mapping talent against your JD, preparing commercial sheets and coordinating the pilot process. We do not sell your data or add you to unrelated marketing lists.",
  },
  {
    title: "Who can access it",
    body: "Submitted details are accessible to the KalviumX program and partnerships team. Where we use service providers (for example CRM or email tooling), they process data only on our instructions.",
  },
  {
    title: "Retention",
    body: "We keep enquiry data for as long as needed to serve the engagement and meet legal obligations, then delete or anonymise it.",
  },
  {
    title: "Your choices",
    body: "You can ask us to update or delete your information at any time by contacting us at the phone number listed on this site or replying to any email from our team.",
  },
];

export default function PrivacyPage() {
  return (
    <section>
      <div className="container-x max-w-3xl">
        <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
          Legal
        </span>
        <h1 className="text-[clamp(34px,4.5vw,54px)] font-black tracking-[-0.05em] leading-[1.08] mb-4">
          Privacy Policy
        </h1>
        <p className="text-[#555] text-sm font-semibold mb-10">
          Last updated: June 2026
        </p>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-extrabold tracking-[-0.03em] mb-2.5">{section.title}</h2>
              <p className="text-[#333] text-[15px] leading-relaxed font-medium">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
