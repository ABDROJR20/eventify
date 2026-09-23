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
      // Existing User -> Update image or role if specified
      const updates = {};
      if (image && !user.image) updates.image = image;
      if (role && ["attendee", "organizer"].includes(role) && user.role !== "admin") {
        updates.role = role;
      }
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

    return NextResponse.json({
      success: true,
      message: `Successfully authenticated with Google as ${user.role}`,
      user: tokenPayload,
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Google authentication failed" },
      { status: 500 }
    );
  }
}
