"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  UserCog, 
  ShieldCheck, 
  AlertCircle, 
  Settings2, 
  Shield, 
  X,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ activePage, isOpen, onClose }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState({
    name: "System Administrator",
    email: "admin@eventify.com",
  });

  useEffect(() => {
    async function loadAdminSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser({
            name: data.user.name || "System Admin",
            email: data.user.email || "admin@eventify.com",
          });
        }
      } catch (err) {
        // Fallback default
      }
    }
    loadAdminSession();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (onClose) onClose();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.replace("/admin/login");
  };

  const initials = (adminUser.name || "AD")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Sidebar Overlay for Mobile/Tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside 
        className={`w-72 sm:w-80 max-w-[85vw] bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col p-6 sm:p-8 h-screen fixed top-0 left-0 z-50 border-r border-slate-200 dark:border-slate-900 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8 sm:mb-10">
          <Link href="/" onClick={onClose}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform shrink-0">
                <Shield size={26} color="white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-950 dark:text-white leading-none">
                  Eventify <span className="text-brand-blue">Admin</span>
                </h1>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Master Portal</span>
              </div>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            aria-label="Close navigation menu"
            className="lg:hidden text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 p-2 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <AdminNavItem icon={<LayoutDashboard size={19} />} label="Overview" active={activePage === "overview"} href="/admin" onClick={onClose} />
          <AdminNavItem icon={<Home size={19} />} label="Back to Portal" href="/portal" onClick={onClose} />
          <AdminNavItem icon={<Calendar size={19} />} label="All Events" active={activePage === "events"} href="/admin/events" onClick={onClose} />
          <AdminNavItem icon={<UserCog size={19} />} label="User Management" active={activePage === "users"} href="/admin/users" onClick={onClose} />
          <AdminNavItem icon={<ShieldCheck size={19} />} label="Role Access" active={activePage === "roles"} href="/admin/roles" onClick={onClose} />
          <AdminNavItem icon={<AlertCircle size={19} />} label="System Alerts" active={activePage === "alerts"} href="/admin/alerts" onClick={onClose} />
          <AdminNavItem icon={<Settings2 size={19} />} label="Global Settings" active={activePage === "settings"} href="/admin/settings" onClick={onClose} />
        </nav>
        
        <div className="mt-auto border-t border-slate-100 dark:border-slate-900 pt-4 shrink-0">
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 sm:p-4 flex items-center justify-between border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="w-10 h-10 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue font-black border border-brand-blue/30 shrink-0 text-xs">
                {initials}
              </div>
              <div className="truncate min-w-0">
                <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{adminUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest truncate">{adminUser.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign out of admin"
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all shrink-0 cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function AdminNavItem({ icon, label, active = false, href = "#", onClick }) {
  return (
    <Link href={href} onClick={onClick} className="block">
      <div className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
        active 
          ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/25 font-black' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white font-bold'
      }`}>
        <span className={`${active ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-blue'} transition-colors shrink-0`}>
          {icon}
        </span>
        <span className="tracking-tight text-xs sm:text-sm">{label}</span>
      </div>
    </Link>
  );
}
