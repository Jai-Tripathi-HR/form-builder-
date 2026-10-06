export type GuestType = "Family" | "Friend" | "Colleague" | "Other";

export interface GuestData {
  name: string;
  phone: string;
  email?: string;
  type: GuestType;
}

export interface EmployeeData {
  name: string;
  email: string;
  phone: string;
}

export interface RegistrationFormData {
  employee: EmployeeData;
  guestCount: number;
  guests: GuestData[];
}

export interface RegistrationSubmissionResult {
  success: boolean;
  registration_id?: string;
  submitted_at?: string;
  message?: string;
  error?: string;
  errorType?: "VALIDATION_ERROR" | "DUPLICATE_SUBMISSION" | "SHEETDB_ERROR" | "NETWORK_ERROR" | "CONFIG_ERROR";
  requiresSheetHeaders?: boolean;
}

export interface SheetDBRowPayload {
  registration_id: string;
  submitted_at: string;
  status: string;
  employee_name: string;
  employee_email: string;
  employee_phone: string;
  number_of_guests: number | string;
  guest_count?: number | string;
  guests_summary: string;
  // Individual guest fields
  guest_1_name?: string;
  guest_1_phone?: string;
  guest_1_email?: string;
  guest_1_type?: string;
  guest_2_name?: string;
  guest_2_phone?: string;
  guest_2_email?: string;
  guest_2_type?: string;
  guest_3_name?: string;
  guest_3_phone?: string;
  guest_3_email?: string;
  guest_3_type?: string;
  guest_4_name?: string;
  guest_4_phone?: string;
  guest_4_email?: string;
  guest_4_type?: string;
  guest_5_name?: string;
  guest_5_phone?: string;
  guest_5_email?: string;
  guest_5_type?: string;
  // Generic single guest fallback
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  guest_type?: string;
  [key: string]: unknown;
}
