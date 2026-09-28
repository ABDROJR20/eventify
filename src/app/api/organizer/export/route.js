import { NextResponse } from "next/server";
import { getAllRegistrations, getAllAttendees, getAllEvents } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "registrations"; // 'registrations' | 'attendees'
    const eventId = searchParams.get("eventId");
    const format = searchParams.get("format") || "csv"; // 'csv' | 'json'

    if (type === "attendees") {
      const attendees = await getAllAttendees();

      if (format === "json") {
        return NextResponse.json({ success: true, data: attendees });
      }

      // Generate CSV
      const headers = ["ID", "Name", "Email", "Phone", "Events Attended", "VIP Member", "Created At"];
      const rows = attendees.map((a) => [
        `"${a.id}"`,
        `"${a.name || ""}"`,
        `"${a.email || ""}"`,
        `"${a.phone || ""}"`,
        a.events || 0,
        a.vip ? "Yes" : "No",
        `"${a.createdAt || ""}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="eventify-attendees-${Date.now()}.csv"`,
        },
      });
    }

    // Default: Registrations
    let registrations = await getAllRegistrations();

    if (eventId && eventId !== "All" && eventId !== "All Events") {
      registrations = registrations.filter(
        (r) => String(r.eventId) === String(eventId) || r.eventTitle === eventId
      );
    }

    if (format === "json") {
      return NextResponse.json({ success: true, data: registrations });
    }

    const headers = [
      "Order ID",
      "Event Title",
      "Customer Name",
      "Customer Email",
      "Phone",
      "Ticket Type",
      "Ticket Count",
      "Amount Paid",
      "Status",
      "Checked In",
      "Ticket Code",
      "Date",
    ];

    const rows = registrations.map((r) => [
      `"${r.id}"`,
      `"${r.eventTitle || ""}"`,
      `"${r.customerName || ""}"`,
      `"${r.customerEmail || ""}"`,
      `"${r.customerPhone || ""}"`,
      `"${r.ticketType || ""}"`,
      r.ticketCount || 1,
      `"$${(Number(r.amount) || 0).toFixed(2)}"`,
      `"${r.status || ""}"`,
      r.checkedIn ? "Yes" : "No",
      `"${r.ticketCode || ""}"`,
      `"${r.createdAt || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="eventify-guestlist-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to export data" },
      { status: 500 }
    );
  }
}
