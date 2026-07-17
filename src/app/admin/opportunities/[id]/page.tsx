import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminEmail } from "@/auth";
import OpportunityActions from "@/components/admin/OpportunityActions";
import { getOpportunity } from "@/lib/repo/opportunities";

export const dynamic = "force-dynamic";

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">{value}</dd>
    </div>
  );
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const { id } = await params;
  const opportunity = await getOpportunity(id);
  if (!opportunity) notFound();
  const data = opportunity.data;

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Link href="/admin/opportunities" className="text-sm font-extrabold text-red">
          ← All opportunities
        </Link>
        <header className="mt-5 flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-muted">{opportunity.companyName}</p>
            <h1 className="mt-1 text-4xl font-black tracking-[-0.055em]">
              {opportunity.roleTitle || "Requirement in progress"}
            </h1>
            <p className="mt-2 text-sm text-muted">{opportunity.contactName} · {opportunity.email}</p>
          </div>
          <OpportunityActions id={opportunity.id} status={opportunity.status} />
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="text-lg font-black">Hiring brief</h2>
            <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <Detail label="Skills" value={data.skills} />
              <Detail label="Team strength" value={data.headcount} />
              <Detail label="Roles" value={data.roles?.join(", ")} />
              <Detail
                label="Compensation"
                value={[data.compensationType, data.compensationRange].filter(Boolean).join(" · ")}
              />
              <div className="sm:col-span-2"><Detail label="Must demonstrate" value={data.expectations} /></div>
              <div className="sm:col-span-2"><Detail label="Dealbreakers" value={data.dealbreakers} /></div>
              <div className="sm:col-span-2"><Detail label="Common interview gaps" value={data.interviewGaps} /></div>
              <div className="sm:col-span-2">
                <Detail
                  label="Post-interview readiness preference"
                  value={data.readinessCustom || data.readinessPreference}
                />
              </div>
              <div className="sm:col-span-2"><Detail label="JD or additional context" value={data.jdText} /></div>
            </dl>
            <div className="mt-7 rounded-lg border border-line bg-white p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
                Journey signal
              </p>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                <div><strong>Status:</strong> {opportunity.journeyStatus.replaceAll("_", " ")}</div>
                <div><strong>Intent:</strong> {opportunity.intentLevel}</div>
                <div>
                  <strong>Confirmed:</strong>{" "}
                  {opportunity.confirmedAt
                    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(
                        new Date(opportunity.confirmedAt),
                      )
                    : "No"}
                </div>
              </div>
            </div>
            {opportunity.booking ? (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-950">
                <p className="font-extrabold">Meeting booked</p>
                {opportunity.booking.startTime ? (
                  <p className="mt-1">
                    {new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" }).format(
                      new Date(opportunity.booking.startTime),
                    )}
                    {opportunity.booking.timeZone ? ` · ${opportunity.booking.timeZone}` : ""}
                  </p>
                ) : null}
                {opportunity.booking.id ? <p className="mt-1">Booking ID: {opportunity.booking.id}</p> : null}
              </div>
            ) : null}
            <div className="mt-7 rounded-lg border border-line bg-soft p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Alignment: {opportunity.alignment}</p>
              <p className="mt-2 text-sm leading-6">{data.alignmentNotes || "No alignment concerns were flagged."}</p>
            </div>
            {opportunity.rejectionReason ? (
              <div className="mt-4 rounded-lg border border-red/20 bg-red/5 p-4 text-sm text-red">
                <strong>Rejection reason:</strong> {opportunity.rejectionReason}
              </div>
            ) : null}
          </div>

          <aside className="rounded-xl border border-line bg-white p-5">
            <h2 className="text-lg font-black">Conversation</h2>
            <div className="mt-5 max-h-[720px] space-y-4 overflow-y-auto pr-1">
              {opportunity.transcript.map((message, index) => (
                <div key={index}>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                    {message.role === "assistant" ? "Kal" : opportunity.contactName}
                  </p>
                  <p className="mt-1 rounded-lg bg-soft px-3 py-2.5 text-sm leading-5">{message.content}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
