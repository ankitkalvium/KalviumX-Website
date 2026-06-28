export const JOURNEY_STATUSES = [
  "started",
  "in_progress",
  "summary_generated",
  "requirement_confirmed",
  "meeting_booked",
] as const;

export type JourneyStatus = (typeof JOURNEY_STATUSES)[number];
export type ReviewStatus = "pending" | "reviewed" | "rejected";

export interface OpportunityDraft {
  companyName?: string;
  companyConfirmed?: boolean;
  contactName?: string;
  email?: string;
  headcount?: string;
  roles?: string[];
  roleTitle?: string;
  skills?: string;
  expectations?: string;
  dealbreakers?: string;
  interviewGaps?: string;
  readinessPreference?: string;
  readinessCustom?: string;
  compensationType?: "stipend" | "ctc" | "either" | "deciding";
  compensationRange?: string;
  stipend?: string;
  jdText?: string;
  alignment?: "Green" | "Yellow" | "Red";
  alignmentNotes?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface BookingDetails {
  id?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  hostName?: string;
  meetingUrl?: string;
  raw?: Record<string, unknown>;
}

export interface OpportunityRecord {
  id: string;
  status: ReviewStatus;
  journeyStatus: JourneyStatus;
  currentStep: number;
  intentLevel: "started" | "engaged" | "confirmed" | "booked";
  companyName: string;
  roleTitle: string;
  contactName: string;
  email: string;
  alignment: "Green" | "Yellow" | "Red";
  data: OpportunityDraft;
  transcript: ChatMessage[];
  advice: string[];
  booking: BookingDetails | null;
  confirmedAt: string | null;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
