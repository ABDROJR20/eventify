"use client";
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Filter,
  User,
  Compass,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";

const CATEGORIES = ["All Events", "Technology", "Design", "Music", "Business", "Workshops"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesCategory = activeCategory === "All Events" || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-50 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/portal">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tighter italic cursor-pointer">Eventify</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-slate-900 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <User size={14} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">John Doe</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-6 sm:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center relative z-10 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
          <Badge className="bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-400 hover:bg-brand-blue/20 mb-6 px-4 py-1.5 text-xs font-black uppercase tracking-widest border-none">
            Discover Experiences
          </Badge>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1] mb-6">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-emerald-500 italic animate-pulse">Unforgettable Event</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            Explore thousands of professional workshops, tech summits, music festivals, and community gatherings happening near you.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search events, cities, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xl shadow-slate-200/50 dark:shadow-none text-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Filter by Category</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 hover:scale-105 active:scale-95 ${
                    activeCategory === category
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/20"
                      : "bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="px-6 sm:px-8 pb-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeCategory === "All Events" ? "Trending Near You" : `${activeCategory} Events`}
          </h3>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
            {filteredEvents.length} results
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <Link 
                href={`/events/${event.id}`} 
                key={event.id} 
                className="group flex h-full animate-in fade-in slide-in-from-bottom-12 fill-mode-both"
                style={{ animationDuration: '800ms', animationDelay: `${index * 150}ms` }}
              >
                <Card className="relative flex flex-col w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/20 hover:-translate-y-2 hover:border-brand-blue/30 z-10 group-hover:z-20">
                  
                  {/* Glowing backdrop effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/0 via-brand-blue/0 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 z-10">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                      <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white border-none shadow-xl font-black text-[10px] uppercase tracking-widest px-3 py-1.5 transition-transform group-hover:scale-105">
                        {event.category}
                      </Badge>
                      {event.featured && (
                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none shadow-xl shadow-orange-500/30 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 animate-pulse">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1 z-10">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight line-clamp-2 group-hover:text-brand-blue transition-colors duration-300">
                        {event.title}
                      </h4>
                      <div className="bg-slate-100 dark:bg-slate-800 text-brand-blue dark:text-blue-400 px-3 py-1.5 rounded-xl font-black text-lg shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 shadow-sm">
                        {event.price}
                      </div>
                    </div>

                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        <Calendar size={16} className="shrink-0 text-brand-blue opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-bold truncate">{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        <MapPin size={16} className="shrink-0 text-brand-green opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-bold truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        <User size={16} className="shrink-0 text-brand-purple opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-bold">{event.attendees} attending</span>
                      </div>
                    </div>

                    <Button className="w-full bg-slate-50 hover:bg-brand-blue dark:bg-slate-950 dark:hover:bg-brand-blue text-slate-900 dark:text-white hover:text-white border border-slate-200 dark:border-slate-800 transition-all duration-300 h-14 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-brand-blue/20">
                      View Details <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-slate-800">
            <Compass size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-6" />
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No events found</h4>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">We couldn't find any events matching your criteria.</p>
            <Button onClick={() => {setSearchQuery(""); setActiveCategory("All Events");}} className="mt-8 bg-brand-blue text-white rounded-xl px-8 h-12 font-black">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
