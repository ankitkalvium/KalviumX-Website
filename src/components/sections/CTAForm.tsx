"use client";

import { useState, useRef, type FormEvent } from "react";
import { roleOptions } from "@/lib/data";

interface FormFields {
  name: string;
  email: string;
  role: string;
  brief: string;
}

const initialFields: FormFields = {
  name: "",
  email: "",
  role: "",
  brief: "",
};

interface CTAFormProps {
  source?: string;
}

export default function CTAForm({ source = "website" }: CTAFormProps) {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [serverError, setServerError] = useState("");
  // Honeypot value + mount timestamp for bot detection.
  const honeypotRef = useRef("");
  const loadedAtRef = useRef(Date.now());

  function update<K extends keyof FormFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormFields, string>> = {};
    if (!fields.name.trim()) {
      nextErrors.name = "Tell us your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      nextErrors.email = "Enter a valid work email.";
    }
    if (!fields.role.trim()) {
      nextErrors.role = "Select a role or stack.";
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
        body: JSON.stringify({
          ...fields,
          source,
          website: honeypotRef.current,
          loadedAt: loadedAtRef.current,
        }),
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
          A program lead will map the right KalviumX talent for your brief and follow up
          same working day.
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
      {/* Honeypot — hidden from humans, bots fill it. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => {
            honeypotRef.current = e.target.value;
          }}
        />
      </div>

      <div className="grid gap-3.5">
        <div className="grid gap-1.5">
          <label htmlFor="name" className="text-xs font-extrabold text-[#303030]">
            Your name*
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Ankit Singh"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border border-line rounded-sm h-[42px] px-3 text-sm outline-none focus:border-red"
          />
          {errors.name && <span className="text-xs font-semibold text-red">{errors.name}</span>}
        </div>
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
          <select
            id="role"
            value={fields.role}
            onChange={(e) => update("role", e.target.value)}
            className={`w-full border border-line rounded-sm h-[42px] px-3 text-sm outline-none focus:border-red bg-white ${
              fields.role ? "text-ink" : "text-[#9a9a9a]"
            }`}
          >
            <option value="" disabled>
              Select the role you&apos;re hiring for
            </option>
            {roleOptions.map((option) => (
              <option key={option} value={option} className="text-ink">
                {option}
              </option>
            ))}
          </select>
          {errors.role && <span className="text-xs font-semibold text-red">{errors.role}</span>}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="brief" className="text-xs font-extrabold text-[#303030]">
            Paste your JD or a one-line brief (optional)
          </label>
          <textarea
            id="brief"
            placeholder="Drop a JD link, paste the JD, or describe what you need"
            value={fields.brief}
            onChange={(e) => update("brief", e.target.value)}
            className="w-full border border-line rounded-sm h-[72px] px-3 py-2.5 text-sm outline-none resize-none focus:border-red"
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
