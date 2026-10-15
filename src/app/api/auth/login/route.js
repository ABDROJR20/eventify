import { NextResponse } from "next/server";
import { comparePassword, createToken, setAuthCookie } from "@/lib/auth";
import { findUserByEmail, updateUser } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If account was created with Google only and has no password
    if (!user.password && user.provider === "google") {
      return NextResponse.json(
        {
          success: false,
          message: "This account was created with Google. Please use Google Sign In.",
        },
        { status: 400 }
      );
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Strict Role Validation: Prevent Attendees from logging in to Organizer portal & vice-versa
    if (role === "organizer" && user.role === "attendee") {
      return NextResponse.json(
        {
          success: false,
          message: "This account is registered as an Attendee. You cannot log in to the Organizer portal with an Attendee account. Please switch to 'I am an Attendee' to log in.",
        },
        { status: 403 }
      );
    }

    if (role === "attendee" && user.role === "organizer") {
      return NextResponse.json(
        {
          success: false,
          message: "This account is registered as an Organizer. Please switch to 'I am an Organizer' to log in.",
        },
        { status: 403 }
      );
    }

    const activeRole = user.role;

    // Generate JWT & session cookie
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: activeRole,
    };

    const token = await createToken(tokenPayload);
    await setAuthCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: tokenPayload,
    });

    response.cookies.set("eventify_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
