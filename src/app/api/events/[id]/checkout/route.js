import { NextResponse } from "next/server";
import { 
  getAllRegistrations, 
  updateRegistration, 
  createRegistration, 
  getAllEvents, 
  updateEvent,
  logActivity 
} from "@/lib/db";
import { sendTicketEmail } from "@/lib/email";
import { MOCK_EVENTS } from "@/lib/data";

export async function POST(request, { params }) {
  try {
    const unwrappedParams = await params;
    const eventId = unwrappedParams?.id;
    const body = await request.json();

    const { 
      registrationId, 
      paymentMethod = "credit_card", 
      paymentDetails = {},
      name, 
      email, 
      phone, 
      ticketType = "Standard", 
      amount = 49 
    } = body;

    // Lookup event
    const dbEvents = await getAllEvents();
    let currentEvent = dbEvents.find(e => String(e.id) === String(eventId) || String(e.id) === `evt_${eventId}`);
    if (!currentEvent) {
      currentEvent = MOCK_EVENTS.find(e => String(e.id) === String(eventId)) || {
        id: eventId,
        title: "Event Registration",
        price: `PKR ${amount}`,
        date: "Upcoming",
        time: "10:00 AM",
        location: "Convention Center"
      };
    }

    let reg = null;
    const registrations = await getAllRegistrations();

    if (registrationId) {
      reg = registrations.find(r => String(r.id) === String(registrationId));
    }

    if (reg) {
      reg = await updateRegistration(reg.id, {
        status: "Completed",
        paymentMethod: paymentMethod,
        paymentGateway: paymentDetails.gateway || paymentMethod,
        paidAt: new Date().toISOString()
      });
    } else {
      // Fallback create completed registration directly
      const regId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const ticketCode = `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      reg = await createRegistration({
        id: regId,
        eventId: currentEvent.id || eventId,
        eventTitle: currentEvent.title,
        customerName: name || "Attendee",
        customerEmail: (email || "").toLowerCase().trim(),
        customerPhone: phone || "",
        ticketType: ticketType,
        ticketCount: 1,
        amount: Number(amount) || 49,
        amountDisplay: `PKR ${Number(amount).toFixed(2)}`,
        status: "Completed",
        ticketCode: ticketCode,
        checkedIn: false,
        paymentMethod: paymentMethod
      });
    }

    // Try incrementing event ticketsSold & revenue if event exists in db
    try {
      if (currentEvent && currentEvent.ticketsSold !== undefined) {
        await updateEvent(currentEvent.id, {
          ticketsSold: (currentEvent.ticketsSold || 0) + 1,
          revenue: (currentEvent.revenue || 0) + (Number(reg.amount) || 0)
        });
      }
    } catch (e) {
      // Ignore if mock event
    }

    // Send confirmation email with QR code
    if (reg.customerEmail) {
      sendTicketEmail({
        toEmail: reg.customerEmail,
        attendeeName: reg.customerName,
        eventTitle: currentEvent.title,
        eventDate: currentEvent.date,
        eventTime: currentEvent.time,
        eventLocation: currentEvent.location,
        ticketType: reg.ticketType,
        ticketCode: reg.ticketCode,
        amount: reg.amountDisplay || `PKR ${reg.amount}`
      }).catch(err => console.warn("Background ticket email send error:", err.message));
    }

    return NextResponse.json({
      success: true,
      message: "Payment confirmed and ticket issued successfully.",
      registration: reg,
      ticketCode: reg.ticketCode,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Eventify-Ticket-${reg.ticketCode}-${encodeURIComponent(reg.customerName)}`
    });

  } catch (error) {
    console.error("Error finalizing checkout:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
