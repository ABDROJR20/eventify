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
          router.replace("/auth?role=attendee&redirect=/portal");
        }
      } catch (err) {
        console.warn("Session check failed:", err);
        router.replace("/auth?role=attendee&redirect=/portal");
      }
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/auth");
    } catch (err) {
      router.push("/auth");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

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

          <NotificationBell role="attendee" userEmail={user?.email} />
          <ThemeToggle />

          {user ? (
            <button onClick={handleLogout} className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 normal-case font-bold text-xs">
              <LogOut size={15} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-8 px-3 text-xs normal-case">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10 text-center">
        {user ? (
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-brand-blue border border-blue-200 dark:border-blue-800/60 rounded-full px-4 py-1.5 text-xs font-bold mb-6">
            <Sparkles size={14} /> Welcome back, {user.name}!
          </div>
        ) : null}

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">
          How will you <span className="text-brand-blue italic">Eventify</span> today?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Choose your portal to start crafting experiences or discovering your next great adventure.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Attendee Card */}
          <Link href={user ? "/events" : "/auth?role=attendee"} className="block">
            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/60 dark:shadow-none bg-white dark:bg-slate-900 text-left transition-all hover:-translate-y-2 hover:shadow-emerald-200/40 relative overflow-hidden group cursor-pointer p-1 h-full">
              <CardContent className="p-8">
                <div className="relative w-16 h-16 mb-5">
                  <div className="w-full h-full bg-emerald-500 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 group-hover:scale-110 transition-transform duration-500">
                    <User size={32} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md text-emerald-500">
                    <Compass size={16} />
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">Attendee</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  Join events, discover unique local experiences, and connect with communities that share your passion.
                </p>
                <div className="text-emerald-500 font-black text-base flex items-center gap-2 group-hover:translate-x-3 transition-transform">
                  {user ? "Explore Events" : "Login as Attendee"} <ArrowRight size={18} />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Organizer Card */}
          <Link href={user ? "/dashboard" : "/auth?role=organizer"} className="block">
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
                <h3 className="text-2xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">Organizer</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  Create events, manage registrations, track analytics, and architect unforgettable moments for your guests.
                </p>
                <div className="text-brand-blue font-black text-base flex items-center gap-2 group-hover:translate-x-3 transition-transform">
                  {user ? "Go to Dashboard" : "Login as Organizer"} <ArrowRight size={18} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center text-left gap-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none transition-colors duration-300">
          <div className="flex-1">
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">Unified Experience</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
              Your account allows you to book tickets as an attendee or create and manage events as an organizer seamlessly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
