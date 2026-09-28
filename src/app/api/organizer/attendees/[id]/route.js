import { NextResponse } from "next/server";
import { getAttendeeById, updateAttendee, deleteAttendee, getAllRegistrations } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const attendee = await getAttendeeById(id);

    if (!attendee) {
      return NextResponse.json(
        { success: false, error: "Attendee not found" },
        { status: 404 }
      );
    }

    const registrations = await getAllRegistrations();
    const attendeeOrders = registrations.filter(
      (r) => r.customerEmail.toLowerCase() === attendee.email.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      data: {
        ...attendee,
        orders: attendeeOrders,
      },
    });
  } catch (error) {
    console.error("Attendee GET Detail Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch attendee details" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateAttendee(id, body);

    return NextResponse.json({
      success: true,
      message: "Attendee updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Attendee Update Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update attendee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteAttendee(id);

    return NextResponse.json({
      success: true,
      message: "Attendee removed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Attendee Delete Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove attendee" },
      { status: 500 }
    );
  }
}
