"use client";

import { useState, type FormEvent } from "react";

interface FormFields {
  email: string;
  role: string;
  interns: string;
  duration: string;
  notes: string;
}

const initialFields: FormFields = {
  email: "",
  role: "",
  interns: "",
  duration: "",
  notes: "",
};

interface CTAFormProps {
  source?: string;
}

export default function CTAForm({ source = "website" }: CTAFormProps) {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [serverError, setServerError] = useState("");

  function update<K extends keyof FormFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormFields, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      nextErrors.email = "Enter a valid work email.";
    }
    if (!fields.role.trim()) {
      nextErrors.role = "Tell us the role and stack.";
    }
    if (!fields.interns.trim() || Number.isNaN(Number(fields.interns))) {
      nextErrors.interns = "Enter the number of interns needed.";
    }
    if (!fields.duration.trim()) {
      nextErrors.duration = "Enter the internship duration.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    setServerError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source }),
      });
      const data: { success: boolean; error?: string } = await response.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setStatus("failed");
        setServerError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("failed");
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white border border-line rounded-lg shadow-2xl p-8 sm:p-9 text-center">
        <div className="w-14 h-14 rounded-full bg-red text-white grid place-items-center text-2xl font-black mx-auto mb-4">
          ✓
        </div>
        <h3 className="text-2xl font-extrabold tracking-[-0.03em] mb-2">Request received</h3>
        <p className="text-[#424242] text-[15px] leading-relaxed font-medium">
          Our team will map the right KalviumX talent pool for your JD and follow up
          within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-line rounded-lg shadow-2xl p-5 sm:p-6"
      noValidate
    >
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div className="grid gap-1.5">
          <label htmlFor="email" className="text-xs font-extrabold text-[#303030]">
            Work email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border border-line rounded-sm h-[42px] px-3 text-sm outline-none focus:border-red"
          />
          {errors.email && <span className="text-xs font-semibold text-red">{errors.email}</span>}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="role" className="text-xs font-extrabold text-[#303030]">
            Role / stack*
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Full-stack (React, Node.js)"
            value={fields.role}
            onChange={(e) => update("role", e.target.value)}
            className="w-full border border-line rounded-sm h-[42px] px-3 text-sm outline-none focus:border-red"
          />
          {errors.role && <span className="text-xs font-semibold text-red">{errors.role}</span>}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="interns" className="text-xs font-extrabold text-[#303030]">
            No. of interns*
          </label>
          <input
            id="interns"
            type="text"
            placeholder="e.g. 5"
            value={fields.interns}
            onChange={(e) => update("interns", e.target.value)}
            className="w-full border border-line rounded-sm h-[42px] px-3 text-sm outline-none focus:border-red"
          />
          {errors.interns && <span className="text-xs font-semibold text-red">{errors.interns}</span>}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="duration" className="text-xs font-extrabold text-[#303030]">
            Internship duration*
          </label>
          <input
            id="duration"
            type="text"
            placeholder="e.g. 6 months"
            value={fields.duration}
            onChange={(e) => update("duration", e.target.value)}
            className="w-full border border-line rounded-sm h-[42px] px-3 text-sm outline-none focus:border-red"
          />
          {errors.duration && <span className="text-xs font-semibold text-red">{errors.duration}</span>}
        </div>
        <div className="sm:col-span-2 grid gap-1.5">
          <label htmlFor="notes" className="text-xs font-extrabold text-[#303030]">
            Additional notes (optional)
          </label>
          <textarea
            id="notes"
            placeholder="Share any specific skills, tools or preferences"
            value={fields.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full border border-line rounded-sm h-[58px] px-3 py-2.5 text-sm outline-none resize-none focus:border-red"
          />
        </div>
      </div>
      {serverError && (
        <p className="mt-3 text-sm font-semibold text-red text-center">{serverError}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full mt-3.5 h-[46px] bg-red text-white rounded-sm text-[15px] font-black hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Get Shortlist"}
      </button>
      <div className="flex justify-center items-center gap-1.5 mt-3 text-xs text-[#777]">
        We respect your privacy. No spam, ever.
      </div>
    </form>
  );
}
