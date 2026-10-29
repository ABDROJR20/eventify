"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, Filter, Shield, CheckCircle2, XCircle, Menu, RefreshCw, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminEvents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [counts, setCounts] = useState({ total: 0, live: 0, pending: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEventsList(data.events);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.warn("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEventsList((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        showToast(`Event status updated to ${newStatus}`);
      } else {
        showToast(data.message || "Failed to update status");
      }
    } catch (err) {
      showToast("Network error updating event");
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to permanently remove this event from the platform?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEventsList((prev) => prev.filter((e) => e.id !== id));
        showToast("Event deleted successfully");
      } else {
        showToast(data.message || "Failed to delete event");
      }
    } catch (err) {
      showToast("Network error deleting event");
    }
  };

  const filteredEvents = eventsList.filter((event) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "live" && event.status === "Live") ||
      (activeFilter === "pending" && event.status === "Pending") ||
      (activeFilter === "suspended" && event.status === "Suspended");

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      event.title?.toLowerCase().includes(q) ||
      event.id?.toLowerCase().includes(q) ||
      event.organizer?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="events" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              id="admin-events-hamburger-btn"
              aria-label="Open admin navigation menu"
              className="lg:hidden p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                All Events
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base mt-0.5 truncate">
                Master list and moderation controls for all platform events.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 sm:gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event titles, IDs..." 
                className="pl-11 h-11 sm:h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100 text-sm" 
              />
            </div>
            <Button 
              onClick={loadEvents} 
              variant="outline" 
              title="Refresh Events"
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
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All ({eventsList.length})
              </button>
              <button
                onClick={() => setActiveFilter("live")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeFilter === "live"
                    ? "bg-brand-blue text-white shadow-sm"
                    : "bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/20"
                }`}
              >
                {counts.live || eventsList.filter((e) => e.status === "Live").length} Live
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeFilter === "pending"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                }`}
              >
                {counts.pending || eventsList.filter((e) => e.status === "Pending").length} Pending
              </button>
              <button
                onClick={() => setActiveFilter("suspended")}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeFilter === "suspended"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                }`}
              >
                {counts.suspended || eventsList.filter((e) => e.status === "Suspended").length} Suspended
              </button>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredEvents.length} events
            </span>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-950/40">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Event Details
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Organizer
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Status
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest text-right">
                      Admin Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                        <div className="flex items-center justify-center gap-2 font-bold text-sm">
                          <Loader2 className="animate-spin text-brand-blue" size={20} />
                          Loading master events list...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <EventRow 
                        key={event.id} 
                        {...event} 
                        onAction={(action) => {
                          if (action === "delete") deleteEvent(event.id);
                          else updateStatus(event.id, action);
                        }}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-slate-500 font-bold">
                        No events match the selected filter.
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

function EventRow({ title, id, organizer, status, onAction }) {
  const isSuspended = status === "Suspended";
  const isPending = status === "Pending";
  const isLive = status === "Live";

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-850">
      <TableCell className="px-6 sm:px-10 py-6">
        <div>
          <span className="font-black text-slate-900 dark:text-white text-base tracking-tight block">
            {title}
          </span>
          <span className="text-[11px] font-bold text-slate-400 block tracking-wider uppercase mt-0.5">
            {id}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-6 text-slate-700 dark:text-slate-300 font-bold text-sm">
        {organizer}
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-6">
        <Badge
          className={`border-none px-3 py-1 font-black text-[10px] tracking-widest uppercase rounded-lg ${
            isLive
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
              : isPending
              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
              : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-6 text-right space-x-1.5 whitespace-nowrap">
        {isLive ? (
          <Button 
            onClick={() => onAction("Suspended")} 
            variant="ghost" 
            size="sm"
            className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold rounded-xl px-3 py-1.5 text-xs cursor-pointer"
          >
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Suspend
          </Button>
        ) : (
          <Button 
            onClick={() => onAction("Live")} 
            variant="ghost" 
            size="sm"
            className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold rounded-xl px-3 py-1.5 text-xs cursor-pointer"
          >
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Publish Live
          </Button>
        )}
        <Button 
          onClick={() => onAction("delete")} 
          variant="ghost" 
          size="sm"
          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold rounded-xl px-2.5 py-1.5 text-xs cursor-pointer"
        >
          <Trash2 size={14} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
