import { LayoutDashboard, Home, Calendar, UserCog, ShieldCheck, AlertCircle, Settings2, Shield, Save, CreditCard, Key, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminSettings() {
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
          <AdminNavItem icon={<AlertCircle size={20} />} label="System Alerts" href="/admin/alerts" />
          <AdminNavItem icon={<Settings2 size={20} />} label="Global Settings" active href="/admin/settings" />
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
        <header className="flex justify-between items-center mb-12 border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Global Configuration</h2>
            <p className="text-slate-500 font-medium text-lg mt-1">Manage platform fees, API integrations, and core system settings.</p>
          </div>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6">
            <Save size={18} className="mr-2" /> Save Global Settings
          </Button>
        </header>

        <div className="flex gap-12 max-w-6xl">
          <div className="w-64 space-y-2 shrink-0">
            <SettingsTab icon={<CreditCard size={18} />} label="Platform Fees" active />
            <SettingsTab icon={<Key size={18} />} label="API Integrations" />
            <SettingsTab icon={<Mail size={18} />} label="Email Templates" />
            <SettingsTab icon={<Shield size={18} />} label="Security Policies" />
          </div>

          <Card className="flex-1 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-none bg-white p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Platform Monetization</h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Standard Ticket Fee (%)</label>
                <Input defaultValue="5.0" type="number" step="0.1" className="h-14 bg-slate-50 border-none font-bold text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                <p className="text-xs font-bold text-slate-400">Percentage taken from every successful standard ticket transaction.</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">VIP Ticket Fee (%)</label>
                <Input defaultValue="3.5" type="number" step="0.1" className="h-14 bg-slate-50 border-none font-bold text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-8">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Minimum Withdrawal Amount ($)</label>
                <Input defaultValue="50.00" type="number" className="h-14 bg-slate-50 border-none font-bold text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                <p className="text-xs font-bold text-slate-400">Organizers cannot request payouts below this threshold.</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 mt-12 text-rose-500">Danger Zone</h3>
            <div className="p-6 bg-rose-50 rounded-[1.5rem] border border-rose-100 flex justify-between items-center">
              <div>
                <h4 className="font-black text-rose-600 text-lg">Maintenance Mode</h4>
                <p className="text-sm font-bold text-rose-500/70">Locks out all users except Super Admins. Shows maintenance page.</p>
              </div>
              <Button variant="outline" className="border-rose-200 text-rose-600 font-bold hover:bg-rose-100 rounded-xl px-6">
                Enable Maintenance
              </Button>
            </div>
          </Card>
        </div>
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

function SettingsTab({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.25rem] cursor-pointer transition-all font-black text-sm tracking-tight ${active ? 'bg-brand-blue/10 text-brand-blue' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
