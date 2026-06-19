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
      <HerosSection />
    </>
  );
}
