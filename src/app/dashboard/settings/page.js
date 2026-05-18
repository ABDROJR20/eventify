"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings as SettingsIcon, Save, CreditCard, Bell, Shield, User, X, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="settings" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full max-w-5xl overflow-hidden">
        <header className="flex justify-between items-center mb-10 border-b border-slate-200 dark:border-slate-850 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-base">Manage your organizer profile, payouts, and notifications.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-4 sm:px-6">
              <Save size={18} className="sm:mr-2 shrink-0" /> <span className="hidden sm:inline">Save Changes</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Nav */}
          <div className="w-full md:w-64 space-y-2 shrink-0">
            <SettingsTab icon={<User size={18} />} label="Profile Details" active />
            <SettingsTab icon={<CreditCard size={18} />} label="Payout Methods" />
            <SettingsTab icon={<Bell size={18} />} label="Notifications" />
            <SettingsTab icon={<Shield size={18} />} label="Security" />
          </div>

          {/* Settings Form */}
          <Card className="flex-1 rounded-[2.5rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 overflow-hidden p-6 sm:p-10 border dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4">Profile Details</h3>
            
            <div className="flex gap-6 sm:gap-8 items-center mb-10">
              <div className="relative group cursor-pointer shrink-0">
                <img src="https://i.pravatar.cc/150?u=organizer" className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] shadow-lg border-4 border-white dark:border-slate-800" alt="Profile" />
                <div className="absolute inset-0 bg-slate-900/50 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-xs uppercase tracking-widest">Change</span>
                </div>
              </div>
              <div>
                <Button variant="outline" className="font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl mb-2 hover:bg-slate-50 dark:hover:bg-slate-800">Upload New Avatar</Button>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">JPEG or PNG under 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organizer / Company Name</label>
                <Input defaultValue="Aadrish Pirzado" className="h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
                <Input defaultValue="aadrish@example.com" type="email" className="h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organizer Bio</label>
                <textarea rows="4" defaultValue="We curate high-end technology and design events across Pakistan." className="w-full p-4 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-850 pb-4 mt-12">Social Links</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center font-black text-slate-450 dark:text-slate-500 border border-slate-100 dark:border-slate-800 shrink-0">X</div>
                <Input placeholder="Twitter / X Profile URL" className="flex-1 h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center font-black text-slate-450 dark:text-slate-500 border border-slate-100 dark:border-slate-800 shrink-0">In</div>
                <Input placeholder="LinkedIn Profile URL" className="flex-1 h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function SettingsTab({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${
      active 
        ? 'bg-slate-200/80 dark:bg-slate-900 text-slate-900 dark:text-white' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-700 dark:hover:text-slate-200'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
