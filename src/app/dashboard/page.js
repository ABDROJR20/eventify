"use client";

import { useState } from "react";
import { TrendingUp, BarChart3, LayoutDashboard, Home, Calendar, Ticket, Users, Settings, Plus, Bell, Search, Activity, X, Menu, Zap, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Dashboard() {
  const [activeAction, setActiveAction] = useState("Start QR Check-in");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="dashboard" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        <header className="flex justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">Event Overview</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Welcome back! Here's what's happening with your events.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-brand-blue hover:bg-brand-blue/90 font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-4 sm:px-8 shrink-0">
              <Plus className="sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Create New Event</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Quick Actions Bar */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          <QuickAction icon={<Activity size={18} />} label="Start QR Check-in" active={activeAction === "Start QR Check-in"} onClick={() => setActiveAction("Start QR Check-in")} />
          <QuickAction icon={<Users size={18} />} label="Broadcast Message" active={activeAction === "Broadcast Message"} onClick={() => setActiveAction("Broadcast Message")} />
          <QuickAction icon={<Ticket size={18} />} label="Export Guestlist" active={activeAction === "Export Guestlist"} onClick={() => setActiveAction("Export Guestlist")} />
        </div>

        {/* Dynamic Content based on Quick Action */}
        {activeAction === "Start QR Check-in" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard label="Total Events" value="12" icon={<Calendar size={24} className="text-brand-blue" />} trend="+2 this month" />
              <StatCard label="Total Registrations" value="1,284" icon={<Ticket size={24} className="text-brand-green" />} trend="+15% vs last week" />
              <StatCard label="Active Attendees" value="842" icon={<Users size={24} className="text-violet-600" />} trend="Steady" />
              <StatCard label="Revenue" value="$14,250" icon={<TrendingUp size={24} className="text-amber-500" />} trend="+22% growth" />
            </div>

            {/* Charts/Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registration Trend</h3>
                  <select className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-none rounded-lg px-4 py-2 text-sm font-medium outline-none cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                {/* Mock Chart Area */}
                <div className="h-64 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-end justify-between px-8 py-4 gap-4 transition-colors duration-300">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#2563EB] rounded-t-lg relative group transition-all hover:opacity-80" style={{ height: `${h}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.floor(h * 1.5)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 px-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <Activity size={20} className="text-brand-blue" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                </div>
                <div className="space-y-6">
                  <ActivityItem user="John Doe" action="registered for" event="Tech Summit 2026" time="2m ago" />
                  <ActivityItem user="Sarah Smith" action="checked in at" event="Design Workshop" time="15m ago" />
                  <ActivityItem user="Mike Ross" action="joined" event="Networking Mixer" time="1h ago" />
                  <ActivityItem user="Emily Blunt" action="booked" event="AI Conference" time="3h ago" />
                </div>
              </div>
            </div>
          </>
        )}

        {activeAction === "Broadcast Message" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-50 dark:bg-slate-950 text-brand-blue rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Broadcast Message</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send an update to all registered attendees.</p>
              </div>
            </div>
            
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Event</label>
                <select className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                  <option>Tech Summit 2026</option>
                  <option>Design Workshop</option>
                  <option>Networking Mixer</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                <Input placeholder="e.g., Update regarding venue location" className="rounded-xl h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Content</label>
                <textarea className="w-full h-40 p-4 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none" placeholder="Write your message here..."></textarea>
              </div>
              <Button className="bg-brand-blue hover:bg-brand-blue/90 font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-8 w-full md:w-auto">
                Send Broadcast Message
              </Button>
            </div>
          </div>
        )}

        {activeAction === "Export Guestlist" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket size={40} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Export Your Guestlist</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto text-lg">Download a complete list of all registered attendees in CSV or Excel format for your records or on-site checking.</p>
            
            <div className="max-w-md mx-auto mb-10 text-left space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Event to Export</label>
              <select className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                <option>All Events</option>
                <option>Tech Summit 2026</option>
                <option>Design Workshop</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl h-14 shadow-xl shadow-emerald-500/20 px-10 text-lg text-white">
                Download CSV
              </Button>
              <Button variant="outline" className="font-bold rounded-xl h-14 px-10 text-lg border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                Download Excel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Event</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Event Name</label>
                <Input placeholder="e.g., Tech Innovators Summit" className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date</label>
                  <Input type="date" className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Time</label>
                  <Input type="time" className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
                <Input placeholder="e.g., San Francisco Convention Center" className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea className="w-full h-24 p-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none" placeholder="Briefly describe your event..."></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3 bg-slate-50 dark:bg-slate-950/60">
              <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="font-bold rounded-xl h-11 px-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Cancel
              </Button>
              <Button onClick={() => setIsCreateModalOpen(false)} className="bg-brand-blue hover:bg-brand-blue/90 font-bold rounded-xl h-11 px-8 shadow-md shadow-blue-500/20 text-white">
                Create Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <Card className="rounded-[2rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden transition-colors duration-300">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-850">
          {icon}
        </div>
        <Badge variant="secondary" className={`${trend.includes('+') ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-50' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 hover:bg-slate-50'} rounded-full px-3 py-1 font-bold border-none`}>
          {trend}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-slate-500 dark:text-slate-450 text-sm font-bold mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ user, action, event, time }) {
  return (
    <div className="flex gap-4 items-start relative pb-6 last:pb-0">
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
        {user.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-350 leading-tight">
          <span className="font-bold text-slate-900 dark:text-white">{user}</span> {action} <span className="font-bold text-brand-blue">{event}</span>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick} type="button" className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border ${active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-blue dark:hover:border-brand-blue'}`}>
      {icon} {label}
    </button>
  );
}
