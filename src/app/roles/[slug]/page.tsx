import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TrackableButton from "@/components/ui/TrackableButton";
import { roles } from "@/lib/data";

interface RolePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);
  if (!role) return {};
  return {
    title: `${role.title} | KalviumX`,
    description: role.summary,
  };
}

export default async function RolePage({ params }: RolePageProps) {
  const { slug } = await params;
  const role = roles.find((r) => r.slug === slug);
  if (!role) notFound();

  const otherRoles = roles.filter((r) => r.slug !== slug);

  return (
    <>
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <Link href="/roles" className="text-sm font-extrabold text-red mb-4 inline-flex items-center gap-1">
            ← All roles
          </Link>
          <h1 className="text-[clamp(34px,4.5vw,56px)] font-black tracking-[-0.05em] leading-[1.08] mb-4">
            {role.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#303030] font-medium mb-6">
            {role.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-7">
            {role.stack.map((s) => (
              <span key={s} className="bg-white border border-line rounded-full px-3.5 py-1.5 text-sm font-bold">
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3.5">
            <TrackableButton href="/start-a-pilot" event="role_page_cta_clicked" properties={{ role: role.slug, location: "hero" }}>Get {role.shortTitle} Shortlist</TrackableButton>
            <Button href="/deployment-model" variant="outline">
              See Deployment Model
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-5">
              What {role.shortTitle.toLowerCase()} interns do
            </h2>
            <ul className="space-y-3.5">
              {role.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] font-semibold text-[#333] leading-snug">
                  <span className="text-red font-black shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ink text-white rounded-lg p-7">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-5">Sample readiness profile</h2>
            <div className="grid grid-cols-2 gap-4">
              {role.readiness.map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-lg p-4">
                  <b className="block text-2xl text-red tracking-[-0.04em] mb-1">{stat.value}</b>
                  <span className="text-xs font-bold text-white/60 leading-snug">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft border-y border-line">
        <div className="container-x text-center">
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-black tracking-[-0.05em] mb-4">
            Other roles you can hire through KalviumX
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {otherRoles.map((r) => (
              <Link
                key={r.slug}
                href={`/roles/${r.slug}`}
                className="bg-white border border-line rounded-full px-5 py-2.5 text-sm font-bold hover:border-red hover:text-red transition-colors"
              >
                {r.shortTitle}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center">
        <div className="container-x">
          <h2 className="text-[clamp(30px,3.6vw,46px)] font-black tracking-[-0.05em] mb-4 max-w-2xl mx-auto">
            Ready to build your {role.shortTitle.toLowerCase()} bench?
          </h2>
          <p className="max-w-xl mx-auto text-[#424242] text-base font-medium mb-7">
            Share your JD and get a curated, pre-assessed shortlist in under 48 hours.
          </p>
          <TrackableButton href="/start-a-pilot" event="role_page_cta_clicked" properties={{ role: role.slug, location: "bottom" }}>Share a JD</TrackableButton>
        </div>
      </section>
    </>
  );
}
