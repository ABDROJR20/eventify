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
  Home
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

export default function AdminPanel() {
  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col p-8 h-screen fixed top-0 left-0 z-20 shadow-2xl shadow-blue-900/20">
        <Link href="/">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Shield size={28} color="white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">Eventify <span className="text-brand-blue">Admin</span></h1>
          </div>
        </Link>
        
        <nav className="flex-1 space-y-3">
          <AdminNavItem icon={<LayoutDashboard size={20} />} label="Overview" active href="/admin" />
          <AdminNavItem icon={<Home size={20} />} label="Back to Portal" href="/portal" />
          <AdminNavItem icon={<Calendar size={20} />} label="All Events" href="/admin/events" />
          <AdminNavItem icon={<UserCog size={20} />} label="User Management" href="/admin/users" />
          <AdminNavItem icon={<ShieldCheck size={20} />} label="Role Access" href="/admin/roles" />
          <AdminNavItem icon={<AlertCircle size={20} />} label="System Alerts" href="/admin/alerts" />
          <AdminNavItem icon={<Settings2 size={20} />} label="Global Settings" href="/admin/settings" />
        </nav>
        
        <div className="mt-auto border-t border-slate-800/50 pt-8">
          <Link href="/auth">
            <div className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center gap-4 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue font-black border border-brand-blue/30">
                AD
              </div>
              <div>
                <p className="font-bold text-sm text-white">System Admin</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sign Out</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto ml-72">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h2>
            <p className="text-slate-500 font-medium text-lg mt-1">Monitor and manage the entire Eventify ecosystem.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search events, users..." 
                className="pl-12 h-12 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm border-none"
              />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white border-slate-200 shadow-sm hover:bg-slate-50">
              <SlidersHorizontal size={20} className="text-slate-600" />
            </Button>
          </div>
        </header>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <AdminStatCard label="Total Platform Users" value="45,284" trend="+1.2k this week" type="blue" />
          <AdminStatCard label="Live Events" value="1,402" trend="+85 today" type="green" />
          <AdminStatCard label="Reported Issues" value="12" trend="-4 from yesterday" type="red" />
        </div>

        {/* User Management Table Section */}
        <Card className="rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-none overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-slate-50 flex flex-row justify-between items-center bg-white">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Pending Event Approvals</CardTitle>
              <p className="text-slate-500 font-medium text-sm mt-1">Review and manage upcoming event submissions.</p>
            </div>
            <Button variant="ghost" className="text-brand-blue font-black hover:bg-blue-50 rounded-xl px-6">View All Approvals</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Event Title</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Organizer</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Submission Date</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ApprovalRow title="Global Tech Summit 2026" user="Mahad Yaseen" date="May 15, 2026" />
                <ApprovalRow title="Digital Marketing Expo" user="Abdullah Bin Munawar" date="May 14, 2026" />
                <ApprovalRow title="AI Research Workshop" user="Muhammad Umer" date="May 14, 2026" />
                <ApprovalRow title="Crypto & Web3 Meetup" user="Aadrish Pirzado" date="May 13, 2026" />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function AdminNavItem({ icon, label, active = false, href = "#" }) {
  return (
    <Link href={href} className="block">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.25rem] cursor-pointer transition-all duration-300 group ${active ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/40 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-brand-blue'} transition-colors`}>{icon}</span>
        <span className="tracking-tight">{label}</span>
      </div>
    </Link>
  );
}

function AdminStatCard({ label, value, trend, type }) {
  const styles = {
    blue: 'bg-brand-blue/10 text-brand-blue',
    green: 'bg-emerald-500/10 text-emerald-600',
    red: 'bg-rose-500/10 text-rose-600'
  };
  
  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${type === 'blue' ? 'bg-brand-blue' : type === 'green' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      <CardHeader className="p-0 mb-4">
        <Badge className={`${styles[type]} border-none rounded-full px-4 py-1 font-bold text-[10px] tracking-wider uppercase`}>{trend}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-slate-500 text-sm font-black uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
          {value}
        </h4>
      </CardContent>
    </Card>
  );
}

function ApprovalRow({ title, user, date }) {
  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-50">
      <TableCell className="px-10 py-8 font-black text-slate-900 text-lg tracking-tight">{title}</TableCell>
      <TableCell className="px-10 py-8 text-slate-600 font-bold">{user}</TableCell>
      <TableCell className="px-10 py-8">
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 rounded-lg px-4 py-1 font-black text-[10px] tracking-widest uppercase flex items-center gap-2 w-fit">
          <Clock size={12} /> Pending Review
        </Badge>
      </TableCell>
      <TableCell className="px-10 py-8 text-slate-400 font-bold text-sm tracking-tight">{date}</TableCell>
      <TableCell className="px-10 py-8 text-right space-x-2">
        <Button variant="ghost" className="text-emerald-600 font-black hover:bg-emerald-50 rounded-xl px-4">
          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
        </Button>
        <Button variant="ghost" className="text-rose-500 font-black hover:bg-rose-50 rounded-xl px-4">
          <XCircle className="mr-2 h-4 w-4" /> Reject
        </Button>
      </TableCell>
    </TableRow>
  );
}
