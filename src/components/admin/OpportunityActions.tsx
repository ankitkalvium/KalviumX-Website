"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OpportunityActions({
  id,
  status,
}: {
  id: string;
  status: "pending" | "reviewed" | "rejected";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function update(nextStatus: "reviewed" | "rejected") {
    const reason =
      nextStatus === "rejected"
        ? window.prompt("Why is this opportunity being rejected?")?.trim()
        : undefined;
    if (nextStatus === "rejected" && !reason) return;

    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, rejectionReason: reason }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not update this opportunity.");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this opportunity? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not delete this opportunity.");
      return;
    }
    router.push("/admin/opportunities");
  }

  return (
    <div>
      <div className="flex gap-2">
        {status === "pending" ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => update("reviewed")}
              className="h-10 rounded-lg bg-red px-4 text-sm font-extrabold text-white disabled:opacity-50"
            >
              Mark reviewed
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => update("rejected")}
              className="h-10 rounded-lg border-2 border-ink px-4 text-sm font-extrabold disabled:opacity-50"
            >
              Reject
            </button>
          </>
        ) : null}
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          className="h-10 rounded-lg border-2 border-red/30 px-4 text-sm font-extrabold text-red disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-semibold text-red">{error}</p> : null}
    </div>
  );
}
