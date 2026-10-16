"use client";
import { useState, useEffect, use } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  ArrowLeft, 
  ArrowRight,
  Share2, 
  Heart, 
  CheckCircle2, 
  Star,
  Clock,
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  Loader2,
  Copy,
  Check,
  Compass
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');

  const unwrappedParams = use(params);
  const eventId = unwrappedParams?.id || '1';
  
  const [event, setEvent] = useState(
    MOCK_EVENTS.find(e => String(e.id) === String(eventId) || e.id === parseInt(eventId)) || MOCK_EVENTS[0]
  );

  // Load Google Identity Services Script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

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

    // Auto-refresh event data silently every 10 seconds (seats, schedule, prices)
    const interval = setInterval(() => {
      loadEventData();
    }, 10000);

    const handleFocus = () => {
      loadEventData();
      loadUser();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [eventId]);

  // Google 1-Click Login for Attendees
  const handleGoogleSignIn = () => {
    setErrorMessage('');
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setErrorMessage("Google Sign-In is not configured (missing Client ID).");
      return;
    }

    if (typeof window === "undefined" || !window.google?.accounts?.oauth2) {
      setErrorMessage("Google authentication service is initializing. Please try again in a few seconds.");
      return;
    }

    setGoogleLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setErrorMessage(tokenResponse.error_description || "Google sign-in was cancelled.");
            setGoogleLoading(false);
            return;
          }

          try {
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });

            if (!userInfoRes.ok) {
              throw new Error("Unable to fetch user details from Google.");
            }

            const profile = await userInfoRes.json();

            // Establish session with Eventify backend as attendee
            const authRes = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                role: "attendee",
                allowAnyRole: true,
              }),
            });

            const data = await authRes.json();
            if (!authRes.ok || !data.success) {
              throw new Error(data.message || "Google authentication failed on server.");
            }

            const authenticatedUser = data.user || {
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              role: "attendee"
            };

            setUser(authenticatedUser);
            setFormData(prev => ({
              ...prev,
              name: profile.name || prev.name,
              email: profile.email || prev.email,
            }));
          } catch (err) {
            setErrorMessage(err.message || "Google authentication failed.");
          } finally {
            setGoogleLoading(false);
          }
        },
        error_callback: () => {
          setGoogleLoading(false);
          setErrorMessage("Failed to open Google sign-in popup. Please check your popup blocker.");
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      setGoogleLoading(false);
      setErrorMessage(err.message || "Failed to launch Google authentication popup.");
    }
  };

  // Share Event Link Generator
  const handleShareLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${eventId}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareSuccess("Event link copied to clipboard! Share it with attendees.");
      setTimeout(() => setShareSuccess(''), 3500);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict validation for required fields & valid email
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid Gmail / Email address (e.g. name@gmail.com).");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your contact phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const amountVal = selectedTicket === 'vip' ? 199 : (typeof event.price === 'number' ? event.price : parseFloat(String(event.price).replace(/[^0-9.]/g, '')) || 49);
      
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          ticketTier: selectedTicket,
          amount: data.amount,
          amountDisplay: data.amountDisplay,
          event: data.event || event
        }));
      }

      const params = new URLSearchParams({
        regId: data.registrationId || '',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '',
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
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link href="/events" className="flex items-center gap-2 group bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 px-3 sm:px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
              <Compass size={16} className="text-brand-blue group-hover:rotate-45 transition-transform" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-blue transition-colors">Explore All Events</span>
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
              <Button 
                onClick={handleShareLink} 
                variant="outline" 
                size="icon" 
                title="Share Event Link (Copies direct link for attendees)" 
                className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-blue transition-colors cursor-pointer"
              >
                <Share2 size={16} />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Heart size={16} className="text-slate-600 dark:text-slate-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Share Toast Notification */}
      {shareSuccess && (
        <div className="fixed top-20 right-6 z-100 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} />
          <span>{shareSuccess}</span>
        </div>
      )}

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

      {/* Explore All Events Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-500/20">
          <div>
            <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-3">
              Explore Experiences
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Looking for more events?</h3>
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-xl mt-1 leading-relaxed">
              Attendees can directly browse dozens of conferences, workshops, design meetups, and concerts without needing a separate portal.
            </p>
          </div>
          <Link href="/events" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl h-14 px-8 text-sm sm:text-base shadow-lg transition-transform hover:-translate-y-0.5">
              Explore All Events <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
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
              
              {/* Google 1-Click Login Option vs Verified Status */}
              {user ? (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-emerald-300 dark:border-emerald-700" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                        {(user.name || "U").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" /> Verified via Google
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-xs">{user.name} ({user.email})</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setUser(null);
                      setFormData(prev => ({ ...prev, name: '', email: '' }));
                    }} 
                    className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-rose-500 underline ml-2 shrink-0 cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm shadow-sm hover:shadow transition-all hover:border-slate-300 cursor-pointer disabled:opacity-60"
                  >
                    {googleLoading ? (
                      <Loader2 size={18} className="animate-spin text-brand-blue" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    )}
                    <span>{googleLoading ? "Connecting to Google..." : "Continue with Google (1-Click)"}</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                    <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                      Or Enter Details Manually
                    </span>
                  </div>
                </div>
              )}

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
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Valid Gmail / Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    required 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. yourname@gmail.com" 
                    className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:border-brand-blue"
                  />
                  <p className="text-[10px] font-medium text-slate-400 mt-1">
                    Your QR ticket pass will be automatically delivered to this inbox.
                  </p>
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
                    className="flex-2 bg-brand-blue hover:bg-blue-600 text-white h-12 rounded-xl font-black text-sm sm:text-base shadow-lg shadow-brand-blue/20 transition-all disabled:opacity-60 cursor-pointer"
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
