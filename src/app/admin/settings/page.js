"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Shield, Save, CreditCard, Key, Mail, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Fees");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="settings" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 w-full overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Global Configuration</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Manage platform fees, API integrations, and core system settings.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto items-center shrink-0">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6 shrink-0 flex-1 sm:flex-initial justify-center">
              <Save size={18} className="mr-2" /> Save Global Settings
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 max-w-6xl">
          <div className="w-full md:w-64 space-y-0 md:space-y-2 shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-2 md:gap-0 whitespace-nowrap">
            <SettingsTab icon={<CreditCard size={18} />} label="Platform Fees" active={activeTab === "Fees"} onClick={() => setActiveTab("Fees")} />
            <SettingsTab icon={<Key size={18} />} label="API Integrations" active={activeTab === "API"} onClick={() => setActiveTab("API")} />
            <SettingsTab icon={<Mail size={18} />} label="Email Templates" active={activeTab === "Email"} onClick={() => setActiveTab("Email")} />
            <SettingsTab icon={<Shield size={18} />} label="Security Policies" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
          </div>

          <Card className="flex-1 rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 transition-colors duration-300">
            {activeTab === "Fees" && (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Platform Monetization</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Standard Ticket Fee (%)</label>
                    <Input defaultValue="5.0" type="number" step="0.1" className="h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 font-bold text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-550">Percentage taken from every successful standard ticket transaction.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">VIP Ticket Fee (%)</label>
                    <Input defaultValue="3.5" type="number" step="0.1" className="h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 font-bold text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                  </div>

                  <div className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-8">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Minimum Withdrawal Amount (PKR)</label>
                    <Input defaultValue="5000" type="number" className="h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 font-bold text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-550">Organizers cannot request payouts below this threshold.</p>
                  </div>
                </div>
              </>
            )}

            {activeTab !== "Fees" && (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 font-bold">
                {activeTab} Settings are currently under development.
              </div>
            )}
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4 mt-12 text-rose-500">Danger Zone</h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Standard Ticket Fee (%)</label>
                <Input defaultValue="5.0" type="number" step="0.1" className="h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 font-bold text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                <p className="text-xs font-bold text-slate-400 dark:text-slate-550">Percentage taken from every successful standard ticket transaction.</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">VIP Ticket Fee (%)</label>
                <Input defaultValue="3.5" type="number" step="0.1" className="h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 font-bold text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
              </div>

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-8">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Minimum Withdrawal Amount (PKR)</label>
                    <Input defaultValue="5000" type="number" className="h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 font-bold text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-brand-blue" />
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-550">Organizers cannot request payouts below this threshold.</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-850 pb-4 mt-12 text-rose-500">Danger Zone</h3>
            <div className={`p-6 ${isMaintenanceMode ? 'bg-rose-500 dark:bg-rose-600' : 'bg-rose-50 dark:bg-rose-950/20'} rounded-[1.5rem] border ${isMaintenanceMode ? 'border-rose-600 dark:border-rose-700' : 'border-rose-100 dark:border-rose-900'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300`}>
              <div>
                <h4 className={`font-black text-lg ${isMaintenanceMode ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`}>Maintenance Mode</h4>
                <p className={`text-sm font-bold ${isMaintenanceMode ? 'text-rose-100' : 'text-rose-500/70 dark:text-rose-455'}`}>Locks out all users except Super Admins. Shows maintenance page.</p>
              </div>
              <Button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} variant={isMaintenanceMode ? "default" : "outline"} className={`${isMaintenanceMode ? 'bg-white text-rose-600 hover:bg-rose-50' : 'border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40'} font-bold rounded-xl px-6 h-11 shrink-0 w-full sm:w-auto justify-center`}>
                {isMaintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function SettingsTab({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-[1.25rem] cursor-pointer transition-all font-black text-sm tracking-tight ${
      active 
        ? 'bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue' 
        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-200'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}