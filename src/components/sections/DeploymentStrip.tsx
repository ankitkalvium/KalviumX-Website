import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { deploymentSteps } from "@/lib/data";

export default function DeploymentStrip() {
  return (
    <section className="border-y border-line">
      <div className="container-x">
        <div className="relative mb-10 text-center">
          <SectionHeading
            eyebrow="Deployment"
            title={
              <>
                JD to deployed intern in <span className="red-pill">12 days</span>
              </>
            }
            align="center"
          />
          <Link
            href="/deployment-model"
            className="absolute top-0 right-0 text-sm font-extrabold text-red inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap"
          >
            See the full deployment model <span aria-hidden>→</span>
          </Link>
        </div>
        <Reveal>
          <div className="relative">
            <div className="hidden lg:block absolute top-[22px] left-[10%] right-[10%] h-0.5 bg-line" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {deploymentSteps.map((step, i) => (
                <div key={step.day} className="relative text-center">
                  <div className="relative z-10 w-11 h-11 mx-auto rounded-full bg-red text-white grid place-items-center font-black text-sm mb-3">
                    {i + 1}
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#888] mb-1">
                    {step.day}
                  </div>
                  <div className="font-extrabold text-[15px] tracking-[-0.02em]">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
