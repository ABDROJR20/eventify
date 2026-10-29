import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getOrganizerSettings, updateOrganizerSettings, logActivity } from "@/lib/db";

const DEFAULT_GLOBAL_SETTINGS = {
  ticketFeePercent: "5.0",
  platformCurrency: "PKR",
  payoutFrequency: "Weekly (Every Monday)",
  maintenanceMode: false,
  supportEmail: "support@eventify.com",
  stripeConnected: true,
  emailNotifications: true,
};

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const dbSettings = await getOrganizerSettings().catch(() => ({}));
    return NextResponse.json({
      success: true,
      settings: {
        ...DEFAULT_GLOBAL_SETTINGS,
        ...(dbSettings.globalSettings || {}),
      },
    });
  } catch (error) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load global settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const current = await getOrganizerSettings().catch(() => ({}));

    const updatedGlobal = {
      ...(current.globalSettings || DEFAULT_GLOBAL_SETTINGS),
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.user.email,
    };

    await updateOrganizerSettings({
      globalSettings: updatedGlobal,
    });

    await logActivity({
      user: auth.user.name || "System Admin",
      action: "Updated Global Configuration settings",
      event: "Platform Settings",
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Global configuration saved successfully",
      settings: updatedGlobal,
    });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update global settings" },
      { status: 500 }
    );
  }
}
