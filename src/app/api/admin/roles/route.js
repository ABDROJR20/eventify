import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getAllTeamRoles, createTeamRole, deleteTeamRole, logActivity } from "@/lib/db";

const DEFAULT_ROLES = [
  {
    id: "role_1",
    title: "Super Admin",
    desc: "Full unrestricted access to all platform features and settings.",
    users: 3,
    permissions: ["System Configuration", "Financial Reports", "Manage Admins", "Event Moderation", "User Ban/Suspend"],
    color: "bg-brand-blue",
  },
  {
    id: "role_2",
    title: "Moderator",
    desc: "Can review events, suspend users, and handle reports.",
    users: 12,
    permissions: ["Event Moderation", "User Warning", "View Reports", "Customer Support", "Content Takedown"],
    color: "bg-purple-500",
  },
  {
    id: "role_3",
    title: "Finance Analyst",
    desc: "Read-only access to financial dashboards and payouts.",
    users: 5,
    permissions: ["Financial Reports", "Payout Approvals", "View Transactions", "Export Tax Data"],
    color: "bg-emerald-500",
  },
];

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const teamRoles = await getAllTeamRoles().catch(() => []);
    
    // Merge predefined platform roles with team roles
    const customRoles = teamRoles.map((r) => ({
      id: r.id,
      title: r.roleTitle || r.role || "Custom Role",
      desc: r.description || `Assigned to ${r.email}`,
      users: 1,
      permissions: r.permissions || ["Event Moderation"],
      color: "bg-indigo-500",
    }));

    return NextResponse.json({
      success: true,
      roles: [...DEFAULT_ROLES, ...customRoles],
    });
  } catch (error) {
    console.error("Admin roles fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load roles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { title, desc, permissions } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Role title is required" },
        { status: 400 }
      );
    }

    const newRole = await createTeamRole({
      roleTitle: title,
      role: title.toLowerCase().replace(/\s+/g, "_"),
      description: desc || "Administrative platform role",
      permissions: permissions || ["Event Moderation"],
      email: auth.user.email,
      name: auth.user.name,
      status: "Active",
    });

    await logActivity({
      user: auth.user.name || "System Admin",
      action: `Created new admin role: ${title}`,
      event: "Role Management",
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Role "${title}" created successfully`,
      role: newRole,
    });
  } catch (error) {
    console.error("Admin role creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create role" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Role ID is required" },
        { status: 400 }
      );
    }

    await deleteTeamRole(id);

    return NextResponse.json({
      success: true,
      message: "Role removed successfully",
    });
  } catch (error) {
    console.error("Admin role delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete role" },
      { status: 500 }
    );
  }
}
