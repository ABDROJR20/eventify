"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Search, Mail, Phone, MoreVertical, MessageSquare, X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Attendees() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="attendees" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Attendees CRM</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Manage your community, send broadcasts, and view attendee profiles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6 shrink-0">
              <MessageSquare size={18} className="mr-2" /> Broadcast Message
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <Card className="rounded-[2.5rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 border dark:border-slate-800 overflow-hidden p-6 sm:p-8 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex gap-4 items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Community Directory</h3>
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-950 text-slate-650 dark:text-slate-400 font-bold px-3 py-1 rounded-full border-none">842 Total</Badge>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Search attendees..." className="pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-12 focus:border-brand-blue text-slate-900 dark:text-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AttendeeCard name="Ali Khan" email="ali.khan@example.com" events={3} vip />
            <AttendeeCard name="Sarah Ahmed" email="sarah.ahmed@example.com" events={1} />
            <AttendeeCard name="John Doe" email="john.doe@example.com" events={5} vip />
            <AttendeeCard name="Emily Chen" email="emily.chen@example.com" events={2} />
            <AttendeeCard name="Michael Ross" email="mike.ross@example.com" events={1} />
            <AttendeeCard name="Fatima Noor" email="fatima.noor@example.com" events={4} vip />
          </div>
        </Card>
      </div>
    </main>
  );
}

function AttendeeCard({ name, email, events, vip = false }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative group">
      {vip && <Badge className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-none font-black text-[10px] tracking-widest uppercase rounded-full">VIP</Badge>}
      <div className="flex items-center gap-4 mb-6">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} alt={name} className="w-14 h-14 rounded-2xl" />
        <div>
          <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><Mail size={12} /> {email}</p>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 flex justify-between items-center mb-6 transition-colors duration-300">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Events Attended</p>
          <p className="font-black text-brand-blue text-lg">{events}</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"><MoreVertical size={16} /></Button>
      </div>
    </div>
  );
}
