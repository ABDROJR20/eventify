import { NextResponse } from "next/server";
import { getAllRegistrations, getAllEvents, updateRegistration } from "@/lib/db";
import { MOCK_EVENTS } from "@/lib/data";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = (searchParams.get("code") || searchParams.get("ticket") || "").trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Ticket Code is required." },
        { status: 400 }
      );
    }

    const registrations = await getAllRegistrations();
    const cleanCode = code.replace(/[^A-Z0-9-]/gi, "");

    let reg = registrations.find(
      (r) =>
        (r.ticketCode && r.ticketCode.toUpperCase() === cleanCode) ||
        (r.id && r.id.toUpperCase() === cleanCode)
    );

    // If not found in registrations, check with loose match or mock fallback
    if (!reg) {
      reg = registrations.find(
        (r) =>
          r.ticketCode &&
          r.ticketCode.toUpperCase().includes(cleanCode.replace("EVT-", ""))
      );
    }

    if (!reg) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: "Invalid ticket code. No matching registration found.",
      });
    }

    // Lookup corresponding event details
    const events = await getAllEvents();
    let event = events.find(
      (e) => String(e.id) === String(reg.eventId) || String(e.id) === `evt_${reg.eventId}`
    );
    if (!event) {
      event = MOCK_EVENTS.find((e) => String(e.id) === String(reg.eventId)) || {
        id: reg.eventId,
        title: reg.eventTitle || "Global Tech Summit 2026",
        date: "July 24, 2026",
        time: "09:00 AM",
        location: "Pearl Continental, Lahore",
        category: "Technology",
      };
    }

    return NextResponse.json({
      success: true,
      valid: true,
      registration: {
        id: reg.id,
        ticketCode: reg.ticketCode,
        customerName: reg.customerName,
        customerEmail: reg.customerEmail,
        customerPhone: reg.customerPhone,
        ticketType: reg.ticketType || "Standard",
        amount: reg.amount,
        amountDisplay: reg.amountDisplay || `PKR ${reg.amount}`,
        status: reg.status || "Completed",
        checkedIn: Boolean(reg.checkedIn),
        checkedInAt: reg.checkedInAt,
        paymentMethod: reg.paymentMethod || "Online",
        createdAt: reg.createdAt,
      },
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        image: event.image,
      },
    });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Verification failed." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { ticketCode, action } = body;

    if (!ticketCode) {
      return NextResponse.json({ success: false, message: "Ticket code is required." }, { status: 400 });
    }

    const registrations = await getAllRegistrations();
    const cleanCode = ticketCode.trim().toUpperCase();

    const reg = registrations.find(
      (r) =>
        (r.ticketCode && r.ticketCode.toUpperCase() === cleanCode) ||
        (r.id && r.id.toUpperCase() === cleanCode)
    );

    if (!reg) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    if (action === "check-in") {
      if (reg.checkedIn) {
        return NextResponse.json({
          success: false,
          alreadyCheckedIn: true,
          message: `Already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString()}`,
          registration: reg,
        });
      }

      const updated = await updateRegistration(reg.id, {
        checkedIn: true,
        checkedInAt: new Date().toISOString(),
        status: "Checked In",
      });

      return NextResponse.json({
        success: true,
        message: "Check-in successful! Attendee verified at the venue.",
        registration: updated,
      });
    }

    return NextResponse.json({ success: true, registration: reg });
  } catch (error) {
    console.error("Error updating ticket check-in:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
