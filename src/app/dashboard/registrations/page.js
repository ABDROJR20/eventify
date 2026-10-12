"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Ticket, 
  Users, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  X, 
  Menu, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationBell from "@/components/NotificationBell";

export default function Registrations() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState("PKR");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [registrations, setRegistrations] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: "PKR 0",
    totalTicketsSold: "0",
    avgOrderValue: "PKR 0",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load registrations from API
  const loadRegistrations = async (selectedCurrency = currency, query = searchQuery, status = statusFilter) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        currency: selectedCurrency,
      });
      if (query.trim()) params.append("q", query.trim());
      if (status !== "All") params.append("status", status);

      const res = await fetch(`/api/organizer/registrations?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations(currency, searchQuery, statusFilter);
  }, [currency, statusFilter]);

  // Handle live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRegistrations(currency, searchQuery, statusFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const exportUrl = `/api/organizer/export?type=registrations&format=csv`;
    const a = document.createElement("a");
    a.href = exportUrl;
    a.download = `eventify-registrations-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="registrations" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Registrations & Orders</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Track live ticket sales, buyer information, and check-in statuses.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto flex-wrap">
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

            {/* Export CSV Button */}
            <Button 
              onClick={handleExportCSV}
              variant="outline" 
              className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <Download size={18} className="mr-2 text-emerald-600 dark:text-emerald-400" /> Export CSV
            </Button>

            <NotificationBell role="organizer" />
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Revenue" 
            value={metrics.totalRevenue} 
            trend="+15% growth" 
            icon={<TrendingUp size={24} className="text-emerald-500" />} 
          />
          <StatCard 
            title="Total Tickets Sold" 
            value={metrics.totalTicketsSold} 
            trend="+8% this week" 
            icon={<Ticket size={24} className="text-brand-blue" />} 
          />
          <StatCard 
            title="Avg. Order Value" 
            value={metrics.avgOrderValue} 
            trend="+2% vs avg" 
            icon={<ArrowUpRight size={24} className="text-purple-500" />} 
          />
        </div>

        {/* Registrations List Card */}
        <Card className="rounded-[2.5rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 border dark:border-slate-800 overflow-hidden transition-colors duration-300">
          <CardHeader className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div>
              <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Live Registrations Feed</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Showing {registrations.length} total orders</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 text-xs outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Checked In">Checked In</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buyer, event, code..." 
                  className="pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-10 text-slate-900 dark:text-slate-100 text-xs font-medium" 
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-brand-blue h-10 w-10 mb-4" />
                <p className="text-slate-500 font-bold text-sm">Loading registrations...</p>
              </div>
            ) : registrations.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40">
                  <TableRow className="border-none">
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Order ID</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Event</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Attendee / Customer</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ticket Type</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ticket Code</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Amount</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800 transition-colors">
                      <TableCell className="px-6 py-5 font-bold text-slate-900 dark:text-white font-mono text-xs">
                        {reg.id}
                      </TableCell>
                      <TableCell className="px-6 py-5 font-bold text-brand-blue max-w-50 truncate">
                        {reg.eventTitle || "Event"}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{reg.customerName}</p>
                        <p className="text-xs text-slate-400 font-medium">{reg.customerEmail}</p>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium text-xs">
                        {reg.ticketType || "Standard"} {reg.ticketCount > 1 ? `(x${reg.ticketCount})` : ""}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                          {reg.ticketCode || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5 font-black text-slate-900 dark:text-white text-sm">
                        {formatAmount(reg.amount, currency)}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <StatusBadge status={reg.status} checkedIn={reg.checkedIn} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center">
                <Ticket className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-lg font-black text-slate-900 dark:text-white mb-1">No registrations found</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Try changing your search filter or checking back later.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function formatAmount(amount, currency) {
  const num = Number(amount) || 0;
  if (currency === "USD") return `$${(num / 278.50).toFixed(2)}`;
  if (currency === "EUR") return `€${(num / 302.20).toFixed(2)}`;
  if (currency === "GBP") return `£${(num / 362.40).toFixed(2)}`;
  if (currency === "AED") return `AED ${(num / 75.82).toFixed(2)}`;
  if (currency === "SAR") return `SAR ${(num / 74.25).toFixed(2)}`;
  return `PKR ${Math.round(num).toLocaleString()}`;
}

function StatCard({ title, value, trend, icon }) {
  return (
    <Card className="rounded-[2rem] border-none shadow-md dark:shadow-none shadow-slate-200/50 dark:border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center border border-transparent dark:border-slate-850">{icon}</div>
        <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 border-none px-3 py-1 font-bold rounded-full">{trend}</Badge>
      </div>
      <p className="text-slate-500 dark:text-slate-450 text-sm font-bold mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
    </Card>
  );
}

function StatusBadge({ status, checkedIn }) {
  if (checkedIn || status === "Checked In") {
    return (
      <Badge className="border-none rounded-full px-3 py-1 text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400">
        Checked In
      </Badge>
    );
  }
  if (status === "Completed") {
    return (
      <Badge className="border-none rounded-full px-3 py-1 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
        Completed
      </Badge>
    );
  }
  if (status === "Pending" || status === "Pending Payment") {
    return (
      <Badge className="border-none rounded-full px-3 py-1 text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
        Pending
      </Badge>
    );
  }
  return (
    <Badge className="border-none rounded-full px-3 py-1 text-xs font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450">
      {status || "Refunded"}
    </Badge>
  );
}
