export type Role = {
  slug: string;
  title: string;
  shortTitle: string;
  stack: string[];
  summary: string;
  description: string;
  responsibilities: string[];
  readiness: { label: string; value: string }[];
};

export const roles: Role[] = [
  {
    slug: "full-stack-engineers",
    title: "Full-Stack Engineering Interns",
    shortTitle: "Full-Stack",
    stack: ["React", "Node.js", "MongoDB", "REST APIs", "Git"],
    summary:
      "Ship end-to-end features across frontend and backend with stack-matched training before deployment.",
    description:
      "Full-stack interns come trained on modern JavaScript frameworks, REST API design, and database fundamentals. Before deployment, each student completes a 2-3 week bootcamp aligned to your specific stack and codebase conventions.",
    responsibilities: [
      "Build and ship UI components in React",
      "Develop and consume REST APIs with Node.js",
      "Work with MongoDB / SQL data models",
      "Participate in sprint planning, code review, and standups",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "82%" },
      { label: "Full-stack project proof points", value: "3+" },
      { label: "Time to first sprint contribution", value: "12 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
  {
    slug: "backend-engineers",
    title: "Backend Engineering Interns",
    shortTitle: "Backend",
    stack: ["Java", "Python", "Spring", "REST APIs", "DBMS"],
    summary:
      "Server-side talent trained on OOP fundamentals, database design, and API architecture.",
    description:
      "Backend interns are trained on Java and Python fundamentals, relational and NoSQL databases, and service-oriented API design. They are mapped to your backend stack and given codebase-specific onboarding before joining.",
    responsibilities: [
      "Design and build REST APIs",
      "Write and optimize database queries",
      "Implement business logic and data validation",
      "Write unit and integration tests",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "80%" },
      { label: "API and data project proof points", value: "3+" },
      { label: "Time to first sprint contribution", value: "12 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
  {
    slug: "frontend-engineers",
    title: "Frontend Engineering Interns",
    shortTitle: "Frontend",
    stack: ["React", "JavaScript", "TypeScript", "UI Integration"],
    summary:
      "Interface-focused talent trained to translate designs into production-quality, responsive UI.",
    description:
      "Frontend interns are trained on component architecture, state management, responsive design, and integration with backend APIs. They are assessed on UI fidelity, accessibility basics, and code quality.",
    responsibilities: [
      "Implement responsive UI from design specs",
      "Integrate frontend with REST/GraphQL APIs",
      "Maintain component libraries and design systems",
      "Debug cross-browser and performance issues",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "81%" },
      { label: "UI component project proof points", value: "3+" },
      { label: "Time to first sprint contribution", value: "12 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
  {
    slug: "qa-automation-interns",
    title: "QA / Automation-Ready Interns",
    shortTitle: "QA & Automation",
    stack: ["Test Design", "Bug Reporting", "Automation Basics", "API Testing"],
    summary:
      "Quality-focused talent with a strong testing mindset and automation fundamentals.",
    description:
      "QA interns are trained on manual test case design, defect lifecycle, and the fundamentals of automation tooling. They are mapped to your QA workflows and ticketing systems during the pre-deployment bootcamp.",
    responsibilities: [
      "Write and execute test cases",
      "Log, triage, and track defects",
      "Support automation script development",
      "Validate API responses and edge cases",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "78%" },
      { label: "Test and defect project proof points", value: "2+" },
      { label: "Time to first sprint contribution", value: "14 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
  {
    slug: "product-engineering-interns",
    title: "Product Engineering Interns",
    shortTitle: "Product Engineering",
    stack: ["Internal Tools", "Workflow Automation", "AI Apps"],
    summary:
      "Generalist builders for internal tools, workflow automation, and AI-driven product features.",
    description:
      "Product engineering interns work across the stack to build internal tools, automate workflows, and ship AI-assisted features. They are trained on rapid prototyping, API integration, and product thinking fundamentals.",
    responsibilities: [
      "Build internal tools and dashboards",
      "Automate manual workflows",
      "Prototype and ship AI-assisted features",
      "Collaborate directly with product and ops teams",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "80%" },
      { label: "Tool and automation project proof points", value: "3+" },
      { label: "Time to first sprint contribution", value: "12 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
  {
    slug: "ai-ml-engineering-interns",
    title: "AI/ML Engineering Interns",
    shortTitle: "AI/ML",
    stack: ["Python", "LangChain", "RAG", "PyTorch", "Prompt Engineering"],
    summary:
      "Applied AI/ML talent trained on LLM integration, RAG pipelines, and model evaluation for production workflows.",
    description:
      "AI/ML interns are assessed on Python fluency, LLM API integration, RAG pipeline fundamentals, and prompt engineering patterns. They are matched to teams building GenAI-assisted features, internal AI tools, or model evaluation workflows.",
    responsibilities: [
      "Build and evaluate RAG pipelines and LLM-powered features",
      "Implement prompt engineering patterns for production use cases",
      "Integrate AI APIs into existing product workflows",
      "Evaluate model outputs against defined quality benchmarks",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "79%" },
      { label: "AI/ML and RAG project proof points", value: "2+" },
      { label: "Time to first sprint contribution", value: "14 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
  {
    slug: "cloud-devops-interns",
    title: "Cloud / DevOps Interns",
    shortTitle: "Cloud/DevOps",
    stack: ["Kubernetes", "Terraform", "ArgoCD", "CI/CD", "AWS/GCP"],
    summary:
      "Infrastructure-focused talent trained on container orchestration, IaC, and CI/CD pipelines for production environments.",
    description:
      "Cloud/DevOps interns are assessed on containerisation fundamentals, Terraform-based IaC, and CI/CD pipeline design. They are matched to teams managing cloud infrastructure, deployment pipelines, or internal platform tooling.",
    responsibilities: [
      "Build and maintain CI/CD pipelines",
      "Write and review Terraform infrastructure modules",
      "Support Kubernetes cluster operations and deployments",
      "Assist with cloud cost monitoring and resource governance",
    ],
    readiness: [
      { label: "JD assessment score (avg)", value: "78%" },
      { label: "Cloud and IaC project proof points", value: "2+" },
      { label: "Time to first sprint contribution", value: "14 days" },
      { label: "Year 2 weekly availability", value: "30 hrs" },
    ],
  },
];

export type CaseStudy = {
  slug: string;
  company: string;
  region: string;
  industry: string;
  role: string;
  problem: string;
  headline: string;
  summary: string;
  context?: string;
  challenge: string;
  model: string;
  outcome: string;
  signal?: string;
  bulletPoints?: string[];
  executiveTakeaway?: string;
  duration: string;
  accent: "retention" | "efficiency" | "genai";
  stat: { label: string; value: string }[];
  timeline: { step: string; title: string; copy: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "zero-attrition-hr-tech",
    company: "HR-Tech Enterprise",
    region: "United Kingdom",
    industry: "HR-Tech",
    role: "Engineering apprentices",
    problem: "High intern attrition was resetting team continuity every 6-9 months, forcing repeated hiring and re-onboarding cycles.",
    headline: "How a UK HR-Tech enterprise eliminated intern attrition across 36 months",
    summary:
      "A structured apprentice deployment built on work-integrated learning, academic accountability, and a continuous mentor-company feedback loop.",
    context:
      "The team had run conventional intern programs for two years. Each intake completed a short placement window then disengaged or left, forcing the team to restart hiring, re-onboard new people, and rebuild institutional context. The cost was not just financial. Every exit reset the codebase familiarity and team rhythm the previous intern had built.",
    challenge:
      "The team needed apprentice-level engineering capacity that could sustain contribution across multiple product cycles, not just a single placement window. The structural problem: traditional programs give learners no professional reason to stay. Disengagement carried no academic consequence, so the company absorbed all the risk.",
    model:
      "KalviumX deployed apprentices whose B.Tech academic progress was directly tied to enterprise contribution. Work performance fed into their degree assessment. Kalvium mentors translated company feedback into academic signals, creating an early-intervention loop before disengagement could take hold. The company owned the work allocation and code review. Kalvium owned the accountability and intervention.",
    outcome:
      "The deployment sustained zero attrition across 36 months and three consecutive cohort cycles. The team stopped planning around placement windows and started treating the KalviumX pipeline as a continuous capacity layer, scheduling product work around apprentice availability rather than scrambling to backfill exits.",
    bulletPoints: [
      "From repeated resets every 6–9 months",
      "to 0% attrition across 36 months",
    ],
    executiveTakeaway:
      "A work-integrated, accountable model that connects company work, mentor oversight and academic rigour can eliminate intern attrition and deliver compounding team impact.",
    duration: "36 months",
    accent: "retention",
    stat: [
      { label: "Intern attrition", value: "0%" },
      { label: "Continuous engagement", value: "36 months" },
      { label: "Cohort cycles", value: "3" },
      { label: "Previous reset cycle", value: "6–9 mo" },
    ],
    timeline: [
      { step: "01", title: "JD alignment", copy: "The team defined what 'productive in month two' actually meant for their codebase, not just the job description. That brief drove every downstream filter." },
      { step: "02", title: "Talent curation", copy: "The pool was scored against stack fit, project output, and professionalism signals. Five profiles reached the team. Not fifty. No resume triage." },
      { step: "03", title: "Readiness", copy: "Shortlisted apprentices completed a 2-week context sprint covering codebase conventions, ticketing workflow, and communication norms before day one." },
      { step: "04", title: "Final selects", copy: "The enterprise ran one technical review round. Two apprentices joined the first cohort." },
      { step: "05", title: "Deployment", copy: "Kalvium mentors attended the first retrospectives and stayed attached. The 36-month feedback loop was structured from week one, not bolted on after a problem surfaced." },
    ],
  },
  {
    slug: "cost-efficient-bfsi-deployment",
    company: "Global BFSI Major",
    region: "United States",
    industry: "Banking & Financial Services",
    role: "MERN engineering deployment",
    problem: "Tier-1 engineering capacity was too expensive to scale without reducing expected output.",
    headline: "How a global BFSI team reduced engineering talent cost by ~60%",
    summary:
      "A MERN engineering deployment structured to reduce talent cost while preserving the output expected from Tier-1 engineering talent.",
    context:
      "The team was scaling product engineering capacity to support new banking product lines. The default path was Tier-1 engineering channels, but cost per engineer was making it difficult to justify headcount expansion at the pace the roadmap required. The question was whether engineering quality could be sustained at a meaningfully lower cost point, without increasing management overhead to compensate.",
    challenge:
      "The team needed MERN engineers who could contribute to live product workflows at Tier-1 output standards. The concern was not just cost. It was whether a cost-optimised deployment could operate at the same standard without adding friction to the engineering team's existing sprint cadence and review processes.",
    model:
      "KalviumX deployed MERN engineers assessed against the company's specific stack and productivity benchmark. Each engineer was evaluated on React component architecture, Node.js API patterns, and MongoDB data modelling before deployment. The Kalvium mentor layer ran monthly structured reviews aligned to the team's existing performance signals, so output visibility remained high without adding management load.",
    outcome:
      "The deployment delivered approximately 60% cost efficiency against the Tier-1 benchmark, with no reduction in engineering output. Sprint velocity and code review standards were maintained across the cohort. The company treated the deployment as a repeatable model for scaling product engineering capacity without resetting the cost structure.",
    bulletPoints: [
      "From Tier-1 talent costs that were blocking headcount growth",
      "to ~60% cost efficiency with no engineering output trade-off",
    ],
    executiveTakeaway:
      "Cost-optimised engineering capacity can match Tier-1 output when talent is assessed against the actual role standard, deployed into live workflows, and supported with an active performance oversight layer. The trade-off assumption does not hold when the selection and governance model is right.",
    duration: "Ongoing deployment",
    accent: "efficiency",
    stat: [
      { label: "Cost vs Tier-1 benchmark", value: "~60%" },
      { label: "Performance trade-off", value: "Zero" },
      { label: "Engineering capability", value: "MERN" },
    ],
    timeline: [
      { step: "01", title: "Benchmark set", copy: "The engagement brief centred on one question: could assessed MERN talent meet the same production standard as the Tier-1 engineers already on the team? That benchmark became the filter for every subsequent step." },
      { step: "02", title: "Talent curation", copy: "The talent pool was mapped to the MERN brief and each candidate was scored on stack proficiency, GitHub project output, and professionalism signals before the shortlist was assembled." },
      { step: "03", title: "Assessment", copy: "Shortlisted engineers completed a MERN assessment built from the JD, covering React component design, Node.js API patterns, and MongoDB query work. Mentor commentary accompanied each result." },
      { step: "04", title: "Final selects", copy: "The engineering lead reviewed scored results and mentor notes. One technical interview round was run against the team's existing interview standard before the cohort was confirmed." },
      { step: "05", title: "Deployment", copy: "Engineers joined live sprint cycles from day one. Performance was tracked against the same Tier-1 benchmark set at the start, keeping the cost-versus-output question answerable throughout." },
    ],
  },
  {
    slug: "genai-upskilling-saas",
    company: "B2B SaaS Firm",
    region: "Japan",
    industry: "B2B SaaS",
    role: "MERN + GenAI",
    problem: "The existing engineering deployment lacked practical GenAI readiness for new product work.",
    headline: "How a Japan B2B SaaS firm closed its GenAI capability gap in four weeks",
    summary:
      "An existing MERN deployment was extended with focused prompt and GenAI capability aligned to the company's evolving product needs.",
    context:
      "The team had a working MERN engineering deployment contributing to core product features. A new product roadmap required engineers who could build and evaluate GenAI-assisted workflows, but the existing talent had no structured GenAI exposure. Restarting the hiring motion or waiting for a traditional upskilling cycle was not viable against the product timeline. The team needed a fast, applicable intervention on top of an already-performing engineering foundation.",
    challenge:
      "Generic prompt courses would not transfer to the team's specific product workflows. The intervention had to be fast, product-context-aware, and validated against real engineering output rather than course completion metrics. The existing deployment was already productive and could not absorb a full programme pause.",
    model:
      "KalviumX designed a four-week focused upskilling sprint layered on top of the existing MERN engagement. Each week connected prompt fundamentals, model interaction patterns, and applied GenAI workflows directly to the company's product context. Engineers practiced the capability in live product workflows. Deliverables were evaluated by the team's own engineering standards, not by course scores, so readiness was measured against what actually mattered.",
    outcome:
      "At the end of the four-week sprint, the engineering team demonstrated applied GenAI readiness across the mapped product use cases. The company sanctioned 12 additional hires immediately, treating the upskilled cohort as proof that the KalviumX model could add new capability to an existing deployment without rebuilding the talent pipeline from scratch.",
    bulletPoints: [
      "From a GenAI capability gap blocking the product roadmap",
      "to 12 additional hires sanctioned after a four-week sprint",
    ],
    executiveTakeaway:
      "Adding new capability to an existing engineering deployment is faster and more effective than restarting a hiring motion. A focused, product-aligned upskilling intervention can demonstrate readiness in four weeks and provide the evidence needed to expand the engagement with confidence.",
    duration: "4-week upskilling",
    accent: "genai",
    stat: [
      { label: "Upskilling duration", value: "4 weeks" },
      { label: "Hires sanctioned post-sprint", value: "12" },
      { label: "Capability added", value: "GenAI" },
    ],
    timeline: [
      { step: "01", title: "Gap identified", copy: "The product team mapped where the existing MERN deployment had no GenAI coverage against the new roadmap. Specific product use cases requiring the capability were documented." },
      { step: "02", title: "Sprint designed", copy: "KalviumX built a four-week curriculum aligned to the company's product context, not a generic prompt course. Week-by-week deliverables were agreed with the engineering lead." },
      { step: "03", title: "Foundation weeks", copy: "Weeks one and two covered prompt fundamentals, context handling, and model interaction patterns, applied directly to the team's product workflows and existing codebase." },
      { step: "04", title: "Applied practice", copy: "Weeks three and four shifted to GenAI workflow prototyping and output evaluation. Engineers submitted deliverables reviewed against the team's own engineering standards." },
      { step: "05", title: "Hiring expanded", copy: "The team-led capability review confirmed applied readiness. The enterprise sanctioned 12 additional hires and extended the KalviumX engagement." },
    ],
  },
];

export const navLinks = [
  { href: "/roles", label: "Roles" },
  { href: "/deployment-model", label: "How It Works" },
  { href: "/for-gccs", label: "For Enterprise" },
  { href: "/case-studies", label: "Results" },
  { href: "/commercials", label: "Pricing" },
];

// Fixed role options for the lead form dropdown — keeps CRM data clean and typo-free.
export const roleOptions = [
  "Full-Stack (React, Node)",
  "Frontend (React, UI)",
  "Backend (Java, Python, APIs)",
  "AI / ML / Data",
  "Cloud / DevOps",
  "Mobile (Android, iOS, RN)",
  "QA / Automation",
  "Product Engineering",
  "Other / Not sure yet",
] as const;

export const trustLogos = [
  "7-Eleven",
  "Lowe's",
  "PhonePe",
  "Rupeek",
  "TATA 1mg",
  "Indegene",
  "Maersk",
  "Josys",
  "Axtria",
  "Morgan Stanley",
  "ThoughtWorks",
  "Commvault",
];

export type Faq = { q: string; a: string };

export const faqsGeneral: Faq[] = [
  {
    q: "What exactly is KalviumX?",
    a: "KalviumX is the enterprise hiring arm of Kalvium's work-integrated B.Tech program. Companies get access to engineering students who are pre-assessed, JD-matched and mentor-managed - built for intern-to-FTE conversion.",
  },
  {
    q: "How is this different from campus hiring?",
    a: "Campus drives give you volume; KalviumX gives you signal. Instead of screening hundreds of resumes, you interview a small shortlist already assessed against your JD with project proof and mentor notes attached.",
  },
  {
    q: "How many hours per week can interns commit?",
    a: "Year 2 students commit 30 hours/week, Monday to Friday, remote. From Year 3 onward, students move to full-time onsite engagements.",
  },
  {
    q: "Which roles are NOT a good fit for KalviumX talent?",
    a: "Pure data analyst, advanced cybersecurity, and specialist UI/UX research roles are not part of the core program unless paired with a dedicated bootcamp track.",
  },
];

export const faqsProcess: Faq[] = [
  {
    q: "How fast can we get a shortlist after sharing a JD?",
    a: "We respond the same working day and deliver a curated, pre-assessed shortlist in under 48 hours of receiving your JD.",
  },
  {
    q: "What does the talent assessment involve?",
    a: "10 MCQs plus 2 coding tasks aligned to your JD, reviewed with mentor notes. You can also add your own interview rounds on top of the shortlist.",
  },
  {
    q: "Who manages the intern day-to-day?",
    a: "Your team owns work allocation and code review. Kalvium owns fundamentals, mentor interventions and the monthly feedback loop - so performance gaps are caught early without burdening your managers.",
  },
  {
    q: "What happens if the fit isn't right?",
    a: "Mentors track performance through a monthly feedback loop and intervene early. If the fit genuinely isn't right, KalviumX provides replacement support with minimal friction.",
  },
];

export const faqsPricing: Faq[] = [
  {
    q: "What is included in the monthly cost?",
    a: "The total monthly cost per intern covers two components: the intern's stipend (paid to the student) and a ₹10,000 KalviumX program management fee. The program fee covers mentor oversight, structured performance reviews, cohort management, and end-to-end deployment support. There is no one-time placement or recruitment commission.",
  },
  {
    q: "When do we see exact numbers?",
    a: "Exact stipend figures and totals are shared in a commercial sheet tailored to your role, stack and intern count - usually within 1-2 business days of your request. The ₹10,000 program management fee is fixed per intern per month.",
  },
  {
    q: "Is there a cost to convert an intern to full-time?",
    a: "The model is built for conversion - performance notes from the engagement feed directly into your FTE decision. Conversion terms are covered in the commercial sheet.",
  },
  {
    q: "What's the minimum engagement?",
    a: "Engagements are structured year-wise starting from Year 2 (30 hrs/week remote). Pilot cohorts can start small - many companies begin with 2-5 interns.",
  },
  {
    q: "Can we engage interns across multiple year cohorts simultaneously?",
    a: "Yes. Companies often run a mix - Year 2 interns for exploratory or support work (30 hrs/week) alongside Year 3 or Year 4 interns on full-time delivery tracks. Pricing is per intern per month regardless of cohort mix.",
  },
];

export const faqsGcc: Faq[] = [
  {
    q: "Can KalviumX support multi-quarter headcount planning?",
    a: "Yes. Because the pipeline is continuous, GCCs can plan cohort intakes quarter by quarter instead of running one-off hiring drives.",
  },
  {
    q: "How does governance reporting work?",
    a: "Monthly structured performance reviews per intern roll up into cohort-level reporting your leadership can share with global stakeholders.",
  },
  {
    q: "Can the bootcamp align to our internal tooling and compliance training?",
    a: "Yes. The 2-3 week pre-deployment bootcamp is company-specific - internal tools, codebase context, workflows and any mandatory compliance modules.",
  },
];

export type DeploymentStep = {
  day: string;
  title: string;
  desc: string;
  detail: string;
};

export const deploymentSteps: DeploymentStep[] = [
  {
    day: "Day 0-1",
    title: "Role discovery",
    desc: "JD, stack, team context and expected output.",
    detail:
      "A quick call with your hiring manager captures the role, tech stack, team structure, codebase maturity and what 'productive' looks like in month one. This brief drives everything downstream.",
  },
  {
    day: "Day 2-4",
    title: "Talent mapping",
    desc: "Ranked shortlist based on skills, projects, GitHub activity, course performance and professionalism.",
    detail:
      "HEROS data filters the student pool against your brief - stack proficiency, project output, GitHub activity, professionalism band and availability. You never see the full pool, only the relevant slice.",
  },
  {
    day: "Day 5-7",
    title: "Talent assessment",
    desc: "10 MCQs plus 2 coding tasks aligned to your JD, reviewed with mentor notes.",
    detail:
      "Mapped candidates take an assessment built from your JD - 10 MCQs and 2 coding tasks. Results come back scored, with mentor commentary on strengths and watch-outs per candidate.",
  },
  {
    day: "Day 8-11",
    title: "Final selects",
    desc: "Your team interviews shortlisted candidates and confirms the hire.",
    detail:
      "Shortlisted candidates complete your interview rounds. Results come back with mentor commentary on strengths and readiness. You make the final call on who joins.",
  },
  {
    day: "Day 12",
    title: "Deployment",
    desc: "Intern joins your team with mentor oversight and monthly performance reporting.",
    detail:
      "Interns join your standups and sprints. Kalvium mentors stay attached - weekly check-ins, monthly structured reviews to your team, and early intervention if anything drifts.",
  },
];

export const announcements = [
  "Campus drives give you volume. KalviumX gives you signal.",
  "Share one JD. Get an assessed shortlist in under 48 hours.",
  "Year 2 interns contribute 30 hrs/week - mentor-managed.",
  "Mentor-managed. Performance-tracked. Conversion-ready.",
];

export type Testimonial = {
  persona: string;
  question: string;
  quote: string;
  name: string;
  title: string;
  image?: string;
};

export const testimonials: Testimonial[] = [
  {
    persona: "CTO / Engineering Leader",
    question: "Can this person contribute to production?",
    quote:
      "Kalvium's talent consistently translates learning into execution, with meaningful contributions early on, and the confidence to navigate hard problems.",
    name: "Amar Prabhu",
    title: "CTO, Rupeek",
    image: "https://x.kalvium.com/wp-content/uploads/2026/03/Amar-Prabhu-k.webp",
  },
  {
    persona: "Enterprise / CCO",
    question: "Does the talent transition to production teams?",
    quote:
      "By prioritizing real-world development practice over language-centric learning, Kalvium delivers talent that transitions seamlessly into production teams.",
    name: "Sarv Saravanan",
    title: "CCO, Commvault",
    image: "https://x.kalvium.com/wp-content/uploads/2026/03/sarv.jpg",
  },
  {
    persona: "Founder / Operator",
    question: "Is Kalvium's model genuinely different?",
    quote:
      "Kalvium's approach to the bachelor's degree is genuinely disruptive. Traditional universities should be taking notes.",
    name: "Shiv Deepak",
    title: "Ex-Founder, Aeroh",
    image: "https://x.kalvium.com/wp-content/uploads/2026/03/shiv.jpg",
  },
];

export type Metric = { value: number; prefix?: string; suffix: string; label: string };

export const metrics: Metric[] = [
  { value: 200, suffix: "+", label: "enterprise teams onboarded" },
  { value: 12, suffix: " days", label: "from JD to deployed intern" },
  { value: 36, suffix: " months", label: "talent supply ahead of demand" },
];
