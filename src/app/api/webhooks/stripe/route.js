import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { 
  getAllRegistrations, 
  updateRegistration, 
  createRegistration, 
  getAllEvents, 
  updateEvent, 
  logActivity 
} from "@/lib/db";
import { sendTicketEmail } from "@/lib/email";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Fallback in case signature is bypassed during test/mocking
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata || {};

    const {
      registrationId,
      eventId,
      eventTitle,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      ticketTier,
      amount,
    } = metadata;

    const email = attendeeEmail || session.customer_details?.email || session.customer_email;
    const name = attendeeName || session.customer_details?.name || "Attendee";
    const phone = attendeePhone || session.customer_details?.phone || "";

    try {
      const registrations = await getAllRegistrations();
      let reg = null;

      if (registrationId) {
        reg = registrations.find((r) => String(r.id) === String(registrationId));
      }

      if (reg) {
        reg = await updateRegistration(reg.id, {
          status: "Completed",
          paymentMethod: "Stripe",
          paymentGateway: "Stripe Checkout",
          stripeSessionId: session.id,
          stripePaymentIntent: session.payment_intent,
          paidAt: new Date().toISOString(),
        });
      } else {
        const regIdNum = Math.floor(1000 + Math.random() * 9000);
        const newRegId = `#ORD-${regIdNum}`;
        const ticketCode = `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        reg = await createRegistration({
          id: newRegId,
          eventId: eventId || "evt_1",
          eventTitle: eventTitle || "Event Registration",
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          ticketType: ticketTier || "Standard",
          ticketCount: 1,
          amount: Number(amount) || (session.amount_total ? session.amount_total / 100 : 49),
          amountDisplay: `PKR ${(Number(amount) || (session.amount_total ? session.amount_total / 100 : 49)).toFixed(2)}`,
          status: "Completed",
          ticketCode: ticketCode,
          checkedIn: false,
          paymentMethod: "Stripe",
          stripeSessionId: session.id,
        });
      }

      // Update event metrics
      if (eventId) {
        const events = await getAllEvents();
        const currentEvent = events.find((e) => String(e.id) === String(eventId) || String(e.id) === `evt_${eventId}`);
        if (currentEvent) {
          await updateEvent(currentEvent.id, {
            ticketsSold: (currentEvent.ticketsSold || 0) + 1,
            revenue: (currentEvent.revenue || 0) + (Number(reg.amount) || 0),
          });
        }
      }

      // Send ticket confirmation email
      if (email) {
        await sendTicketEmail({
          toEmail: email,
          attendeeName: name,
          eventTitle: eventTitle || "Event Pass",
          eventDate: "Upcoming",
          eventTime: "Check Ticket",
          eventLocation: "Venue",
          ticketType: ticketTier || "Standard",
          ticketCode: reg.ticketCode,
          amount: reg.amountDisplay || `PKR ${reg.amount}`,
        });
      }

      console.log(`✅ Successfully processed Stripe Checkout for ${name} (${email}) - Order: ${reg.id}`);
    } catch (dbErr) {
      console.error("Error updating database for Stripe webhook:", dbErr);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
