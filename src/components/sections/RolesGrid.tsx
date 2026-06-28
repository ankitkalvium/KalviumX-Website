import SectionHeading from "@/components/ui/SectionHeading";
import RoleIcon from "@/components/ui/RoleIcon";

const roleTiles = [
  {
    name: "GenAI Engineering",
    icon: "AI/ML",
    label: "Priority capability",
    description:
      "Build RAG workflows, LLM integrations, AI agents, evaluation pipelines, and production-ready GenAI features.",
    stacks: ["Python", "RAG", "LangChain", "AI Agents", "LLM Evaluation"],
    featured: true,
  },
  {
    name: "Full-Stack",
    icon: "Full-Stack",
    label: "Web engineering",
    description:
      "Deliver complete product features across modern interfaces, APIs, and application data layers.",
    stacks: ["React", "Node.js", "MongoDB", "REST APIs"],
  },
  {
    name: "Frontend",
    icon: "Frontend",
    label: "Web engineering",
    description:
      "Translate product designs into responsive, accessible, production-quality interfaces.",
    stacks: ["React", "JavaScript", "TypeScript", "UI Integration"],
  },
  {
    name: "Backend",
    icon: "Backend",
    label: "Core engineering",
    description:
      "Build reliable services, business logic, database workflows, and scalable API foundations.",
    stacks: ["Java", "Python", "Spring", "REST APIs", "DBMS"],
  },
  {
    name: "Cloud & DevOps",
    icon: "Cloud/DevOps",
    label: "Infrastructure",
    description:
      "Support cloud environments, infrastructure automation, deployment pipelines, and platform operations.",
    stacks: ["Kubernetes", "Terraform", "CI/CD", "AWS / GCP"],
  },
  {
    name: "QA & Automation",
    icon: "QA & Automation",
    label: "Quality engineering",
    description:
      "Strengthen product quality through test design, API validation, defect analysis, and automation.",
    stacks: ["Test Design", "API Testing", "Automation", "Bug Reporting"],
  },
];

export default function RolesGrid() {
  return (
    <section id="roles" className="border-b border-line bg-white scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Roles"
          align="center"
          title={<>Hire interns for <span className="red-pill">real engineering work</span></>}
          copy="Not every student is shown for every role. Each profile is mapped against your JD before it reaches your shortlist."
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-4">
          {roleTiles.map((role) => (
            <article
              key={role.name}
              className={`relative overflow-hidden rounded-xl border p-6 sm:p-7 ${
                role.featured
                  ? "border-red bg-ink text-white"
                  : "border-line bg-white"
              }`}
            >
              {role.featured && (
                <div
                  className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full border-[18px] border-red/20"
                  aria-hidden
                />
              )}

              <div className="relative flex items-start justify-between gap-4">
                <RoleIcon type={role.icon} className="w-10 h-10" />
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                    role.featured ? "text-red" : "text-[#777]"
                  }`}
                >
                  {role.label}
                </span>
              </div>

              <h3 className="relative mt-7 text-xl sm:text-2xl font-black tracking-[-0.04em]">
                {role.name}
              </h3>
              <p
                className={`relative mt-3 text-sm leading-relaxed font-medium ${
                  role.featured ? "text-white/70" : "text-[#4b4b4b]"
                }`}
              >
                {role.description}
              </p>

              <div className="relative mt-5 flex flex-wrap gap-1.5">
                {role.stacks.map((stack) => (
                  <span
                    key={stack}
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                      role.featured
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-line bg-soft text-[#444]"
                    }`}
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="text-center pb-6 text-[12px] text-[#888] font-semibold">
          Final role and stack fit is mapped directly against your JD before shortlist creation.
        </p>
      </div>
    </section>
  );
}
