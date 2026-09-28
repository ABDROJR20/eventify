import { NextResponse } from "next/server";
import { getAllEvents, createEvent } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "All Events";
    const category = searchParams.get("category") || "All";
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const sort = searchParams.get("sort") || "newest";

    let events = await getAllEvents();

    // Filter by status
    if (status && status !== "All Events") {
      if (status === "Drafts") {
        events = events.filter((e) => e.status === "Draft");
      } else {
        events = events.filter((e) => e.status.toLowerCase() === status.toLowerCase());
      }
    }

    // Filter by category
    if (category && category !== "All" && category !== "All Categories") {
      events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    // Search query
    if (search) {
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          e.location.toLowerCase().includes(search) ||
          (e.description && e.description.toLowerCase().includes(search))
      );
    }

    // Sorting
    if (sort === "newest") {
      events.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    } else if (sort === "oldest") {
      events.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
    } else if (sort === "tickets") {
      events.sort((a, b) => (Number(b.ticketsSold) || 0) - (Number(a.ticketsSold) || 0));
    } else if (sort === "revenue") {
      events.sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0));
    }

    const counts = {
      all: (await getAllEvents()).length,
      published: (await getAllEvents()).filter((e) => e.status === "Published").length,
      drafts: (await getAllEvents()).filter((e) => e.status === "Draft").length,
      past: (await getAllEvents()).filter((e) => e.status === "Past").length,
    };

    return NextResponse.json({
      success: true,
      data: events,
      counts,
      total: events.length,
    });
  } catch (error) {
    console.error("Events API GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Event title is required" },
        { status: 400 }
      );
    }

    const newEvent = await createEvent({
      title: body.title,
      category: body.category || "General",
      date: body.date,
      time: body.time || "10:00 AM",
      location: body.location || "Online",
      price: body.price || 0,
      image: body.image,
      capacity: body.capacity || 100,
      status: body.status || "Draft",
      featured: body.featured || false,
      description: body.description || "",
      speakers: body.speakers || [],
      organizerId: body.organizerId || "org_default",
    });

    return NextResponse.json(
      { success: true, message: "Event created successfully", data: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Events API POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}
