import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import RoleIcon from "@/components/ui/RoleIcon";
import { roles } from "@/lib/data";

interface RolesGridProps {
  showHeading?: boolean;
  showAll?: boolean;
}

export default function RolesGrid({ showHeading = true, showAll = false }: RolesGridProps) {
  const items = showAll ? roles : roles.slice(0, 5);

  return (
    <section>
      <div className="container-x">
        {showHeading && (
          <SectionHeading
            eyebrow="Roles"
            align="center"
            title={
              <>
                Hire interns for <span className="red-pill">real engineering work</span>
              </>
            }
            copy="Not every student is shown for every role. Each profile is mapped against your JD before it reaches your shortlist."
          />
        )}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((role) => (
            <Link
              key={role.slug}
              href={`/roles/${role.slug}`}
              className="group border border-line rounded-lg p-7 bg-white hover:border-red hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <RoleIcon type={role.shortTitle} className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold tracking-[-0.03em] mb-2 group-hover:text-red transition-colors">
                {role.shortTitle}
              </h3>
              <p className="text-[#424242] text-[15px] leading-relaxed font-medium mb-4">
                {role.summary}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {role.stack.map((s) => (
                  <span key={s} className="bg-soft border border-line rounded-full px-3 py-1 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
              <span className="text-sm font-extrabold text-red inline-flex items-center gap-1">
                View role details <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
          {!showAll && (
            <Link
              href="/roles"
              className="flex flex-col items-center justify-center text-center border-2 border-dashed border-line rounded-lg p-7 hover:border-red hover:text-red transition-all"
            >
              <span className="text-3xl font-black mb-2">+</span>
              <span className="font-extrabold">View all roles</span>
            </Link>
          )}
        </div>
        <p className="text-center mt-8 text-sm text-[#555] font-semibold max-w-2xl mx-auto">
          Not recommended for: pure data-analyst, advanced cybersecurity, or specialist
          UI/UX research roles unless paired with a dedicated bootcamp track.
        </p>
      </div>
    </section>
  );
}
