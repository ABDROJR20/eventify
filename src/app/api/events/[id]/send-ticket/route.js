import { NextResponse } from "next/server";
import { getAllEvents, getAllRegistrations, updateRegistration, createRegistration } from "@/lib/db";
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

    const finalCode = ticketCode || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const finalRegId = regId || `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Ensure registration exists and is saved in DB with ticketCode
    try {
      const registrations = await getAllRegistrations();
      const existing = registrations.find(
        (r) =>
          (regId && String(r.id) === String(regId)) ||
          (r.ticketCode && r.ticketCode === finalCode)
      );

      if (existing) {
        await updateRegistration(existing.id, {
          ticketCode: finalCode,
          status: "Completed",
          ticketSent: true,
          ticketSentAt: new Date().toISOString(),
          customerName: name || existing.customerName,
          customerEmail: email || existing.customerEmail,
        });
      } else {
        await createRegistration({
          id: finalRegId,
          eventId: currentEvent.id || eventId,
          eventTitle: currentEvent.title,
          customerName: name || "Attendee",
          customerEmail: email.toLowerCase().trim(),
          customerPhone: "",
          ticketType: ticketType,
          ticketCount: 1,
          amount: typeof amount === "number" ? amount : (parseFloat(String(amount).replace(/[^0-9.]/g, "")) || 49),
          amountDisplay: typeof amount === "string" ? amount : `PKR ${amount || 49}`,
          status: "Completed",
          ticketCode: finalCode,
          checkedIn: false,
          paymentMethod: "Online",
        });
      }
    } catch (dbErr) {
      console.warn("Could not upsert registration in send-ticket:", dbErr.message);
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
      ticketCode: finalCode,
      amount: amount || "Paid",
    });

    return NextResponse.json({
      success: true,
      message: `Ticket successfully delivered to ${email}`,
      ticketCode: finalCode,
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
