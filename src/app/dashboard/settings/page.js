"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Save, 
  CreditCard, 
  Bell, 
  Shield, 
  User, 
  Menu, 
  Upload, 
  Banknote, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile Details");
  const fileInputRef = useRef(null);

  // Loading & feedback states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // Tab 1: Profile Form
  const [profile, setProfile] = useState({
    name: "Aadrish Pirzado",
    companyName: "Eventify Innovations",
    email: "aadrish@example.com",
    bio: "We curate high-end technology and design events across Pakistan.",
    avatarUrl: "https://i.pravatar.cc/150?u=organizer",
    twitter: "https://twitter.com/eventifypk",
    linkedin: "https://linkedin.com/company/eventify",
  });

  // Tab 2: Payout Methods (Stripe + Bank)
  const [payoutMethods, setPayoutMethods] = useState({
    stripe: {
      connected: true,
      accountId: "acct_1EventifyStripeOrg",
      email: "aadrish@example.com",
      currency: "PKR",
      instantPayouts: true,
    },
    bankAccount: {
      accountTitle: "Aadrish Pirzado",
      bankName: "Meezan Bank",
      accountNumber: "PK36MEZN0001234567898992",
      isDefault: true,
    },
  });

  // Tab 3: Notification Preferences
  const [notifications, setNotifications] = useState({
    ticketSalesAlerts: true,
    dailyDigest: true,
    marketingEmails: false,
    inAppSound: true,
  });

  // Tab 4: Security (Password & 2FA)
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: null, message: "" });

  // Fetch initial settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/organizer/settings");
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.profile) setProfile((prev) => ({ ...prev, ...data.data.profile }));
          if (data.data.payoutMethods) setPayoutMethods((prev) => ({ ...prev, ...data.data.payoutMethods }));
          if (data.data.notifications) setNotifications((prev) => ({ ...prev, ...data.data.notifications }));
          if (data.data.security) setSecurity((prev) => ({ ...prev, ...data.data.security }));
        }
      } catch (err) {
        console.warn("Failed to load organizer settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Avatar Upload Handler
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({ type: "error", message: "Avatar must be under 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, avatarUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings to Backend API
  const handleSaveSettings = async () => {
    setSaving(true);
    setFeedback({ type: null, message: "" });
    try {
      const res = await fetch("/api/organizer/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          payoutMethods,
          notifications,
          security,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save settings");
      }
      setFeedback({ type: "success", message: "All account settings saved successfully!" });
      setTimeout(() => setFeedback({ type: null, message: "" }), 4000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Could not save settings." });
    } finally {
      setSaving(false);
    }
  };

  // Password Update Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: null, message: "" });

    if (security.hasPassword && !passwordForm.currentPassword) {
      setPasswordFeedback({ type: "error", message: "Please enter your current password." });
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordFeedback({ type: "error", message: "Please enter a new password." });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordFeedback({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/organizer/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          security: {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }
      setPasswordFeedback({ 
        type: "success", 
        message: security.hasPassword ? "Password updated successfully!" : "Password created! You can now log in with email & password as well." 
      });
      setSecurity((prev) => ({ ...prev, hasPassword: true }));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordFeedback({ type: null, message: "" }), 5000);
    } catch (err) {
      setPasswordFeedback({ type: "error", message: err.message || "Could not update password." });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Toggle Stripe Connection
  const handleToggleStripe = () => {
    setPayoutMethods((prev) => ({
      ...prev,
      stripe: {
        ...prev.stripe,
        connected: !prev.stripe.connected,
        accountId: !prev.stripe.connected ? `acct_${Date.now().toString().slice(-8)}` : "",
      },
    }));
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="settings" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full max-w-5xl overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-base">Manage your organizer profile, payouts, and notifications.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Realtime In-App Notification Bell */}
            <NotificationBell role="organizer" />

            {/* Save Button */}
            <Button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 shadow-lg shadow-blue-500/20 px-4 sm:px-6 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin sm:mr-2 shrink-0" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} className="sm:mr-2 shrink-0" />
                  <span className="hidden sm:inline">Save Changes</span>
                </>
              )}
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Global Feedback Banner */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in ${
            feedback.type === "success" 
              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}>
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Nav Sidebar */}
          <div className="w-full md:w-64 space-y-2 shrink-0">
            <SettingsTab icon={<User size={18} />} label="Profile Details" active={activeTab === "Profile Details"} onClick={() => setActiveTab("Profile Details")} />
            <SettingsTab icon={<CreditCard size={18} />} label="Payout Methods" active={activeTab === "Payout Methods"} onClick={() => setActiveTab("Payout Methods")} />
            <SettingsTab icon={<Bell size={18} />} label="Notifications" active={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} />
            <SettingsTab icon={<Shield size={18} />} label="Security" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
          </div>

          {/* Settings Form Card */}
          <div className="flex-1 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 overflow-hidden p-6 sm:p-10 transition-colors duration-300">
            
            {/* TAB 1: PROFILE DETAILS */}
            {activeTab === "Profile Details" && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Profile Details</h3>
                
                {/* Avatar Uploader */}
                <div className="flex gap-6 sm:gap-8 items-center mb-10">
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                    <img 
                      src={profile.avatarUrl} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] shadow-lg border-4 border-white dark:border-slate-800 object-cover" 
                      alt="Profile" 
                    />
                    <div className="absolute inset-0 bg-slate-900/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1"><Upload size={14}/> Change</span>
                    </div>
                  </div>
                  <div>
                    <Button onClick={handleAvatarClick} type="button" variant="outline" className="font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl mb-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      Upload New Avatar
                    </Button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">JPEG or PNG under 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organizer / Company Name</label>
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
                    <Input 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      type="email" 
                      className="h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue" 
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organizer Bio</label>
                    <textarea 
                      rows="4" 
                      value={profile.bio} 
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none text-sm" 
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 mt-10">Social & Web Links</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center font-black text-slate-500 border border-slate-200 dark:border-slate-800 shrink-0">X</div>
                    <Input 
                      value={profile.twitter || ""} 
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                      placeholder="Twitter / X Profile URL" 
                      className="flex-1 h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue text-sm" 
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center font-black text-slate-500 border border-slate-200 dark:border-slate-800 shrink-0">In</div>
                    <Input 
                      value={profile.linkedin || ""} 
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      placeholder="LinkedIn Profile URL" 
                      className="flex-1 h-12 bg-slate-50 dark:bg-slate-950 border-none dark:border dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PAYOUT METHODS (STRIPE ATTACHED!) */}
            {activeTab === "Payout Methods" && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
                  <CreditCard className="text-brand-blue" /> Payout Methods & Stripe
                </h3>

                {/* Stripe Connected Account Card */}
                <div className="p-6 rounded-3xl bg-linear-to-br from-[#635BFF]/10 via-[#635BFF]/5 to-transparent border-2 border-[#635BFF]/30 dark:border-[#635BFF]/40 mb-8 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#635BFF] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-[#635BFF]/30 shrink-0">
                        S
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 dark:text-white text-lg">Stripe Connect</h4>
                          {payoutMethods.stripe?.connected ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Connected
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                              Disconnected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Direct automated payouts to your local currency for ticket sales.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleToggleStripe}
                      className={payoutMethods.stripe?.connected 
                        ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl h-10 px-4 cursor-pointer"
                        : "bg-[#635BFF] hover:bg-[#5349e4] text-white font-bold rounded-xl h-10 px-5 shadow-lg shadow-[#635BFF]/30 cursor-pointer"
                      }
                    >
                      {payoutMethods.stripe?.connected ? "Disconnect" : "Connect Stripe Account"}
                    </Button>
                  </div>

                  {payoutMethods.stripe?.connected && (
                    <div className="pt-4 border-t border-[#635BFF]/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-white/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-slate-400 uppercase font-black text-[10px] tracking-wider block">Stripe Account ID</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{payoutMethods.stripe?.accountId || "acct_1EventifyStripeOrg"}</span>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-slate-400 uppercase font-black text-[10px] tracking-wider block">Payout Currency</span>
                        <span className="font-bold text-slate-900 dark:text-white">{payoutMethods.stripe?.currency || "PKR (Rs)"}</span>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-slate-400 uppercase font-black text-[10px] tracking-wider block">Instant Payouts</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Enabled (Next Day)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Bank Account Card */}
                <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Linked Bank Account</h4>
                <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-500/60 rounded-3xl p-6 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-900 shrink-0 shadow-xs">
                      <Banknote size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-base">
                        {payoutMethods.bankAccount?.bankName || "Meezan Bank"}
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold tracking-wider">
                        {payoutMethods.bankAccount?.accountNumber || "PK36MEZN0001234567898992"}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-xs">
                    Primary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bank Name</label>
                    <Input 
                      value={payoutMethods.bankAccount?.bankName || ""}
                      onChange={(e) => setPayoutMethods({
                        ...payoutMethods,
                        bankAccount: { ...payoutMethods.bankAccount, bankName: e.target.value }
                      })}
                      className="h-11 bg-slate-50 dark:bg-slate-950 font-bold rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Number / IBAN</label>
                    <Input 
                      value={payoutMethods.bankAccount?.accountNumber || ""}
                      onChange={(e) => setPayoutMethods({
                        ...payoutMethods,
                        bankAccount: { ...payoutMethods.bankAccount, accountNumber: e.target.value }
                      })}
                      className="h-11 bg-slate-50 dark:bg-slate-950 font-mono font-bold rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NOTIFICATIONS PREFERENCES */}
            {activeTab === "Notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
                  <Bell className="text-brand-blue" /> Notification Preferences
                </h3>

                <div className="space-y-5">
                  {/* Option 1 */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Ticket Sales Alerts</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receive immediate in-app and email alerts every time a ticket is purchased.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications({ ...notifications, ticketSalesAlerts: !notifications.ticketSalesAlerts })}
                      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                        notifications.ticketSalesAlerts ? "bg-brand-blue" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${
                        notifications.ticketSalesAlerts ? "right-1" : "left-1"
                      }`} />
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Daily Digest</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get a comprehensive daily summary of ticket revenue, check-ins, and guestlist stats.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications({ ...notifications, dailyDigest: !notifications.dailyDigest })}
                      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                        notifications.dailyDigest ? "bg-brand-blue" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${
                        notifications.dailyDigest ? "right-1" : "left-1"
                      }`} />
                    </button>
                  </div>

                  {/* Option 3 */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Marketing & Product Updates</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Platform feature releases, organizer growth tips, and promotional updates.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
                      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                        notifications.marketingEmails ? "bg-brand-blue" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${
                        notifications.marketingEmails ? "right-1" : "left-1"
                      }`} />
                    </button>
                  </div>

                  {/* Option 4 */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">In-App Notification Sounds</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Play a subtle audio ping when a real-time event notification arrives.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications({ ...notifications, inAppSound: !notifications.inAppSound })}
                      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                        notifications.inAppSound ? "bg-brand-blue" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${
                        notifications.inAppSound ? "right-1" : "left-1"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY SETTINGS */}
            {activeTab === "Security" && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
                  <Shield className="text-brand-blue" /> Security & Authentication
                </h3>

                {passwordFeedback.message && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in ${
                    passwordFeedback.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                  }`}>
                    {passwordFeedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{passwordFeedback.message}</span>
                  </div>
                )}

                {/* Change / Set Password Form */}
                <form onSubmit={handleUpdatePassword} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8">
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4 text-base">
                    <Lock size={18} className="text-brand-blue" /> {security.hasPassword ? "Change Master Password" : "Set Account Password"}
                  </h4>

                  {security.isGoogleUser && !security.hasPassword && (
                    <div className="mb-5 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">Google Sign-In Connected</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          Aapka account Google se registered hai aur pehle se koi local password nahi hai. Is liye Current Password ki zaroorat nahi. Aap seedha naya password set kar sakte hain taake aage jaakar email aur password se bhi login kar sakein.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4 max-w-md">
                    {security.hasPassword && (
                      <div className="relative">
                        <Input 
                          placeholder="Current Password" 
                          type={showPass ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="h-12 bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 font-bold rounded-xl pr-10" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    )}

                    <Input 
                      placeholder={security.hasPassword ? "New Password (min. 6 characters)" : "Set Password (min. 6 characters)"} 
                      type={showPass ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="h-12 bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 font-bold rounded-xl" 
                    />

                    <Input 
                      placeholder="Confirm New Password" 
                      type={showPass ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="h-12 bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 font-bold rounded-xl" 
                    />

                    <Button 
                      type="submit" 
                      disabled={passwordLoading}
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold rounded-xl h-11 px-6 cursor-pointer"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          {security.hasPassword ? "Updating..." : "Setting Password..."}
                        </>
                      ) : (
                        security.hasPassword ? "Update Password" : "Set Account Password"
                      )}
                    </Button>
                  </div>
                </form>
                
                {/* 2FA Card */}
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                      <Smartphone size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
                        Enhance account security by requiring an SMS or authenticator passkey upon sign-in.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                    variant="outline" 
                    className={`font-bold rounded-xl cursor-pointer ${
                      security.twoFactorEnabled 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" 
                        : ""
                    }`}
                  >
                    {security.twoFactorEnabled ? "Enabled" : "Enable"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SettingsTab({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${
      active 
        ? 'bg-slate-200/80 dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-700 dark:hover:text-slate-200'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
