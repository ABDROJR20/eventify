import { TrendingUp, HelpCircle, LogOut, User, Compass, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Portal() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-8">
        <Link href="/">
          <h1 className="text-brand-blue text-2xl font-black tracking-tighter italic cursor-pointer">Eventify</h1>
        </Link>
        <div className="flex gap-6 items-center text-slate-400 font-black text-xs uppercase tracking-widest">
          <span className="cursor-pointer hover:text-brand-blue dark:hover:text-brand-blue transition-colors flex items-center gap-2">
            <HelpCircle size={16} /> <span className="hidden sm:inline">Help Center</span>
          </span>
          <ThemeToggle />
          <Link href="/auth">
            <button className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-2">
              <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">
          How will you <span className="text-brand-blue italic">Eventify</span> today?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Choose your portal to start crafting experiences or discovering your next great adventure.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Attendee Card */}
          <Link href="/auth?role=attendee" className="block">
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
                  Login as Attendee <ArrowRight size={18} />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Organizer Card */}
          <Link href="/auth?role=organizer" className="block">
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
                  Login as Organizer <ArrowRight size={18} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center text-left gap-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none transition-colors duration-300">
          <div className="flex-1">
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">Can I switch later?</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
              Absolutely. Your account is unified. You can seamlessly switch between attendee and organizer portals at any time from your profile settings.
            </p>
          </div>
          <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-950 px-8 py-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900" src="https://i.pravatar.cc/100?u=1" alt="User" />
              <img className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900" src="https://i.pravatar.cc/100?u=2" alt="User" />
              <img className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900" src="https://i.pravatar.cc/100?u=3" alt="User" />
            </div>
            <span className="font-black text-slate-400 text-sm uppercase tracking-widest">Joined by 20k+ creators</span>
          </div>
        </div>
      </div>
    </main>
  );
}
