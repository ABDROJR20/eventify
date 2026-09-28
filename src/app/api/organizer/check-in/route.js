import { NextResponse } from "next/server";
import { checkInTicket, getAllRegistrations } from "@/lib/db";

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
    const body = await request.json();
    const { ticketCode, orderId, email } = body;

    const query = ticketCode || orderId || email;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Ticket code, Order ID, or Email is required for check-in" },
        { status: 400 }
      );
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
