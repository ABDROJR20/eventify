import { NextResponse } from "next/server";
import { updateRegistration, getAllRegistrations } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const registrations = await getAllRegistrations();
    const reg = registrations.find(
      (r) => String(r.id).toLowerCase() === String(id).toLowerCase()
    );

    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Registration order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reg,
    });
  } catch (error) {
    console.error("Registration GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch registration" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateRegistration(id, body);

    return NextResponse.json({
      success: true,
      message: "Registration updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Registration Update Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update registration" },
      { status: 500 }
    );
  }
}
