"use client";
import { useState, useEffect, use } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  ArrowLeft, 
  Share2, 
  Heart, 
  CheckCircle2, 
  Star,
  Clock,
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";
import { CURRENCY_RATES, formatCurrencyPrice } from "@/lib/currencies";

const REVIEWS = [
  { user: "Sarah Khan", rating: 5, text: "Incredible event! Completely mind-blowing experience. The sessions were fantastic." },
  { user: "Ali Ahmed", rating: 4, text: "Well organized. Looking forward to the next one. Great networking opportunities." },
  { user: "Fatima Noor", rating: 5, text: "Best conference I've attended in years. Highly recommend to everyone in the industry." },
  { user: "Usman Tariq", rating: 5, text: "The hands-on workshops were incredibly valuable. Learned so much in just one day." },
  { user: "Zainab Ali", rating: 4, text: "Amazing atmosphere and crowd. Great venue and the speakers were very approachable." },
  { user: "Bilal Qureshi", rating: 5, text: "Game-changing insights from the industry leaders. I took so many notes!" }
];

export default function EventDetails({ params }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState('standard');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState("PKR");
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const unwrappedParams = use(params);
  const eventId = unwrappedParams?.id || '1';
  
  const [event, setEvent] = useState(
    MOCK_EVENTS.find(e => String(e.id) === String(eventId) || e.id === parseInt(eventId)) || MOCK_EVENTS[0]
  );

  useEffect(() => {
    // Check saved or url currency
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCurr = urlParams.get('currency');
      const savedCurr = localStorage.getItem("eventify_attendee_currency");
      if (urlCurr && CURRENCY_RATES[urlCurr]) {
        setSelectedCurrency(urlCurr);
        localStorage.setItem("eventify_attendee_currency", urlCurr);
      } else if (savedCurr && CURRENCY_RATES[savedCurr]) {
        setSelectedCurrency(savedCurr);
      }
    }

    async function loadEventData() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        if (data.success && data.event) {
          setEvent(data.event);
        }
      } catch (err) {
        console.warn("Failed to load event details dynamically:", err);
      }
    }

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setFormData(prev => ({
            ...prev,
            name: prev.name || data.user.name || '',
            email: prev.email || data.user.email || ''
          }));
        }
      } catch (err) {
        // Not logged in
      }
    }

    loadEventData();
    loadUser();
  }, [eventId]);

  const handleContinue = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const amountVal = selectedTicket === 'vip' ? 199 : (typeof event.price === 'number' ? event.price : parseFloat(String(event.price).replace(/[^0-9.]/g, '')) || 49);
      
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          ticketTier: selectedTicket,
          amount: amountVal
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to initiate registration");
      }

      // Save flow state in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("eventify_checkout_data", JSON.stringify({
          registrationId: data.registrationId,
          ticketCode: data.ticketCode,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          ticketTier: selectedTicket,
          amount: data.amount,
          amountDisplay: data.amountDisplay,
          event: data.event || event
        }));
      }

      const params = new URLSearchParams({
        regId: data.registrationId || '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        tier: selectedTicket,
        amount: String(data.amount || amountVal)
      });

      router.push(`/events/${eventId}/checkout?${params.toString()}`);
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50 transition-colors duration-300 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-50 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/events" className="flex items-center gap-2 group">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 h-9 w-9">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </Button>
              <span className="hidden sm:block text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand-blue transition-colors">Back to Events</span>
            </Link>
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tighter italic cursor-pointer">Eventify</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Currency Switcher */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-all cursor-pointer font-black text-xs text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <span className="text-sm">{(CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR).flag}</span>
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
                        onClick={() => {
                          setSelectedCurrency(code);
                          localStorage.setItem("eventify_attendee_currency", code);
                          setCurrencyMenuOpen(false);
                        }}
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
            <div className="flex gap-1.5 sm:gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Share2 size={16} className="text-slate-600 dark:text-slate-300" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Heart size={16} className="text-slate-600 dark:text-slate-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="aspect-video sm:aspect-21/9 bg-slate-200 dark:bg-slate-800 rounded-2xl sm:rounded-[3rem] mb-8 sm:mb-10 overflow-hidden relative group shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all animate-in fade-in zoom-in-95 duration-1000 fill-mode-both">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex gap-2">
              <Badge className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md font-black uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-lg">
                {event.category}
              </Badge>
              {event.featured && (
                <Badge className="bg-amber-500 text-white font-black uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full border-none shadow-lg">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 fill-mode-both">
            <div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-4 sm:mb-6">
                {event.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-xl font-medium leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-6 border-y border-slate-200 dark:border-slate-800">
              <InfoItem icon={<Calendar className="text-brand-blue" />} label="Date & Time" value={`${event.date} • ${event.time}`} />
              <InfoItem icon={<MapPin className="text-emerald-500" />} label="Location" value={event.location} />
              <InfoItem icon={<Users className="text-purple-500" />} label="Capacity / Attendees" value={`${event.attendees} Registered`} />
              <InfoItem icon={<Ticket className="text-amber-500" />} label="Starting Price" value={formatCurrencyPrice(event.price, selectedCurrency)} />
            </div>

            {/* Agenda / Highlights */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">What You Will Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FeatureItem text="Interactive keynote sessions with experts" />
                <FeatureItem text="Hands-on breakout problem solving" />
                <FeatureItem text="1-on-1 networking & mentorship slots" />
                <FeatureItem text="Access to recorded sessions & slides" />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6 pt-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Event Schedule</h3>
              <div className="space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3 sm:ml-4">
                <AgendaItem time="10:00 AM - 11:30 AM" title="Opening Keynote & Welcome Address" speaker="Muhammad Umer" />
                <AgendaItem time="11:45 AM - 01:15 PM" title="Design Systems for Enterprise Scale" speaker="Aadrish Pirzado" />
                <AgendaItem time="02:00 PM - 04:00 PM" title="Interactive Coding Workshop" speaker="Technical Panel" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Ticket Price</p>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {formatCurrencyPrice(event.price, selectedCurrency)}
                </h3>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full border-none">
                Available Now
              </Badge>
            </div>

            {/* Ticket Tier Selector */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Select Access Tier</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedTicket('standard')}
                  className={`p-3 sm:p-4 rounded-2xl border text-left transition-all ${selectedTicket === 'standard' ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-950/30 text-brand-blue' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}
                >
                  <p className="font-bold text-xs sm:text-sm">Standard</p>
                  <p className="font-black text-base sm:text-lg text-slate-900 dark:text-white mt-1">
                    {formatCurrencyPrice(event.price, selectedCurrency)}
                  </p>
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedTicket('vip')}
                  className={`p-3 sm:p-4 rounded-2xl border text-left transition-all ${selectedTicket === 'vip' ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 text-purple-600' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}
                >
                  <p className="font-bold text-xs sm:text-sm">VIP Pass</p>
                  <p className="font-black text-base sm:text-lg text-slate-900 dark:text-white mt-1">
                    {formatCurrencyPrice(199, selectedCurrency)}
                  </p>
                </button>
              </div>
            </div>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white font-black text-base sm:text-lg h-14 sm:h-16 rounded-2xl shadow-xl shadow-brand-blue/30 transition-all hover:shadow-brand-blue/40 hover:-translate-y-0.5"
            >
              Register Now <ArrowLeft className="rotate-180 ml-2" size={18} />
            </Button>

            <div className="space-y-3 pt-2 text-xs text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> Instant QR Pass Delivered to Email
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-blue" /> 100% Refundable up to 24h before event
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pb-28 sm:pb-32 pt-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12 text-center">
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">What Attendees Say</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">Real experiences from past attendees</p>
        </div>
        
        <div className="relative w-full overflow-hidden pb-4">
          <div className="flex w-[200%] animate-marquee gap-4 sm:gap-6 items-stretch px-4">
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <div key={i} className="w-70 sm:w-90 shrink-0 h-full">
                <ReviewCard user={review.user} rating={review.rating} text={review.text} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fully Responsive Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 dark:bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[1.75rem] sm:rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/70 dark:bg-slate-950/70 shrink-0">
              <div className="pr-4">
                <Badge className="bg-brand-blue/10 text-brand-blue dark:bg-blue-950/40 dark:text-blue-400 border-none font-black text-[10px] uppercase tracking-wider mb-1.5 px-2.5 py-0.5">
                  Event Registration
                </Badge>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-1">{event.title}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Tier: <span className="text-brand-blue font-black">{selectedTicket === 'vip' ? `VIP Pass (${formatCurrencyPrice(199, selectedCurrency)})` : `Standard (${formatCurrencyPrice(event.price, selectedCurrency)})`}</span>
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)} 
                className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 h-9 w-9 shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Event Time Strip */}
            <div className="px-5 sm:px-6 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
              <Calendar size={14} className="text-brand-blue shrink-0" />
              <span className="truncate">{event.date} • {event.time} • {event.location}</span>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleContinue} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Ali Khan" 
                    className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. ali@example.com" 
                    className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required 
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+92 300 1234567" 
                    className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              {/* Price & Checkout Footer */}
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider block">Payable Total</span>
                    <span className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                      {selectedTicket === 'vip' ? formatCurrencyPrice(199, selectedCurrency) : formatCurrencyPrice(event.price, selectedCurrency)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
                    <ShieldCheck size={12} className="mr-1" /> Secure
                  </Badge>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-2 bg-brand-blue hover:bg-blue-600 text-white h-12 rounded-xl font-black text-sm sm:text-base shadow-lg shadow-brand-blue/20 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? 'Saving Details...' : 'Proceed to Payment'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 shrink-0">
        {icon}
      </div>
      <div className="truncate">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">{label}</p>
        <p className="text-slate-900 dark:text-white font-black text-sm sm:text-base tracking-tight leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 py-1">
      <div className="bg-emerald-50 dark:bg-emerald-500/10 p-1.5 sm:p-2 rounded-lg border border-emerald-100 dark:border-emerald-500/20 shrink-0">
        <CheckCircle2 size={16} className="text-brand-green dark:text-emerald-400" />
      </div>
      <span className="text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm uppercase tracking-wider leading-snug">{text}</span>
    </div>
  );
}

function AgendaItem({ time, title, speaker }) {
  return (
    <div className="relative pl-10 sm:pl-16 pb-8 sm:pb-12 last:pb-0">
      <div className="absolute left-0 top-1.5 w-6 h-6 sm:w-10 sm:h-10 bg-white dark:bg-slate-900 border-[3px] sm:border-4 border-brand-blue rounded-full z-10 shadow-md sm:shadow-lg shadow-brand-blue/20"></div>
      <p className="text-[10px] sm:text-xs font-black text-brand-blue dark:text-blue-400 mb-1 uppercase tracking-[0.2em] flex items-center gap-1.5">
        <Clock size={12} /> {time}
      </p>
      <h4 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5">
        <Users size={12} /> with {speaker}
      </p>
    </div>
  );
}

function ReviewCard({ user, rating, text }) {
  return (
    <Card className="p-5 sm:p-8 h-full bg-white dark:bg-slate-900 rounded-[1.75rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center font-black text-brand-blue dark:text-blue-400 text-xs sm:text-sm border border-brand-blue/20">
            {user.split(' ').map(w => w[0]).join('')}
          </div>
          <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-wider">{user}</span>
        </div>
        <div className="flex gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5" fill={i < rating ? "currentColor" : "none"} />
          ))}
        </div>
      </div>
      <p className="text-xs sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic flex-1">"{text}"</p>
    </Card>
  );
}
