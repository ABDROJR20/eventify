"use client";

import { useState } from "react";
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
  Menu
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
  const [approvalsList, setApprovalsList] = useState([
    { id: 1, title: "Global Tech Summit 2026", user: "Mahad Yaseen", date: "May 15, 2026" },
    { id: 2, title: "Digital Marketing Expo", user: "Abdullah Bin Munawar", date: "May 14, 2026" },
    { id: 3, title: "AI Research Workshop", user: "Muhammad Umer", date: "May 14, 2026" },
    { id: 4, title: "Crypto & Web3 Meetup", user: "Aadrish Pirzado", date: "May 13, 2026" }
  ]);

  const handleApprovalAction = (id) => {
    setApprovalsList(approvalsList.filter(app => app.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="overview" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 w-full overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Overview</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Monitor and manage the entire Eventify ecosystem.</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:w-72">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search events, users..." 
                className="pl-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 shrink-0">
              <SlidersHorizontal size={20} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <AdminStatCard label="Total Platform Users" value="45,284" trend="+1.2k this week" type="blue" />
          <AdminStatCard label="Live Events" value="1,402" trend="+85 today" type="green" />
          <AdminStatCard label="Reported Issues" value="12" trend="-4 from yesterday" type="red" />
        </div>

        {/* User Management Table Section */}
        <Card className="rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardHeader className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Pending Event Approvals</CardTitle>
              <p className="text-slate-500 dark:text-slate-450 text-sm mt-1">Review and manage upcoming event submissions.</p>
            </div>
            <Button variant="ghost" className="text-brand-blue font-black hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl px-6">View All Approvals</Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Event Title</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Organizer</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Submission Date</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalsList.length > 0 ? approvalsList.map(app => (
                  <ApprovalRow 
                    key={app.id} 
                    {...app} 
                    onApprove={() => handleApprovalAction(app.id)} 
                    onReject={() => handleApprovalAction(app.id)} 
                  />
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500 font-bold">No pending approvals.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
    <Card className="rounded-[2.5rem] border-none dark:border dark:border-slate-800 shadow-xl dark:shadow-none p-8 relative overflow-hidden bg-white dark:bg-slate-900 group hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${type === 'blue' ? 'bg-brand-blue' : type === 'green' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      <CardHeader className="p-0 mb-4">
        <Badge className={`${styles[type]} border-none rounded-full px-4 py-1 font-bold text-[10px] tracking-wider uppercase`}>{trend}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-slate-500 dark:text-slate-450 text-sm font-black uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          {value}
        </h4>
      </CardContent>
    </Card>
  );
}

function ApprovalRow({ title, user, date, onApprove, onReject }) {
  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-850">
      <TableCell className="px-10 py-8 font-black text-slate-900 dark:text-white text-lg tracking-tight">{title}</TableCell>
      <TableCell className="px-10 py-8 text-slate-650 dark:text-slate-300 font-bold">{user}</TableCell>
      <TableCell className="px-10 py-8">
        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 border-amber-200 dark:border-amber-900 rounded-lg px-4 py-1 font-black text-[10px] tracking-widest uppercase flex items-center gap-2 w-fit">
          <Clock size={12} /> Pending Review
        </Badge>
      </TableCell>
      <TableCell className="px-10 py-8 text-slate-400 dark:text-slate-500 font-bold text-sm tracking-tight">{date}</TableCell>
      <TableCell className="px-10 py-8 text-right space-x-2 whitespace-nowrap">
        <Button onClick={onApprove} variant="ghost" className="text-emerald-600 dark:text-emerald-405 font-black hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl px-4">
          <CheckCircle2 className="mr-2 h-4 w-4 shrink-0" /> Approve
        </Button>
        <Button onClick={onReject} variant="ghost" className="text-rose-500 dark:text-rose-455 font-black hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl px-4">
          <XCircle className="mr-2 h-4 w-4 shrink-0" /> Reject
        </Button>
      </TableCell>
    </TableRow>
  );
}
