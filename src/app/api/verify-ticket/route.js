import { NextResponse } from "next/server";
import { getAllRegistrations, getAllEvents, updateRegistration, createNotification } from "@/lib/db";
import { getDatabase } from "@/lib/mongodb";
import { MOCK_EVENTS } from "@/lib/data";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCode = (searchParams.get("code") || searchParams.get("ticket") || "").trim();

    if (!rawCode) {
      return NextResponse.json(
        { success: false, message: "Ticket Code is required." },
        { status: 400 }
      );
    }

    const upperCode = rawCode.toUpperCase();
    const cleanCode = upperCode.replace(/[^A-Z0-9-]/gi, "");
    const rawNoPrefix = cleanCode.replace(/^EVT-?/i, "");

    // 1. Direct search in MongoDB if available
    let reg = null;
    try {
      const db = await getDatabase();
      if (db) {
        reg = await db.collection("registrations").findOne({
          $or: [
            { ticketCode: cleanCode },
            { ticketCode: { $regex: new RegExp(`^${cleanCode}$`, "i") } },
            { ticketCode: { $regex: new RegExp(rawNoPrefix, "i") } },
            { id: cleanCode },
            { id: { $regex: new RegExp(`^#?${cleanCode}$`, "i") } },
            { id: `#ORD-${rawNoPrefix}` },
            { customerEmail: rawCode.toLowerCase() },
          ],
        });
        if (reg && reg._id) {
          const { _id, ...cleanReg } = reg;
          reg = cleanReg;
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB direct lookup in verify-ticket error:", dbErr.message);
    }

    // 2. Fallback to cached/file registrations
    if (!reg) {
      const registrations = await getAllRegistrations();
      reg = registrations.find((r) => {
        const rTicket = (r.ticketCode || "").toUpperCase();
        const rId = (r.id || "").toUpperCase();
        const rEmail = (r.customerEmail || "").toLowerCase();

        return (
          rTicket === cleanCode ||
          rTicket === `EVT-${cleanCode}` ||
          rTicket.replace("EVT-", "") === rawNoPrefix ||
          rId === cleanCode ||
          rId === `#${cleanCode}` ||
          rId === `#ORD-${rawNoPrefix}` ||
          rEmail === rawCode.toLowerCase()
        );
      });
    }

    if (!reg) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: `Invalid ticket code (${rawCode}). No matching verified registration found.`,
      });
    }

    // Lookup corresponding event details
    const events = await getAllEvents();
    let event = events.find(
      (e) => String(e.id) === String(reg.eventId) || String(e.id) === `evt_${reg.eventId}`
    );
    if (!event) {
      event = MOCK_EVENTS.find((e) => String(e.id) === String(reg.eventId)) || {
        id: reg.eventId || "evt_1",
        title: reg.eventTitle || "Global Tech Summit 2026",
        date: "Upcoming",
        time: "10:00 AM",
        location: "Karachi Expo Center, PK",
        category: "Technology",
      };
    }

    return NextResponse.json({
      success: true,
      valid: true,
      registration: {
        id: reg.id,
        ticketCode: reg.ticketCode,
        customerName: reg.customerName || "Valued Attendee",
        customerEmail: reg.customerEmail,
        customerPhone: reg.customerPhone || "",
        ticketType: reg.ticketType || "Standard Access",
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

    const cleanCode = ticketCode.trim().toUpperCase();
    const rawNoPrefix = cleanCode.replace(/^EVT-?/i, "");

    let reg = null;

    // Direct MongoDB lookup
    try {
      const db = await getDatabase();
      if (db) {
        reg = await db.collection("registrations").findOne({
          $or: [
            { ticketCode: cleanCode },
            { ticketCode: { $regex: new RegExp(`^${cleanCode}$`, "i") } },
            { ticketCode: { $regex: new RegExp(rawNoPrefix, "i") } },
            { id: cleanCode },
            { id: `#ORD-${rawNoPrefix}` },
          ],
        });
        if (reg && reg._id) {
          const { _id, ...cleanReg } = reg;
          reg = cleanReg;
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB post verify error:", dbErr.message);
    }

    if (!reg) {
      const registrations = await getAllRegistrations();
      reg = registrations.find(
        (r) =>
          (r.ticketCode && r.ticketCode.toUpperCase() === cleanCode) ||
          (r.ticketCode && r.ticketCode.toUpperCase().includes(rawNoPrefix)) ||
          (r.id && r.id.toUpperCase() === cleanCode)
      );
    }

    if (!reg) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    if (action === "check-in") {
      if (reg.checkedIn) {
        return NextResponse.json({
          success: false,
          alreadyCheckedIn: true,
          message: `Already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          registration: reg,
        });
      }

      const updated = await updateRegistration(reg.id, {
        checkedIn: true,
        checkedInAt: new Date().toISOString(),
        status: "Checked In",
      });

      // Real-time notifications for Organizer & Attendee
      await createNotification({
        title: "Attendee Checked In ✅",
        message: `${reg.customerName} verified at the entrance for "${reg.eventTitle || "Event"}".`,
        type: "checkin",
        targetRole: "organizer",
        actionUrl: "/dashboard/attendees",
      });

      if (reg.customerEmail) {
        await createNotification({
          title: "Welcome to the Event! 🎟️",
          message: `You've been successfully checked in for "${reg.eventTitle || "Event"}". Enjoy the experience!`,
          type: "checkin",
          targetRole: "attendee",
          userEmail: reg.customerEmail,
          actionUrl: "/portal",
        });
      }

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
