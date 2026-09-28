import { NextResponse } from "next/server";
import { 
  getAllAttendees, 
  createAttendee, 
  updateAttendee, 
  createRegistration, 
  getAllEvents,
  logActivity 
} from "@/lib/db";
import { MOCK_EVENTS } from "@/lib/data";

export async function POST(request, { params }) {
  try {
    const unwrappedParams = await params;
    const eventId = unwrappedParams?.id;
    const body = await request.json();

    const { name, email, phone, ticketTier = "standard", amount, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and Email are required." },
        { status: 400 }
      );
    }

    // Lookup event details
    const dbEvents = await getAllEvents();
    let currentEvent = dbEvents.find(e => String(e.id) === String(eventId) || String(e.id) === `evt_${eventId}`);
    if (!currentEvent) {
      currentEvent = MOCK_EVENTS.find(e => String(e.id) === String(eventId)) || {
        id: eventId,
        title: "Event Registration",
        price: "PKR 49.00",
        date: "Upcoming",
        time: "10:00 AM",
        location: "Main Convention Center"
      };
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = (phone || "").trim();

    // 1. Check if attendee already exists in database
    const attendees = await getAllAttendees();
    let attendee = attendees.find(a => (a.email || "").toLowerCase() === cleanEmail);

    if (attendee) {
      attendee = await updateAttendee(attendee.id, {
        name: cleanName,
        phone: cleanPhone || attendee.phone,
        events: (Number(attendee.events) || 1) + 1,
        vip: ticketTier === 'vip' ? true : attendee.vip
      });
    } else {
      attendee = await createAttendee({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        events: 1,
        vip: ticketTier === 'vip'
      });
    }

    // 2. Determine ticket display & numerical price
    const ticketTypeTitle = ticketTier === 'vip' ? 'VIP Pass' : 'Standard';
    const parsedAmount = typeof amount === 'number' 
      ? amount 
      : (ticketTier === 'vip' ? 199 : (typeof currentEvent.price === 'number' ? currentEvent.price : parseFloat(String(currentEvent.price).replace(/[^0-9.]/g, '')) || 49));

    // 3. Create initial registration order
    const regId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketCode = `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const registration = await createRegistration({
      id: regId,
      eventId: currentEvent.id || eventId,
      eventTitle: currentEvent.title,
      customerName: cleanName,
      customerEmail: cleanEmail,
      customerPhone: cleanPhone,
      ticketType: ticketTypeTitle,
      ticketCount: 1,
      amount: parsedAmount,
      amountDisplay: `PKR ${parsedAmount.toFixed(2)}`,
      status: "Pending Payment",
      ticketCode: ticketCode,
      checkedIn: false
    });

    return NextResponse.json({
      success: true,
      message: "Registration initiated successfully.",
      registrationId: registration.id,
      ticketCode: registration.ticketCode,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        vip: attendee.vip
      },
      event: {
        id: currentEvent.id,
        title: currentEvent.title,
        date: currentEvent.date,
        time: currentEvent.time,
        location: currentEvent.location
      },
      ticketType: ticketTypeTitle,
      amount: parsedAmount,
      amountDisplay: `PKR ${parsedAmount.toFixed(2)}`
    });

  } catch (error) {
    console.error("Error creating event registration:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process registration." },
      { status: 500 }
    );
  }
}
