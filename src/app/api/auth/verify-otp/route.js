import { NextResponse } from "next/server";
import { getOtp } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const storedRecord = await getOtp(normalizedEmail);

    if (!storedRecord) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired or was not requested" },
        { status: 400 }
      );
    }

    if (String(storedRecord.otp).trim() !== String(otp).trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code confirmed",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify code" },
      { status: 500 }
    );
  }
}
