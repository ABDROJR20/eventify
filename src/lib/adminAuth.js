import { getSessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function verifyAdmin() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, message: "Unauthorized. Administrator privileges required." },
          { status: 403 }
        ),
      };
    }
    return { authorized: true, user: session };
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Session verification error." },
        { status: 500 }
      ),
    };
  }
}
