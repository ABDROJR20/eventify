import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getAllUsers, updateUser, getAllEvents, logActivity } from "@/lib/db";

export async function GET(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const filterRole = searchParams.get("role") || "all";

    const [users, events] = await Promise.all([
      getAllUsers().catch(() => []),
      getAllEvents().catch(() => []),
    ]);

    let userList = users.map((u) => {
      const userEvents = events.filter((e) => e.organizerId === u.id || (typeof e.organizer === "string" && e.organizer.toLowerCase() === u.name?.toLowerCase()));
      
      let displayRole = "Attendee";
      if (u.role === "admin") displayRole = "Administrator";
      else if (u.role === "organizer") displayRole = "Organizer";

      return {
        id: u.id,
        name: u.name || "Eventify User",
        email: u.email,
        type: displayRole,
        status: u.status || "Active",
        createdAt: u.createdAt || new Date().toISOString(),
        eventsCount: userEvents.length,
      };
    });

    if (search) {
      userList = userList.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    if (filterRole !== "all") {
      userList = userList.filter((u) => u.type.toLowerCase() === filterRole.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      users: userList,
      counts: {
        total: users.length,
        organizers: userList.filter((u) => u.type === "Organizer").length,
        attendees: userList.filter((u) => u.type === "Attendee").length,
        admins: userList.filter((u) => u.type === "Administrator").length,
      },
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch platform users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { email, status, role } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const updates = {};
    if (status) updates.status = status;
    if (role) updates.role = role.toLowerCase();
    updates.updatedAt = new Date().toISOString();

    const updated = await updateUser(email, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found or update failed" },
        { status: 404 }
      );
    }

    await logActivity({
      user: auth.user.name || "System Admin",
      action: `Updated user ${email} status to ${status || role}`,
      event: "User Management",
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "User status updated successfully",
      user: updated,
    });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}
