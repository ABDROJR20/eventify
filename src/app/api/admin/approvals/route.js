import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getAllEvents, updateEvent, createNotification, logActivity } from "@/lib/db";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const events = await getAllEvents();
    // Events that are in Draft or Pending or Pending Review status
    const pendingApprovals = events
      .filter((e) => e.status === "Draft" || e.status === "Pending" || e.status === "Pending Review")
      .map((e) => ({
        id: e.id,
        title: e.title,
        organizer: e.organizerName || (typeof e.organizer === "string" ? e.organizer : "Platform Organizer"),
        category: e.category || "General",
        date: e.date || "Upcoming",
        price: e.price || 0,
        status: e.status,
        createdAt: e.createdAt,
      }));

    return NextResponse.json({
      success: true,
      approvals: pendingApprovals,
    });
  } catch (error) {
    console.error("Admin approvals fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load pending approvals" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { eventId, action, reason } = body;

    if (!eventId || !action) {
      return NextResponse.json(
        { success: false, message: "Event ID and action ('approve' | 'reject') are required." },
        { status: 400 }
      );
    }

    const events = await getAllEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Target event not found" },
        { status: 404 }
      );
    }

    const isApprove = action.toLowerCase() === "approve";
    const newStatus = isApprove ? "Published" : "Suspended";

    const updated = await updateEvent(eventId, {
      status: newStatus,
      reviewedByAdmin: auth.user.email,
      reviewedAt: new Date().toISOString(),
      adminNotes: reason || (isApprove ? "Approved by Platform Administrator" : "Rejected by Platform Administrator"),
    });

    // Notify event organizer
    await createNotification({
      title: isApprove ? "Event Approved!" : "Event Submission Update",
      message: isApprove
        ? `Your event "${event.title}" has been approved by the admin and is now live for attendees.`
        : `Your event "${event.title}" was rejected: ${reason || "Does not meet platform guidelines."}`,
      type: isApprove ? "success" : "alert",
      role: "organizer",
      link: `/dashboard/events`,
    }).catch((err) => console.warn("Failed to create notification:", err.message));

    await logActivity({
      user: auth.user.name || "System Admin",
      action: `${isApprove ? "Approved" : "Rejected"} event: ${event.title}`,
      event: event.title,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Event successfully ${isApprove ? "approved and published" : "rejected"}`,
      event: updated,
    });
  } catch (error) {
    console.error("Admin approval action error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process approval decision" },
      { status: 500 }
    );
  }
}
