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
      { label: "Project proof points", value: "3+" },
      { label: "Deployment readiness", value: "12 days" },
      { label: "Weekly availability (Year 2)", value: "30 hrs" },
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
      { label: "Project proof points", value: "3+" },
      { label: "Deployment readiness", value: "12 days" },
      { label: "Weekly availability (Year 2)", value: "30 hrs" },
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
      { label: "Project proof points", value: "3+" },
      { label: "Deployment readiness", value: "12 days" },
      { label: "Weekly availability (Year 2)", value: "30 hrs" },
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
      { label: "Project proof points", value: "2+" },
      { label: "Deployment readiness", value: "12 days" },
      { label: "Weekly availability (Year 2)", value: "30 hrs" },
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
      { label: "Project proof points", value: "3+" },
      { label: "Deployment readiness", value: "12 days" },
      { label: "Weekly availability (Year 2)", value: "30 hrs" },
    ],
  },
];

export type CaseStudy = {
  slug: string;
  company: string;
  industry: string;
  role: string;
  headline: string;
  quote: string;
  person: string;
  title: string;
  stat: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "fintech-full-stack-bench",
    company: "Fintech Platform (GCC)",
    industry: "Fintech / GCC",
    role: "Full-Stack Engineers",
    headline: "Built a 6-intern full-stack bench in under 2 weeks",
    quote:
      "We shared one JD and got a shortlist of pre-assessed candidates with project proof. Onboarding time dropped because the stack alignment was already done.",
    person: "Engineering Director",
    title: "GCC Engineering Leadership",
    stat: [
      { label: "Time to shortlist", value: "9 days" },
      { label: "Interns deployed", value: "6" },
      { label: "Stack match", value: "React / Node.js" },
    ],
  },
  {
    slug: "retail-backend-conversion",
    company: "Retail / E-commerce",
    industry: "Retail",
    role: "Backend Engineers",
    headline: "3 of 4 interns converted to full-time offers",
    quote:
      "The monthly feedback loop meant we caught skill gaps early and could course-correct with the mentor team before it became a performance issue.",
    person: "VP Engineering",
    title: "Retail Technology Group",
    stat: [
      { label: "Interns deployed", value: "4" },
      { label: "Converted to FTE", value: "3" },
      { label: "Avg ramp-up", value: "3 weeks" },
    ],
  },
  {
    slug: "saas-qa-automation",
    company: "B2B SaaS",
    industry: "SaaS",
    role: "QA / Automation",
    headline: "Stood up a dedicated QA pod without a hiring cycle",
    quote:
      "Instead of running a 4-month hiring process, we deployed a QA pod in under 2 weeks with mentor oversight built in.",
    person: "Head of Quality",
    title: "B2B SaaS Company",
    stat: [
      { label: "Time to deployment", value: "12 days" },
      { label: "Pod size", value: "3 interns" },
      { label: "Replacement requests", value: "0" },
    ],
  },
];

export const navLinks = [
  { href: "/roles", label: "Roles" },
  { href: "/deployment-model", label: "Deployment Model" },
  { href: "/for-gccs", label: "For GCCs" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/commercials", label: "Commercials" },
];

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
    a: "Typically 7-12 days from JD share to a curated, pre-assessed shortlist ready for interviews.",
  },
  {
    q: "What does the company assessment involve?",
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
    q: "Is there a recruitment fee?",
    a: "No. The commercial model is a monthly stipend plus a program management fee, structured by year of engagement - not a placement commission.",
  },
  {
    q: "When do we see exact numbers?",
    a: "Exact stipend and program management fee figures are shared in a commercial sheet tailored to your role, stack and intern count - usually within 1-2 business days of your request.",
  },
  {
    q: "Is there a cost to convert an intern to full-time?",
    a: "The model is built for conversion - performance notes from the engagement feed directly into your FTE decision. Conversion terms are covered in the commercial sheet.",
  },
  {
    q: "What's the minimum engagement?",
    a: "Engagements are structured year-wise starting from Year 2 (30 hrs/week remote). Pilot cohorts can start small - many companies begin with 2-5 interns.",
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
      "A 30-minute call with your hiring manager captures the role, tech stack, team structure, codebase maturity and what 'productive' looks like in month one. This brief drives everything downstream.",
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
    title: "Company assessment",
    desc: "10 MCQs plus 2 coding tasks aligned to your JD, reviewed with mentor notes.",
    detail:
      "Mapped candidates take an assessment built from your JD - 10 MCQs and 2 coding tasks. Results come back scored, with mentor commentary on strengths and watch-outs per candidate.",
  },
  {
    day: "Day 8-11",
    title: "Final interview",
    desc: "Your team interviews the shortlisted candidates and confirms the hire.",
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
  "Share one JD. Get an assessed shortlist in 7-12 days.",
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
