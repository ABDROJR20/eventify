"use client";

import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, X } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ activePage, isOpen, onClose }) {
  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col p-6 h-screen fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="w-full">
            <h1 className="text-brand-blue text-2xl font-black cursor-pointer italic text-center">Eventify</h1>
          </Link>
          <button className="lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 p-1 rounded-lg shrink-0 transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === "dashboard"} href="/dashboard" onClick={onClose} />
          <NavItem icon={<Home size={20} />} label="Portal" href="/portal" onClick={onClose} />
          <NavItem icon={<Calendar size={20} />} label="My Events" active={activePage === "events"} href="/dashboard/events" onClick={onClose} />
          <NavItem icon={<Ticket size={20} />} label="Registrations" active={activePage === "registrations"} href="/dashboard/registrations" onClick={onClose} />
          <NavItem icon={<Users size={20} />} label="Attendees" active={activePage === "attendees"} href="/dashboard/attendees" onClick={onClose} />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" active={activePage === "analytics"} href="/dashboard/analytics" onClick={onClose} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activePage === "settings"} href="/dashboard/settings" onClick={onClose} />
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <Link href="/auth" onClick={onClose}>
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-all">
              <img className="w-10 h-10 rounded-full border border-slate-200/40 dark:border-slate-800" src="https://i.pravatar.cc/100?u=organizer" alt="User" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Aadrish Pirzado</p>
                <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">Sign Out</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, active = false, href = "#", onClick }) {
  return (
    <Link href={href} className="block" onClick={onClick}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active 
          ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
      }`}>
        {icon}
        <span className="font-bold">{label}</span>
      </div>
    </Link>
  );
}
