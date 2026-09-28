import { NextResponse } from "next/server";
import { getOrganizerSettings, updateOrganizerSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getOrganizerSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await updateOrganizerSettings(body);

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Settings PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
