"use client";

import { useState, useEffect } from "react";
import { TrendingUp, HelpCircle, LogOut, User, Compass, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationBell from "@/components/NotificationBell";

export default function Portal() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.replace("/auth?role=organizer&redirect=/portal");
        }
      } catch (err) {
        console.warn("Session check failed:", err);
        router.replace("/auth?role=organizer&redirect=/portal");
      }
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/auth?role=organizer");
    } catch (err) {
      router.push("/auth?role=organizer");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "O";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 sm:px-8 md:px-16 py-6 border-b border-slate-100 dark:border-slate-850">
        <Link href="/">
          <h1 className="text-brand-blue text-2xl font-black tracking-tighter italic cursor-pointer">Eventify</h1>
        </Link>
        <div className="flex gap-4 sm:gap-6 items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 pl-1.5 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white font-black text-[10px] flex items-center justify-center">
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 normal-case">{user.name}</span>
            </div>
          ) : null}

          <NotificationBell role="organizer" userEmail={user?.email} />
          <ThemeToggle />

          {user ? (
            <button onClick={handleLogout} className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 normal-case font-bold text-xs">
              <LogOut size={15} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link href="/auth?role=organizer">
              <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-8 px-3 text-xs normal-case">
                Organizer Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 text-center">
        {user ? (
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-brand-blue border border-blue-200 dark:border-blue-800/60 rounded-full px-4 py-1.5 text-xs font-bold mb-6">
            <Sparkles size={14} /> Welcome back, {user.name}!
          </div>
        ) : null}

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">
          Event Operations & <span className="text-brand-blue italic">Organizer Hub</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage your events, configure ticket sales, and verify attendee admissions with high-speed check-ins.
        </p>

        {/* Portals Grid (Attendee portal removed - attendees access events directly) */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Organizer Dashboard Card */}
          <Link href={user ? "/dashboard" : "/auth?role=organizer"} className="block text-left">
            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/60 dark:shadow-none bg-white dark:bg-slate-900 text-left transition-all hover:-translate-y-2 hover:shadow-blue-200/40 relative overflow-hidden group cursor-pointer p-1 h-full">
              <CardContent className="p-8">
                <div className="relative w-16 h-16 mb-5">
                  <div className="w-full h-full bg-brand-blue rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 group-hover:scale-110 transition-transform duration-500">
                    <Compass size={32} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md text-brand-blue">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Organizer Portal</h3>
                  <Badge className="bg-brand-blue/10 text-brand-blue border-none text-[10px] font-bold">Primary</Badge>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  Create events, generate shareable links for attendees, manage ticket tiers, track revenue, and monitor live sales.
                </p>
                <div className="text-brand-blue font-black text-base flex items-center gap-2 group-hover:translate-x-3 transition-transform">
                  {user ? "Open Organizer Dashboard" : "Sign In as Organizer"} <ArrowRight size={18} />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Ticket Verification & Scanner Portal Card */}
          <Link href="/verify-ticket" className="block text-left">
            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/60 dark:shadow-none bg-white dark:bg-slate-900 text-left transition-all hover:-translate-y-2 hover:shadow-emerald-200/40 relative overflow-hidden group cursor-pointer p-1 h-full">
              <CardContent className="p-8">
                <div className="relative w-16 h-16 mb-5">
                  <div className="w-full h-full bg-emerald-500 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles size={32} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md text-emerald-500">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ticket Scanner Portal</h3>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none text-[10px] font-bold">Gate Staff</Badge>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  Scan attendee QR passes using live camera or manual code verification to confirm entrance and prevent duplicate check-ins.
                </p>
                <div className="text-emerald-600 dark:text-emerald-400 font-black text-base flex items-center gap-2 group-hover:translate-x-3 transition-transform">
                  Open Scanner Portal <ArrowRight size={18} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info & Public Events Banner for Attendees */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/30 rounded-[1.75rem] p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center text-left gap-6 border border-blue-100 dark:border-blue-900/40 shadow-lg shadow-blue-500/5">
          <div className="flex-1">
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight flex items-center gap-2">
              <Compass size={20} className="text-brand-blue" /> Looking for events to attend?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
              Attendees do not need to sign in to browse events! All events are publicly accessible with direct booking.
            </p>
          </div>
          <Link href="/events" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-brand-blue hover:bg-blue-600 text-white font-black rounded-xl h-12 px-6 shadow-md shadow-brand-blue/20">
              Browse All Events <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
