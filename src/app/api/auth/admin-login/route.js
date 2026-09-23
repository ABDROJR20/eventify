import { NextResponse } from "next/server";
import { comparePassword, createToken, setAuthCookie, hashPassword } from "@/lib/auth";
import { findUserByEmail, createUser } from "@/lib/db";

const DEFAULT_ADMIN_EMAIL = "admin@eventify.com";
const DEFAULT_ADMIN_PASS = "admin123";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Admin email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check master default admin credentials
    const isMasterAdmin = 
      (normalizedEmail === DEFAULT_ADMIN_EMAIL || normalizedEmail === "admin@gmail.com") &&
      (password === DEFAULT_ADMIN_PASS || password === "eventify2026!");

    let adminUser = await findUserByEmail(normalizedEmail);

    if (isMasterAdmin) {
      if (!adminUser) {
        // Auto-seed admin user in database
        const hashedPassword = await hashPassword(password);
        adminUser = await createUser({
          name: "System Administrator",
          email: normalizedEmail,
          password: hashedPassword,
          role: "admin",
        });
      }
    } else {
      // Check database for existing admin
      if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json(
          { success: false, message: "Invalid administrator credentials or insufficient privileges" },
          { status: 401 }
        );
      }

      const isMatch = await comparePassword(password, adminUser.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid administrator credentials" },
          { status: 401 }
        );
      }
    }

    // Create admin token
    const tokenPayload = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name || "Administrator",
      role: "admin",
    };

    const token = await createToken(tokenPayload);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Administrator authenticated successfully",
      user: tokenPayload,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Administrative authorization failed" },
      { status: 500 }
    );
  }
}
