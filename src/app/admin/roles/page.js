"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { ShieldCheck, Plus, Trash2, Menu, RefreshCw, Loader2, CheckCircle2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminRoles() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(["Event Moderation"]);
  const [toastMessage, setToastMessage] = useState(null);

  const availablePermissions = [
    "System Configuration",
    "Financial Reports",
    "Manage Admins",
    "Event Moderation",
    "User Warning",
    "User Ban/Suspend",
    "View Reports",
    "Customer Support",
    "Content Takedown",
    "Payout Approvals"
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (data.success && Array.isArray(data.roles)) {
        setRolesList(data.roles);
      }
    } catch (err) {
      console.warn("Failed to load roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newRoleTitle,
          desc: newRoleDesc,
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("New role created successfully!");
        setIsModalOpen(false);
        setNewRoleTitle("");
        setNewRoleDesc("");
        loadRoles();
      } else {
        showToast(data.message || "Failed to create role");
      }
    } catch (err) {
      showToast("Network error creating role");
    }
  };

  const removeRole = async (id) => {
    if (!confirm("Are you sure you want to remove this role?")) return;
    try {
      const res = await fetch(`/api/admin/roles?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRolesList((prev) => prev.filter((r) => r.id !== id));
        showToast("Role removed successfully");
      } else {
        showToast(data.message || "Failed to remove role");
      }
    } catch (err) {
      showToast("Network error removing role");
    }
  };

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar activePage="roles" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-72 xl:ml-80 w-full overflow-x-hidden min-w-0">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-fade-in border border-slate-700 dark:border-slate-200">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              id="admin-roles-hamburger-btn"
              aria-label="Open admin navigation menu"
              className="lg:hidden p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                Role Access Controls
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base mt-0.5 truncate">
                Configure permissions and security clearance for administrative staff.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto items-center shrink-0">
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 sm:h-12 shadow-lg shadow-blue-500/20 px-5 shrink-0 flex-1 sm:flex-initial justify-center cursor-pointer text-xs sm:text-sm"
            >
              <Plus size={18} className="mr-2" /> Add Custom Role
            </Button>
            <Button 
              onClick={loadRoles} 
              variant="outline" 
              title="Refresh Roles"
              className="h-11 sm:h-12 w-11 sm:w-12 p-0 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 shrink-0 cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-brand-blue" : ""} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3 font-bold">
            <Loader2 className="animate-spin text-brand-blue" size={24} />
            Loading security roles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {rolesList.map((role) => (
              <RoleCard 
                key={role.id}
                {...role}
                onDelete={() => removeRole(role.id)}
              />
            ))}
          </div>
        )}

        {/* Create Role Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Create Custom Role</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Role Title</label>
                  <Input 
                    value={newRoleTitle} 
                    onChange={(e) => setNewRoleTitle(e.target.value)} 
                    placeholder="e.g. Compliance Officer" 
                    required 
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">Description</label>
                  <Input 
                    value={newRoleDesc} 
                    onChange={(e) => setNewRoleDesc(e.target.value)} 
                    placeholder="Brief description of responsibilities" 
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Permissions</label>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {availablePermissions.map((perm) => {
                      const active = selectedPermissions.includes(perm);
                      return (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => togglePermission(perm)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? "bg-brand-blue text-white shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {perm}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-11">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-md">
                    Create Role
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function RoleCard({ id, title, desc, users, permissions, color = "bg-brand-blue", onDelete }) {
  const isDefault = id === "role_1" || id === "role_2" || id === "role_3";

  return (
    <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-none dark:border dark:border-slate-800 shadow-xl dark:shadow-none p-6 sm:p-8 bg-white dark:bg-slate-900 flex flex-col justify-between transition-colors duration-300 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0`}>
            <ShieldCheck size={24} />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-none font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
              {users} Assigned
            </Badge>
            {!isDefault && (
              <button onClick={onDelete} title="Delete Role" className="text-slate-400 hover:text-rose-500 p-1 rounded-lg cursor-pointer">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mb-6">{desc}</p>

        <div className="space-y-2 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Granted Privileges</p>
          <div className="flex flex-wrap gap-1.5">
            {permissions?.map((p, idx) => (
              <Badge key={idx} variant="outline" className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 font-bold text-[11px] rounded-lg px-2.5 py-1">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
