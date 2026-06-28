"use client";

import { FormEvent, useEffect, useEffectEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { validateWorkEmail } from "@/lib/lead-validation";
import type {
  BookingDetails,
  ChatMessage,
  JourneyStatus,
  OpportunityDraft,
  OpportunityRecord,
} from "@/lib/opportunity-types";

const CAL_LINK = "ankitkalvi/30min";
const STORAGE_KEY = "kal-ai-conversation-id";

const ROLE_OPTIONS = [
  "Frontend",
  "Backend",
  "Full-stack",
  "AI/ML",
  "Cloud/DevOps",
  "QA/Automation",
  "Mobile",
  "Other",
];

const HEADCOUNT_OPTIONS = ["1", "2–3", "4–5", "6–10", "10+", "Still exploring"];

const READINESS_OPTIONS = [
  "Yes, this would help us close strong candidates faster",
  "Yes, if the preparation is tailored to our interview feedback",
  "Only for specific tools or minor technical gaps",
  "We would consider it depending on the candidate",
  "No, candidates must meet every requirement during the interview",
  "Add our own expectation",
];

const STIPEND_RANGES = [
  "₹10k–₹20k per month",
  "₹20k–₹35k per month",
  "₹35k–₹50k per month",
  "₹50k–₹75k per month",
  "₹75k–₹1L per month",
  "₹1L–₹1.5L per month",
  "Custom",
];

const CTC_RANGES = [
  "₹6–₹8 LPA",
  "₹8–₹12 LPA",
  "₹12–₹18 LPA",
  "₹18–₹25 LPA",
  "₹25+ LPA",
  "Custom",
];

const STEP_LABELS = [
  "Company",
  "Team strength",
  "Roles and stack",
  "Candidate expectations",
  "Readiness",
  "Compensation",
];

type Stage =
  | "gate"
  | "company"
  | "headcount"
  | "roles"
  | "expectations"
  | "readiness"
  | "compensation"
  | "summary"
  | "confirmed"
  | "booked";

const STAGE_ORDER: Stage[] = ["company", "headcount", "roles", "expectations", "readiness", "compensation"];

function stageFromOpportunity(opportunity: OpportunityRecord): Stage {
  if (opportunity.journeyStatus === "meeting_booked") return "booked";
  if (opportunity.journeyStatus === "requirement_confirmed") return "confirmed";
  if (opportunity.journeyStatus === "summary_generated") return "summary";
  return STAGE_ORDER[opportunity.currentStep] ?? "company";
}

function journeyStatusForStep(step: number): JourneyStatus {
  return step === 0 ? "started" : "in_progress";
}

function KxMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[17px] font-black tracking-[-0.12em] shadow-sm ${className}`}
      aria-hidden
    >
      <span className="text-red">K</span>
      <span className="text-ink">X</span>
    </span>
  );
}

function ChoiceButton({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border-2 px-3 py-1.5 text-left text-[13px] font-bold leading-snug transition-colors ${
        selected ? "border-red bg-red/5 text-red" : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function KalChatWidget() {
  const pathname = usePathname();
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("gate");
  const [opportunityId, setOpportunityId] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [draft, setDraft] = useState<OpportunityDraft>({});
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [companyCorrection, setCompanyCorrection] = useState("");
  const [customReadiness, setCustomReadiness] = useState("");
  const [customCompensation, setCustomCompensation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bookingListenerReady = useRef(false);

  const currentStep = Math.max(0, STAGE_ORDER.indexOf(stage));
  const journeyStep = Math.max(1, currentStep);

  function goBack() {
    const index = STAGE_ORDER.indexOf(stage);
    if (index > 0) setStage(STAGE_ORDER[index - 1]);
  }
  const progress = stage === "company" ? 5 : Math.min(100, journeyStep * 20);
  const onBookingSuccessful = useEffectEvent((event: unknown) => {
    const root = (event ?? {}) as Record<string, unknown>;
    const detail = (root.detail ?? {}) as Record<string, unknown>;
    const data = (detail.data ?? detail) as Record<string, unknown>;
    const bookingDetails: BookingDetails = {
      id: String(data.uid ?? data.id ?? ""),
      title: String(data.title ?? "KalviumX conversation"),
      startTime: String(data.startTime ?? data.start ?? ""),
      endTime: String(data.endTime ?? data.end ?? ""),
      timeZone: String(data.timeZone ?? data.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone),
      hostName: String(data.organizerName ?? data.hostName ?? ""),
      meetingUrl: String(data.meetingUrl ?? data.videoCallUrl ?? ""),
      raw: data,
    };
    void saveBooking(bookingDetails);
  });

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("kal-widget-toggle", { detail: { open } }));
    return () => {
      window.dispatchEvent(new CustomEvent("kal-widget-toggle", { detail: { open: false } }));
    };
  }, [open]);

  function loadOpportunity(opportunity: OpportunityRecord) {
    window.localStorage.setItem(STORAGE_KEY, opportunity.id);
    setOpportunityId(opportunity.id);
    setContactName(opportunity.contactName);
    setEmail(opportunity.email);
    setDraft(opportunity.data);
    setTranscript(opportunity.transcript);
    setAdvice(opportunity.advice);
    setBooking(opportunity.booking);
    setStage(stageFromOpportunity(opportunity));
  }

  useEffect(() => {
    const savedId = window.localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      fetch(`/api/opportunity-intake/${savedId}`)
        .then((response) => (response.ok ? response.json() : null))
        .then((result) => {
          const opportunity = result?.opportunity as OpportunityRecord | undefined;
          if (!opportunity) {
            window.localStorage.removeItem(STORAGE_KEY);
            return;
          }
          loadOpportunity(opportunity);
        })
        .catch(() => {});
      return;
    }
    // No local record — silently check whether this IP already started a
    // conversation recently (e.g. cleared storage, different browser on the
    // same network) so we can skip asking for contact info again.
    fetch("/api/opportunity-intake")
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        const opportunity = result?.opportunity as OpportunityRecord | undefined;
        if (opportunity) loadOpportunity(opportunity);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!["confirmed", "booked"].includes(stage) || bookingListenerReady.current) return;
    let attempts = 0;
    const attach = () => {
      const cal = (window as { Cal?: (...args: unknown[]) => void }).Cal;
      if (typeof cal !== "function") return false;
      bookingListenerReady.current = true;
      cal("on", {
        action: "bookingSuccessful",
        callback: onBookingSuccessful,
      });
      return true;
    };
    if (attach()) return;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (attach() || attempts > 25) window.clearInterval(interval);
    }, 400);
    return () => window.clearInterval(interval);
  }, [stage]);

  if (pathname.startsWith("/admin")) return null;

  function appendMessages(...messages: ChatMessage[]) {
    const next = [...transcript, ...messages];
    setTranscript(next);
    return next;
  }

  async function persist(input: {
    nextDraft: OpportunityDraft;
    nextTranscript: ChatMessage[];
    nextStep: number;
    journeyStatus?: JourneyStatus;
    nextAdvice?: string[];
    confirmed?: boolean;
    nextBooking?: BookingDetails;
  }) {
    if (!opportunityId) throw new Error("Conversation has not started.");
    const response = await fetch(`/api/opportunity-intake/${opportunityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draft: input.nextDraft,
        transcript: input.nextTranscript,
        currentStep: input.nextStep,
        journeyStatus: input.journeyStatus ?? journeyStatusForStep(input.nextStep),
        advice: input.nextAdvice ?? advice,
        confirmed: input.confirmed,
        booking: input.nextBooking,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save your progress.");
    return result.opportunity as OpportunityRecord;
  }

  async function startConversation(event: FormEvent) {
    event.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    const emailError = validateWorkEmail(normalized);
    if (emailError) return setError(emailError);
    if (contactName.trim().length < 2) return setError("Tell us your name.");

    setBusy(true);
    try {
      const response = await fetch("/api/opportunity-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          email: normalized,
          website: honeypot,
          loadedAt,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not start the conversation.");
      loadOpportunity(result.opportunity as OpportunityRecord);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmCompany(correct: boolean) {
    const companyName = correct ? draft.companyName?.trim() : companyCorrection.trim();
    if (!companyName) return setError("Enter the correct company name.");
    await advance({
      patch: { companyName, companyConfirmed: true },
      answer: correct ? `Yes, ${companyName} is right.` : `The correct company is ${companyName}.`,
      assistant: "Great. Let’s map the requirement in five focused steps.",
      nextStage: "headcount",
      nextStep: 1,
    });
  }

  async function advance(input: {
    patch: Partial<OpportunityDraft>;
    answer: string;
    assistant: string;
    nextStage: Stage;
    nextStep: number;
  }) {
    setBusy(true);
    setError("");
    const nextDraft = { ...draft, ...input.patch };
    const nextTranscript = appendMessages(
      { role: "user", content: input.answer },
      { role: "assistant", content: input.assistant },
    );
    try {
      await persist({ nextDraft, nextTranscript, nextStep: input.nextStep });
      setDraft(nextDraft);
      setStage(input.nextStage);
    } catch (requestError) {
      setTranscript(transcript);
      setError(requestError instanceof Error ? requestError.message : "Could not save your answer.");
    } finally {
      setBusy(false);
    }
  }

  async function finishQuestions() {
    const range = draft.compensationRange === "Custom" ? customCompensation.trim() : draft.compensationRange;
    if (!draft.compensationType || !range) return setError("Choose a compensation structure and range.");
    setBusy(true);
    setError("");
    const nextDraft = {
      ...draft,
      compensationRange: range,
      stipend: draft.compensationType === "stipend" ? range : undefined,
    };
    const answer = `${draft.compensationType}: ${range}`;
    const nextTranscript = appendMessages(
      { role: "user", content: answer },
      { role: "assistant", content: "I’ve organised your answers and added a few practical points to consider before profiles are assessed." },
    );
    try {
      const adviceResponse = await fetch("/api/kal/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: nextDraft }),
      });
      const adviceResult = await adviceResponse.json();
      const nextAdvice = (adviceResult.advice ?? []) as string[];
      await persist({
        nextDraft,
        nextTranscript,
        nextStep: 6,
        journeyStatus: "summary_generated",
        nextAdvice,
      });
      setDraft(nextDraft);
      setAdvice(nextAdvice);
      setStage("summary");
    } catch (requestError) {
      setTranscript(transcript);
      setError(requestError instanceof Error ? requestError.message : "Could not prepare the summary.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmRequirement() {
    setBusy(true);
    setError("");
    const summary = `Confirmed requirement: ${draft.headcount} profiles across ${draft.roles?.join(", ")}. Stack: ${draft.skills}. Compensation: ${draft.compensationRange}.`;
    const nextTranscript = appendMessages(
      { role: "user", content: "I confirm this requirement." },
      { role: "assistant", content: summary },
    );
    try {
      await persist({
        nextDraft: draft,
        nextTranscript,
        nextStep: 7,
        journeyStatus: "requirement_confirmed",
        nextAdvice: advice,
        confirmed: true,
      });
      setStage("confirmed");
    } catch (requestError) {
      setTranscript(transcript);
      setError(requestError instanceof Error ? requestError.message : "Could not confirm the requirement.");
    } finally {
      setBusy(false);
    }
  }

  async function saveBooking(details: BookingDetails) {
    const nextTranscript = appendMessages({
      role: "assistant",
      content: `Your conversation is booked${details.startTime ? ` for ${new Date(details.startTime).toLocaleString()}` : ""}. Cal.com has sent the confirmation email to ${draft.email}.`,
    });
    try {
      await persist({
        nextDraft: draft,
        nextTranscript,
        nextStep: 8,
        journeyStatus: "meeting_booked",
        nextAdvice: advice,
        nextBooking: details,
      });
      setBooking(details);
      setStage("booked");
    } catch (error) {
      console.error("Could not save booking details", error);
    }
  }

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setLoadedAt(Date.now());
    setStage("gate");
    setOpportunityId("");
    setContactName("");
    setEmail("");
    setDraft({});
    setTranscript([]);
    setAdvice([]);
    setBooking(null);
    setError("");
  }

  const compensationRanges =
    draft.compensationType === "stipend"
      ? STIPEND_RANGES
      : draft.compensationType === "ctc"
        ? CTC_RANGES
        : ["Open to a suitable recommendation", "Still being finalised", "Custom"];

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-5 sm:right-5">
      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="KAL AI"
          className="fixed inset-3 flex h-auto w-auto flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(720px,calc(100vh-40px))] sm:w-[440px]"
        >
          <header className="flex items-center justify-between gap-4 bg-ink px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <KxMark />
              <div>
                <h2 className="font-extrabold leading-tight">KAL AI</h2>
                <p className="text-xs text-white/65">Map your team requirement</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 hover:bg-white/10"
              aria-label="Close KAL AI"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </header>

          {stage === "gate" ? (
            <form onSubmit={startConversation} className="flex flex-1 flex-col p-6">
              <div className="flex-1">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-red">
                  Team requirement snapshot
                </p>
                <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-ink">
                  See what to look for before assessing profiles.
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Five focused steps will organise your requirement and surface practical assessment considerations.
                </p>
                <label htmlFor="kal-name" className="mt-7 block text-sm font-extrabold text-ink">
                  Your name
                </label>
                <input
                  id="kal-name"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="e.g. Ankit Singh"
                  autoComplete="name"
                  className="mt-2 h-12 w-full rounded-lg border-2 border-line px-4 text-sm outline-none focus:border-red"
                />
                <label htmlFor="kal-email" className="mt-4 block text-sm font-extrabold text-ink">
                  Work email
                </label>
                <input
                  id="kal-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="mt-2 h-12 w-full rounded-lg border-2 border-line px-4 text-sm outline-none focus:border-red"
                />
                <input
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute opacity-0 pointer-events-none"
                />
                {error ? <p className="mt-2 text-sm font-semibold text-red">{error}</p> : null}
              </div>
              <button
                type="submit"
                disabled={busy}
                className="min-h-12 w-full rounded-lg bg-red px-5 text-sm font-extrabold text-white hover:bg-red-dark disabled:opacity-50"
              >
                {busy ? "Saving..." : "Let’s map it"}
              </button>
              <p className="mt-3 text-center text-[11px] leading-4 text-muted">
                Your progress is saved so you can return to it.
              </p>
            </form>
          ) : (
            <>
              {!["summary", "confirmed", "booked"].includes(stage) ? (
                <div className="border-b border-line bg-soft px-5 py-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted">
                    <div className="flex items-center gap-2">
                      {currentStep > 0 ? (
                        <button
                          type="button"
                          onClick={goBack}
                          aria-label="Back to previous question"
                          className="-ml-1 grid h-6 w-6 place-items-center rounded-md text-ink hover:bg-line"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                      ) : null}
                      <span>{STEP_LABELS[currentStep]}</span>
                    </div>
                    <span>{stage === "company" ? "Getting started" : `${journeyStep} of 5`}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-red transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : null}

              <div className="flex-1 overflow-y-auto p-4">
                {stage === "company" ? (
                  <div>
                    <p className="text-sm leading-6 text-muted">I’ve saved your progress.</p>
                    <h3 className="mt-2 text-xl font-black tracking-[-0.03em]">
                      It looks like you’re with {draft.companyName}. Is that right?
                    </h3>
                    <div className="mt-6 grid gap-2">
                      <button
                        type="button"
                        onClick={() => void confirmCompany(true)}
                        disabled={busy}
                        className="h-12 rounded-lg bg-red text-sm font-extrabold text-white"
                      >
                        Yes, that’s right
                      </button>
                      <input
                        value={companyCorrection}
                        onChange={(event) => setCompanyCorrection(event.target.value)}
                        placeholder="Enter the correct company name"
                        className="mt-2 h-11 rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
                      />
                      <button
                        type="button"
                        onClick={() => void confirmCompany(false)}
                        disabled={busy || !companyCorrection.trim()}
                        className="h-11 rounded-lg border-2 border-ink text-sm font-extrabold disabled:opacity-40"
                      >
                        Use this company
                      </button>
                    </div>
                  </div>
                ) : null}

                {stage === "headcount" ? (
                  <div>
                    <QuestionTitle>How many interns or early-career engineers are you considering for the team?</QuestionTitle>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {HEADCOUNT_OPTIONS.map((option) => (
                        <ChoiceButton
                          key={option}
                          selected={draft.headcount === option}
                          onClick={() => setDraft((current) => ({ ...current, headcount: option }))}
                        >
                          {option}
                        </ChoiceButton>
                      ))}
                    </div>
                    <ContinueButton
                      disabled={!draft.headcount || busy}
                      onClick={() =>
                        void advance({
                          patch: { headcount: draft.headcount },
                          answer: draft.headcount ?? "",
                          assistant: "Next, let’s define the profiles and technical readiness.",
                          nextStage: "roles",
                          nextStep: 2,
                        })
                      }
                    />
                  </div>
                ) : null}

                {stage === "roles" ? (
                  <div>
                    <QuestionTitle>Which roles are you considering, and what should candidates already be comfortable working with?</QuestionTitle>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {ROLE_OPTIONS.map((role) => {
                        const selected = draft.roles?.includes(role) ?? false;
                        return (
                          <ChoiceButton
                            key={role}
                            selected={selected}
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                roles: selected
                                  ? current.roles?.filter((item) => item !== role)
                                  : [...(current.roles ?? []), role],
                              }))
                            }
                          >
                            {role}
                          </ChoiceButton>
                        );
                      })}
                    </div>
                    <label className="mt-3 block text-xs font-extrabold uppercase tracking-wide text-muted">
                      Expected stack or capabilities
                    </label>
                    <textarea
                      rows={2}
                      value={draft.skills ?? ""}
                      onChange={(event) => setDraft((current) => ({ ...current, skills: event.target.value }))}
                      placeholder="For example: Java, Spring Boot, PostgreSQL and REST APIs"
                      className="mt-2 w-full resize-none rounded-lg border-2 border-line px-3 py-2 text-[13px] outline-none focus:border-red"
                    />
                    <ContinueButton
                      disabled={!draft.roles?.length || !draft.skills?.trim() || busy}
                      onClick={() =>
                        void advance({
                          patch: { roles: draft.roles, roleTitle: draft.roles?.join(", "), skills: draft.skills },
                          answer: `${draft.roles?.join(", ")}. Expected stack: ${draft.skills}`,
                          assistant: "Now let’s make the interview expectations clear.",
                          nextStage: "expectations",
                          nextStep: 3,
                        })
                      }
                    />
                  </div>
                ) : null}

                {stage === "expectations" ? (
                  <div>
                    <QuestionTitle>What would make a candidate feel ready for your team, and what gaps would prevent them from progressing?</QuestionTitle>
                    <FieldArea
                      label="Must demonstrate"
                      value={draft.expectations ?? ""}
                      placeholder="Skills, knowledge or behaviours expected during the interview"
                      onChange={(value) => setDraft((current) => ({ ...current, expectations: value }))}
                    />
                    <FieldArea
                      label="Would not progress if"
                      value={draft.dealbreakers ?? ""}
                      placeholder="Technical gaps, weak fundamentals or interview concerns considered dealbreakers"
                      onChange={(value) => setDraft((current) => ({ ...current, dealbreakers: value }))}
                    />
                    <FieldArea
                      label="Where candidates usually struggle (optional)"
                      value={draft.interviewGaps ?? ""}
                      placeholder="Any recurring interview or knowledge gaps"
                      onChange={(value) => setDraft((current) => ({ ...current, interviewGaps: value }))}
                    />
                    <ContinueButton
                      disabled={!draft.expectations?.trim() || !draft.dealbreakers?.trim() || busy}
                      onClick={() =>
                        void advance({
                          patch: {
                            expectations: draft.expectations,
                            dealbreakers: draft.dealbreakers,
                            interviewGaps: draft.interviewGaps,
                          },
                          answer: `Must demonstrate: ${draft.expectations}. Dealbreakers: ${draft.dealbreakers}.${draft.interviewGaps ? ` Common gaps: ${draft.interviewGaps}.` : ""}`,
                          assistant: "One readiness question before compensation.",
                          nextStage: "readiness",
                          nextStep: 4,
                        })
                      }
                    />
                  </div>
                ) : null}

                {stage === "readiness" ? (
                  <div>
                    <QuestionTitle>If you identify promising candidates who meet your core expectations but have gaps in specific tools or technologies, would a focused post-interview readiness program help you move forward with them confidently?</QuestionTitle>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      We can use the interview feedback to prepare selected candidates on your stack, workflows and expected areas of ownership before they join the team.
                    </p>
                    <div className="mt-3 grid gap-2">
                      {READINESS_OPTIONS.map((option) => (
                        <ChoiceButton
                          key={option}
                          selected={draft.readinessPreference === option}
                          onClick={() => setDraft((current) => ({ ...current, readinessPreference: option }))}
                        >
                          {option}
                        </ChoiceButton>
                      ))}
                    </div>
                    {draft.readinessPreference === "Add our own expectation" ? (
                      <textarea
                        rows={2}
                        value={customReadiness}
                        onChange={(event) => setCustomReadiness(event.target.value)}
                        placeholder="Add your expectation"
                        className="mt-3 w-full rounded-lg border-2 border-line px-3 py-2 text-[13px] outline-none focus:border-red"
                      />
                    ) : null}
                    <ContinueButton
                      disabled={
                        !draft.readinessPreference ||
                        (draft.readinessPreference === "Add our own expectation" && !customReadiness.trim()) ||
                        busy
                      }
                      onClick={() =>
                        void advance({
                          patch: {
                            readinessPreference: draft.readinessPreference,
                            readinessCustom:
                              draft.readinessPreference === "Add our own expectation"
                                ? customReadiness
                                : undefined,
                          },
                          answer:
                            draft.readinessPreference === "Add our own expectation"
                              ? customReadiness
                              : draft.readinessPreference ?? "",
                          assistant: "Last step: let’s capture the compensation structure.",
                          nextStage: "compensation",
                          nextStep: 5,
                        })
                      }
                    />
                  </div>
                ) : null}

                {stage === "compensation" ? (
                  <div>
                    <QuestionTitle>How would this engagement be compensated?</QuestionTitle>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        ["stipend", "Monthly stipend"],
                        ["ctc", "Full-time CTC"],
                        ["either", "Open to either"],
                        ["deciding", "Still deciding"],
                      ].map(([value, label]) => (
                        <ChoiceButton
                          key={value}
                          selected={draft.compensationType === value}
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              compensationType: value as OpportunityDraft["compensationType"],
                              compensationRange: "",
                            }))
                          }
                        >
                          {label}
                        </ChoiceButton>
                      ))}
                    </div>
                    {draft.compensationType ? (
                      <>
                        <label className="mt-3 block text-xs font-extrabold uppercase tracking-wide text-muted">
                          Expected range
                        </label>
                        <div className="mt-2 grid gap-2">
                          {compensationRanges.map((range) => (
                            <ChoiceButton
                              key={range}
                              selected={draft.compensationRange === range}
                              onClick={() => setDraft((current) => ({ ...current, compensationRange: range }))}
                            >
                              {range}
                            </ChoiceButton>
                          ))}
                        </div>
                        {draft.compensationRange === "Custom" ? (
                          <input
                            value={customCompensation}
                            onChange={(event) => setCustomCompensation(event.target.value)}
                            placeholder={draft.compensationType === "ctc" ? "Minimum ₹6 LPA" : "₹10,000 to ₹1,50,000 per month"}
                            className="mt-3 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
                          />
                        ) : null}
                      </>
                    ) : null}
                    <ContinueButton
                      label={busy ? "Preparing..." : "Show my summary"}
                      disabled={
                        !draft.compensationType ||
                        !draft.compensationRange ||
                        (draft.compensationRange === "Custom" && !customCompensation.trim()) ||
                        busy
                      }
                      onClick={() => void finishQuestions()}
                    />
                  </div>
                ) : null}

                {stage === "summary" ? (
                  <Summary
                    draft={draft}
                    advice={advice}
                    busy={busy}
                    error={error}
                    onEdit={() => setStage("headcount")}
                    onConfirm={() => void confirmRequirement()}
                  />
                ) : null}

                {stage === "confirmed" ? (
                  <div className="flex min-h-full flex-col justify-center text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red text-white">
                      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="2.5">
                        <path d="M5 12l4 4L19 6" />
                      </svg>
                    </span>
                    <h3 className="mt-5 text-2xl font-black tracking-[-0.04em]">Requirement confirmed</h3>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                      Your context and assessment considerations are saved for the relevant KalviumX team.
                    </p>
                    <button
                      type="button"
                      data-cal-link={CAL_LINK}
                      data-cal-origin="https://cal.com"
                      className="mt-7 h-12 rounded-lg bg-red px-5 text-sm font-extrabold text-white"
                    >
                      Discuss the profile approach
                    </button>
                    <button type="button" onClick={() => setStage("summary")} className="mt-3 text-sm font-extrabold text-ink">
                      View summary
                    </button>
                    <button type="button" onClick={reset} className="mt-2 text-xs font-bold text-muted hover:text-ink">
                      Start a new chat
                    </button>
                  </div>
                ) : null}

                {stage === "booked" ? (
                  <div className="flex min-h-full flex-col justify-center text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white">✓</span>
                    <h3 className="mt-5 text-2xl font-black tracking-[-0.04em]">Your conversation is booked</h3>
                    {booking?.startTime ? (
                      <p className="mt-3 text-sm font-extrabold">
                        {new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" }).format(
                          new Date(booking.startTime),
                        )}
                      </p>
                    ) : null}
                    {booking?.timeZone ? <p className="mt-1 text-sm text-muted">{booking.timeZone}</p> : null}
                    <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
                      Cal.com has sent the booking confirmation to {draft.email}. Use that email to confirm, reschedule or update the meeting.
                    </p>
                    <button type="button" onClick={reset} className="mt-7 text-sm font-extrabold text-red">
                      Start a new chat
                    </button>
                  </div>
                ) : null}

                {error && !["summary"].includes(stage) ? (
                  <p className="mt-4 text-sm font-semibold text-red">{error}</p>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex h-[58px] items-center overflow-hidden rounded-full bg-ink p-1.5 text-white shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-all duration-300 sm:w-[58px] sm:hover:w-[220px] sm:focus-visible:w-[220px]"
          aria-label="Open KAL AI"
        >
          <KxMark />
          <span className="ml-3 hidden min-w-[145px] text-left opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
            <span className="block text-sm font-extrabold leading-4">KAL AI</span>
            <span className="mt-0.5 block text-[11px] text-white/70">Map your team requirement</span>
          </span>
        </button>
      )}
    </div>
  );
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[16px] font-extrabold leading-[1.32] tracking-[-0.01em] text-ink">{children}</h3>;
}

function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: {
  onClick: () => void;
  disabled: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-4 h-11 w-full rounded-lg bg-red text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function FieldArea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-3 block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-muted">{label}</span>
      <textarea
        rows={2}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-lg border-2 border-line px-3 py-2 text-[13px] outline-none focus:border-red"
      />
    </label>
  );
}

function Summary({
  draft,
  advice,
  busy,
  error,
  onEdit,
  onConfirm,
}: {
  draft: OpportunityDraft;
  advice: string[];
  busy: boolean;
  error: string;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const rows = [
    ["Company", draft.companyName],
    ["Team strength", draft.headcount],
    ["Roles", draft.roles?.join(", ")],
    ["Stack", draft.skills],
    ["Must demonstrate", draft.expectations],
    ["Dealbreakers", draft.dealbreakers],
    ["Common gaps", draft.interviewGaps],
    ["Post-interview readiness", draft.readinessCustom || draft.readinessPreference],
    ["Compensation", `${draft.compensationType ?? ""}: ${draft.compensationRange ?? ""}`],
  ].filter(([, value]) => value);

  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-red">Requirement summary</p>
      <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">Here’s how I understand it</h3>
      <dl className="mt-5 divide-y divide-line rounded-xl border border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[120px_1fr] gap-3 px-3 py-3">
            <dt className="text-xs font-extrabold text-muted">{label}</dt>
            <dd className="text-sm leading-5 text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 rounded-xl bg-soft p-4">
        <h4 className="text-sm font-black">Points to consider before assessing profiles</h4>
        <ol className="mt-3 space-y-3">
          {advice.map((point, index) => (
            <li key={point} className="flex gap-3 text-sm leading-5">
              <span className="font-black text-red">{index + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ol>
      </div>
      {error ? <p className="mt-3 text-sm font-semibold text-red">{error}</p> : null}
      <div className="sticky bottom-0 -mx-5 mt-5 flex gap-2 border-t border-line bg-white px-5 pt-4">
        <button type="button" onClick={onEdit} className="h-11 flex-1 rounded-lg border-2 border-ink text-sm font-extrabold">
          Edit answers
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="h-11 flex-[1.25] rounded-lg bg-red text-sm font-extrabold text-white disabled:opacity-50"
        >
          {busy ? "Confirming..." : "Confirm this requirement"}
        </button>
      </div>
    </div>
  );
}
