import { NextResponse } from "next/server";
import { checkInTicket, getAllRegistrations, getAllEvents } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    let registrations = await getAllRegistrations();

    if (eventId && eventId !== "All") {
      registrations = registrations.filter(
        (r) => String(r.eventId) === String(eventId) || r.eventTitle === eventId
      );
    }

    const checkedIn = registrations.filter((r) => r.checkedIn);
    const pending = registrations.filter((r) => !r.checkedIn && r.status !== "Refunded");

    return NextResponse.json({
      success: true,
      stats: {
        total: registrations.length,
        checkedInCount: checkedIn.length,
        pendingCount: pending.length,
        checkInPercentage: registrations.length > 0
          ? `${Math.round((checkedIn.length / registrations.length) * 100)}%`
          : "0%",
      },
      checkedIn,
      pending,
    });
  } catch (error) {
    console.error("Check-in GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch check-in stats" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || (sessionUser.role !== "organizer" && sessionUser.role !== "admin")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Only the event organizer or admin can check in attendees." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ticketCode, orderId, email } = body;

    const query = ticketCode || orderId || email;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Ticket code, Order ID, or Email is required for check-in" },
        { status: 400 }
      );
    }

    // Verify ownership of the event if not admin
    if (sessionUser.role !== "admin") {
      const cleanQuery = query.trim().toUpperCase();
      const registrations = await getAllRegistrations();
      const targetReg = registrations.find(
        (r) =>
          (r.ticketCode && r.ticketCode.toUpperCase() === cleanQuery) ||
          (r.id && r.id.toUpperCase() === cleanQuery) ||
          (r.customerEmail && r.customerEmail.toUpperCase() === cleanQuery) ||
          (r.ticketCode && r.ticketCode.toUpperCase().includes(cleanQuery.replace("EVT-", "")))
      );

      if (targetReg) {
        const events = await getAllEvents();
        const event = events.find(
          (e) => String(e.id) === String(targetReg.eventId) || String(e.id) === `evt_${targetReg.eventId}`
        );

        if (event) {
          const isOwner =
            !event.organizerId ||
            event.organizerId === "org_default" ||
            event.organizerId === sessionUser.id ||
            (event.organizerEmail && event.organizerEmail.toLowerCase() === sessionUser.email?.toLowerCase());

          if (!isOwner) {
            return NextResponse.json(
              { success: false, error: `Forbidden: You are not the organizer for "${event.title}".` },
              { status: 403 }
            );
          }
        }
      }
    }

    const result = await checkInTicket(query);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          alreadyCheckedIn: result.alreadyCheckedIn || false,
          registration: result.registration || null,
        },
        { status: result.alreadyCheckedIn ? 409 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Check-in successful! Attendee verified.",
      data: result.registration,
    });
  } catch (error) {
    console.error("Check-in POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process check-in" },
      { status: 500 }
    );
  }
}
