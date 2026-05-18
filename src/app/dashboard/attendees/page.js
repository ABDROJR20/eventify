"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Search, Mail, Phone, MoreVertical, MessageSquare , X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Attendees() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col p-6 h-screen fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="w-full">
            <h1 className="text-brand-blue text-2xl font-black cursor-pointer italic text-center">Eventify</h1>
          </Link>
          <button className="lg:hidden text-slate-500 hover:bg-slate-100 p-1 rounded-lg shrink-0" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
          <NavItem icon={<Home size={20} />} label="Portal" href="/portal" />
          <NavItem icon={<Calendar size={20} />} label="My Events" href="/dashboard/events" />
          <NavItem icon={<Ticket size={20} />} label="Registrations" href="/dashboard/registrations" />
          <NavItem icon={<Users size={20} />} label="Attendees" active href="/dashboard/attendees" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" href="/dashboard/analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" href="/dashboard/settings" />
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-100">
          <Link href="/auth">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100?u=organizer" alt="User" />
              <div>
                <p className="font-bold text-sm text-slate-900">Aadrish Pirzado</p>
                <p className="text-xs text-slate-500">Sign Out</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
          <button 
            className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shrink-0 mb-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendees CRM</h2>
            <p className="text-slate-500 font-medium">Manage your community, send broadcasts, and view attendee profiles.</p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6">
              <MessageSquare size={18} className="mr-2" /> Broadcast Message
            </Button>
          </div>
        </header>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden p-8">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-8">
            <div className="flex gap-4 items-center">
              <h3 className="text-xl font-black text-slate-900">Community Directory</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">842 Total</Badge>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Search attendees..." className="pl-12 bg-slate-50 border-slate-200 rounded-xl h-12 focus:border-brand-blue" />
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

function NavItem({ icon, label, active = false, href = "#", onClick }) {
  return (
    <Link href={href} className="block" onClick={onClick}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50'}`}>
        {icon}
        <span className="font-bold">{label}</span>
      </div>
    </Link>
  );
}

function AttendeeCard({ name, email, events, vip = false }) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative group">
      {vip && <Badge className="absolute top-4 right-4 bg-amber-100 text-amber-700 border-none font-black text-[10px] tracking-widest uppercase">VIP</Badge>}
      <div className="flex items-center gap-4 mb-6">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} alt={name} className="w-14 h-14 rounded-2xl" />
        <div>
          <h4 className="font-black text-slate-900 text-lg tracking-tight">{name}</h4>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1"><Mail size={12} /> {email}</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Events Attended</p>
          <p className="font-black text-brand-blue text-lg">{events}</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white text-slate-400"><MoreVertical size={16} /></Button>
      </div>
    </div>
  );
}
