import { notFound } from "next/navigation";
import HiringForm from "@/components/HiringForm";
import { getDealByToken } from "@/lib/db-deals";

export const dynamic = "force-dynamic";

export default async function HiringFormPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const deal = await getDealByToken(token);
  if (!deal) notFound();

  return <HiringForm deal={deal} />;
}
