"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { ShieldCheck, Plus, Edit2, Trash2, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminRoles() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="roles" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Role Access Controls</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Configure permissions and access levels for administrative staff.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto items-center shrink-0">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6 shrink-0 flex-1 sm:flex-initial justify-center">
              <Plus size={18} className="mr-2" /> Add Custom Role
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <RoleCard 
            title="Super Admin" 
            desc="Full unrestricted access to all platform features and settings." 
            users={3}
            permissions={['System Configuration', 'Financial Reports', 'Manage Admins', 'Event Moderation', 'User Ban/Suspend']}
            color="bg-brand-blue"
          />
          <RoleCard 
            title="Moderator" 
            desc="Can review events, suspend users, and handle reports." 
            users={12}
            permissions={['Event Moderation', 'User Warning', 'View Reports', 'Customer Support', 'Content Takedown']}
            color="bg-purple-500"
          />
          <RoleCard 
            title="Finance Analyst" 
            desc="Read-only access to financial dashboards and payouts." 
            users={5}
            permissions={['Financial Reports', 'Payout Approvals', 'View Transactions', 'Export Tax Data']}
            color="bg-emerald-500"
          />
        </div>
      </div>
    </main>
  );
}

function RoleCard({ title, desc, users, permissions, color }) {
  return (
    <Card className="rounded-[2.5rem] shadow-xl dark:shadow-none border-none dark:border dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 hover:-translate-y-2 transition-all duration-300 flex flex-col">
      <div className={`h-3 w-full ${color}`}></div>
      <CardHeader className="p-8 pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">{title}</CardTitle>
          <Badge variant="outline" className="font-bold text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800">{users} Users</Badge>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
      </CardHeader>
      <CardContent className="p-8 pt-0 flex-1 flex flex-col">
        <div className="mb-6 flex-1">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-4">Included Permissions</p>
          <ul className="space-y-3">
            {permissions.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck size={16} className={color.replace('bg-', 'text-')} /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 pt-6 border-t border-slate-100 dark:border-slate-850">
          <Button variant="outline" className="flex-1 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800/40 border-slate-200 dark:border-slate-800 h-11">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 border-slate-200 dark:border-slate-800 h-11 w-11 shrink-0">
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
