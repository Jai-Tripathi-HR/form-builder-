import { NextRequest, NextResponse } from "next/server";
import { fullRegistrationSchema } from "@/lib/validation";
import {
  generateRegistrationId,
  formatSubmissionTime,
  buildSheetDBPayload,
  checkRecentDuplicate,
  recordRecentSubmission,
} from "@/lib/registration";
import { postRegistrationToSheetDB, getSheetColumns, RECOMMENDED_SHEET_HEADERS } from "@/lib/sheetdb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          errorType: "VALIDATION_ERROR",
          error: "Invalid request payload. Please ensure all form data is provided.",
        },
        { status: 400 }
      );
    }

    // 1. Server-side validation using Zod
    const validationResult = fullRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          success: false,
          errorType: "VALIDATION_ERROR",
          error: firstError,
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 2. Prevent rapid duplicate submissions
    const recentDuplicateId = checkRecentDuplicate(
      validData.employee.email,
      validData.employee.phone
    );

    if (recentDuplicateId) {
      return NextResponse.json(
        {
          success: false,
          errorType: "DUPLICATE_SUBMISSION",
          error: `A registration for ${validData.employee.name} was already submitted moments ago with pass ID: ${recentDuplicateId}.`,
          registration_id: recentDuplicateId,
        },
        { status: 409 }
      );
    }

    // 3. Generate secure registration metadata
    const registrationId = generateRegistrationId();
    const submittedAt = formatSubmissionTime(new Date());

    // 4. Construct sheet-ready payload
    const sheetPayload = buildSheetDBPayload(validData, registrationId, submittedAt);

    // 5. Post to SheetDB
    const sheetDbResult = await postRegistrationToSheetDB(sheetPayload);

    if (!sheetDbResult.success) {
      return NextResponse.json(
        {
          success: false,
          errorType: sheetDbResult.errorType || "SHEETDB_ERROR",
          error: sheetDbResult.error || "Unable to save registration to database.",
          requiresSheetHeaders: sheetDbResult.requiresSheetHeaders,
          recommendedHeaders: sheetDbResult.requiresSheetHeaders ? RECOMMENDED_SHEET_HEADERS : undefined,
        },
        { status: 502 }
      );
    }

    // 6. Record in duplicate check cache
    recordRecentSubmission(validData.employee.email, validData.employee.phone, registrationId);

    return NextResponse.json(
      {
        success: true,
        registration_id: registrationId,
        submitted_at: submittedAt,
        message: "Your Garba registration has been confirmed.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API Registration Error]:", error);
    return NextResponse.json(
      {
        success: false,
        errorType: "INTERNAL_ERROR",
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * Health check & SheetDB column diagnostics endpoint
 */
export async function GET() {
  const columnCheck = await getSheetColumns();
  return NextResponse.json({
    status: "ok",
    sheet_columns: columnCheck,
    recommended_headers: RECOMMENDED_SHEET_HEADERS,
  });
}
