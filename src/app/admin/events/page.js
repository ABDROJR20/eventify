"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, Filter, MoreVertical, Shield, CheckCircle2, XCircle, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminEvents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [eventsList, setEventsList] = useState([
    { id: "EVT-9921", title: "Global Tech Summit 2026", organizer: "Mahad Yaseen", status: "Live" },
    { id: "EVT-8834", title: "Digital Marketing Expo", organizer: "Abdullah Bin Munawar", status: "Suspended" },
    { id: "EVT-7721", title: "AI Research Workshop", organizer: "Muhammad Umer", status: "Pending" },
    { id: "EVT-6652", title: "Crypto & Web3 Meetup", organizer: "Aadrish Pirzado", status: "Live" },
    { id: "EVT-5541", title: "Startup Pitch Night", organizer: "Sarah Khan", status: "Live" }
  ]);

  const updateStatus = (id, newStatus) => {
    setEventsList(eventsList.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };
  const deleteEvent = (id) => {
    setEventsList(eventsList.filter(e => e.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="events" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 w-full overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">All Events</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Master list of all events created on the platform.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search event titles, IDs..." className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100" />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 shrink-0">
              <Filter size={20} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <Card className="rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardHeader className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-row justify-between items-center bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="flex gap-3 flex-wrap">
              <Badge variant="outline" className="px-4 py-2 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue border-brand-blue/20 font-black rounded-lg">1,402 Live</Badge>
              <Badge variant="outline" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 border-none font-bold rounded-lg">84 Pending</Badge>
              <Badge variant="outline" className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 border-none font-bold rounded-lg">12 Suspended</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Event Details</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Organizer</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest text-right">Admin Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventsList.map(event => (
                  <EventRow 
                    key={event.id} 
                    {...event} 
                    onAction={(action) => {
                      if (action === 'delete') deleteEvent(event.id);
                      else updateStatus(event.id, action);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function EventRow({ title, id, organizer, status, onAction }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusBadge = () => {
    if (status === 'Live') return <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Live</Badge>;
    if (status === 'Pending') return <Badge className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Pending Review</Badge>;
    return <Badge className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Suspended</Badge>;
  };

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-850 cursor-pointer">
      <TableCell className="px-10 py-6">
        <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight mb-1">{title}</p>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">{id}</p>
      </TableCell>
      <TableCell className="px-10 py-6 text-slate-650 dark:text-slate-300 font-bold">{organizer}</TableCell>
      <TableCell className="px-10 py-6">{getStatusBadge()}</TableCell>
      <TableCell className="px-10 py-6 text-right space-x-2 relative">
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" className="text-slate-400 dark:text-slate-500 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl relative z-10">
          <MoreVertical size={18} />
        </Button>
        {isMenuOpen && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
            {status !== 'Live' && (
              <button onClick={() => { setIsMenuOpen(false); onAction('Live'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
                <CheckCircle2 size={14} /> Approve Event
              </button>
            )}
            {status !== 'Suspended' && (
              <button onClick={() => { setIsMenuOpen(false); onAction('Suspended'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
                <XCircle size={14} /> Suspend Event
              </button>
            )}
            <button onClick={() => { setIsMenuOpen(false); onAction('delete'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2">
              <XCircle size={14} /> Delete Event
            </button>
          </div>
        )}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
        )}
      </TableCell>
    </TableRow>
  );
}
