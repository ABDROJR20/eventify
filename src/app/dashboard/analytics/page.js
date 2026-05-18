"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, BarChart2, PieChart, Activity, Download, MousePointer2, ArrowUpRight , X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Analytics() {
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
          <NavItem icon={<Users size={20} />} label="Attendees" href="/dashboard/attendees" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" active href="/dashboard/analytics" />
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Performance Analytics</h2>
            <p className="text-slate-500 font-medium">Deep dive into your event metrics, page views, and conversion rates.</p>
          </div>
          <div className="flex gap-4">
            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none cursor-pointer h-12 shadow-sm">
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-12 px-6 shadow-xl shadow-slate-900/20">
              <Download size={18} className="mr-2" /> Download Report
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Page Views" value="45.2K" trend="+24%" icon={<Activity size={24} className="text-brand-blue" />} />
          <StatCard title="Conversion Rate" value="12.4%" trend="+1.2%" icon={<MousePointer2 size={24} className="text-purple-500" />} />
          <StatCard title="Tickets Sold" value="1,284" trend="+8%" icon={<Ticket size={24} className="text-emerald-500" />} />
          <StatCard title="Total Revenue" value="$24,500" trend="+15%" icon={<TrendingUp size={24} className="text-amber-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border-none">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Traffic vs Sales</h3>
            </div>
            {/* Multi-line mock chart */}
            <div className="h-72 bg-slate-50 rounded-2xl flex items-end justify-between px-8 py-4 gap-6 relative">
              {[40, 50, 45, 70, 65, 90, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex gap-1 items-end h-full">
                  <div className="flex-1 bg-[#2563EB] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }}></div>
                  <div className="flex-1 bg-emerald-500 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h * 0.4}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 gap-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><div className="w-3 h-3 rounded-full bg-[#2563EB]"></div> Page Views</div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Sales</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border-none flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-8">Traffic Sources</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <SourceBar label="Direct" percentage="45%" color="bg-brand-blue" width="w-[45%]" />
              <SourceBar label="Social Media" percentage="30%" color="bg-purple-500" width="w-[30%]" />
              <SourceBar label="Organic Search" percentage="15%" color="bg-emerald-500" width="w-[15%]" />
              <SourceBar label="Referral" percentage="10%" color="bg-amber-500" width="w-[10%]" />
            </div>
          </div>
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

function StatCard({ title, value, trend, icon }) {
  return (
    <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 p-6 bg-white hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">{icon}</div>
        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-black tracking-widest text-[10px] rounded-full uppercase">{trend}</Badge>
      </div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
    </Card>
  );
}

function SourceBar({ label, percentage, color, width }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900">{percentage}</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} ${width}`}></div>
      </div>
    </div>
  );
}
