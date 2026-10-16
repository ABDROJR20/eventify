"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MoreVertical, 
  MessageSquare, 
  X, 
  Menu, 
  Loader2, 
  Download, 
  Calendar,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotificationBell from "@/components/NotificationBell";

export default function Attendees() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendeesList, setAttendeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // null | { type: 'profile' | 'message' | 'broadcast', attendee }
  
  // Broadcast / Message state
  const [messageForm, setMessageForm] = useState({ subject: "", body: "" });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState(null);

  const loadAttendees = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const res = await fetch("/api/organizer/attendees");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAttendeesList(data.data);
      }
    } catch (err) {
      console.error("Failed to load attendees:", err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendees(false);

    // Live background polling so guestlist stays updated without page reload
    const pollInterval = setInterval(() => {
      loadAttendees(true);
    }, 12000);

    const onWindowFocus = () => {
      loadAttendees(true);
    };
    window.addEventListener("focus", onWindowFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, []);

  const removeAttendee = async (id) => {
    if (!confirm("Are you sure you want to remove this attendee from your community directory?")) return;
    try {
      const res = await fetch(`/api/organizer/attendees/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAttendeesList(prev => prev.filter(a => String(a.id) !== String(id)));
      } else {
        alert(data.error || "Failed to remove attendee");
      }
    } catch (err) {
      alert(err.message || "Error removing attendee");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageForm.subject || !messageForm.body) return;
    setSendingMessage(true);
    setMessageFeedback(null);

    try {
      const res = await fetch("/api/organizer/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "All",
          subject: messageForm.subject,
          message: messageForm.body,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessageFeedback({ success: true, text: "Message dispatched successfully!" });
        setMessageForm({ subject: "", body: "" });
        setTimeout(() => setActiveModal(null), 1500);
      } else {
        setMessageFeedback({ success: false, text: data.error || "Failed to send message" });
      }
    } catch (err) {
      setMessageFeedback({ success: false, text: err.message || "Network error" });
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredAttendees = attendeesList.filter(attendee => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (attendee.name || "").toLowerCase().includes(q) ||
           (attendee.email || "").toLowerCase().includes(q) ||
           (attendee.phone || "").toLowerCase().includes(q);
  });
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="attendees" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Attendees CRM</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Manage your community, send broadcasts, and view attendee profiles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto flex-wrap">
            <a 
              href="/api/organizer/export?type=attendees&format=csv"
              download
              className="inline-flex items-center justify-center font-bold text-sm rounded-xl h-11 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download size={16} className="mr-2 text-emerald-600 dark:text-emerald-400" /> Export CSV
            </a>
            <Button 
              onClick={() => { setMessageFeedback(null); setActiveModal({ type: 'broadcast' }); }}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 shadow-xl shadow-blue-500/20 px-5 shrink-0 text-sm"
            >
              <MessageSquare size={16} className="mr-2" /> Broadcast Message
            </Button>
            <NotificationBell role="organizer" />
            <ThemeToggle />
          </div>
        </header>

        <Card className="rounded-[2.5rem] border-none shadow-xl dark:shadow-none shadow-slate-200/50 bg-white dark:bg-slate-900 border dark:border-slate-800 overflow-hidden p-6 sm:p-8 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex gap-4 items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Community Directory</h3>
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-950 text-slate-650 dark:text-slate-400 font-bold px-3 py-1 rounded-full border-none">{attendeesList.length} Total</Badge>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendees..." 
                className="pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-12 focus:border-brand-blue text-slate-900 dark:text-slate-100 font-medium text-sm" 
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-brand-blue h-10 w-10 mb-4" />
              <p className="text-slate-500 font-bold text-sm">Loading attendees directory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map(attendee => (
                  <AttendeeCard 
                    key={attendee.id} 
                    {...attendee} 
                    onAction={(type) => {
                      if (type === 'remove') removeAttendee(attendee.id);
                      else {
                        setMessageFeedback(null);
                        setActiveModal({ type, attendee });
                      }
                    }} 
                  />
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-slate-900 dark:text-white font-black text-lg mb-1">No attendees found</p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">When users register for your events, they will automatically appear in your CRM directory.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Profile Modal */}
      {activeModal && activeModal.type === 'profile' && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800 text-center">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="w-20 h-20 rounded-3xl bg-brand-blue/10 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 flex items-center justify-center font-black text-2xl mx-auto mb-4 border border-brand-blue/20">
              {activeModal.attendee.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            {activeModal.attendee.vip && <Badge className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-none font-black text-[10px] tracking-widest uppercase rounded-full mb-2">VIP Member</Badge>}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{activeModal.attendee.name}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{activeModal.attendee.email}</p>
            
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 mb-6 text-left space-y-4 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{activeModal.attendee.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Registrations</p>
                <p className="font-bold text-brand-blue text-sm">{activeModal.attendee.events || 1} Event(s) Booked</p>
              </div>
            </div>

            <Button onClick={() => setActiveModal(null)} className="w-full h-12 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">Close Profile</Button>
          </div>
        </div>
      )}

      {/* Direct Message / Broadcast Modal */}
      {activeModal && (activeModal.type === 'message' || activeModal.type === 'broadcast') && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              {activeModal.type === 'message' ? `Message ${activeModal.attendee?.name}` : 'Broadcast Email'}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
              {activeModal.type === 'message' ? `Send an update directly to ${activeModal.attendee?.email}` : `Broadcast to all ${attendeesList.length} members in your directory`}
            </p>
            
            <form onSubmit={handleSendMessage} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Subject *</label>
                <Input 
                  required
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="e.g., Venue Update or Pass Confirmation" 
                  className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Message Body *</label>
                <textarea 
                  required
                  rows="4" 
                  value={messageForm.body}
                  onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })}
                  placeholder="Type your message here..." 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none text-sm" 
                />
              </div>

              {messageFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold ${messageFeedback.success ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200'}`}>
                  {messageFeedback.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setActiveModal(null)} variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800">Cancel</Button>
                <Button type="submit" disabled={sendingMessage} className="flex-1 h-12 rounded-xl font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">
                  {sendingMessage ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function AttendeeCard({ name, email, events, vip = false, phone, onAction }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative group">
      {vip && <Badge className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-none font-black text-[10px] tracking-widest uppercase rounded-full">VIP</Badge>}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 flex items-center justify-center font-black text-lg border border-brand-blue/20 shrink-0">
          {(name || "U").split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="truncate">
          <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight truncate">{name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 truncate"><Mail size={12} className="shrink-0" /> {email}</p>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 flex justify-between items-center mb-6 transition-colors duration-300 relative">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Events Booked</p>
          <p className="font-black text-brand-blue text-lg">{events || 1}</p>
        </div>
        <div className="relative">
          <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)} variant="ghost" size="icon" className="rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500">
            <MoreVertical size={16} />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <button 
                onClick={() => { setIsDropdownOpen(false); onAction('profile'); }} 
                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"
              >
                <Users size={14} /> View Profile
              </button>
              <button 
                onClick={() => { setIsDropdownOpen(false); onAction('message'); }} 
                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"
              >
                <MessageSquare size={14} /> Send Message
              </button>
              <button 
                onClick={() => { setIsDropdownOpen(false); onAction('remove'); }} 
                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Remove Attendee
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside overlay */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
      )}
    </div>
  );
}
