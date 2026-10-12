import { NextResponse } from "next/server";
import { getSessionUser, comparePassword, hashPassword } from "@/lib/auth";
import { getOrganizerSettings, updateOrganizerSettings, findUserByEmail, updateUser } from "@/lib/db";

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    const settings = await getOrganizerSettings();

    let isGoogleUser = false;
    let hasPassword = true;

    // If session user exists, merge their live profile
    if (sessionUser) {
      const dbUser = await findUserByEmail(sessionUser.email);
      if (dbUser) {
        isGoogleUser = dbUser.provider === "google";
        hasPassword = Boolean(dbUser.password);
      }
      settings.profile = {
        ...settings.profile,
        name: sessionUser.name || settings.profile?.name,
        email: sessionUser.email || settings.profile?.email,
        avatarUrl: sessionUser.image || settings.profile?.avatarUrl,
      };
      settings.security = {
        ...settings.security,
        isGoogleUser,
        hasPassword,
      };
    }

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
    const sessionUser = await getSessionUser();
    const body = await request.json();
    const { profile, payoutMethods, notifications, security } = body;

    // 1. Password Change / Set Handler (if submitted in security tab)
    if (security?.newPassword) {
      if (!sessionUser?.email) {
        return NextResponse.json(
          { success: false, error: "Authentication required to change password" },
          { status: 401 }
        );
      }

      const dbUser = await findUserByEmail(sessionUser.email);
      if (!dbUser) {
        return NextResponse.json(
          { success: false, error: "User account not found" },
          { status: 404 }
        );
      }

      // If user already has a password, verify currentPassword
      if (dbUser.password) {
        if (!security.currentPassword) {
          return NextResponse.json(
            { success: false, error: "Current password is required" },
            { status: 400 }
          );
        }

        const isCurrentValid = await comparePassword(security.currentPassword, dbUser.password);
        if (!isCurrentValid) {
          return NextResponse.json(
            { success: false, error: "Current password is incorrect" },
            { status: 400 }
          );
        }
      }

      if (security.newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const newHashed = await hashPassword(security.newPassword);
      await updateUser(dbUser.email, { password: newHashed });
    }

    // 2. User profile name/image sync (if updated in profile tab)
    if (sessionUser?.email && profile) {
      const userUpdates = {};
      if (profile.name) userUpdates.name = profile.name;
      if (profile.avatarUrl) userUpdates.image = profile.avatarUrl;
      if (Object.keys(userUpdates).length > 0) {
        await updateUser(sessionUser.email, userUpdates);
      }
    }

    // 3. Save organizer settings
    const updated = await updateOrganizerSettings({
      ...(profile ? { profile } : {}),
      ...(payoutMethods ? { payoutMethods } : {}),
      ...(notifications ? { notifications } : {}),
      ...(security ? { security: { twoFactorEnabled: Boolean(security.twoFactorEnabled) } } : {}),
    });

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
