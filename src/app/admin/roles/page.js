import { LayoutDashboard, Home, Calendar, UserCog, ShieldCheck, AlertCircle, Settings2, Shield, Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminRoles() {
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
          <AdminNavItem icon={<Calendar size={20} />} label="All Events" href="/admin/events" />
          <AdminNavItem icon={<UserCog size={20} />} label="User Management" href="/admin/users" />
          <AdminNavItem icon={<ShieldCheck size={20} />} label="Role Access" active href="/admin/roles" />
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
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Role Access Controls</h2>
            <p className="text-slate-500 font-medium text-lg mt-1">Configure permissions and access levels for administrative staff.</p>
          </div>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6">
            <Plus size={18} className="mr-2" /> Add Custom Role
          </Button>
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

function RoleCard({ title, desc, users, permissions, color }) {
  return (
    <Card className="rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-none overflow-hidden bg-white hover:-translate-y-2 transition-transform duration-500 flex flex-col">
      <div className={`h-3 w-full ${color}`}></div>
      <CardHeader className="p-8 pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-2xl font-black text-slate-900">{title}</CardTitle>
          <Badge variant="outline" className="font-bold text-slate-500 border-slate-200">{users} Users</Badge>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
      </CardHeader>
      <CardContent className="p-8 pt-0 flex-1 flex flex-col">
        <div className="mb-6 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Included Permissions</p>
          <ul className="space-y-3">
            {permissions.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <ShieldCheck size={16} className={color.replace('bg-', 'text-')} /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 pt-6 border-t border-slate-100">
          <Button variant="outline" className="flex-1 rounded-xl font-bold text-slate-600 hover:text-brand-blue hover:bg-blue-50 border-slate-200">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 border-slate-200">
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
