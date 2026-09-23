import { NextResponse } from "next/server";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "attendee" } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password & create user
    const hashedPassword = await hashPassword(password);
    const userRole = ["attendee", "organizer", "admin"].includes(role) ? role : "attendee";
    
    const newUser = await createUser({
      name: name?.trim() || email.split("@")[0],
      email: email.trim(),
      password: hashedPassword,
      role: userRole,
      provider: "credentials",
    });

    // Create session token
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = await createToken(tokenPayload);
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: tokenPayload,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
