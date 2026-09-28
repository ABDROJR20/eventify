import { NextResponse } from "next/server";
import { getAllAttendees, createAttendee } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const vip = searchParams.get("vip");

    let attendees = await getAllAttendees();

    if (search) {
      attendees = attendees.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          a.email.toLowerCase().includes(search) ||
          (a.phone && a.phone.includes(search))
      );
    }

    if (vip === "true") {
      attendees = attendees.filter((a) => a.vip === true);
    } else if (vip === "false") {
      attendees = attendees.filter((a) => a.vip === false);
    }

    return NextResponse.json({
      success: true,
      data: attendees,
      total: attendees.length,
    });
  } catch (error) {
    console.error("Attendees GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newAttendee = await createAttendee({
      name: body.name,
      email: body.email,
      phone: body.phone,
      events: body.events || 1,
      vip: body.vip || false,
      avatar: body.avatar,
    });

    return NextResponse.json(
      { success: true, message: "Attendee created successfully", data: newAttendee },
      { status: 201 }
    );
  } catch (error) {
    console.error("Attendees POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create attendee" },
      { status: 500 }
    );
  }
}
