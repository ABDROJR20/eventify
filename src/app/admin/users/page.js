"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, MoreVertical, ShieldAlert, Mail, Menu, RefreshCw, Loader2, CheckCircle2, UserX, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminUsers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [counts, setCounts] = useState({ total: 0, organizers: 0, attendees: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsersList(data.users);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.warn("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateStatus = async (email, newStatus) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.email === email ? { ...u, status: newStatus } : u))
        );
        showToast(`User status changed to ${newStatus}`);
      } else {
        showToast(data.message || "Failed to update user status");
      }
    } catch (err) {
      showToast("Network error updating user status");
    }
  };

  const filteredUsers = usersList.filter((user) => {
    const matchesRole =
      activeRoleFilter === "all" ||
      user.type.toLowerCase() === activeRoleFilter.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.type.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="users" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-72 xl:ml-80 w-full overflow-x-hidden min-w-0">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in border border-slate-700 dark:border-slate-200">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              id="admin-users-hamburger-btn"
              aria-label="Open admin navigation menu"
              className="lg:hidden p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                User Management
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base mt-0.5 truncate">
                Manage attendees, organizers, and their platform access privileges.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 sm:gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email..." 
                className="pl-11 h-11 sm:h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100 text-sm" 
              />
            </div>
            <Button 
              onClick={loadUsers} 
              variant="outline" 
              title="Refresh Users"
              className="h-11 sm:h-12 w-11 sm:w-12 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 shrink-0 cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-brand-blue" : ""} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <Card className="rounded-[2rem] sm:rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardHeader className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2.5 items-center justify-between bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setActiveRoleFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeRoleFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All Users ({usersList.length})
              </button>
              <button
                onClick={() => setActiveRoleFilter("organizer")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeRoleFilter === "organizer"
                    ? "bg-brand-blue text-white shadow-sm"
                    : "bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/20"
                }`}
              >
                Organizers ({counts.organizers || usersList.filter((u) => u.type === "Organizer").length})
              </button>
              <button
                onClick={() => setActiveRoleFilter("attendee")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeRoleFilter === "attendee"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                }`}
              >
                Attendees ({counts.attendees || usersList.filter((u) => u.type === "Attendee").length})
              </button>
              <button
                onClick={() => setActiveRoleFilter("administrator")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeRoleFilter === "administrator"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100"
                }`}
              >
                Admins ({counts.admins || usersList.filter((u) => u.type === "Administrator").length})
              </button>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredUsers.length} users
            </span>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-950/40">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      User Profile
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Account Type
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Status
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest text-right">
                      Account Access
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                        <div className="flex items-center justify-center gap-2 font-bold text-sm">
                          <Loader2 className="animate-spin text-brand-blue" size={20} />
                          Loading platform users...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <UserRow 
                        key={user.id ? `${user.id}-${idx}` : idx} 
                        {...user} 
                        onStatusChange={(newStatus) => updateStatus(user.email, newStatus)} 
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-slate-500 font-bold">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function UserRow({ name, email, type, status, eventsCount, onStatusChange }) {
  const isBanned = status === "Banned" || status === "Suspended";
  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-850">
      <TableCell className="px-6 sm:px-10 py-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <span className="font-black text-slate-900 dark:text-white text-base tracking-tight block truncate">
              {name}
            </span>
            <span className="text-xs font-medium text-slate-400 block truncate">
              {email}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`font-black text-[10px] tracking-widest uppercase rounded-lg px-2.5 py-0.5 border ${
              type === "Administrator"
                ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                : type === "Organizer"
                ? "bg-blue-50 dark:bg-blue-950/30 text-brand-blue border-blue-200 dark:border-blue-800"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {type}
          </Badge>
          {eventsCount > 0 && (
            <span className="text-[11px] font-bold text-slate-400">
              {eventsCount} events
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-5">
        <Badge
          className={`border-none px-3 py-1 font-black text-[10px] tracking-widest uppercase rounded-lg ${
            !isBanned
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-5 text-right whitespace-nowrap">
        {isBanned ? (
          <Button 
            onClick={() => onStatusChange("Active")} 
            variant="ghost" 
            size="sm"
            className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold rounded-xl px-3 py-1.5 text-xs cursor-pointer"
          >
            <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Reactivate User
          </Button>
        ) : (
          <Button 
            onClick={() => onStatusChange("Banned")} 
            variant="ghost" 
            size="sm"
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold rounded-xl px-3 py-1.5 text-xs cursor-pointer"
          >
            <UserX className="mr-1.5 h-3.5 w-3.5" /> Suspend Access
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
