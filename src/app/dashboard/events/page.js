"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Plus, Search, Filter, MoreHorizontal, Edit2, Share2, BarChart2 , X, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function MyEvents() {
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
          <NavItem icon={<Calendar size={20} />} label="My Events" active href="/dashboard/events" />
          <NavItem icon={<Ticket size={20} />} label="Registrations" href="/dashboard/registrations" />
          <NavItem icon={<Users size={20} />} label="Attendees" href="/dashboard/attendees" />
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Events</h2>
            <p className="text-slate-500 font-medium">Manage your event portfolio and track their status.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search events..." 
                className="pl-12 h-12 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm"
              />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white border-slate-200 shadow-sm hover:bg-slate-50">
              <Filter size={20} className="text-slate-600" />
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6">
              <Plus className="mr-2 h-5 w-5" /> New Event
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8">
          <Tab label="All Events" count="12" active />
          <Tab label="Published" count="8" />
          <Tab label="Drafts" count="3" />
          <Tab label="Past" count="1" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard 
            title="Global Tech Summit 2026"
            date="June 12, 2026"
            location="Karachi Expo Center"
            status="Published"
            image="https://images.unsplash.com/photo-1540575861501-7ad058c78a00?q=80&w=2070&auto=format&fit=crop"
            ticketsSold="425"
            revenue="$20,825"
            trend="+12%"
          />
          <EventCard 
            title="Design Leadership Workshop"
            date="July 05, 2026"
            location="Virtual Event"
            status="Draft"
            image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
            ticketsSold="0"
            revenue="$0"
            trend="0%"
          />
          <EventCard 
            title="Web3 Developers Meetup"
            date="August 20, 2026"
            location="Innovation Hub, Lahore"
            status="Published"
            image="https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop"
            ticketsSold="180"
            revenue="$4,500"
            trend="+5%"
          />
          <EventCard 
            title="Startup Pitch Night"
            date="September 10, 2026"
            location="NIC Karachi"
            status="Published"
            image="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop"
            ticketsSold="85"
            revenue="$1,275"
            trend="+2%"
          />
        </div>
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

function Tab({ label, count, active = false }) {
  return (
    <div className={`pb-4 border-b-2 font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors ${active ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    </div>
  );
}

function EventCard({ title, date, location, status, image, ticketsSold, revenue, trend }) {
  const isPublished = status === "Published";
  
  return (
    <Card className="rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden group">
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <Badge className={`border-none px-3 py-1 text-xs font-bold uppercase tracking-widest ${isPublished ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-900/80 backdrop-blur hover:bg-slate-900 text-white'}`}>
            {status}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white/90 backdrop-blur border-none shadow-sm hover:bg-white text-slate-600">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-2">{date}</p>
          <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight line-clamp-1">{title}</h3>
          <p className="text-slate-500 text-sm font-medium">{location}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 mb-6">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Tickets</p>
            <p className="text-lg font-black text-slate-900">{ticketsSold}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Revenue</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-black text-slate-900">{revenue}</p>
              {isPublished && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">{trend}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl font-bold text-slate-600 hover:text-brand-blue hover:bg-blue-50 border-slate-200">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600">
            <BarChart2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
