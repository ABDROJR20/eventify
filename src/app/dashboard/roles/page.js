"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Mail, 
  Calendar, 
  Menu, 
  Loader2, 
  CheckCircle2, 
  X, 
  QrCode, 
  Users, 
  Eye, 
  Radio, 
  DollarSign, 
  Edit3, 
  RefreshCw,
  Send,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationBell from "@/components/NotificationBell";

// Preset Role Profiles for fast setup
const ROLE_PRESETS = [
  {
    title: "Gate Scanner & Check-in",
    desc: "Scans QR ticket passes at venue gate",
    permissions: {
      canCheckIn: true,
      canViewAttendees: true,
      canEditEvent: false,
      canSendBroadcast: false,
      canViewRevenue: false,
    },
  },
  {
    title: "Event Coordinator",
    desc: "Oversees attendee check-ins, guestlists & event schedule",
    permissions: {
      canCheckIn: true,
      canViewAttendees: true,
      canEditEvent: true,
      canSendBroadcast: true,
      canViewRevenue: false,
    },
  },
  {
    title: "Registration & Help Desk",
    desc: "Handles registrant lookups and attendee inquiries",
    permissions: {
      canCheckIn: false,
      canViewAttendees: true,
      canEditEvent: false,
      canSendBroadcast: false,
      canViewRevenue: false,
    },
  },
  {
    title: "Broadcast & Announcements Lead",
    desc: "Dispatches live announcements to event attendees",
    permissions: {
      canCheckIn: false,
      canViewAttendees: true,
      canEditEvent: false,
      canSendBroadcast: true,
      canViewRevenue: false,
    },
  },
];

export default function TeamRolesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");

  // Form State for Add Role Modal
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [roleTitle, setRoleTitle] = useState("Gate Scanner & Check-in");
  const [permissions, setPermissions] = useState({
    canCheckIn: true,
    canViewAttendees: true,
    canEditEvent: false,
    canSendBroadcast: false,
    canViewRevenue: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Team Roles & Events
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [rolesRes, eventsRes] = await Promise.all([
        fetch("/api/organizer/roles"),
        fetch("/api/organizer/events"),
      ]);

      const rolesData = await rolesRes.json();
      const eventsData = await eventsRes.json();

      if (rolesData.success && Array.isArray(rolesData.roles)) {
        setRoles(rolesData.roles);
      }

      if (eventsData.success && Array.isArray(eventsData.data)) {
        setEvents(eventsData.data);
        if (eventsData.data.length > 0 && !selectedEventId) {
          setSelectedEventId(eventsData.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading team roles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Preset selection
  const handleSelectPreset = (preset) => {
    setRoleTitle(preset.title);
    setPermissions(preset.permissions);
  };

  // Toggle individual permission authority
  const handleTogglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Submit Add Role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!memberName.trim() || !memberEmail.trim()) {
      setFormError("Please fill in member name and email.");
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch("/api/organizer/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: memberName,
          email: memberEmail,
          eventId: selectedEventId || (events[0]?.id || "evt_1"),
          roleTitle,
          permissions,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create team role.");
      }

      setFormSuccess(data.message || "Role created and invite email sent!");
      setMemberName("");
      setMemberEmail("");
      
      // Reload roles list
      await loadData();

      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
      }, 1500);
    } catch (err) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete / Revoke Role
  const handleDeleteRole = async (id) => {
    if (!confirm("Are you sure you want to revoke this team member's role and authorities?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/organizer/roles?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRoles((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.message || "Failed to delete role.");
      }
    } catch (err) {
      alert("Error deleting role: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter roles by search and event
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent =
      selectedEventFilter === "all" ||
      String(role.eventId) === String(selectedEventFilter) ||
      role.eventId === "all";

    return matchesSearch && matchesEvent;
  });

  // Calculate quick stats
  const totalMembers = roles.length;
  const gateScannersCount = roles.filter((r) => r.permissions?.canCheckIn).length;
  const eventsCovered = new Set(roles.map((r) => r.eventId)).size;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar activePage="roles" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-brand-blue" size={20} />
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Team & Event Roles</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1.5">
                Staff & Role Authorities
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Har event ke liye alag alag staff assign karein aur unki specific authorities (e.g. Gate Check-in) control karein.
              </p>
            </div>

            <Button
              onClick={() => {
                setFormError("");
                setFormSuccess("");
                setIsModalOpen(true);
              }}
              className="bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-2xl h-11 px-5 shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <UserPlus size={18} />
              <span>Add Role & Invite Member</span>
            </Button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-black">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Team Members</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalMembers}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                  <QrCode size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Gate Check-in Staff</p>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{gateScannersCount}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Staffed Events</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{eventsCovered}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-slate-400 shrink-0" />
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="w-full sm:w-auto h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Events Filter</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>

              <Button
                variant="ghost"
                size="icon"
                onClick={loadData}
                disabled={isLoading}
                className="rounded-xl h-10 w-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>

          {/* Team Roles List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-brand-blue" />
                <p className="text-xs font-bold">Loading team members & roles...</p>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Users size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">No Team Members Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Apne event ke liye pehla team member ya gate scanner invite karein taakay wo venue par check-in kar sakein.
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-brand-blue text-white rounded-xl text-xs font-bold h-9 mt-2"
                >
                  <UserPlus size={14} className="mr-1.5" /> Invite First Member
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-4 px-6">Member Details</th>
                      <th className="py-4 px-6">Assigned Event</th>
                      <th className="py-4 px-6">Role Title</th>
                      <th className="py-4 px-6">Granted Authorities</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredRoles.map((role) => {
                      const initials = role.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase();

                      return (
                        <tr key={role.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate">{role.name}</p>
                                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                  <Mail size={11} /> {role.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none font-bold text-[11px]">
                              {role.eventTitle || "Assigned Event"}
                            </Badge>
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-extrabold text-brand-blue dark:text-blue-400">
                              {role.roleTitle}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {role.permissions?.canCheckIn && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-lg text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
                                  <QrCode size={11} /> Gate Check-in
                                </span>
                              )}
                              {role.permissions?.canViewAttendees && (
                                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                                  <Users size={11} /> View Guests
                                </span>
                              )}
                              {role.permissions?.canEditEvent && (
                                <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                                  <Edit3 size={11} /> Edit Event
                                </span>
                              )}
                              {role.permissions?.canSendBroadcast && (
                                <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                                  <Radio size={11} /> Broadcast
                                </span>
                              )}
                              {role.permissions?.canViewRevenue && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                                  <DollarSign size={11} /> Revenue
                                </span>
                              )}
                              {!role.permissions?.canCheckIn && !role.permissions?.canViewAttendees && !role.permissions?.canEditEvent && !role.permissions?.canSendBroadcast && !role.permissions?.canViewRevenue && (
                                <span className="text-[10px] text-slate-400 font-medium italic">View Only</span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px]">
                              {role.status || "Active"}
                            </Badge>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === role.id}
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl h-8 px-2.5 font-bold text-xs"
                            >
                              {deletingId === role.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Add Role / Invite Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-5 animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-black">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Add Role & Invite Member</h3>
                  <p className="text-xs text-slate-400 font-medium">Assign customized event authorities</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            {/* Feedback Alerts */}
            {formError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateRole} className="space-y-4">
              
              {/* Member Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Ali Ahmed"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="ali@example.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Event Target */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Event (Har event ka alag role) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.date})
                    </option>
                  ))}
                  <option value="all">⭐ All My Current & Future Events</option>
                </select>
              </div>

              {/* Role Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Choose Role Preset or Custom Title
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.title}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        roleTitle === preset.title
                          ? "border-brand-blue bg-blue-50/60 dark:bg-blue-950/40 text-brand-blue dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <p className="font-extrabold text-xs">{preset.title}</p>
                      <p className="text-[10px] opacity-75 truncate">{preset.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Role Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Role Title (Customizable)
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. VIP Gate Scanner Lead"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-bold"
                />
              </div>

              {/* Specific Authority Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Designated Authorities (Organizer Control)
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">Select granted actions</span>
                </div>

                <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  
                  {/* Authority 1: Gate Check-in */}
                  <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canCheckIn}
                      onChange={() => handleTogglePermission("canCheckIn")}
                      className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <QrCode size={13} className="text-emerald-500" /> Entrance Gate QR Check-in
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Allows scanning and checking in attendee tickets at venue entrance.
                      </p>
                    </div>
                  </label>

                  {/* Authority 2: View Attendees */}
                  <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canViewAttendees}
                      onChange={() => handleTogglePermission("canViewAttendees")}
                      className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Users size={13} className="text-blue-500" /> View Attendee Guestlist
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Can search and view attendee names, emails, and ticket tier.
                      </p>
                    </div>
                  </label>

                  {/* Authority 3: Edit Event */}
                  <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canEditEvent}
                      onChange={() => handleTogglePermission("canEditEvent")}
                      className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Edit3 size={13} className="text-purple-500" /> Edit Event Schedule & Logistics
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Can adjust event timing, venue details, and descriptions.
                      </p>
                    </div>
                  </label>

                  {/* Authority 4: Broadcasts */}
                  <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canSendBroadcast}
                      onChange={() => handleTogglePermission("canSendBroadcast")}
                      className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Radio size={13} className="text-amber-500" /> Dispatch Announcements & Broadcasts
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Can send real-time alerts to registered attendees.
                      </p>
                    </div>
                  </label>

                  {/* Authority 5: Revenue */}
                  <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canViewRevenue}
                      onChange={() => handleTogglePermission("canViewRevenue")}
                      className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <DollarSign size={13} className="text-indigo-500" /> View Financials & Ticket Revenue
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Allows access to monetary analytics and payout histories.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 h-12 rounded-2xl font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 h-12 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-brand-blue/25 transition-all flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Invite...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Invite Email</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
