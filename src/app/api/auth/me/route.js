import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const dbUser = await findUserById(session.id);
    const user = dbUser
      ? {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          image: dbUser.image,
          provider: dbUser.provider,
        }
      : session;

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
