import { NextResponse } from "next/server";
import { createToken, setAuthCookie } from "@/lib/auth";
import { findUserByEmail, createUser, updateUser } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, image, role = "attendee" } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Google email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    let user = await findUserByEmail(email);

    if (!user) {
      // New Google User -> Sign Up
      user = await createUser({
        name: name || email.split("@")[0],
        email: email.trim(),
        role: ["attendee", "organizer"].includes(role) ? role : "attendee",
        provider: "google",
        image: image || null,
      });
    } else {
      // Existing User -> Check role permission
      if (role === "organizer" && user.role === "attendee") {
        return NextResponse.json(
          {
            success: false,
            message: "This Google account is registered as an Attendee. You cannot log in to the Organizer portal with an Attendee account. Please switch to 'I am an Attendee'.",
          },
          { status: 403 }
        );
      }

      if (role === "attendee" && user.role === "organizer") {
        return NextResponse.json(
          {
            success: false,
            message: "This Google account is registered as an Organizer. Please switch to 'I am an Organizer' to log in.",
          },
          { status: 403 }
        );
      }

      // Update image only if not set yet (never mutate role)
      const updates = {};
      if (image && !user.image) updates.image = image;
      if (Object.keys(updates).length > 0) {
        user = await updateUser(user.email, updates);
      }
    }

    // Generate JWT and session cookie
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      provider: "google",
    };

    const token = await createToken(tokenPayload);
    await setAuthCookie(token);

    const response = NextResponse.json({
      success: true,
      message: `Successfully authenticated with Google as ${user.role}`,
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
    console.error("Google Auth error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Google authentication failed" },
      { status: 500 }
    );
  }
}
