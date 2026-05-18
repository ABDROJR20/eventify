"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, BarChart2, PieChart, Activity, Download, MousePointer2, ArrowUpRight, X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Analytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="analytics" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Performance Analytics</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Deep dive into your event metrics, page views, and conversion rates.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto">
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-350 outline-none cursor-pointer h-12 shadow-sm focus:ring-2 focus:ring-brand-blue flex-1 md:flex-initial">
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
            <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold rounded-xl h-12 px-6 shadow-xl shadow-slate-900/20 shrink-0">
              <Download size={18} className="mr-2 shrink-0" /> Download Report
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Page Views" value="45.2K" trend="+24%" icon={<Activity size={24} className="text-brand-blue" />} />
          <StatCard title="Conversion Rate" value="12.4%" trend="+1.2%" icon={<MousePointer2 size={24} className="text-purple-500" />} />
          <StatCard title="Tickets Sold" value="1,284" trend="+8%" icon={<Ticket size={24} className="text-emerald-500" />} />
          <StatCard title="Total Revenue" value="$24,500" trend="+15%" icon={<TrendingUp size={24} className="text-amber-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl dark:shadow-none shadow-slate-200/50 border dark:border-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Traffic vs Sales</h3>
            </div>
            {/* Multi-line mock chart */}
            <div className="h-72 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-end justify-between px-6 sm:px-8 py-4 gap-4 sm:gap-6 relative transition-colors duration-300">
              {[40, 50, 45, 70, 65, 90, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex gap-1 items-end h-full">
                  <div className="flex-1 bg-[#2563EB] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }}></div>
                  <div className="flex-1 bg-emerald-500 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h * 0.4}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 gap-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-350"><div className="w-3 h-3 rounded-full bg-[#2563EB]"></div> Page Views</div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-355"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Sales</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl dark:shadow-none shadow-slate-200/50 border dark:border-slate-800 flex flex-col transition-colors duration-300">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Traffic Sources</h3>
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

function StatCard({ title, value, trend, icon }) {
  return (
    <Card className="rounded-[2rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 dark:border dark:border-slate-800 p-6 bg-white dark:bg-slate-900 hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-850">{icon}</div>
        <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 border-none px-3 py-1 font-black tracking-widest text-[10px] rounded-full uppercase">{trend}</Badge>
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
    </Card>
  );
}

function SourceBar({ label, percentage, color, width }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-650 dark:text-slate-400">{label}</span>
        <span className="text-slate-900 dark:text-white">{percentage}</span>
      </div>
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 border dark:border-slate-850 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} ${width}`}></div>
      </div>
    </div>
  );
}
