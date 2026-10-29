"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  LayoutDashboard, 
  UserCog, 
  ShieldCheck, 
  AlertCircle, 
  Settings2, 
  Search as SearchIcon, 
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Filter,
  Users,
  Calendar,
  Settings,
  Bell,
  Home,
  Menu,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 45284,
    liveEvents: 1402,
    reportedIssues: 3,
  });
  const [approvalsList, setApprovalsList] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Load real stats and approvals from APIs
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, approvalsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/approvals")
      ]);

      const statsData = await statsRes.json();
      if (statsData.success && statsData.stats) {
        setStats({
          totalUsers: statsData.stats.totalUsers,
          liveEvents: statsData.stats.liveEvents,
          reportedIssues: statsData.stats.reportedIssues,
        });
      }

      const approvalsData = await approvalsRes.json();
      if (approvalsData.success && Array.isArray(approvalsData.approvals)) {
        setApprovalsList(approvalsData.approvals);
      }
    } catch (err) {
      console.warn("Failed to load admin overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprovalAction = async (id, action) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          action: action, // 'approve' | 'reject'
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApprovalsList((prev) => prev.filter((app) => app.id !== id));
        if (action === "approve") {
          setStats((prev) => ({ ...prev, liveEvents: prev.liveEvents + 1 }));
          showToast("Event approved and published live!");
        } else {
          showToast("Event rejected.");
        }
      } else {
        showToast(data.message || "Failed to complete action");
      }
    } catch (err) {
      showToast("Network error. Could not process approval.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApprovals = approvalsList.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.title?.toLowerCase().includes(q) ||
      app.organizer?.toLowerCase().includes(q) ||
      app.id?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="overview" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-72 xl:ml-80 w-full overflow-x-hidden min-w-0">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in border border-slate-700 dark:border-slate-200">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              id="admin-hamburger-btn"
              aria-label="Open admin navigation menu"
              className="lg:hidden p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                System Overview
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base mt-0.5 truncate">
                Monitor and manage the entire Eventify ecosystem.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2.5 sm:gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:w-72">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, organizers..." 
                className="pl-11 h-11 sm:h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100 text-sm"
              />
            </div>
            <Button 
              onClick={loadData} 
              variant="outline" 
              title="Refresh Data"
              className="h-11 sm:h-12 w-11 sm:w-12 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 shrink-0 cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-brand-blue" : ""} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-8 sm:mb-12">
          <AdminStatCard 
            label="Total Platform Users" 
            value={stats.totalUsers.toLocaleString()} 
            trend="+1.2k this week" 
            type="blue" 
          />
          <AdminStatCard 
            label="Live Events" 
            value={stats.liveEvents.toLocaleString()} 
            trend="+85 today" 
            type="green" 
          />
          <AdminStatCard 
            label="Reported Issues" 
            value={stats.reportedIssues.toLocaleString()} 
            trend="All operational" 
            type="red" 
          />
        </div>

        {/* Pending Event Approvals Section */}
        <Card className="rounded-[2rem] sm:rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardHeader className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Pending Event Approvals
                </CardTitle>
                <Badge className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 font-black text-xs px-2.5 py-0.5 rounded-full">
                  {filteredApprovals.length} Pending
                </Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Review and approve upcoming event submissions before they go live.
              </p>
            </div>
            <Link href="/admin/events">
              <Button variant="ghost" className="text-brand-blue font-black hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl px-4 text-xs sm:text-sm">
                View All Events &rarr;
              </Button>
            </Link>
          </CardHeader>

          {/* Table Container with Horizontal Scroll on Tablet/Mobile */}
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[680px]">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-950/40">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Event Title
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Organizer
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Status
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest">
                      Submission Date
                    </TableHead>
                    <TableHead className="px-6 sm:px-10 py-5 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest text-right">
                      Admin Decision
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                        <div className="flex items-center justify-center gap-2 font-bold text-sm">
                          <Loader2 className="animate-spin text-brand-blue" size={20} />
                          Loading pending submissions...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredApprovals.length > 0 ? (
                    filteredApprovals.map((app) => (
                      <ApprovalRow 
                        key={app.id} 
                        {...app} 
                        isProcessing={actionLoading === app.id}
                        onApprove={() => handleApprovalAction(app.id, "approve")} 
                        onReject={() => handleApprovalAction(app.id, "reject")} 
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-14 text-slate-500 font-bold">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                        <p className="text-slate-700 dark:text-slate-300">All submissions have been reviewed.</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">No pending events waiting for admin approval.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function AdminStatCard({ label, value, trend, type }) {
  const styles = {
    blue: 'bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue',
    green: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    red: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
  };
  
  return (
    <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-none dark:border dark:border-slate-800 shadow-xl dark:shadow-none p-6 sm:p-8 relative overflow-hidden bg-white dark:bg-slate-900 group hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${type === 'blue' ? 'bg-brand-blue' : type === 'green' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      <CardHeader className="p-0 mb-4">
        <Badge className={`${styles[type]} border-none rounded-full px-3.5 py-1 font-bold text-[10px] tracking-wider uppercase`}>{trend}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-black uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          {value}
        </h4>
      </CardContent>
    </Card>
  );
}

function ApprovalRow({ id, title, organizer, date, isProcessing, onApprove, onReject }) {
  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-850">
      <TableCell className="px-6 sm:px-10 py-6 font-black text-slate-900 dark:text-white text-base tracking-tight">
        <div>
          <span>{title}</span>
          <span className="block text-[11px] font-bold text-slate-400 normal-case">{id}</span>
        </div>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-6 text-slate-700 dark:text-slate-300 font-bold text-sm">{organizer}</TableCell>
      <TableCell className="px-6 sm:px-10 py-6">
        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 rounded-lg px-3 py-1 font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 w-fit">
          <Clock size={12} /> Pending Review
        </Badge>
      </TableCell>
      <TableCell className="px-6 sm:px-10 py-6 text-slate-400 dark:text-slate-500 font-bold text-xs sm:text-sm">{date || "Upcoming"}</TableCell>
      <TableCell className="px-6 sm:px-10 py-6 text-right space-x-2 whitespace-nowrap">
        <Button 
          disabled={isProcessing}
          onClick={onApprove} 
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-3.5 py-1.5 text-xs shadow-sm cursor-pointer"
        >
          {isProcessing ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <CheckCircle2 size={14} className="mr-1.5" />}
          Approve
        </Button>
        <Button 
          disabled={isProcessing}
          onClick={onReject} 
          variant="outline"
          size="sm"
          className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold rounded-xl px-3.5 py-1.5 text-xs cursor-pointer"
        >
          <XCircle size={14} className="mr-1.5" />
          Reject
        </Button>
      </TableCell>
    </TableRow>
  );
}
