export type LeadStatus = "new" | "contacted";

export interface LeadRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  brief: string;
  source: string;
  status: LeadStatus;
  zohoId: string | null;
  createdAt: string;
}
