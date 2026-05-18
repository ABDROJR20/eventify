import { LayoutDashboard, Home, Calendar, UserCog, ShieldCheck, AlertCircle, Settings2, Search, Filter, MoreVertical, Shield, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function AdminEvents() {
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
          <AdminNavItem icon={<LayoutDashboard size={20} />} label="Overview" href="/admin" />
          <AdminNavItem icon={<Home size={20} />} label="Back to Portal" href="/portal" />
          <AdminNavItem icon={<Calendar size={20} />} label="All Events" active href="/admin/events" />
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
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">All Events</h2>
            <p className="text-slate-500 font-medium text-lg mt-1">Master list of all events created on the platform.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search event titles, IDs..." className="pl-12 h-12 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm border-none" />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-white border-slate-200 shadow-sm hover:bg-slate-50">
              <Filter size={20} className="text-slate-600" />
            </Button>
          </div>
        </header>

        <Card className="rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-none overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-slate-50 flex flex-row justify-between items-center bg-white">
            <div className="flex gap-4">
              <Badge variant="outline" className="px-4 py-2 bg-brand-blue/10 text-brand-blue border-brand-blue/20 font-black rounded-lg">1,402 Live</Badge>
              <Badge variant="outline" className="px-4 py-2 bg-slate-100 text-slate-500 border-none font-bold rounded-lg">84 Pending</Badge>
              <Badge variant="outline" className="px-4 py-2 bg-rose-50 text-rose-500 border-none font-bold rounded-lg">12 Suspended</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Event Details</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Organizer</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="px-10 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest text-right">Admin Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <EventRow title="Global Tech Summit 2026" id="EVT-9921" organizer="Mahad Yaseen" status="Live" />
                <EventRow title="Digital Marketing Expo" id="EVT-8834" organizer="Abdullah Bin Munawar" status="Suspended" />
                <EventRow title="AI Research Workshop" id="EVT-7721" organizer="Muhammad Umer" status="Pending" />
                <EventRow title="Crypto & Web3 Meetup" id="EVT-6652" organizer="Aadrish Pirzado" status="Live" />
                <EventRow title="Startup Pitch Night" id="EVT-5541" organizer="Sarah Khan" status="Live" />
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

function EventRow({ title, id, organizer, status }) {
  const getStatusBadge = () => {
    if (status === 'Live') return <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Live</Badge>;
    if (status === 'Pending') return <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Pending Review</Badge>;
    return <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Suspended</Badge>;
  };

  return (
    <TableRow className="hover:bg-slate-50/50 transition-colors border-slate-50 cursor-pointer">
      <TableCell className="px-10 py-6">
        <p className="font-black text-slate-900 text-lg tracking-tight mb-1">{title}</p>
        <p className="text-xs font-bold text-slate-400 tracking-widest">{id}</p>
      </TableCell>
      <TableCell className="px-10 py-6 text-slate-600 font-bold">{organizer}</TableCell>
      <TableCell className="px-10 py-6">{getStatusBadge()}</TableCell>
      <TableCell className="px-10 py-6 text-right space-x-2">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl">
          <MoreVertical size={18} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
