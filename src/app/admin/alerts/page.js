"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Activity, BellRing, ServerCrash, Cpu, AlertCircle, Menu, RefreshCw, Loader2, Database, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminAlerts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({
    apiUptime: "99.98%",
    serverLoad: "38%",
    failedLogins: 0,
    dbStatus: "Healthy",
  });
  const [logsList, setLogsList] = useState([]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/alerts");
      const data = await res.json();
      if (data.success) {
        if (data.health) setHealthData(data.health);
        if (Array.isArray(data.logs)) setLogsList(data.logs);
      }
    } catch (err) {
      console.warn("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="alerts" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-72 xl:ml-80 w-full overflow-x-hidden min-w-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              id="admin-alerts-hamburger-btn"
              aria-label="Open admin navigation menu"
              className="lg:hidden p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                System Health & Alerts
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base mt-0.5 truncate">
                Monitor server stability, database connection, and critical runtime events.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto items-center shrink-0">
            <Button 
              onClick={loadAlerts} 
              variant="outline" 
              title="Refresh Health Data"
              className="h-11 sm:h-12 w-11 sm:w-12 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 shrink-0 cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-brand-blue" : ""} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* System Health Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <HealthCard 
            title="API Uptime" 
            value={healthData.apiUptime} 
            status="Operational" 
            icon={<Activity size={24} className="text-emerald-500" />} 
          />
          <HealthCard 
            title="Server Load" 
            value={healthData.serverLoad} 
            status="Optimal" 
            icon={<Cpu size={24} className="text-brand-blue" />} 
          />
          <HealthCard 
            title="Database Cluster" 
            value={healthData.dbStatus} 
            status="Operational" 
            icon={<Database size={24} className="text-emerald-500" />} 
          />
        </div>

        {/* Live System Logs */}
        <Card className="rounded-[2rem] sm:rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardHeader className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Live System Audit Logs
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time log stream from backend infrastructure and security handlers.</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-xs px-3 py-1">
              Active Stream
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400 gap-2 font-bold text-sm">
                <Loader2 className="animate-spin text-brand-blue" size={20} />
                Loading system logs...
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {logsList.map((log, idx) => (
                  <AlertLog 
                    key={log.id || idx} 
                    type={log.type || "info"} 
                    time={log.time} 
                    message={log.message} 
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function HealthCard({ title, value, status, icon }) {
  const isOk = status === "Operational" || status === "Optimal";
  return (
    <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-none dark:border dark:border-slate-800 shadow-xl dark:shadow-none p-6 sm:p-8 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-850 shrink-0">
          {icon}
        </div>
        <Badge className={`${isOk ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450'} border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-full`}>
          {status}
        </Badge>
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h4>
    </Card>
  );
}

function AlertLog({ type, time, message }) {
  const styles = {
    critical: { icon: <ServerCrash size={20} className="text-rose-500" />, bg: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400", label: "CRITICAL" },
    warning: { icon: <AlertCircle size={20} className="text-amber-500" />, bg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450", label: "WARNING" },
    info: { icon: <Activity size={20} className="text-brand-blue" />, bg: "bg-blue-50 dark:bg-brand-blue/20 text-blue-600 dark:text-brand-blue", label: "INFO" },
  };

  const s = styles[type] || styles.info;

  return (
    <div className="p-5 sm:p-8 flex gap-4 sm:gap-6 items-start hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
      <div className={`w-11 h-11 ${s.bg.split(" ")[0]} rounded-2xl flex items-center justify-center shrink-0 border border-slate-200/20`}>
        {s.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <Badge className={`${s.bg} border-none font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded`}>
            {s.label}
          </Badge>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{time}</span>
        </div>
        <p className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base leading-snug">{message}</p>
      </div>
    </div>
  );
}
