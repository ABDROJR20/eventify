"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, MoreVertical, ShieldAlert, Mail, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminUsers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="users" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Manage attendees, organizers, and their platform access.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search by name, email..." className="pl-12 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100" />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <Card className="rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">User Details</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Account Type</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <UserRow name="Mahad Yaseen" email="mahad@eventify.com" type="Organizer" status="Active" />
                <UserRow name="Abdullah Bin Munawar" email="abdullah@eventify.com" type="Organizer" status="Active" />
                <UserRow name="John Doe" email="john.doe@example.com" type="Attendee" status="Active" />
                <UserRow name="Spam Bot 99" email="spam@scam.net" type="Attendee" status="Banned" />
                <UserRow name="Sarah Khan" email="sarah@eventify.com" type="Organizer" status="Active" />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function UserRow({ name, email, type, status }) {
  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-850 cursor-pointer">
      <TableCell className="px-10 py-6">
        <div className="flex items-center gap-4">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} alt={name} className="w-12 h-12 rounded-xl shrink-0" />
          <div>
            <p className="font-black text-slate-900 dark:text-white text-base tracking-tight mb-0.5">{name}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-550 flex items-center gap-1"><Mail size={12} /> {email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-10 py-6">
        <Badge variant="outline" className={`px-3 py-1 border-none font-black text-[10px] uppercase tracking-widest ${type === 'Organizer' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{type}</Badge>
      </TableCell>
      <TableCell className="px-10 py-6">
        {status === 'Active' ? 
          <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Active</Badge> : 
          <Badge className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 flex items-center gap-1 w-fit"><ShieldAlert size={12}/> Banned</Badge>
        }
      </TableCell>
      <TableCell className="px-10 py-6 text-right space-x-2">
        <Button variant="ghost" size="icon" className="text-slate-400 dark:text-slate-500 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl">
          <MoreVertical size={18} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
