import { NextResponse } from "next/server";
import { getAllEvents, getAllRegistrations, updateRegistration } from "@/lib/db";
import { sendTicketEmail } from "@/lib/email";
import { MOCK_EVENTS } from "@/lib/data";

export async function POST(request, { params }) {
  try {
    const unwrappedParams = await params;
    const eventId = unwrappedParams?.id;
    const body = await request.json();

    const {
      email,
      name,
      ticketCode,
      ticketType = "Standard Access",
      amount,
      regId,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // Lookup event
    const events = await getAllEvents();
    let currentEvent = events.find(
      (e) => String(e.id) === String(eventId) || String(e.id) === `evt_${eventId}`
    );
    if (!currentEvent) {
      currentEvent = MOCK_EVENTS.find((e) => String(e.id) === String(eventId)) || {
        id: eventId,
        title: "Event Pass",
        date: "Upcoming",
        time: "10:00 AM",
        location: "Convention Center",
      };
    }

    // Mark registration as confirmed in DB if exists
    if (regId) {
      try {
        const registrations = await getAllRegistrations();
        const reg = registrations.find((r) => String(r.id) === String(regId));
        if (reg) {
          await updateRegistration(reg.id, {
            status: "Completed",
            ticketSent: true,
            ticketSentAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn("Could not update reg in db:", dbErr.message);
      }
    }

    // Send email with dynamic QR code via Nodemailer
    const emailResult = await sendTicketEmail({
      toEmail: email,
      attendeeName: name || "Valued Attendee",
      eventTitle: currentEvent.title,
      eventDate: currentEvent.date || "Upcoming",
      eventTime: currentEvent.time || "10:00 AM",
      eventLocation: currentEvent.location || "Venue",
      ticketType: ticketType,
      ticketCode: ticketCode || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      amount: amount || "Paid",
    });

    return NextResponse.json({
      success: true,
      message: `Ticket successfully delivered to ${email}`,
      emailResult,
    });
  } catch (error) {
    console.error("Error sending ticket email endpoint:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send ticket email" },
      { status: 500 }
    );
  }
}
