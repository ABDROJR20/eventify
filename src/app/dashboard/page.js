"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Ticket, Users, Plus, Activity, X, Menu, Download, CheckCircle, AlertCircle, Loader2, QrCode, DollarSign, CalendarRange, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationBell from "@/components/NotificationBell";

export default function Dashboard() {
  const [activeAction, setActiveAction] = useState("Start QR Check-in");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Timeframe and Currency state
  const [currency, setCurrency] = useState("PKR");
  const [trendRange, setTrendRange] = useState("7days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Dashboard Data State
  const [stats, setStats] = useState({
    totalEvents: { value: "5", trend: "+0 this month" },
    totalRegistrations: { value: "5", trend: "+15% vs last week" },
    activeAttendees: { value: "6", trend: "Steady" },
    revenue: { value: "PKR 263", trend: "+22% growth" },
  });
  const [chartData, setChartData] = useState([
    { label: "Mon", height: 40, count: 12 },
    { label: "Tue", height: 70, count: 25 },
    { label: "Wed", height: 45, count: 18 },
    { label: "Thu", height: 90, count: 32 },
    { label: "Fri", height: 65, count: 22 },
    { label: "Sat", height: 80, count: 28 },
    { label: "Sun", height: 55, count: 19 },
  ]);
  const [activities, setActivities] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  // Form states for Quick Actions & Modal
  const [broadcastForm, setBroadcastForm] = useState({ eventId: "All", subject: "", message: "" });
  const [broadcastStatus, setBroadcastStatus] = useState({ loading: false, success: null, message: "" });
  
  const [checkInCode, setCheckInCode] = useState("");
  const [checkInStatus, setCheckInStatus] = useState({ loading: false, success: null, message: "" });

  const [newEventForm, setNewEventForm] = useState({
    title: "",
    category: "Technology",
    date: "",
    time: "10:00 AM",
    location: "",
    price: "",
    description: "",
  });
  const [createEventLoading, setCreateEventLoading] = useState(false);

  // Fetch Dashboard overview on load or filter change
  const loadDashboardData = async (selectedRange = trendRange, selectedCurrency = currency, sDate = customStartDate, eDate = customEndDate) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        range: selectedRange,
        currency: selectedCurrency,
      });
      if (selectedRange === "custom" && sDate && eDate) {
        params.append("startDate", sDate);
        params.append("endDate", eDate);
      }

      const res = await fetch(`/api/organizer/dashboard?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        if (data.data.stats) setStats(data.data.stats);
        if (data.data.chartData) setChartData(data.data.chartData);
        if (data.data.recentActivities) setActivities(data.data.recentActivities);
      }
      
      // Also fetch events list
      const evRes = await fetch("/api/organizer/events");
      const evData = await evRes.json();
      if (evData.success && evData.data) {
        setEventsList(evData.data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(trendRange, currency, customStartDate, customEndDate);
  }, [trendRange, currency]);

  // Handle custom date apply
  const handleApplyCustomDate = (e) => {
    e.preventDefault();
    if (customStartDate && customEndDate) {
      setTrendRange("custom");
      setShowCustomDatePicker(false);
      loadDashboardData("custom", currency, customStartDate, customEndDate);
    }
  };

  // Handle Send Broadcast
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.subject || !broadcastForm.message) {
      setBroadcastStatus({ loading: false, success: false, message: "Please fill in subject and message." });
      return;
    }
    setBroadcastStatus({ loading: true, success: null, message: "" });
    try {
      const res = await fetch("/api/organizer/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(broadcastForm),
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastStatus({ loading: false, success: true, message: data.message });
        setBroadcastForm({ eventId: "All", subject: "", message: "" });
        loadDashboardData();
      } else {
        setBroadcastStatus({ loading: false, success: false, message: data.error || "Failed to send broadcast." });
      }
    } catch (err) {
      setBroadcastStatus({ loading: false, success: false, message: err.message || "Broadcast error." });
    }
  };

  // Handle QR / Ticket Check-in
  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!checkInCode.trim()) return;
    setCheckInStatus({ loading: true, success: null, message: "" });
    try {
      const res = await fetch("/api/organizer/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode: checkInCode }),
      });
      const data = await res.json();
      if (data.success) {
        setCheckInStatus({ loading: false, success: true, message: `${data.message} (${data.data?.customerName} - ${data.data?.ticketType})` });
        setCheckInCode("");
        loadDashboardData();
      } else {
        setCheckInStatus({ loading: false, success: false, message: data.error || "Ticket not found or invalid." });
      }
    } catch (err) {
      setCheckInStatus({ loading: false, success: false, message: err.message || "Check-in failed." });
    }
  };

  // Handle Create Event Submit
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEventForm.title) return;
    setCreateEventLoading(true);
    try {
      const res = await fetch("/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEventForm,
          price: Number(newEventForm.price) || 0,
          status: "Published",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setNewEventForm({ title: "", category: "Technology", date: "", time: "10:00 AM", location: "", price: "", description: "" });
        loadDashboardData();
      } else {
        alert(data.error || "Failed to create event");
      }
    } catch (err) {
      alert(err.message || "Error creating event");
    } finally {
      setCreateEventLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar activePage="dashboard" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">Organizer Dashboard</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Real-time overview of events, revenue, registrations, and check-ins.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 flex-wrap w-full md:w-auto justify-end">
            {/* Currency Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1.5 uppercase ml-1">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer py-1.5 pr-2"
              >
                <option value="PKR" className="dark:bg-slate-900">PKR (₨)</option>
                <option value="USD" className="dark:bg-slate-900">USD ($)</option>
                <option value="EUR" className="dark:bg-slate-900">EUR (€)</option>
                <option value="GBP" className="dark:bg-slate-900">GBP (£)</option>
                <option value="AED" className="dark:bg-slate-900">AED (د.إ)</option>
                <option value="SAR" className="dark:bg-slate-900">SAR (﷼)</option>
              </select>
            </div>

            <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="bg-brand-blue hover:bg-brand-blue/90 font-bold rounded-xl h-11 shadow-xl shadow-blue-500/20 px-4 sm:px-6 shrink-0 text-white">
              <Plus className="sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Create Event</span>
            </Button>
            <NotificationBell role="organizer" />
            <ThemeToggle />
          </div>
        </header>

        {/* Quick Actions Bar */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <QuickAction icon={<Activity size={18} />} label="Start QR Check-in" active={activeAction === "Start QR Check-in"} onClick={() => setActiveAction("Start QR Check-in")} />
          <QuickAction icon={<Users size={18} />} label="Broadcast Message" active={activeAction === "Broadcast Message"} onClick={() => setActiveAction("Broadcast Message")} />
          <QuickAction icon={<Ticket size={18} />} label="Export Guestlist" active={activeAction === "Export Guestlist"} onClick={() => setActiveAction("Export Guestlist")} />
        </div>

        {/* Dynamic Content based on Quick Action */}
        {activeAction === "Start QR Check-in" && (
          <>
            {/* Live QR / Ticket Verification Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 transition-colors duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-slate-950 text-brand-blue rounded-2xl flex items-center justify-center shrink-0">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Quick Ticket Scanner & Check-in</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Enter ticket code (e.g. EVT1-VIP-8821), order ID, or customer email.</p>
                  </div>
                </div>

                <form onSubmit={handleCheckIn} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
                  <Input 
                    value={checkInCode} 
                    onChange={(e) => setCheckInCode(e.target.value)} 
                    placeholder="e.g. EVT1-VIP-8821" 
                    className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-slate-100"
                  />
                  <Button type="submit" disabled={checkInStatus.loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 px-6 shrink-0">
                    {checkInStatus.loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify"}
                  </Button>
                </form>
              </div>

              {checkInStatus.message && (
                <div className={`mt-4 p-3.5 rounded-xl flex items-center gap-2 text-sm font-bold ${checkInStatus.success ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'}`}>
                  {checkInStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span>{checkInStatus.message}</span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard label="Total Events" value={stats.totalEvents?.value || "5"} icon={<Calendar size={24} className="text-brand-blue" />} trend={stats.totalEvents?.trend || "+0 this month"} />
              <StatCard label="Total Registrations" value={stats.totalRegistrations?.value || "5"} icon={<Ticket size={24} className="text-emerald-500" />} trend={stats.totalRegistrations?.trend || "+15% vs last week"} />
              <StatCard label="Active Attendees" value={stats.activeAttendees?.value || "6"} icon={<Users size={24} className="text-violet-600" />} trend={stats.activeAttendees?.trend || "Steady"} />
              <StatCard label="Total Revenue" value={stats.revenue?.value || "PKR 263"} icon={<TrendingUp size={24} className="text-amber-500" />} trend={stats.revenue?.trend || "+22% growth"} />
            </div>

            {/* Charts/Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registration Trend</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Track ticket registration patterns over time.</p>
                  </div>

                  {/* Range Selector with Custom Date Option */}
                  <div className="flex items-center gap-2 relative">
                    <select 
                      value={trendRange}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                          setShowCustomDatePicker(true);
                        } else {
                          setShowCustomDatePicker(false);
                          setTrendRange(val);
                        }
                      }}
                      className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                      <option value="year">This Year (12 Months)</option>
                      <option value="custom">Custom Date Range...</option>
                    </select>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowCustomDatePicker(!showCustomDatePicker)} 
                      className={`h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 ${trendRange === "custom" ? "bg-brand-blue text-white" : ""}`}
                    >
                      <CalendarRange size={14} className="mr-1" /> Custom
                    </Button>

                    {/* Custom Date Range Popover */}
                    {showCustomDatePicker && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Select Date Range</h5>
                          <button onClick={() => setShowCustomDatePicker(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X size={16} />
                          </button>
                        </div>
                        <form onSubmit={handleApplyCustomDate} className="space-y-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Start Date</label>
                            <Input 
                              type="date" 
                              value={customStartDate} 
                              onChange={(e) => setCustomStartDate(e.target.value)} 
                              required 
                              className="h-9 text-xs bg-slate-50 dark:bg-slate-950" 
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">End Date</label>
                            <Input 
                              type="date" 
                              value={customEndDate} 
                              onChange={(e) => setCustomEndDate(e.target.value)} 
                              required 
                              className="h-9 text-xs bg-slate-50 dark:bg-slate-950" 
                            />
                          </div>
                          <Button type="submit" size="sm" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-lg h-9 text-xs">
                            Apply Custom Range
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Chart Area */}
                <div className="h-64 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-end justify-between px-6 sm:px-8 py-4 gap-3 sm:gap-4 transition-colors duration-300">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex-1 bg-brand-blue rounded-t-lg relative group transition-all hover:opacity-80" style={{ height: `${Math.max(item.height, 12)}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-20">
                        {item.count} tickets
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 px-2 overflow-x-auto">
                  {chartData.map((item, i) => (
                    <span key={i} className="text-center min-w-7 truncate">{item.label}</span>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <Activity size={20} className="text-brand-blue" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                </div>
                <div className="space-y-6">
                  {activities.length > 0 ? (
                    activities.map((act) => (
                      <ActivityItem key={act.id} user={act.user} action={act.action} event={act.event} time={act.time} />
                    ))
                  ) : (
                    <>
                      <ActivityItem user="Ali Khan" action="registered for" event="Tech Summit 2026" time="2m ago" />
                      <ActivityItem user="Sarah Smith" action="checked in at" event="Design Workshop" time="15m ago" />
                      <ActivityItem user="Mike Ross" action="joined" event="Networking Mixer" time="1h ago" />
                      <ActivityItem user="Emily Blunt" action="booked" event="AI Conference" time="3h ago" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeAction === "Broadcast Message" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-50 dark:bg-slate-950 text-brand-blue rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Broadcast Message</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send an instant email notification or announcement to all registered attendees.</p>
              </div>
            </div>
            
            <form onSubmit={handleSendBroadcast} className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Audience / Event</label>
                <select 
                  value={broadcastForm.eventId} 
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, eventId: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="All">All Events & Attendees</option>
                  {eventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                <Input 
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                  placeholder="e.g., Important Update regarding venue gate timings" 
                  className="rounded-xl h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Content</label>
                <textarea 
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full h-40 p-4 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none font-medium" 
                  placeholder="Write your email broadcast message to attendees here..."
                ></textarea>
              </div>

              {broadcastStatus.message && (
                <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${broadcastStatus.success ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'}`}>
                  {broadcastStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span>{broadcastStatus.message}</span>
                </div>
              )}

              <Button type="submit" disabled={broadcastStatus.loading} className="bg-brand-blue hover:bg-brand-blue/90 font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-8 text-white w-full md:w-auto">
                {broadcastStatus.loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                Send Broadcast Message
              </Button>
            </form>
          </div>
        )}

        {activeAction === "Export Guestlist" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket size={40} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Export Your Guestlist</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto text-lg">Download a complete list of all registered attendees in CSV or JSON format for your records or on-site gate check-in.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/api/organizer/export?type=registrations&format=csv"
                download
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl h-14 shadow-xl shadow-emerald-500/20 px-10 text-lg text-white transition-colors"
              >
                <Download size={20} className="mr-2" /> Download Guestlist CSV
              </a>
              <a 
                href="/api/organizer/export?type=attendees&format=csv"
                download
                className="inline-flex items-center justify-center font-bold rounded-xl h-14 px-10 text-lg border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download size={20} className="mr-2" /> Download Attendees CRM
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Event</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Event Title</label>
                  <Input 
                    required 
                    value={newEventForm.title} 
                    onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })} 
                    placeholder="e.g., Tech Innovators Summit 2026" 
                    className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                    <select 
                      value={newEventForm.category}
                      onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white outline-none text-sm"
                    >
                      <option>Technology</option>
                      <option>Design</option>
                      <option>Business</option>
                      <option>Workshops</option>
                      <option>Music</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ticket Price ({currency})</label>
                    <Input 
                      type="number"
                      value={newEventForm.price} 
                      onChange={(e) => setNewEventForm({ ...newEventForm, price: e.target.value })} 
                      placeholder="0 for Free" 
                      className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date</label>
                    <Input 
                      type="date" 
                      value={newEventForm.date} 
                      onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })} 
                      className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Time</label>
                    <Input 
                      type="time" 
                      value={newEventForm.time} 
                      onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })} 
                      className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <Input 
                    value={newEventForm.location} 
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })} 
                    placeholder="e.g., Karachi Expo Center, PK" 
                    className="rounded-xl h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea 
                    value={newEventForm.description} 
                    onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })} 
                    className="w-full h-20 p-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none font-medium text-sm" 
                    placeholder="Briefly describe your event..."
                  ></textarea>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3 bg-slate-50 dark:bg-slate-950/60">
                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="font-bold rounded-xl h-11 px-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  Cancel
                </Button>
                <Button type="submit" disabled={createEventLoading} className="bg-brand-blue hover:bg-brand-blue/90 font-bold rounded-xl h-11 px-8 shadow-md shadow-blue-500/20 text-white">
                  {createEventLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <Card className="rounded-[2rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-850">
          {icon}
        </div>
        <Badge variant="secondary" className={`${String(trend).includes('+') ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-50' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 hover:bg-slate-50'} rounded-full px-3 py-1 font-bold border-none`}>
          {trend}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-slate-500 dark:text-slate-450 text-sm font-bold mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ user, action, event, time }) {
  return (
    <div className="flex gap-4 items-start relative pb-6 last:pb-0">
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
        {(user || "User").split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-350 leading-tight">
          <span className="font-bold text-slate-900 dark:text-white">{user}</span> {action} <span className="font-bold text-brand-blue">{event}</span>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick} type="button" className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border ${active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-blue dark:hover:border-brand-blue'}`}>
      {icon} {label}
    </button>
  );
}
