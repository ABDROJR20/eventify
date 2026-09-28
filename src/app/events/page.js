"use client";
import { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Filter,
  User,
  Compass,
  ArrowLeft,
  LogOut,
  ChevronDown,
  Coins,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";
import { CURRENCY_RATES, formatCurrencyPrice } from "@/lib/currencies";

const CATEGORIES = ["All Events", "Technology", "Design", "Music", "Business", "Workshops"];

export default function EventsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("PKR");

  const [eventsList, setEventsList] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem("eventify_attendee_currency");
    if (savedCurrency && CURRENCY_RATES[savedCurrency]) {
      setSelectedCurrency(savedCurrency);
    }

    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const res = await fetch("/api/events?all=true");
        const data = await res.json();
        if (data.success && Array.isArray(data.events) && data.events.length > 0) {
          setEventsList(data.events);
        } else {
          setEventsList(MOCK_EVENTS);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic events, using fallback:", err);
        setEventsList(MOCK_EVENTS);
      } finally {
        setLoadingEvents(false);
      }
    }

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.warn("Session fetch failed:", err);
      }
    }

    loadEvents();
    loadUser();
  }, []);

  const handleCurrencyChange = (curr) => {
    setSelectedCurrency(curr);
    localStorage.setItem("eventify_attendee_currency", curr);
    setCurrencyMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/auth");
    } catch (err) {
      router.push("/auth");
    }
  };

  const filteredEvents = eventsList.filter(event => {
    const matchesCategory = activeCategory === "All Events" || (event.category || "").toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = (event.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (event.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const currConfig = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-50 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/portal">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 h-9 w-9">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tighter italic cursor-pointer">Eventify</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-all cursor-pointer font-black text-xs text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <span className="text-sm">{currConfig.flag}</span>
                <span>{selectedCurrency}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {currencyMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCurrencyMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5 mb-1">
                      Display Currency
                    </p>
                    {Object.entries(CURRENCY_RATES).map(([code, config]) => (
                      <button
                        key={code}
                        onClick={() => handleCurrencyChange(code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                          selectedCurrency === code
                            ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{config.flag}</span>
                          <span>{code}</span>
                        </span>
                        <span className={selectedCurrency === code ? "text-white/80" : "text-slate-400"}>
                          {config.symbol.trim()}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 pl-1 pr-2.5 sm:pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:border-brand-blue transition-colors cursor-pointer"
                >
                  {user.image ? (
                    <img src={user.image} className="w-7 h-7 rounded-full object-cover" alt={user.name} />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                      {initials}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-22.5 sm:max-w-30 truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                        <Badge variant="secondary" className="mt-1.5 text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-none font-bold uppercase">
                          {user.role || "Attendee"}
                        </Badge>
                      </div>
                      
                      {user.role === "organizer" || user.role === "admin" ? (
                        <Link href="/dashboard" className="block px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl mb-1">
                          Organizer Dashboard
                        </Link>
                      ) : null}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-9 px-4 text-xs">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <div className="pt-28 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <Badge className="bg-brand-blue/10 dark:bg-blue-950/40 text-brand-blue dark:text-blue-400 border-none px-4 py-1.5 text-xs uppercase tracking-widest font-black rounded-full">
              Discover Experiences
            </Badge>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Explore Top Events Across Pakistan & Beyond
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg">
              Find workshops, summits, and conferences. Book your passes securely.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-blue transition-colors duration-300" size={22} />
            <input 
              type="text"
              placeholder="Search by event title, speaker, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Categories Strip */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar w-full justify-start sm:justify-center">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 ${
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
      <div className="px-4 sm:px-8 py-10 pb-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeCategory === "All Events" ? "Trending Near You" : `${activeCategory} Events`}
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Prices displayed in <span className="text-brand-blue dark:text-blue-400 font-black">{selectedCurrency}</span>
            </p>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
            {filteredEvents.length} results
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event, index) => {
              const displayPrice = formatCurrencyPrice(event.price, selectedCurrency);
              return (
                <Link 
                  href={`/events/${event.id}?currency=${selectedCurrency}`} 
                  key={event.id} 
                  className="group flex h-full animate-in fade-in slide-in-from-bottom-12 fill-mode-both"
                  style={{ animationDuration: '800ms', animationDelay: `${index * 150}ms` }}
                >
                  <Card className="relative flex flex-col w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/20 hover:-translate-y-2 hover:border-brand-blue/30 z-10 group-hover:z-20">
                    
                    {/* Glowing backdrop effect on hover */}
                    <div className="absolute inset-0 bg-linear-to-b from-brand-blue/0 via-brand-blue/0 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                    {/* Image Container */}
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800 z-10">
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
                          <Badge className="bg-linear-to-r from-amber-400 to-orange-500 text-white border-none shadow-xl shadow-orange-500/30 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 animate-pulse">
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
                        <div className="bg-slate-100 dark:bg-slate-800 text-brand-blue dark:text-blue-400 px-3 py-1.5 rounded-xl font-black text-base sm:text-lg shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 shadow-sm whitespace-nowrap">
                          {displayPrice}
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
              );
            })}
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
