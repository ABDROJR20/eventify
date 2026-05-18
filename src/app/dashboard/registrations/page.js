"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Search, Filter, Download, ArrowUpRight, X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Registrations() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Registrations</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Track ticket sales and manage orders across all events.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <Button variant="outline" className="h-12 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
              <Download size={18} className="mr-2" /> Export CSV
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Revenue" value="$24,500" trend="+15%" icon={<TrendingUp size={24} className="text-emerald-500" />} />
          <StatCard title="Tickets Sold" value="1,284" trend="+8%" icon={<Ticket size={24} className="text-brand-blue" />} />
          <StatCard title="Avg. Order Value" value="$45.20" trend="+2%" icon={<ArrowUpRight size={24} className="text-purple-500" />} />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 border dark:border-slate-800 overflow-hidden transition-colors duration-300">
          <CardHeader className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 transition-colors duration-300">
            <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Recent Orders</CardTitle>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input placeholder="Search orders..." className="pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl h-10 text-slate-900 dark:text-slate-100" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40">
                <TableRow className="border-none">
                  <TableHead className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Order ID</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Event</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Customer</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ticket Type</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Amount</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <OrderRow id="#ORD-001" event="Global Tech Summit 2026" user="Ali Khan" type="VIP Access" amount="$199.00" status="Completed" />
                <OrderRow id="#ORD-002" event="Global Tech Summit 2026" user="Sarah Ahmed" type="Standard" amount="$49.00" status="Completed" />
                <OrderRow id="#ORD-003" event="Design Workshop" user="John Doe" type="Standard" amount="$25.00" status="Pending" />
                <OrderRow id="#ORD-004" event="Web3 Meetup" user="Emily Chen" type="Early Bird" amount="$15.00" status="Completed" />
                <OrderRow id="#ORD-005" event="Startup Pitch Night" user="Michael Ross" type="Standard" amount="$10.00" status="Refunded" />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
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

function OrderRow({ id, event, user, type, amount, status }) {
  const getStatusColor = (s) => {
    if (s === 'Completed') return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400';
    if (s === 'Pending') return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400';
    return 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450';
  };

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800 cursor-pointer">
      <TableCell className="px-8 py-6 font-bold text-slate-900 dark:text-white">{id}</TableCell>
      <TableCell className="px-8 py-6 font-bold text-brand-blue">{event}</TableCell>
      <TableCell className="px-8 py-6 text-slate-650 dark:text-slate-300 font-medium">{user}</TableCell>
      <TableCell className="px-8 py-6 text-slate-500 dark:text-slate-400 font-medium">{type}</TableCell>
      <TableCell className="px-8 py-6 font-black text-slate-900 dark:text-white">{amount}</TableCell>
      <TableCell className="px-8 py-6">
        <Badge className={`border-none rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(status)}`}>{status}</Badge>
      </TableCell>
    </TableRow>
  );
}
