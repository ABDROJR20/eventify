"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Activity, BellRing, ServerCrash, Cpu, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminAlerts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="alerts" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 w-full overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Open Menu</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Health & Alerts</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Monitor server stability, security flags, and critical system events.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto items-center shrink-0">
            <Button variant="outline" className="h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-600 dark:text-slate-305 rounded-xl px-6 shrink-0 flex-1 sm:flex-initial justify-center">
              <BellRing size={18} className="mr-2" /> Pause Notifications
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <HealthCard title="API Uptime" value="99.98%" status="Operational" icon={<Activity size={24} className="text-emerald-500" />} />
          <HealthCard title="Server Load" value="42%" status="Normal" icon={<Cpu size={24} className="text-brand-blue" />} />
          <HealthCard title="Failed Logins" value="12" status="Warning" icon={<ShieldAlertIcon size={24} className="text-amber-500" />} />
        </div>

        <Card className="rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardHeader className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-850">
            <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Recent System Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              <AlertLog type="critical" time="10 mins ago" message="Database connection timeout detected on cluster-02." />
              <AlertLog type="warning" time="1 hour ago" message="Unusual traffic spike detected from IP range 192.168.x.x." />
              <AlertLog type="info" time="3 hours ago" message="Automated daily backup completed successfully." />
              <AlertLog type="info" time="5 hours ago" message="Admin user 'Mahad Yaseen' modified Role Access policies." />
              <AlertLog type="critical" time="12 hours ago" message="Payment gateway API rate limit reached." />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function ShieldAlertIcon({ className, size }) {
  return <AlertCircle size={size} className={className} />;
}

function HealthCard({ title, value, status, icon }) {
  const isOk = status === 'Operational' || status === 'Normal';
  return (
    <Card className="rounded-[2.5rem] border-none dark:border dark:border-slate-800 shadow-xl dark:shadow-none p-8 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-850 shrink-0">{icon}</div>
        <Badge className={`${isOk ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450'} border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-full`}>{status}</Badge>
      </div>
      <p className="text-slate-500 dark:text-slate-450 text-sm font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h4>
    </Card>
  );
}

function AlertLog({ type, time, message }) {
  const styles = {
    critical: { icon: <ServerCrash size={20} className="text-rose-500" />, bg: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400", label: "CRITICAL" },
    warning: { icon: <AlertCircle size={20} className="text-amber-500" />, bg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450", label: "WARNING" },
    info: { icon: <Activity size={20} className="text-brand-blue" />, bg: "bg-blue-50 dark:bg-brand-blue/20 text-blue-600 dark:text-brand-blue", label: "INFO" },
  };

  const s = styles[type];

  return (
    <div className="p-6 sm:p-8 flex gap-6 items-start hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
      <div className={`w-12 h-12 ${s.bg.split(" ")[0]} rounded-2xl flex items-center justify-center shrink-0 border border-slate-200/20`}>
        {s.icon}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <Badge className={`${s.bg} border-none font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded`}>{s.label}</Badge>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-550">{time}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-200 font-bold text-base sm:text-lg leading-snug">{message}</p>
      </div>
    </div>
  );
}
