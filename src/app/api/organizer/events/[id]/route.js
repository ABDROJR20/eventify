import { NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent, getAllRegistrations } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Get event registrations
    const registrations = await getAllRegistrations();
    const eventRegistrations = registrations.filter(
      (r) => String(r.eventId) === String(id) || r.eventTitle === event.title
    );

    const checkedInCount = eventRegistrations.filter((r) => r.checkedIn).length;

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        registrations: eventRegistrations,
        stats: {
          totalRegistrations: eventRegistrations.length,
          checkedInCount,
          checkInRate: eventRegistrations.length > 0 
            ? `${Math.round((checkedInCount / eventRegistrations.length) * 100)}%` 
            : "0%",
        },
      },
    });
  } catch (error) {
    console.error("Event Detail GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateEvent(id, body);

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Event Update Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteEvent(id);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Event Delete Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete event" },
      { status: 500 }
    );
  }
}
