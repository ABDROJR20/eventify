"use client";

import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  UserCog, 
  ShieldCheck, 
  AlertCircle, 
  Settings2, 
  Shield, 
  X 
} from "lucide-react";
import Link from "next/link";

export default function AdminSidebar({ activePage, isOpen, onClose }) {
  return (
    <>
      {/* Sidebar Overlay for Mobile/Tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`w-72 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col p-8 h-screen fixed top-0 left-0 z-50 border-r border-slate-200 dark:border-slate-900 transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex justify-between items-center mb-12">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform shrink-0">
                <Shield size={28} color="white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">Eventify <span className="text-brand-blue">Admin</span></h1>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="lg:hidden text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 p-1.5 rounded-lg shrink-0 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          <AdminNavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activePage === "overview"} href="/admin" onClick={onClose} />
          <AdminNavItem icon={<Home size={20} />} label="Back to Portal" href="/portal" onClick={onClose} />
          <AdminNavItem icon={<Calendar size={20} />} label="All Events" active={activePage === "events"} href="/admin/events" onClick={onClose} />
          <AdminNavItem icon={<UserCog size={20} />} label="User Management" active={activePage === "users"} href="/admin/users" onClick={onClose} />
          <AdminNavItem icon={<ShieldCheck size={20} />} label="Role Access" active={activePage === "roles"} href="/admin/roles" onClick={onClose} />
          <AdminNavItem icon={<AlertCircle size={20} />} label="System Alerts" active={activePage === "alerts"} href="/admin/alerts" onClick={onClose} />
          <AdminNavItem icon={<Settings2 size={20} />} label="Global Settings" active={activePage === "settings"} href="/admin/settings" onClick={onClose} />
        </nav>
        
        <div className="mt-auto border-t border-slate-100 dark:border-slate-900 pt-6 shrink-0">
          <Link href="/auth" onClick={onClose}>
            <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] p-4 flex items-center gap-4 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue font-black border border-brand-blue/30 shrink-0">
                AD
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">System Admin</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Sign Out</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}

function AdminNavItem({ icon, label, active = false, href = "#", onClick }) {
  return (
    <Link href={href} onClick={onClick} className="block">
      <div className={`flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] cursor-pointer transition-all duration-300 group ${
        active 
          ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20 font-bold' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
      }`}>
        <span className={`${active ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-blue'} transition-colors`}>{icon}</span>
        <span className="tracking-tight text-sm font-bold">{label}</span>
      </div>
    </Link>
  );
}
