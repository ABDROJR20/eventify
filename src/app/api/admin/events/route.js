import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getAllEvents, updateEvent, deleteEvent, logActivity } from "@/lib/db";

export async function GET(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const filterStatus = searchParams.get("status") || "all";

    let events = await getAllEvents();

    if (search) {
      events = events.filter(
        (e) =>
          e.title?.toLowerCase().includes(search) ||
          e.id?.toLowerCase().includes(search) ||
          (typeof e.organizer === "string" && e.organizer.toLowerCase().includes(search))
      );
    }

    if (filterStatus !== "all") {
      events = events.filter((e) => {
        const s = (e.status || "").toLowerCase();
        if (filterStatus === "live") return s === "published" || s === "live";
        if (filterStatus === "pending") return s === "draft" || s === "pending";
        if (filterStatus === "suspended") return s === "suspended";
        return true;
      });
    }

    const mappedEvents = events.map((e) => {
      let displayStatus = "Live";
      const s = (e.status || "").toLowerCase();
      if (s === "draft" || s === "pending") displayStatus = "Pending";
      else if (s === "suspended") displayStatus = "Suspended";
      else displayStatus = "Live";

      return {
        id: e.id,
        title: e.title,
        organizer: e.organizerName || (typeof e.organizer === "string" ? e.organizer : "Platform Organizer"),
        status: displayStatus,
        date: e.date,
        price: e.price,
        ticketsSold: e.ticketsSold || 0,
        capacity: e.capacity || 100,
      };
    });

    return NextResponse.json({
      success: true,
      events: mappedEvents,
      counts: {
        total: events.length,
        live: mappedEvents.filter((e) => e.status === "Live").length,
        pending: mappedEvents.filter((e) => e.status === "Pending").length,
        suspended: mappedEvents.filter((e) => e.status === "Suspended").length,
      },
    });
  } catch (error) {
    console.error("Admin events fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load master events list" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Event ID and new status are required" },
        { status: 400 }
      );
    }

    // Map UI status to DB status
    let dbStatus = "Published";
    if (status.toLowerCase() === "suspended") dbStatus = "Suspended";
    else if (status.toLowerCase() === "pending") dbStatus = "Draft";
    else dbStatus = "Published";

    const updated = await updateEvent(id, {
      status: dbStatus,
      updatedAt: new Date().toISOString(),
    });

    await logActivity({
      user: auth.user.name || "System Admin",
      action: `Updated status of event ${id} to ${status}`,
      event: updated.title,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Event status updated to ${status}`,
      event: updated,
    });
  } catch (error) {
    console.error("Admin update event error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    await deleteEvent(id);

    await logActivity({
      user: auth.user.name || "System Admin",
      action: `Deleted event ${id}`,
      event: id,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Event removed from platform successfully",
    });
  } catch (error) {
    console.error("Admin delete event error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove event" },
      { status: 500 }
    );
  }
}
