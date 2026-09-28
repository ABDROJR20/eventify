"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar({ activePage, isOpen, onClose }) {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Organizer Account",
    email: "organizer@eventify.pk",
    image: null,
  });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Fetch logged in user from /api/auth/me
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser({
            name: data.user.name || "Organizer",
            email: data.user.email || "",
            image: data.user.image || null,
          });
        }
      } catch (err) {
        console.warn("Could not load session user:", err);
      }
    }
    fetchSession();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth");
      router.refresh();
    } catch (err) {
      router.push("/auth");
    }
  };

  // Generate initials for avatar fallback
  const initials = (user.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        
        {/* Dynamic Logged In User Profile Box */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              {user.image ? (
                <img className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0" src={user.image} alt={user.name} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {initials}
                </div>
              )}
              <div className="truncate min-w-0">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user.email || "Organizer"}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all shrink-0 ml-1"
            >
              <LogOut size={16} />
            </button>
          </div>
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
