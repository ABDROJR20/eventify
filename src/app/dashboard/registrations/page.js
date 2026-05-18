"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Search, Filter, Download, ArrowUpRight , X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function Registrations() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <main className="min-h-screen bg-slate-50 flex">
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
          <NavItem icon={<Ticket size={20} />} label="Registrations" active href="/dashboard/registrations" />
          <NavItem icon={<Users size={20} />} label="Attendees" href="/dashboard/attendees" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" href="/dashboard/analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" href="/dashboard/settings" />
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
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
          <button 
            className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shrink-0 mb-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Registrations</h2>
            <p className="text-slate-500 font-medium">Track ticket sales and manage orders across all events.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-12 rounded-xl bg-white border-slate-200 shadow-sm hover:bg-slate-50 font-bold text-slate-600">
              <Download size={18} className="mr-2" /> Export CSV
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Revenue" value="$24,500" trend="+15%" icon={<TrendingUp size={24} className="text-emerald-500" />} />
          <StatCard title="Tickets Sold" value="1,284" trend="+8%" icon={<Ticket size={24} className="text-brand-blue" />} />
          <StatCard title="Avg. Order Value" value="$45.20" trend="+2%" icon={<ArrowUpRight size={24} className="text-purple-500" />} />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row justify-between items-center bg-white">
            <CardTitle className="text-xl font-black text-slate-900">Recent Orders</CardTitle>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input placeholder="Search orders..." className="pl-10 bg-slate-50 border-none rounded-xl h-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Order ID</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Event</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Customer</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Ticket Type</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Amount</TableHead>
                  <TableHead className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
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

function StatCard({ title, value, trend, icon }) {
  return (
    <Card className="rounded-[2rem] border-none shadow-md shadow-slate-200/50 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
        <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-bold rounded-full">{trend}</Badge>
      </div>
      <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
    </Card>
  );
}

function OrderRow({ id, event, user, type, amount, status }) {
  const getStatusColor = (s) => {
    if (s === 'Completed') return 'bg-emerald-50 text-emerald-600';
    if (s === 'Pending') return 'bg-amber-50 text-amber-600';
    return 'bg-rose-50 text-rose-600';
  };

  return (
    <TableRow className="hover:bg-slate-50/50 border-slate-50 cursor-pointer">
      <TableCell className="px-8 py-6 font-bold text-slate-900">{id}</TableCell>
      <TableCell className="px-8 py-6 font-bold text-brand-blue">{event}</TableCell>
      <TableCell className="px-8 py-6 text-slate-600 font-medium">{user}</TableCell>
      <TableCell className="px-8 py-6 text-slate-500 font-medium">{type}</TableCell>
      <TableCell className="px-8 py-6 font-black text-slate-900">{amount}</TableCell>
      <TableCell className="px-8 py-6">
        <Badge className={`border-none rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(status)}`}>{status}</Badge>
      </TableCell>
    </TableRow>
  );
}
