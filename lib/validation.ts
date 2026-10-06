import { z } from "zod";

/**
 * Sanitizes phone numbers by removing spaces, dashes, parentheses,
 * and optional "+91" or leading "0" country codes for Indian mobile numbers.
 */
export function sanitizeIndianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+91")) {
    return cleaned.slice(3);
  }
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned.slice(2);
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return cleaned.slice(1);
  }
  return cleaned;
}

export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(100, "Name must be less than 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Work or personal email is required.")
    .email("Please enter a valid email address (e.g. name@company.com)."),
  phone: z
    .string()
    .trim()
    .transform(sanitizeIndianPhone)
    .refine((val) => INDIAN_PHONE_REGEX.test(val), {
      message: "Please enter a valid 10-digit mobile number (starts with 6-9).",
    }),
});

export const guestTypeSchema = z.enum(["Family", "Friend", "Colleague", "Other"], {
  message: "Please select a relationship type.",
});

export const singleGuestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter the guest's full name.")
    .max(100, "Guest name must be less than 100 characters."),
  phone: z
    .string()
    .trim()
    .transform(sanitizeIndianPhone)
    .refine((val) => INDIAN_PHONE_REGEX.test(val), {
      message: "Please enter a valid 10-digit mobile number.",
    }),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "Please enter a valid email address or leave it blank."
    ),
  type: guestTypeSchema,
});

export const fullRegistrationSchema = z.object({
  employee: employeeSchema,
  guestCount: z
    .number()
    .int("Guest count must be an integer.")
    .min(0, "Guest count cannot be negative.")
    .max(5, "A maximum of 5 guests is allowed."),
  guests: z.array(singleGuestSchema),
}).refine(
  (data) => data.guests.length === data.guestCount,
  {
    message: "The number of registered guests must match the selected guest count.",
    path: ["guests"],
  }
);

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export type SingleGuestFormValues = z.infer<typeof singleGuestSchema>;
export type FullRegistrationValues = z.infer<typeof fullRegistrationSchema>;
