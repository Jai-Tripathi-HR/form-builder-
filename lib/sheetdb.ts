import { SheetDBRowPayload, RegistrationSubmissionResult } from "@/types/registration";

const DEFAULT_SHEETDB_URL = "https://sheetdb.io/api/v1/a5xism6f9pfnq";

export const RECOMMENDED_SHEET_HEADERS = [
  "registration_id",
  "submitted_at",
  "status",
  "employee_name",
  "employee_email",
  "employee_phone",
  "number_of_guests",
  "guests_summary",
  "guest_1_name",
  "guest_1_phone",
  "guest_1_email",
  "guest_1_type",
  "guest_2_name",
  "guest_2_phone",
  "guest_2_email",
  "guest_2_type",
  "guest_3_name",
  "guest_3_phone",
  "guest_3_email",
  "guest_3_type",
  "guest_4_name",
  "guest_4_phone",
  "guest_4_email",
  "guest_4_type",
  "guest_5_name",
  "guest_5_phone",
  "guest_5_email",
  "guest_5_type",
];

export function getSheetDBUrl(): string {
  const url = process.env.SHEETDB_API_URL || DEFAULT_SHEETDB_URL;
  return url.trim().replace(/\/+$/, "");
}

/**
 * Checks the existing columns in the SheetDB spreadsheet
 */
export async function getSheetColumns(): Promise<{ success: boolean; keys?: string[]; error?: string }> {
  const baseUrl = getSheetDBUrl();
  try {
    const res = await fetch(`${baseUrl}/keys`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      return {
        success: false,
        error: errorJson?.error || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      return { success: true, keys: data };
    }
    return { success: false, error: "Unexpected response format from SheetDB" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect to SheetDB";
    return { success: false, error: message };
  }
}

/**
 * Posts registration row to SheetDB
 */
export async function postRegistrationToSheetDB(
  payload: SheetDBRowPayload
): Promise<RegistrationSubmissionResult> {
  const baseUrl = getSheetDBUrl();

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        data: [payload],
      }),
      signal: AbortSignal.timeout(12000),
    });

    const responseBody = await response.json().catch(() => null);

    if (response.ok && (responseBody?.created === 1 || responseBody?.created > 0 || Array.isArray(responseBody))) {
      return {
        success: true,
        registration_id: payload.registration_id,
        submitted_at: payload.submitted_at,
        message: "Registration successfully recorded in SheetDB.",
      };
    }

    // Check for empty sheet / missing header error from SheetDB
    const errorMessage = responseBody?.error || (typeof responseBody === "string" ? responseBody : "");
    const isMissingHeaders =
      errorMessage.includes("could not find data matching the spreadsheet format") ||
      errorMessage.includes("Spreadsheet is empty") ||
      errorMessage.includes("Fill first row with the column names");

    if (isMissingHeaders) {
      console.warn("[SheetDB] Target Google Sheet requires header row initialization.", errorMessage);
      return {
        success: false,
        errorType: "SHEETDB_ERROR",
        requiresSheetHeaders: true,
        error:
          "The Google Sheet backend needs row 1 headers configured. Please ensure Row 1 of 'Garba SK sheet' contains the event columns.",
      };
    }

    console.error("[SheetDB] POST failed:", response.status, responseBody);
    return {
      success: false,
      errorType: "SHEETDB_ERROR",
      error: errorMessage || "We couldn't complete your registration right now. Please try again in a moment.",
    };
  } catch (err: unknown) {
    console.error("[SheetDB] Connection exception:", err);
    const isTimeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return {
      success: false,
      errorType: "NETWORK_ERROR",
      error: isTimeout
        ? "The registration request timed out. Please check your internet connection and try again."
        : "Something went wrong while connecting to the server. Please try again.",
    };
  }
}
