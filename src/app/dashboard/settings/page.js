"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings as SettingsIcon, Save, CreditCard, Bell, Shield, User , X, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <main className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col p-6 h-screen fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="w-full">
            <h1 className="text-brand-blue text-2xl font-black cursor-pointer italic text-center">Eventify</h1>
          </Link>
          <button className="lg:hidden text-slate-500 hover:bg-slate-100 p-1 rounded-lg shrink-0" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
          <NavItem icon={<Home size={20} />} label="Portal" href="/portal" />
          <NavItem icon={<Calendar size={20} />} label="My Events" href="/dashboard/events" />
          <NavItem icon={<Ticket size={20} />} label="Registrations" href="/dashboard/registrations" />
          <NavItem icon={<Users size={20} />} label="Attendees" href="/dashboard/attendees" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" href="/dashboard/analytics" />
          <NavItem icon={<SettingsIcon size={20} />} label="Settings" active href="/dashboard/settings" />
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-100">
          <Link href="/auth">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100?u=organizer" alt="User" />
              <div>
                <p className="font-bold text-sm text-slate-900">Aadrish Pirzado</p>
                <p className="text-xs text-slate-500">Sign Out</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10 ml-64 max-w-5xl">
        <header className="flex justify-between items-center mb-10 border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h2>
            <p className="text-slate-500 font-medium">Manage your organizer profile, payouts, and notifications.</p>
          </div>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6">
            <Save size={18} className="mr-2" /> Save Changes
          </Button>
        </header>

        <div className="flex gap-12">
          {/* Settings Nav */}
          <div className="w-64 space-y-2 shrink-0">
            <SettingsTab icon={<User size={18} />} label="Profile Details" active />
            <SettingsTab icon={<CreditCard size={18} />} label="Payout Methods" />
            <SettingsTab icon={<Bell size={18} />} label="Notifications" />
            <SettingsTab icon={<Shield size={18} />} label="Security" />
          </div>

          {/* Settings Form */}
          <Card className="flex-1 rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Profile Details</h3>
            
            <div className="flex gap-8 items-center mb-10">
              <div className="relative group cursor-pointer">
                <img src="https://i.pravatar.cc/150?u=organizer" className="w-24 h-24 rounded-[2rem] shadow-lg border-4 border-white" alt="Profile" />
                <div className="absolute inset-0 bg-slate-900/50 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-xs uppercase tracking-widest">Change</span>
                </div>
              </div>
              <div>
                <Button variant="outline" className="font-bold border-slate-200 text-slate-700 rounded-xl mb-2 hover:bg-slate-50">Upload New Avatar</Button>
                <p className="text-xs text-slate-400 font-medium">JPEG or PNG under 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Organizer / Company Name</label>
                <Input defaultValue="Aadrish Pirzado" className="h-12 bg-slate-50 border-none font-bold text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <Input defaultValue="aadrish@example.com" type="email" className="h-12 bg-slate-50 border-none font-bold text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Organizer Bio</label>
                <textarea rows="4" defaultValue="We curate high-end technology and design events across Pakistan." className="w-full p-4 bg-slate-50 border-none font-bold text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 mt-12">Social Links</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100">X</div>
                <Input placeholder="Twitter / X Profile URL" className="flex-1 h-12 bg-slate-50 border-none font-medium text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100">In</div>
                <Input placeholder="LinkedIn Profile URL" className="flex-1 h-12 bg-slate-50 border-none font-medium text-slate-900 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function NavItem({ icon, label, active = false, href = "#", onClick }) {
  return (
    <Link href={href} className="block" onClick={onClick}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50'}`}>
        {icon}
        <span className="font-bold">{label}</span>
      </div>
    </Link>
  );
}

function SettingsTab({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
