import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  createNotification 
} from "@/lib/db";

// GET /api/notifications - Get notifications for current user
export async function GET(request) {
  try {
    const sessionUser = await getSessionUser();
    const role = sessionUser?.role || "all";
    const email = sessionUser?.email || "";

    const notifications = await getUserNotifications(role, email);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Mark as read (single or all)
export async function PUT(request) {
  try {
    const sessionUser = await getSessionUser();
    const role = sessionUser?.role || "all";
    const email = sessionUser?.email || "";

    const body = await request.json();
    const { id, all } = body;

    if (all) {
      await markAllNotificationsAsRead(role, email);
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    if (id) {
      await markNotificationAsRead(id);
      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
      });
    }

    return NextResponse.json(
      { success: false, message: "Notification ID or 'all' required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Notifications PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Delete notification
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Notification ID required" },
        { status: 400 }
      );
    }

    await deleteNotification(id);
    return NextResponse.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Notifications DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete notification" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create custom notification (internal or broadcast)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, message, type = "system", recipientRole = "all", recipientEmail, link } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required" },
        { status: 400 }
      );
    }

    const created = await createNotification({
      title,
      message,
      type,
      recipientRole,
      recipientEmail,
      link,
    });

    return NextResponse.json({
      success: true,
      notification: created,
    });
  } catch (error) {
    console.error("Notifications POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}
