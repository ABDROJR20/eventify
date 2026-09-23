import { NextResponse } from "next/server";
import { findUserByEmail, saveOtp } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email address." },
        { status: 404 }
      );
    }

    // Generate random 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with 10-minute expiration
    await saveOtp(normalizedEmail, otp, 10);

    // Send email using Nodemailer
    try {
      await sendOtpEmail(normalizedEmail, otp, user.name);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email. Please check SMTP configuration or try again.",
          error: emailError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
