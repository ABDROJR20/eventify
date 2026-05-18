import { LayoutDashboard, Home, Calendar, UserCog, ShieldCheck, AlertCircle, Settings2, Shield, Activity, BellRing, ServerCrash, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminAlerts() {
  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col p-8 h-screen fixed top-0 left-0 z-20 shadow-2xl shadow-blue-900/20">
        <Link href="/">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Shield size={28} color="white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">Eventify <span className="text-brand-blue">Admin</span></h1>
          </div>
        </Link>
        <nav className="flex-1 space-y-3">
          <AdminNavItem icon={<LayoutDashboard size={20} />} label="Overview" href="/admin" />
          <AdminNavItem icon={<Home size={20} />} label="Back to Portal" href="/portal" />
          <AdminNavItem icon={<Calendar size={20} />} label="All Events" href="/admin/events" />
          <AdminNavItem icon={<UserCog size={20} />} label="User Management" href="/admin/users" />
          <AdminNavItem icon={<ShieldCheck size={20} />} label="Role Access" href="/admin/roles" />
          <AdminNavItem icon={<AlertCircle size={20} />} label="System Alerts" active href="/admin/alerts" />
          <AdminNavItem icon={<Settings2 size={20} />} label="Global Settings" href="/admin/settings" />
        </nav>
        <div className="mt-auto border-t border-slate-800/50 pt-8">
          <Link href="/auth">
            <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center gap-4 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue font-black border border-brand-blue/30">
                AD
              </div>
              <div>
                <p className="font-bold text-sm text-white">System Admin</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sign Out</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto ml-72">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Health & Alerts</h2>
            <p className="text-slate-500 font-medium text-lg mt-1">Monitor server stability, security flags, and critical system events.</p>
          </div>
          <Button variant="outline" className="h-12 bg-white border-slate-200 shadow-sm hover:bg-slate-50 font-bold text-slate-600 rounded-xl px-6">
            <BellRing size={18} className="mr-2" /> Pause Notifications
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <HealthCard title="API Uptime" value="99.98%" status="Operational" icon={<Activity size={24} className="text-emerald-500" />} />
          <HealthCard title="Server Load" value="42%" status="Normal" icon={<Cpu size={24} className="text-brand-blue" />} />
          <HealthCard title="Failed Logins" value="12" status="Warning" icon={<ShieldAlertIcon size={24} className="text-amber-500" />} />
        </div>

        <Card className="rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-none overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900">Recent System Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
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

function AdminNavItem({ icon, label, active = false, href = "#" }) {
  return (
    <Link href={href} className="block">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.25rem] cursor-pointer transition-all duration-300 group ${active ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/40 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-brand-blue'} transition-colors`}>{icon}</span>
        <span className="tracking-tight">{label}</span>
      </div>
    </Link>
  );
}

function ShieldAlertIcon({ className, size }) {
  return <AlertCircle size={size} className={className} />;
}

function HealthCard({ title, value, status, icon }) {
  const isOk = status === 'Operational' || status === 'Normal';
  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
        <Badge className={`${isOk ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-full`}>{status}</Badge>
      </div>
      <p className="text-slate-500 text-sm font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h4>
    </Card>
  );
}

function AlertLog({ type, time, message }) {
  const styles = {
    critical: { icon: <ServerCrash size={20} className="text-rose-500" />, bg: "bg-rose-50", text: "text-rose-600", label: "CRITICAL" },
    warning: { icon: <AlertCircle size={20} className="text-amber-500" />, bg: "bg-amber-50", text: "text-amber-600", label: "WARNING" },
    info: { icon: <Activity size={20} className="text-brand-blue" />, bg: "bg-blue-50", text: "text-blue-600", label: "INFO" },
  };

  const s = styles[type];

  return (
    <div className="p-8 flex gap-6 items-start hover:bg-slate-50/50 transition-colors">
      <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center shrink-0`}>
        {s.icon}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className={`${s.bg} ${s.text} border-none font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded`}>{s.label}</Badge>
          <span className="text-xs font-bold text-slate-400">{time}</span>
        </div>
        <p className="text-slate-700 font-bold text-lg">{message}</p>
      </div>
    </div>
  );
}
