import { NextResponse } from "next/server";
import { getAllReviews, createReview, getPlatformStats } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const [reviews, stats] = await Promise.all([
      getAllReviews(),
      getPlatformStats(),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      stats,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, rating, comment, eventTitle, role } = body;

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a review comment." },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();

    const authorName = (name && name.trim()) || sessionUser?.name || "Verified Attendee";
    const authorRole = role || (sessionUser?.role === "organizer" ? "Organizer" : "Verified Attendee");
    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = await createReview({
      name: authorName,
      role: authorRole,
      eventTitle: eventTitle || "Community Event",
      rating: numRating,
      comment: comment.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully! Thank you for your feedback.",
      review: newReview,
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
