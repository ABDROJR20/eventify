"use client";

import { useState } from "react";
import { LayoutDashboard, Home, Calendar, Ticket, Users, TrendingUp, Settings, Search, Mail, Phone, MoreVertical, MessageSquare, X, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Attendees() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [attendeesList, setAttendeesList] = useState([
    { id: 1, name: "Ali Khan", email: "ali.khan@example.com", events: 3, vip: true, phone: "+92 300 1234567" },
    { id: 2, name: "Sarah Ahmed", email: "sarah.ahmed@example.com", events: 1, vip: false, phone: "+92 321 7654321" },
    { id: 3, name: "John Doe", email: "john.doe@example.com", events: 5, vip: true, phone: "+1 555 0192" },
    { id: 4, name: "Emily Chen", email: "emily.chen@example.com", events: 2, vip: false, phone: "+1 555 0184" },
    { id: 5, name: "Michael Ross", email: "mike.ross@example.com", events: 1, vip: false, phone: "+1 555 0177" },
    { id: 6, name: "Fatima Noor", email: "fatima.noor@example.com", events: 4, vip: true, phone: "+92 333 9988776" },
  ]);

  const [activeModal, setActiveModal] = useState(null); // null | { type: 'profile' | 'message', attendee }

  const removeAttendee = (id) => {
    setAttendeesList(attendeesList.filter(a => a.id !== id));
  };
  
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
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto">
            <Button 
              onClick={() => setActiveModal({ type: 'broadcast' })}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 shadow-xl shadow-blue-500/20 px-6 shrink-0"
            >
              <MessageSquare size={18} className="mr-2" /> Broadcast Message
            </Button>
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
              <Input placeholder="Search attendees..." className="pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-12 focus:border-brand-blue text-slate-900 dark:text-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendeesList.length > 0 ? (
              attendeesList.map(attendee => (
                <AttendeeCard 
                  key={attendee.id} 
                  {...attendee} 
                  onAction={(type) => {
                    if (type === 'remove') removeAttendee(attendee.id);
                    else setActiveModal({ type, attendee });
                  }} 
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No attendees found.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      {activeModal && activeModal.type === 'profile' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800 text-center">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeModal.attendee.name)}&background=random`} alt="Avatar" className="w-24 h-24 rounded-3xl mx-auto mb-4 shadow-lg" />
            {activeModal.attendee.vip && <Badge className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-none font-black text-[10px] tracking-widest uppercase rounded-full mb-2">VIP Member</Badge>}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{activeModal.attendee.name}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{activeModal.attendee.email}</p>
            
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 mb-6 text-left space-y-4 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{activeModal.attendee.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Events</p>
                <p className="font-bold text-brand-blue text-sm">{activeModal.attendee.events} Events Attended</p>
              </div>
            </div>

            <Button onClick={() => setActiveModal(null)} className="w-full h-12 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">Close Profile</Button>
          </div>
        </div>
      )}

      {activeModal && activeModal.type === 'message' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Send Message</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">Sending to <span className="font-bold text-slate-900 dark:text-white">{activeModal.attendee.name}</span></p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                <Input placeholder="Message Subject" className="h-12 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message</label>
                <textarea rows="4" placeholder="Type your message here..." className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setActiveModal(null)} variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800">Cancel</Button>
              <Button onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">Send Now</Button>
            </div>
          </div>
        </div>
      )}

      {activeModal && activeModal.type === 'broadcast' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Broadcast Message</h3>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">Send an email broadcast to all <span className="font-bold text-slate-900 dark:text-white">{attendeesList.length} attendees</span> in your directory.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                <Input placeholder="E.g., Important update about tomorrow's event" className="h-12 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message Body</label>
                <textarea rows="5" placeholder="Type your broadcast message here..." className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button onClick={() => setActiveModal(null)} variant="outline" className="flex-1 h-14 rounded-xl font-bold border-slate-200 dark:border-slate-800">Cancel</Button>
              <Button onClick={() => setActiveModal(null)} className="flex-1 h-14 rounded-xl font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">Send Broadcast to {attendeesList.length} People</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function AttendeeCard({ name, email, events, vip = false, onAction }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative group">
      {vip && <Badge className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-none font-black text-[10px] tracking-widest uppercase rounded-full">VIP</Badge>}
      <div className="flex items-center gap-4 mb-6">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} alt={name} className="w-14 h-14 rounded-2xl" />
        <div>
          <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><Mail size={12} /> {email}</p>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 flex justify-between items-center mb-6 transition-colors duration-300 relative">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Events Attended</p>
          <p className="font-black text-brand-blue text-lg">{events}</p>
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
                <X size={14} /> Remove Attendee
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
