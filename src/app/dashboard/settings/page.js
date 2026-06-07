"use client";

import { useState, useRef } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings as SettingsIcon, Save, CreditCard, Bell, Shield, User, X, Menu, Upload, Banknote, Lock, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile Details");
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/150?u=organizer");
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
            <SettingsTab icon={<User size={18} />} label="Profile Details" active={activeTab === "Profile Details"} onClick={() => setActiveTab("Profile Details")} />
            <SettingsTab icon={<CreditCard size={18} />} label="Payout Methods" active={activeTab === "Payout Methods"} onClick={() => setActiveTab("Payout Methods")} />
            <SettingsTab icon={<Bell size={18} />} label="Notifications" active={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} />
            <SettingsTab icon={<Shield size={18} />} label="Security" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
          </div>

          {/* Settings Form */}
          <Card className="flex-1 rounded-[2.5rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 overflow-hidden p-6 sm:p-10 border dark:border-slate-800 transition-colors duration-300">
            
            {activeTab === "Profile Details" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4">Profile Details</h3>
                
                <div className="flex gap-6 sm:gap-8 items-center mb-10">
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                    <img src={avatarUrl} className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] shadow-lg border-4 border-white dark:border-slate-800 object-cover" alt="Profile" />
                    <div className="absolute inset-0 bg-slate-900/50 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1"><Upload size={14}/> Change</span>
                    </div>
                  </div>
                  <div>
                    <Button onClick={handleAvatarClick} variant="outline" className="font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl mb-2 hover:bg-slate-50 dark:hover:bg-slate-800">Upload New Avatar</Button>
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
              </div>
            )}

            {activeTab === "Payout Methods" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4 flex items-center gap-3">
                  <CreditCard className="text-brand-blue" /> Payout Methods
                </h3>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl p-6 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                      <Banknote />
                    </div>
                    <div>
                      <p className="font-black text-emerald-800 dark:text-emerald-400 text-lg">Meezan Bank</p>
                      <p className="text-emerald-600/80 font-bold text-sm tracking-widest">**** **** 8992</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-100 font-bold rounded-xl">Primary</Button>
                </div>
                <Button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold h-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 shadow-none">
                  + Link Another Bank Account
                </Button>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4 flex items-center gap-3">
                  <Bell className="text-brand-blue" /> Notification Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Ticket Sales Alerts</p>
                      <p className="text-sm font-medium text-slate-500">Get notified every time someone buys a ticket.</p>
                    </div>
                    <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow"></div></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Daily Digest</p>
                      <p className="text-sm font-medium text-slate-500">Receive a daily email summary of your event stats.</p>
                    </div>
                    <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow"></div></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Marketing Emails</p>
                      <p className="text-sm font-medium text-slate-500">Tips, trends, and Eventify news.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow"></div></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4 flex items-center gap-3">
                  <Shield className="text-brand-blue" /> Security Settings
                </h3>
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Lock size={18}/> Change Password</h4>
                    <div className="space-y-4">
                      <Input placeholder="Current Password" type="password" className="h-12 bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 font-bold rounded-xl" />
                      <Input placeholder="New Password" type="password" className="h-12 bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 font-bold rounded-xl" />
                      <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl">Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm font-medium text-slate-500 max-w-sm">Secure your account with an additional verification step using your phone.</p>
                      </div>
                    </div>
                    <Button variant="outline" className="font-bold rounded-xl">Enable</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

function SettingsTab({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm ${
      active 
        ? 'bg-slate-200/80 dark:bg-slate-900 text-slate-900 dark:text-white' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-700 dark:hover:text-slate-200'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
