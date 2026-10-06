import { FullRegistrationValues } from "./validation";
import { SheetDBRowPayload } from "@/types/registration";

/**
 * Generates an Apple-style, human-readable registration ID.
 * Format: GARBA-XXXXXX (using unambiguous uppercase alphanumeric chars)
 */
export function generateRegistrationId(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return `GARBA-${code}`;
}

/**
 * Formats date into readable string in Indian Standard Time (IST)
 */
export function formatSubmissionTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Builds the SheetDB row payload with comprehensive column mapping.
 * Handles both flattened guest columns (guest_1_*, guest_2_*) and 
 * consolidated summary fields to match any Google Sheet header layout.
 */
export function buildSheetDBPayload(
  data: FullRegistrationValues,
  registrationId: string,
  timestamp: string
): SheetDBRowPayload {
  const guests = data.guests || [];

  const guestsSummary =
    guests.length > 0
      ? guests
          .map(
            (g, idx) =>
              `${idx + 1}. ${g.name} (${g.type}${g.phone ? ` - ${g.phone}` : ""})`
          )
          .join(" | ")
      : "No additional guests";

  const payload: SheetDBRowPayload = {
    registration_id: registrationId,
    submitted_at: timestamp,
    status: "Registered",
    employee_name: data.employee.name,
    employee_email: data.employee.email,
    employee_phone: data.employee.phone,
    number_of_guests: data.guestCount,
    guest_count: data.guestCount,
    guests_summary: guestsSummary,
  };

  // Populate guest 1..5 fields
  for (let i = 1; i <= 5; i++) {
    const guest = guests[i - 1];
    payload[`guest_${i}_name`] = guest ? guest.name : "";
    payload[`guest_${i}_phone`] = guest ? guest.phone : "";
    payload[`guest_${i}_email`] = guest ? guest.email || "" : "";
    payload[`guest_${i}_type`] = guest ? guest.type : "";
  }

  // Also include single guest fallback in case the sheet headers use generic names
  if (guests.length > 0) {
    payload.guest_name = guests.map((g) => g.name).join(", ");
    payload.guest_phone = guests.map((g) => g.phone).join(", ");
    payload.guest_email = guests.map((g) => g.email || "").filter(Boolean).join(", ");
    payload.guest_type = guests.map((g) => g.type).join(", ");
  } else {
    payload.guest_name = "";
    payload.guest_phone = "";
    payload.guest_email = "";
    payload.guest_type = "";
  }

  return payload;
}

// In-memory cache to prevent duplicate accidental submissions within 60 seconds
interface SubmissionCacheEntry {
  timestamp: number;
  registrationId: string;
}

const recentSubmissions = new Map<string, SubmissionCacheEntry>();

export function checkRecentDuplicate(email: string, phone: string): string | null {
  const now = Date.now();
  const emailKey = `email:${email.toLowerCase().trim()}`;
  const phoneKey = `phone:${phone.trim()}`;

  // Purge entries older than 60 seconds
  for (const [key, entry] of recentSubmissions.entries()) {
    if (now - entry.timestamp > 60_000) {
      recentSubmissions.delete(key);
    }
  }

  const existingEmail = recentSubmissions.get(emailKey);
  if (existingEmail && now - existingEmail.timestamp < 60_000) {
    return existingEmail.registrationId;
  }

  const existingPhone = recentSubmissions.get(phoneKey);
  if (existingPhone && now - existingPhone.timestamp < 60_000) {
    return existingPhone.registrationId;
  }

  return null;
}

export function recordRecentSubmission(email: string, phone: string, registrationId: string): void {
  const now = Date.now();
  recentSubmissions.set(`email:${email.toLowerCase().trim()}`, { timestamp: now, registrationId });
  recentSubmissions.set(`phone:${phone.trim()}`, { timestamp: now, registrationId });
}
