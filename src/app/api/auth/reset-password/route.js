import { NextResponse } from "next/server";
import { getOtp, deleteOtp, findUserByEmail, updateUserPassword } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, OTP code, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP code
    const storedRecord = await getOtp(normalizedEmail);
    if (!storedRecord || String(storedRecord.otp).trim() !== String(otp).trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Check user
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found" },
        { status: 404 }
      );
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(normalizedEmail, hashedPassword);

    // Invalidate OTP
    await deleteOtp(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
