import { NextResponse } from "next/server";
import { getAllEvents } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search") || searchParams.get("q");

    let events = await getAllEvents();

    // Default to published events for attendee view unless specified
    const publishedOnly = searchParams.get("all") !== "true";
    if (publishedOnly) {
      events = events.filter((e) => e.status === "Published" || !e.status);
    }

    if (category && category !== "All Events" && category !== "All") {
      events = events.filter(
        (e) => (e.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      events = events.filter(
        (e) =>
          (e.title || "").toLowerCase().includes(q) ||
          (e.location || "").toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q) ||
          (Array.isArray(e.speakers) && e.speakers.some((s) => s.toLowerCase().includes(q)))
      );
    }

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Public Events API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load events" },
      { status: 500 }
    );
  }
}
