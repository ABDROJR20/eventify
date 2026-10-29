"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Shield, Save, CreditCard, Key, Mail, Menu, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Fees");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [settings, setSettings] = useState({
    ticketFeePercent: "5.0",
    platformCurrency: "PKR",
    payoutFrequency: "Weekly (Every Monday)",
    maintenanceMode: false,
    supportEmail: "support@eventify.com",
    stripeConnected: true,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.warn("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Global configuration saved successfully!");
      } else {
        showToast(data.message || "Failed to save settings");
      }
    } catch (err) {
      showToast("Network error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="settings" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-72 xl:ml-80 w-full overflow-x-hidden min-w-0">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in border border-slate-700 dark:border-slate-200">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8 sm:mb-12 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8 transition-colors duration-300">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              id="admin-settings-hamburger-btn"
              aria-label="Open admin navigation menu"
              className="lg:hidden p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                Global Configuration
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base mt-0.5 truncate">
                Manage platform fees, API integrations, and core platform settings.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto items-center shrink-0">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 sm:h-12 shadow-lg shadow-blue-500/20 px-5 shrink-0 flex-1 sm:flex-initial justify-center cursor-pointer text-xs sm:text-sm"
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
              Save Global Settings
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 max-w-6xl">
          {/* Settings Tabs */}
          <div className="w-full md:w-64 space-y-1.5 shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-2 md:gap-0 whitespace-nowrap">
            <SettingsTab icon={<CreditCard size={18} />} label="Platform Fees" active={activeTab === "Fees"} onClick={() => setActiveTab("Fees")} />
            <SettingsTab icon={<Key size={18} />} label="API Integrations" active={activeTab === "API"} onClick={() => setActiveTab("API")} />
            <SettingsTab icon={<Mail size={18} />} label="Email Templates" active={activeTab === "Email"} onClick={() => setActiveTab("Email")} />
            <SettingsTab icon={<Shield size={18} />} label="Security Policies" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
          </div>

          {/* Settings Content Card */}
          <Card className="flex-1 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 transition-colors duration-300">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400 gap-2 font-bold text-sm">
                <Loader2 className="animate-spin text-brand-blue" size={20} />
                Loading settings...
              </div>
            ) : (
              <>
                {activeTab === "Fees" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      Platform Monetization
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Standard Ticket Fee (%)
                        </label>
                        <Input 
                          value={settings.ticketFeePercent} 
                          onChange={(e) => setSettings({ ...settings, ticketFeePercent: e.target.value })}
                          type="number" 
                          step="0.1" 
                          className="h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-blue" 
                        />
                        <p className="text-xs font-medium text-slate-400">Commission deducted from each ticket transaction on the platform.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Platform Default Currency
                        </label>
                        <Input 
                          value={settings.platformCurrency} 
                          onChange={(e) => setSettings({ ...settings, platformCurrency: e.target.value })}
                          className="h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-blue" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Organizer Payout Schedule
                        </label>
                        <Input 
                          value={settings.payoutFrequency} 
                          onChange={(e) => setSettings({ ...settings, payoutFrequency: e.target.value })}
                          className="h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-blue" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "API" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      Payment & AI Gateways
                    </h3>
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Stripe Payment Gateway</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">Connected and processing live webhook events</p>
                        </div>
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full">Connected</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-blue-800 dark:text-blue-300">Google Gemini AI Engine</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">Integrated for automated event descriptions and analytics</p>
                        </div>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 rounded-full">Active</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Email" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      Email Dispatch Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform Support Email</label>
                        <Input 
                          value={settings.supportEmail}
                          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                          className="h-12 bg-slate-50 dark:bg-slate-950 rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-slate-400">System confirmation receipts and check-in tickets will be sent via this address.</p>
                    </div>
                  </div>
                )}

                {activeTab === "Security" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      Platform Security Controls
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">Maintenance Mode</p>
                          <p className="text-xs text-slate-400">Temporarily restrict public access for platform upgrades</p>
                        </div>
                        <input 
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                          className="w-5 h-5 rounded text-brand-blue cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

function SettingsTab({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
        active
          ? "bg-brand-blue text-white shadow-md shadow-blue-500/20"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}