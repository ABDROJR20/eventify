"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Ticket, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Share2, 
  BarChart2, 
  X, 
  Menu, 
  Loader2, 
  Trash2, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MyEvents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Events");
  const [editingEvent, setEditingEvent] = useState(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [analyticsEvent, setAnalyticsEvent] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // { type: 'share' | 'tickets', event }

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    category: "Technology",
    date: "",
    time: "10:00 AM",
    location: "Karachi, Pakistan",
    price: "49.00",
    capacity: "200",
    status: "Published",
    description: "",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop"
  });

  // Edit Event Form State
  const [editForm, setEditForm] = useState({
    title: "",
    category: "Technology",
    date: "",
    time: "10:00 AM",
    location: "",
    price: "0",
    capacity: "100",
    status: "Published",
    description: ""
  });

  // Load events from Organizer API
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/organizer/events");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEventsList(data.data);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle Create Event
  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    if (!newEventForm.title) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEventForm,
          price: Number(newEventForm.price) || 0,
          capacity: Number(newEventForm.capacity) || 100,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewEventModalOpen(false);
        setNewEventForm({
          title: "",
          category: "Technology",
          date: "",
          time: "10:00 AM",
          location: "Karachi, Pakistan",
          price: "49.00",
          capacity: "200",
          status: "Published",
          description: "",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop"
        });
        await loadEvents();
      } else {
        alert(data.error || "Failed to create event");
      }
    } catch (err) {
      alert(err.message || "Error creating event");
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title || "",
      category: event.category || "Technology",
      date: event.date || "",
      time: event.time || "10:00 AM",
      location: event.location || "",
      price: String(event.price || "0"),
      capacity: String(event.capacity || "100"),
      status: event.status || "Published",
      description: event.description || "",
    });
  };

  // Handle Update Event
  const handleUpdateEventSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent?.id) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/organizer/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          price: Number(editForm.price) || 0,
          capacity: Number(editForm.capacity) || 100,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingEvent(null);
        await loadEvents();
      } else {
        alert(data.error || "Failed to update event");
      }
    } catch (err) {
      alert(err.message || "Error updating event");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/organizer/events/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEventsList(prev => prev.filter(e => String(e.id) !== String(id)));
      } else {
        alert(data.error || "Failed to delete event");
      }
    } catch (err) {
      alert(err.message || "Error deleting event");
    }
  };

  // Filter & Sort Logic
  const filteredEvents = eventsList.filter(event => {
    // Status tab filter
    if (activeTab === "Published" && event.status !== "Published") return false;
    if (activeTab === "Drafts" && event.status !== "Draft") return false;
    if (activeTab === "Past" && event.status !== "Past") return false;

    // Category filter
    if (selectedCategory !== "All Categories" && (event.category || "").toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = (event.title || "").toLowerCase().includes(q) ||
                    (event.location || "").toLowerCase().includes(q) ||
                    (event.description || "").toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "oldest") return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
    if (sortBy === "tickets") return (Number(b.ticketsSold) || 0) - (Number(a.ticketsSold) || 0);
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  const getCount = (status) => {
    if (status === "All Events") return eventsList.length;
    if (status === "Drafts") return eventsList.filter(e => e.status === "Draft").length;
    return eventsList.filter(e => e.status === status).length;
  };
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Reusable Sidebar Component */}
      <Sidebar activePage="events" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Events</h2>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-medium">Manage your event portfolio and track live registrations.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..." 
                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-blue shadow-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="relative">
              <Button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="outline" 
                className={`h-11 w-11 p-0 rounded-xl shadow-sm text-slate-600 dark:text-slate-355 shrink-0 ${isFilterOpen ? 'bg-slate-100 dark:bg-slate-800 border-brand-blue' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Filter size={18} />
              </Button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                    <h4 className="font-black text-slate-900 dark:text-white mb-4 text-sm">Filter Events</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                        <select 
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none text-sm"
                        >
                          <option>All Categories</option>
                          <option>Technology</option>
                          <option>Design</option>
                          <option>Business</option>
                          <option>Workshops</option>
                          <option>Music</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Sort By</label>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none text-sm"
                        >
                          <option value="newest">Date: Newest First</option>
                          <option value="oldest">Date: Oldest First</option>
                          <option value="tickets">Tickets Sold (High-Low)</option>
                        </select>
                      </div>
                      <Button onClick={() => setIsFilterOpen(false)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg h-10">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <Button 
              onClick={() => setIsNewEventModalOpen(true)}
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 shadow-xl shadow-blue-500/20 px-4 shrink-0"
            >
              <Plus className="mr-1.5 h-5 w-5" /> New Event
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 sm:gap-8 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
          <Tab label="All Events" count={getCount("All Events")} active={activeTab === "All Events"} onClick={() => setActiveTab("All Events")} />
          <Tab label="Published" count={getCount("Published")} active={activeTab === "Published"} onClick={() => setActiveTab("Published")} />
          <Tab label="Drafts" count={getCount("Drafts")} active={activeTab === "Drafts"} onClick={() => setActiveTab("Drafts")} />
          <Tab label="Past" count={getCount("Past")} active={activeTab === "Past"} onClick={() => setActiveTab("Past")} />
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-blue h-10 w-10 mb-4" />
            <p className="text-slate-500 font-bold text-sm">Loading your events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  status={event.status}
                  image={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop"}
                  ticketsSold={event.ticketsSold || 0}
                  revenue={event.revenue ? `PKR ${Number(event.revenue).toLocaleString()}` : (event.price ? `PKR ${(Number(event.price) * (event.ticketsSold || 0)).toLocaleString()}` : "PKR 0")}
                  trend="+12%"
                  onEdit={() => handleOpenEdit(event)}
                  onAnalytics={() => setAnalyticsEvent(event)}
                  onAction={(action) => {
                    if (action === 'delete') handleDeleteEvent(event.id);
                    else setActiveModal({ type: action, event });
                  }}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-900 dark:text-white font-black text-xl mb-1">No events found</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6">Create an event to start selling tickets and tracking registrations.</p>
                <Button onClick={() => setIsNewEventModalOpen(true)} className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-11 px-6 shadow-md shadow-blue-500/20">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Event
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create New Event Modal */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative border border-slate-200 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            <button 
              onClick={() => setIsNewEventModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Create New Event
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6">Enter event information. It will instantly be published for attendees to book.</p>
            
            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Event Title *</label>
                <Input 
                  required
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder="e.g., Pakistan AI & Tech Summit 2026"
                  className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Category</label>
                  <select 
                    value={newEventForm.category}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white text-sm outline-none"
                  >
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Workshops</option>
                    <option>Music</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ticket Price (PKR)</label>
                  <Input 
                    type="number"
                    value={newEventForm.price}
                    onChange={(e) => setNewEventForm({ ...newEventForm, price: e.target.value })}
                    placeholder="0 for Free"
                    className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Date</label>
                  <Input 
                    type="date"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Time</label>
                  <Input 
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    placeholder="10:00 AM"
                    className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Location / Venue</label>
                <Input 
                  value={newEventForm.location}
                  onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                  placeholder="e.g. Expo Center, Karachi"
                  className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Description</label>
                <textarea 
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  placeholder="Describe your event agenda, key speakers, and benefits..."
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-slate-100 text-sm outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" onClick={() => setIsNewEventModalOpen(false)} variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="flex-1 h-12 rounded-xl font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">
                  {actionLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto">
            <button 
              onClick={() => setEditingEvent(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Edit Event
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6">Update your event details and publishing status.</p>
            
            <form onSubmit={handleUpdateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Event Title</label>
                <Input 
                  required
                  value={editForm.title} 
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Category</label>
                  <select 
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white text-sm outline-none"
                  >
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Workshops</option>
                    <option>Music</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Price (PKR)</label>
                  <Input 
                    type="number"
                    value={editForm.price} 
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Location</label>
                <Input 
                  value={editForm.location} 
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="h-11 rounded-xl font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100" 
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Status</label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none text-sm"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Past">Past</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Description</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-slate-100 text-sm outline-none resize-none"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <Button type="button" onClick={() => setEditingEvent(null)} variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="flex-1 h-12 rounded-xl font-bold bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20">
                  {actionLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsEvent && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setAnalyticsEvent(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-8">
              <Badge className="bg-brand-blue/10 text-brand-blue border-none mb-3">Analytics Report</Badge>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                {analyticsEvent.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Quick performance overview of this event.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{analyticsEvent.capacity || 200}</p>
                <p className="text-xs font-bold text-emerald-500 mt-1">Available</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tickets Sold</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{analyticsEvent.ticketsSold || 0}</p>
                <p className="text-xs font-bold text-emerald-500 mt-1">+12%</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{analyticsEvent.status || "Live"}</p>
                <p className="text-xs font-bold text-blue-500 mt-1">Status</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">Revenue</p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                  {analyticsEvent.revenue ? `PKR ${Number(analyticsEvent.revenue).toLocaleString()}` : (analyticsEvent.price ? `PKR ${(Number(analyticsEvent.price) * (analyticsEvent.ticketsSold || 0)).toLocaleString()}` : "PKR 0")}
                </p>
                <p className="text-xs font-bold text-emerald-600 mt-1">Total</p>
              </div>
            </div>

            <Button onClick={() => setAnalyticsEvent(null)} className="w-full h-14 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">
              Close Analytics
            </Button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {activeModal && activeModal.type === 'share' && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800 text-center">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6 text-brand-blue">
              <Share2 size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Share Event</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">Share <span className="font-bold text-slate-900 dark:text-white">{activeModal.event.title}</span> with attendees.</p>
            
            <div className="flex bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/events/${activeModal.event.id}`} className="flex-1 bg-transparent px-4 text-xs font-medium text-slate-600 dark:text-slate-300 outline-none" />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/events/${activeModal.event.id}`);
                  alert("Event link copied to clipboard!");
                }}
                className="bg-slate-200 dark:bg-slate-800 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Copy
              </button>
            </div>

            <Button onClick={() => setActiveModal(null)} className="w-full h-12 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">Done</Button>
          </div>
        </div>
      )}
    </main>
  );
}

function Tab({ label, count, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`pb-4 border-b-2 font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${active ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}>
        {count}
      </span>
    </div>
  );
}

function EventCard({ id, title, date, time, location, status, image, ticketsSold, revenue, trend, onEdit, onAnalytics, onAction }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isPublished = status === "Published";
  
  return (
    <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 group">
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <Badge className={`border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
            status === 'Published' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 
            status === 'Draft' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' :
            'bg-slate-900/80 backdrop-blur hover:bg-slate-900 text-white'
          }`}>
            {status}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)} variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-none shadow-sm hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
            <MoreHorizontal size={16} />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <button onClick={() => { setIsDropdownOpen(false); onAction('share'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Share2 size={14} /> Share Event Link
              </button>
              <Link href={`/events/${id}`} target="_blank" className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <ExternalLink size={14} /> Public View
              </Link>
              <button onClick={() => { setIsDropdownOpen(false); onAction('delete'); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2">
                <Trash2 size={14} /> Delete Event
              </button>
            </div>
          )}
        </div>
        
        {isDropdownOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-1">{date || "Upcoming"} {time ? `• ${time}` : ""}</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight line-clamp-1">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-1">{location || "Online"}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-850 mb-6">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Tickets Sold</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{ticketsSold}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Revenue</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-black text-slate-900 dark:text-white">{revenue}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline" className="flex-1 rounded-xl font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800">
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button onClick={onAnalytics} variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
            <BarChart2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
