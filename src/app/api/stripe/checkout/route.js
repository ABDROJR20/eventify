import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getAllEvents, createRegistration, getAllRegistrations } from "@/lib/db";
import { MOCK_EVENTS } from "@/lib/data";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      eventId,
      registrationId,
      name,
      email,
      phone,
      ticketType = "Standard Access",
      amount = 49,
      currency = "pkr"
    } = body;

    if (!eventId || !email || !name) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (eventId, email, name)." },
        { status: 400 }
      );
    }

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

    // Ensure registration ID
    let regId = registrationId;
    if (!regId) {
      const regIdNum = Math.floor(1000 + Math.random() * 9000);
      regId = `#ORD-${regIdNum}`;
      const ticketCode = `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      await createRegistration({
        id: regId,
        eventId: currentEvent.id || eventId,
        eventTitle: currentEvent.title,
        customerName: name,
        customerEmail: email,
        customerPhone: phone || "",
        ticketType: ticketType,
        ticketCount: 1,
        amount: Number(amount),
        amountDisplay: `PKR ${Number(amount).toFixed(2)}`,
        status: "Pending Payment",
        ticketCode: ticketCode,
        checkedIn: false,
        paymentMethod: "Stripe"
      });
    }

    // Determine base URL (handles localhost and production Vercel)
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://eventify-tawny-one.vercel.app";

    const numAmount = Number(amount) || 49;
    
    // Live exchange rate: 1 USD = 278.50 PKR
    // Convert PKR price to USD for Stripe Checkout
    const USD_RATE = 278.50;
    let convertedUsd = Number((numAmount / USD_RATE).toFixed(2));
    
    // Stripe requires at least $0.50 USD minimum for any checkout session
    if (convertedUsd < 0.50) {
      convertedUsd = 0.50;
    }

    const unitAmountInCents = Math.round(convertedUsd * 100);

    // Create Stripe Checkout Session in USD
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${currentEvent.title} - ${ticketType}`,
              description: `Event Date: ${currentEvent.date || "Upcoming"} | Attendee: ${name} (PKR ${numAmount} converted to USD $${convertedUsd.toFixed(2)})`,
              images: currentEvent.image ? [currentEvent.image] : [],
            },
            unit_amount: unitAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: {
        registrationId: regId,
        eventId: String(eventId),
        eventTitle: currentEvent.title,
        attendeeName: name,
        attendeeEmail: email,
        attendeePhone: phone || "",
        ticketTier: ticketType,
        originalAmountPKR: String(numAmount),
        amountUSD: String(convertedUsd),
      },
      success_url: `${origin}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}&regId=${encodeURIComponent(regId)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone || '')}&tier=${encodeURIComponent(ticketType)}&amount=${encodeURIComponent(`$${convertedUsd.toFixed(2)} (PKR ${numAmount})`)}&gateway=Stripe`,
      cancel_url: `${origin}/events/${eventId}/checkout?regId=${encodeURIComponent(regId)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone || '')}&tier=${encodeURIComponent(ticketType)}&cancelled=true`,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to initialize Stripe session" },
      { status: 500 }
    );
  }
}
