import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  {
    label: "Web Engineering",
    roles: [
      { name: "Full-Stack", stacks: ["React", "Node.js", "MongoDB", "REST APIs", "Git"] },
      { name: "Frontend", stacks: ["React", "JavaScript", "TypeScript", "Tailwind"] },
      { name: "Backend", stacks: ["Java", "Python", "Spring", "REST APIs", "DBMS"] },
    ],
  },
  {
    label: "AI & Product",
    roles: [
      { name: "AI / ML Engineering", stacks: ["Python", "LangChain", "RAG", "PyTorch", "Prompt Engineering"] },
      { name: "Product Engineering", stacks: ["Internal Tools", "Workflow Automation", "AI Apps", "API Integration"] },
    ],
  },
  {
    label: "Infrastructure & Quality",
    roles: [
      { name: "Cloud & DevOps", stacks: ["Kubernetes", "Terraform", "ArgoCD", "CI/CD", "AWS / GCP"] },
      { name: "QA & Automation", stacks: ["Test Design", "Automation Basics", "API Testing", "Bug Reporting"] },
    ],
  },
];

export default function RolesGrid() {
  return (
    <section className="border-b border-line bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Roles"
          align="center"
          title={<>Hire interns for <span className="red-pill">real engineering work</span></>}
          copy="Not every student is shown for every role. Each profile is mapped against your JD before it reaches your shortlist."
        />

        <div className="mt-12 grid lg:grid-cols-3 gap-6 pb-4">
          {categories.map((cat) => (
            <div key={cat.label} className="rounded-2xl border border-line bg-soft p-6">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-5">
                {cat.label}
              </div>
              <div className="space-y-5">
                {cat.roles.map((role) => (
                  <div key={role.name}>
                    <div className="text-[14px] font-extrabold text-ink mb-2">{role.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.stacks.map((s) => (
                        <span
                          key={s}
                          className="bg-white border border-line rounded-full px-3 py-1 text-[11px] font-bold text-[#444]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center pb-6 text-[12px] text-[#888] font-semibold">
          Not recommended for: pure data-analyst, advanced cybersecurity, or specialist UI/UX research roles.
        </p>
      </div>
    </section>
  );
}
