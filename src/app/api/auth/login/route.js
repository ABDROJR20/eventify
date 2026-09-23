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

    // If user selected role, optionally update or keep existing
    let activeRole = user.role;
    if (role && ["attendee", "organizer"].includes(role) && user.role !== "admin") {
      activeRole = role;
      if (user.role !== role) {
        await updateUser(user.email, { role });
      }
    }

    // Generate JWT & session cookie
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: activeRole,
    };

    const token = await createToken(tokenPayload);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: tokenPayload,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
