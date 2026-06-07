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
  const [editingEvent, setEditingEvent] = useState(null);
  const [analyticsEvent, setAnalyticsEvent] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const MOCK_DASHBOARD_EVENTS = [
    {
      id: 1,
      title: "Global Tech Summit 2026",
      date: "June 12, 2026",
      location: "Karachi Expo Center",
      status: "Published",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      ticketsSold: "425",
      revenue: "$20,825",
      trend: "+12%"
    },
    {
      id: 2,
      title: "Design Leadership Workshop",
      date: "July 05, 2026",
      location: "Virtual Event",
      status: "Draft",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      ticketsSold: "0",
      revenue: "$0",
      trend: "0%"
    },
    {
      id: 3,
      title: "Web3 Developers Meetup",
      date: "August 20, 2026",
      location: "Innovation Hub, Lahore",
      status: "Published",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop",
      ticketsSold: "180",
      revenue: "$4,500",
      trend: "+5%"
    },
    {
      id: 4,
      title: "FinTech Founders Mixer",
      date: "March 15, 2026",
      location: "Serena Hotel, Islamabad",
      status: "Past",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
      ticketsSold: "310",
      revenue: "$15,500",
      trend: "+8%"
    },
    {
      id: 5,
      title: "Startup Pitch Night",
      date: "September 10, 2026",
      location: "NIC Karachi",
      status: "Published",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2070&auto=format&fit=crop",
      ticketsSold: "85",
      revenue: "$1,275",
      trend: "+2%"
    }
  ];

  const filteredEvents = MOCK_DASHBOARD_EVENTS.filter(event => {
    if (activeTab === "All Events") return true;
    if (activeTab === "Drafts") return event.status === "Draft";
    return event.status === activeTab;
  });

  const getCount = (status) => {
    if (status === "All Events") return MOCK_DASHBOARD_EVENTS.length;
    if (status === "Drafts") return MOCK_DASHBOARD_EVENTS.filter(e => e.status === "Draft").length;
    return MOCK_DASHBOARD_EVENTS.filter(e => e.status === status).length;
  };
  
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
            <div className="relative">
              <Button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="outline" 
                className={`h-11 w-11 p-0 rounded-xl shadow-sm text-slate-600 dark:text-slate-355 shrink-0 ${isFilterOpen ? 'bg-slate-100 dark:bg-slate-800 border-brand-blue' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Filter size={18} />
              </Button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                    <h4 className="font-black text-slate-900 dark:text-white mb-4 text-sm">Filter Events</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none text-sm">
                          <option>All Categories</option>
                          <option>Technology</option>
                          <option>Design</option>
                          <option>Business</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Sort By</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none text-sm">
                          <option>Date: Newest First</option>
                          <option>Date: Oldest First</option>
                          <option>Tickets Sold (High-Low)</option>
                        </select>
                      </div>
                      <Button onClick={() => setIsFilterOpen(false)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg h-10">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <Button 
              onClick={() => setEditingEvent({ title: '', location: '', status: 'Draft' })}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 shadow-xl shadow-blue-500/20 px-4 shrink-0"
            >
              <Plus className="mr-1.5 h-5 w-5" /> New Event
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 sm:gap-8 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
          <Tab label="All Events" count={getCount("All Events")} active={activeTab === "All Events"} onClick={() => setActiveTab("All Events")} />
          <Tab label="Published" count={getCount("Published")} active={activeTab === "Published"} onClick={() => setActiveTab("Published")} />
          <Tab label="Drafts" count={getCount("Drafts")} active={activeTab === "Drafts"} onClick={() => setActiveTab("Drafts")} />
          <Tab label="Past" count={getCount("Past")} active={activeTab === "Past"} onClick={() => setActiveTab("Past")} />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard 
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                status={event.status}
                image={event.image}
                ticketsSold={event.ticketsSold}
                revenue={event.revenue}
                trend={event.trend}
                onEdit={() => setEditingEvent(event)}
                onAnalytics={() => setAnalyticsEvent(event)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No events found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit / New Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setEditingEvent(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              {editingEvent.title ? 'Edit Event' : 'Create New Event'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Update your event details and settings below.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Event Title</label>
                <Input defaultValue={editingEvent.title} className="h-12 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-brand-blue" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Location</label>
                <Input defaultValue={editingEvent.location} className="h-12 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-brand-blue" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Status</label>
                <select className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none">
                  <option selected={editingEvent.status === 'Published'}>Published</option>
                  <option selected={editingEvent.status === 'Draft'}>Draft</option>
                  <option selected={editingEvent.status === 'Past'}>Past</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <Button onClick={() => setEditingEvent(null)} variant="outline" className="flex-1 h-14 rounded-xl font-bold border-slate-200 dark:border-slate-800">
                Cancel
              </Button>
              <Button onClick={() => setEditingEvent(null)} className="flex-1 h-14 rounded-xl font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setAnalyticsEvent(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-8">
              <Badge className="bg-brand-blue/10 text-brand-blue border-none mb-3">Analytics Report</Badge>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                {analyticsEvent.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Quick performance overview of your event.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Page Views</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">1,248</p>
                <p className="text-xs font-bold text-emerald-500 mt-1">+14%</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tickets Sold</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{analyticsEvent.ticketsSold}</p>
                <p className="text-xs font-bold text-emerald-500 mt-1">{analyticsEvent.trend}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">6.8%</p>
                <p className="text-xs font-bold text-red-500 mt-1">-1.2%</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">Revenue</p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{analyticsEvent.revenue}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1">{analyticsEvent.trend}</p>
              </div>
            </div>

            <div className="h-48 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8 relative overflow-hidden">
              <div className="absolute bottom-0 w-full flex items-end justify-between px-6 h-32 gap-2 opacity-60">
                {[40, 70, 45, 90, 65, 85, 110].map((h, i) => (
                  <div key={i} className="w-full bg-brand-blue/20 dark:bg-brand-blue/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <p className="text-slate-400 font-bold z-10">Revenue Chart Placeholder</p>
            </div>
            
            <Button onClick={() => setAnalyticsEvent(null)} className="w-full h-14 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">
              Close Analytics
            </Button>
          </div>
        </div>
      )}
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

function EventCard({ title, date, location, status, image, ticketsSold, revenue, trend, onEdit, onAnalytics }) {
  const isPublished = status === "Published";
  
  return (
    <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 group">
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <Badge className={`border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
            status === 'Published' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 
            status === 'Draft' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' :
            'bg-slate-900/80 backdrop-blur hover:bg-slate-900 text-white'
          }`}>
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
          <Button onClick={onEdit} variant="outline" className="flex-1 rounded-xl font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button onClick={onAnalytics} variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
            <BarChart2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
