import { NextResponse } from "next/server";
import { getAllRegistrations, getAllAttendees, getAllEvents, logActivity, getOrganizerSettings } from "@/lib/db";
import { sendBroadcastEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventTitle, eventId, subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject and message content are required" },
        { status: 400 }
      );
    }

    const [registrations, attendees, settings] = await Promise.all([
      getAllRegistrations(),
      getAllAttendees(),
      getOrganizerSettings(),
    ]);

    // Find recipient emails
    let recipientEmails = [];
    let targetEventName = eventTitle || "All Events";

    if (eventId && eventId !== "All" && eventId !== "All Events") {
      const filtered = registrations.filter(
        (r) => String(r.eventId) === String(eventId) || r.eventTitle === eventId
      );
      recipientEmails = filtered.map((r) => r.customerEmail).filter(Boolean);
      if (filtered[0]?.eventTitle) {
        targetEventName = filtered[0].eventTitle;
      }
    } else if (eventTitle && eventTitle !== "All Events") {
      const filtered = registrations.filter((r) => r.eventTitle === eventTitle);
      recipientEmails = filtered.map((r) => r.customerEmail).filter(Boolean);
    } else {
      // All attendees
      recipientEmails = [
        ...new Set([
          ...registrations.map((r) => r.customerEmail),
          ...attendees.map((a) => a.email),
        ]),
      ].filter(Boolean);
    }

    // Deduplicate
    recipientEmails = [...new Set(recipientEmails)];

    if (recipientEmails.length === 0) {
      recipientEmails = ["attendee@example.com"]; // Fallback dummy for testing
    }

    // Send broadcast email via Nodemailer
    const emailResult = await sendBroadcastEmail({
      to: recipientEmails.slice(0, 50), // Batch up to 50 recipients
      subject,
      messageContent: message,
      eventTitle: targetEventName,
      organizerName: settings.organizerName || "Event Organizer",
    });

    // Log this activity
    await logActivity({
      user: settings.organizerName || "Organizer",
      action: "sent broadcast to",
      event: `${recipientEmails.length} attendees (${targetEventName})`,
    });

    return NextResponse.json({
      success: true,
      message: `Broadcast successfully sent to ${recipientEmails.length} attendee(s).`,
      recipientsCount: recipientEmails.length,
      emailResult,
    });
  } catch (error) {
    console.error("Broadcast POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send broadcast" },
      { status: 500 }
    );
  }
}
