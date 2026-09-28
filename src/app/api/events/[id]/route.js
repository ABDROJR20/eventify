import { NextResponse } from "next/server";
import { getEventById, getAllEvents } from "@/lib/db";
import { MOCK_EVENTS } from "@/lib/data";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let event = await getEventById(id);

    // Fallback search in case id is numeric index or matching slug
    if (!event) {
      const allEvents = await getAllEvents();
      event = allEvents.find(
        (e) => String(e.id) === String(id) || e.id === `evt_${id}` || e.id === Number(id)
      );
    }

    // Fallback to MOCK_EVENTS if not in db
    if (!event) {
      const mock = MOCK_EVENTS.find((e) => String(e.id) === String(id) || e.id === Number(id));
      if (mock) event = mock;
    }

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Public Event Details API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load event details" },
      { status: 500 }
    );
  }
}
