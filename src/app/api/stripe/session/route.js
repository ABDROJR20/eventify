import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Missing session_id query parameter." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email || session.customer_details?.email,
        customer_name: session.customer_details?.name,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
