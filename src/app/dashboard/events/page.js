"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Plus, Search, Filter, MoreHorizontal, Edit2, Share2, BarChart2, X, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MyEvents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Events");
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="events" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Events</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Manage your event portfolio and track their status.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search events..." 
                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <Button variant="outline" className="h-11 w-11 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-355 shrink-0">
              <Filter size={18} />
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 shadow-xl shadow-blue-500/20 px-4 shrink-0">
              <Plus className="mr-1.5 h-5 w-5" /> New Event
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 sm:gap-8 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
          <Tab label="All Events" count="12" active={activeTab === "All Events"} onClick={() => setActiveTab("All Events")} />
          <Tab label="Published" count="8" active={activeTab === "Published"} onClick={() => setActiveTab("Published")} />
          <Tab label="Drafts" count="3" active={activeTab === "Drafts"} onClick={() => setActiveTab("Drafts")} />
          <Tab label="Past" count="1" active={activeTab === "Past"} onClick={() => setActiveTab("Past")} />
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

function Tab({ label, count, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`pb-4 border-b-2 font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${active ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}>
        {count}
      </span>
    </div>
  );
}

function EventCard({ title, date, location, status, image, ticketsSold, revenue, trend }) {
  const isPublished = status === "Published";
  
  return (
    <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 group">
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <Badge className={`border-none px-3 py-1 text-xs font-bold uppercase tracking-widest ${isPublished ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-900/80 backdrop-blur hover:bg-slate-900 text-white'}`}>
            {status}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-none shadow-sm hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-2">{date}</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight line-clamp-1">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{location}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-850 mb-6">
          <div>
            <p className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Tickets</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{ticketsSold}</p>
          </div>
          <div>
            <p className="text-xs text-slate-455 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Revenue</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-black text-slate-900 dark:text-white">{revenue}</p>
              {isPublished && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded">{trend}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
            <BarChart2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
