import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { 
  getAllTeamRoles, 
  createTeamRole, 
  updateTeamRole, 
  deleteTeamRole, 
  getAllEvents,
  createNotification 
} from "@/lib/db";
import { sendTeamInviteEmail } from "@/lib/email";

// GET: Retrieve all team roles for current organizer
export async function GET(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || (sessionUser.role !== "organizer" && sessionUser.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Organizer access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    let roles = await getAllTeamRoles();

    if (sessionUser.role !== "admin") {
      // Show roles invited by this organizer, or for events owned by this organizer
      const events = await getAllEvents();
      const myEventIds = events
        .filter(
          (e) =>
            !e.organizerId ||
            e.organizerId === "org_default" ||
            e.organizerId === sessionUser.id ||
            (e.organizerEmail && e.organizerEmail.toLowerCase() === sessionUser.email?.toLowerCase())
        )
        .map((e) => String(e.id));

      roles = roles.filter(
        (r) =>
          r.invitedBy === sessionUser.id ||
          (r.invitedByEmail && r.invitedByEmail.toLowerCase() === sessionUser.email?.toLowerCase()) ||
          myEventIds.includes(String(r.eventId)) ||
          r.eventId === "all"
      );
    }

    if (eventId && eventId !== "all") {
      roles = roles.filter((r) => String(r.eventId) === String(eventId));
    }

    return NextResponse.json({
      success: true,
      roles,
      total: roles.length,
    });
  } catch (error) {
    console.error("Team Roles GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch team roles." },
      { status: 500 }
    );
  }
}

// POST: Add new team member, assign authorities & send invite email
export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || (sessionUser.role !== "organizer" && sessionUser.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Organizer access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, eventId, roleTitle, permissions } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Team member name is required." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Team member email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Lookup event title
    const events = await getAllEvents();
    const event = events.find((e) => String(e.id) === String(eventId));
    const eventTitle = event ? event.title : (eventId === "all" ? "All My Events" : "Eventify Showcase");

    const newRole = await createTeamRole({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      eventId: eventId || "evt_1",
      eventTitle,
      roleTitle: roleTitle || "Event Staff & Gate Scanner",
      permissions: {
        canCheckIn: Boolean(permissions?.canCheckIn),
        canViewAttendees: Boolean(permissions?.canViewAttendees),
        canEditEvent: Boolean(permissions?.canEditEvent),
        canSendBroadcast: Boolean(permissions?.canSendBroadcast),
        canViewRevenue: Boolean(permissions?.canViewRevenue),
      },
      status: "Active",
      invitedBy: sessionUser.id,
      invitedByEmail: sessionUser.email,
      invitedByName: sessionUser.name || "Organizer",
    });

    // Send official invitation email
    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://eventify-tawny-one.vercel.app";
    const inviteUrl = `${appOrigin}/verify-ticket`;

    await sendTeamInviteEmail({
      toEmail: email.trim().toLowerCase(),
      inviteeName: name.trim(),
      organizerName: sessionUser.name || "Event Organizer",
      eventTitle,
      roleTitle: newRole.roleTitle,
      permissions: newRole.permissions,
      inviteUrl,
    });

    // Create real-time notification
    await createNotification({
      title: "Team Role Assigned 👥",
      message: `${name} has been assigned as "${newRole.roleTitle}" for "${eventTitle}".`,
      type: "system",
      targetRole: "organizer",
      actionUrl: "/dashboard/roles",
    });

    return NextResponse.json({
      success: true,
      message: `Team member invited successfully! An invitation email has been sent to ${email.trim()}.`,
      role: newRole,
    }, { status: 201 });
  } catch (error) {
    console.error("Team Roles POST Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create team role." },
      { status: 500 }
    );
  }
}

// DELETE: Revoke role
export async function DELETE(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || (sessionUser.role !== "organizer" && sessionUser.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Organizer access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Role ID is required." },
        { status: 400 }
      );
    }

    await deleteTeamRole(id);

    return NextResponse.json({
      success: true,
      message: "Role removed successfully.",
    });
  } catch (error) {
    console.error("Team Roles DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete team role." },
      { status: 500 }
    );
  }
}
