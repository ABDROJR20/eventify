"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Compass, QrCode, BarChart3, Mail, Calendar, Bell, CreditCard, ChevronDown, Users, Menu, X, Star, CheckCircle2, Zap, Phone, MapPin, Ticket, ShieldCheck, Box, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Eventify3DScene from "@/components/Eventify3DScene";
import GsapBackground from "@/components/GsapBackground";
import ThreeDCard from "@/components/ThreeDCard";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

const FEATURES = [
  { 
    icon: <QrCode size={24}/>, 
    title: "QR-Based Check-In", 
    desc: "Paperless entry, track check-ins, workshops, and meals with one digital pass.", 
    badgeStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 shadow-blue-500/20 shadow-md",
  },
  { 
    icon: <Users size={24}/>, 
    title: "Attendee Management", 
    desc: "Monitor attendees, volunteers, and staff timings in real-time.", 
    badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-emerald-500/20 shadow-md",
  },
  { 
    icon: <Bell size={24}/>, 
    title: "Automated Emails", 
    desc: "Automated passes, reminders, certificates, and follow-ups throughout the lifecycle.", 
    badgeStyle: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shadow-indigo-500/20 shadow-md",
  },
  { 
    icon: <CreditCard size={24}/>, 
    title: "Secure Payments", 
    desc: "Multiple payment gateways integrated directly in registration forms.", 
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-amber-500/20 shadow-md",
  },
  { 
    icon: <Calendar size={24}/>, 
    title: "Schedule Management", 
    desc: "Plan schedules, workshops, and speaker line-ups in one place.", 
    badgeStyle: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 shadow-purple-500/20 shadow-md",
  },
  { 
    icon: <BarChart3 size={24}/>, 
    title: "Advanced Analytics", 
    desc: "Detailed insights into performance, engagement, and registration data.", 
    badgeStyle: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-cyan-500/20 shadow-md",
  },
];

const TESTIMONIALS = [
  { name: "Sarah M.", role: "Lead Event Organizer", initials: "SM", color: "bg-blue-600", text: "Eventify completely transformed how we run campus symposiums. Registration queues dropped to zero!" },
  { name: "James K.", role: "Society President", initials: "JK", color: "bg-emerald-600", text: "The instant QR check-in feature cut our entry desk wait times down to seconds. Highly recommended." },
  { name: "Priya S.", role: "Workshop Coordinator", initials: "PS", color: "bg-purple-600", text: "Managing multi-track attendee lists and sending event reminders was effortless and smooth." },
  { name: "Ali R.", role: "Hackathon Organizer", initials: "AR", color: "bg-indigo-600", text: "Real-time registration metrics gave our team exact counts as students checked in." },
  { name: "Emily T.", role: "Conference Host", initials: "ET", color: "bg-rose-600", text: "A clean, ultra-responsive dashboard that handled our multi-track schedule seamlessly." },
  { name: "Noah P.", role: "Arts & Culture Director", initials: "NP", color: "bg-amber-600", text: "Delivered a stellar experience for both organizers and attendees alike." },
];

const FAQS = [
  { q: "How do I get started?", a: "Sign up for free, choose Organizer or Attendee, and create your first event in minutes." },
  { q: "Does Eventify support multiple payment gateways?", a: "Yes — Stripe, PayPal, and local options are all supported with secure checkout." },
  { q: "Can I manage multiple events at once?", a: "Absolutely. Your dashboard lets you manage unlimited events with separate analytics." },
  { q: "Is there a mobile app for check-in?", a: "Our QR check-in works on any browser — no app download needed for event staff." },
  { q: "What analytics does Eventify provide?", a: "Real-time registrations, revenue, check-in rates, session popularity, and more." },
];

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "3D Pass Engine", href: "#pass3d" },
  { label: "How It Works", href: "#how" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" }
];

const ROTATING_WORDS = [
  { text: "Communities", color: "from-brand-blue to-violet-500" },
  { text: "Events", color: "from-brand-green to-cyan-500" },
  { text: "Experiences", color: "from-orange-500 to-pink-500" },
  { text: "Moments", color: "from-brand-blue to-brand-green" },
  { text: "Connections", color: "from-violet-500 to-pink-500" },
];

function TextRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2500);
    return () => clearInterval(t);
  }, []);
  const word = ROTATING_WORDS[index];
  return (
    <span className="relative inline-block overflow-hidden h-[1.25em] w-full align-bottom leading-[1.25em]">
      <AnimatePresence>
        <motion.span
          key={index}
          initial={{ y: "80%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-80%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute left-0 right-0 bg-gradient-to-r ${word.color} bg-clip-text text-transparent italic`}
        >
          {word.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [confetti, setConfetti] = useState([]);

  // Hero Mouse Tilt State
  const heroRef = useRef(null);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  // How It Works Workspace Mouse Tilt State
  const workspaceRef = useRef(null);
  const [workspaceTilt, setWorkspaceTilt] = useState({ x: 0, y: 0 });

  // CTA Section Parallax Ref & Scroll Hooks
  const ctaRef = useRef(null);
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });

  const orb1Y = useTransform(ctaScrollProgress, [0, 1], [-40, 40]);
  const orb2Y = useTransform(ctaScrollProgress, [0, 1], [40, -40]);
  const iconY = useTransform(ctaScrollProgress, [0, 1], [-25, 25]);

  // GSAP Animations Initialization
  const gsapHeroBadgeRef = useRef(null);
  useEffect(() => {
    if (gsapHeroBadgeRef.current) {
      gsap.fromTo(
        gsapHeroBadgeRef.current,
        { scale: 0.8, opacity: 0, y: -15 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const handleHeroMouseMove = (e) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setHeroTilt({
      x: (y / (rect.height / 2)) * -6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleHeroMouseLeave = () => setHeroTilt({ x: 0, y: 0 });

  const handleWorkspaceMouseMove = (e) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setWorkspaceTilt({
      x: (y / (rect.height / 2)) * -5,
      y: (x / (rect.width / 2)) * 5,
    });
  };

  const handleWorkspaceMouseLeave = () => setWorkspaceTilt({ x: 0, y: 0 });

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 60 }).map((_, i) => {
      const angle = (Math.random() * 120 + 30) * (Math.PI / 180);
      const velocity = Math.random() * 250 + 150;
      const xDistance = Math.cos(angle) * velocity * (Math.random() * 0.8 + 0.5);
      const yDistance = -Math.sin(angle) * velocity * (Math.random() * 0.8 + 0.5);
      
      return {
        id: Math.random() + i,
        x: xDistance,
        y: yDistance,
        rotation: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.4,
        color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444"][Math.floor(Math.random() * 6)],
        shape: Math.random() > 0.5 ? "circle" : "rect",
        duration: Math.random() * 1.5 + 1.2
      };
    });
    setConfetti((prev) => [...prev, ...pieces].slice(-150));
    setTimeout(() => {
      setConfetti((prev) => prev.filter(p => !pieces.find(newP => newP.id === p.id)));
    }, 3000);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1.25;
        }
        return 100;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [activeStep]);

  useEffect(() => {
    if (progress >= 100) {
      setActiveStep((current) => (current + 1) % 4);
    }
  }, [progress]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden relative transition-colors duration-300">

      {/* ⚡ GSAP ANIMATED BACKGROUND ORBS & GRID */}
      <GsapBackground />

      {/* NAVBAR */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-xl border-b border-slate-200/80 dark:border-slate-800/80" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/"><span className="text-xl font-black italic tracking-tighter text-brand-blue flex items-center gap-2"><Box size={22} className="text-brand-blue animate-pulse"/> Eventify</span></Link>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {NAV_ITEMS.map(item => (
              <a 
                key={item.href} 
                href={item.href} 
                className="relative py-2 capitalize transition-colors hover:text-brand-blue after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-brand-blue after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <Link href="/auth"><button className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand-blue px-3 sm:px-4 py-2 transition-colors">Sign In</button></Link>
              <Link href="/portal"><button className="bg-brand-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5">Get Started</button></Link>
            </div>
            
            <ThemeToggle />
            
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-slate-600 dark:text-slate-400 p-1.5 transition-transform active:scale-95" aria-label="Toggle Navigation Menu">{mobileOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-6 flex flex-col gap-4 shadow-lg overflow-hidden"
            >
              {NAV_ITEMS.map(item => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setMobileOpen(false)} 
                  className="text-slate-800 dark:text-slate-300 font-semibold hover:text-brand-blue py-1.5 border-b border-slate-200 dark:border-slate-800/50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/auth" onClick={() => setMobileOpen(false)}>
                  <button className="w-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/portal" onClick={() => setMobileOpen(false)}>
                  <button className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-slate-100/90 via-white/80 to-slate-100/90 dark:from-slate-950/80 dark:via-slate-900/60 dark:to-slate-950/90 backdrop-blur-xs z-10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none"/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Avatar Row & Project Badge with GSAP animation */}
          <div ref={gsapHeroBadgeRef} className="inline-flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-xl hover:border-brand-blue/40 transition-all duration-300 backdrop-blur-md">
            <div className="flex -space-x-2">
              {[
                { initials: "AK", bg: "bg-blue-600" },
                { initials: "BM", bg: "bg-emerald-600" },
                { initials: "ZR", bg: "bg-purple-600" },
                { initials: "HS", bg: "bg-indigo-600" },
                { initials: "TA", bg: "bg-rose-600" }
              ].map((av, idx) => (
                <div 
                  key={av.initials} 
                  className={`w-6 h-6 rounded-full ${av.bg} text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md shadow-black/20 hover:-translate-y-0.5 transition-transform`}
                  style={{ zIndex: 10 - idx }}
                >
                  {av.initials}
                </div>
              ))}
            </div>
            <span className="text-slate-600 dark:text-slate-400 font-medium text-xs tracking-tight">Final Year University Project • Smart Event Platform</span>
          </div>

          <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter text-slate-900 dark:text-white mb-6">
            Build Amazing<br/>
            <TextRotator />
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4 sm:px-0">
            From registration to analytics, manage everything in one platform. Our intuitive tools guide you from creation to post-event analytics.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4 sm:px-0">
            <Link href="/portal" className="w-full sm:w-auto flex justify-center">
              <button className="w-full max-w-[280px] sm:max-w-none flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-0.5 group">
                Create Your First Event <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </Link>
            <a href="#pass3d" className="w-full sm:w-auto flex justify-center">
              <button className="w-full max-w-[280px] sm:max-w-none text-slate-700 dark:text-slate-300 hover:text-brand-blue font-bold text-base px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-800 hover:border-brand-blue/40 bg-white/60 dark:bg-slate-900/60 hover:bg-brand-blue/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                <Box size={18} className="text-brand-blue animate-pulse"/> Launch 3D Experience
              </button>
            </a>
          </motion.div>

          {/* 3D Floating Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transform: `perspective(1200px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg)`,
              transition: "transform 0.15s ease-out"
            }}
            className="relative mx-auto max-w-4xl rounded-t-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-200 dark:border-slate-800 border-b-0"
          >
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-yellow-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
              <div className="flex-1 mx-4 bg-white dark:bg-slate-950 rounded-lg px-3 py-1 text-xs text-slate-500 font-medium border border-slate-200 dark:border-slate-800/50 shadow-inner">app.eventify.com/dashboard</div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-4 sm:p-6 min-h-[320px]">
              
              {/* Layered Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
                {[
                  ["2,840","Total Attendees","text-brand-blue","bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40"],
                  ["142","Active Events","text-emerald-600 dark:text-brand-green","bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40"],
                  ["98%","Check-in Rate","text-violet-600 dark:text-violet-400","bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/40"],
                  ["PKR 48k","Revenue","text-amber-600 dark:text-orange-400","bg-amber-50 dark:bg-orange-950/30 border-amber-200 dark:border-orange-900/40"]
                ].map(([val,label,textColor,cardBg])=>(
                  <ThreeDCard 
                    key={label} 
                    depth={15}
                    className={`rounded-xl p-3 sm:p-4 border flex flex-col justify-center text-center shadow-lg transition-all ${cardBg}`}
                  >
                    <p className={`text-lg sm:text-2xl font-black ${textColor} truncate`}>{val}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] sm:text-xs mt-0.5 leading-tight font-medium">{label}</p>
                  </ThreeDCard>
                ))}
              </div>

              {/* Layered Trend Chart & Event Types Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ThreeDCard depth={18} className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-lg h-40">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-300 mb-3">Registration Trend</p>
                  <div className="flex items-end gap-1 sm:gap-2 h-24">
                    {[40,60,45,80,65,90,75,100,85,95,70,88].map((h,i)=>(
                      <div key={i} className="flex-1 bg-gradient-to-t from-brand-blue/30 to-brand-blue rounded-t-sm hover:from-brand-blue hover:to-blue-500 transition-colors shadow-sm" style={{height:`${h}%`}}/>
                    ))}
                  </div>
                </ThreeDCard>

                <ThreeDCard depth={18} className="col-span-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-lg h-40">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-300 mb-3">Event Types</p>
                  <div className="space-y-2">
                    {[["Conference","65%","bg-brand-blue"],["Workshop","25%","bg-brand-green"],["Webinar","10%","bg-violet-500"]].map(([t,p,c])=>(
                      <div key={t} className="min-w-0">
                        <div className="flex justify-between items-center flex-wrap gap-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                          <span className="truncate">{t}</span>
                          <span className="font-bold shrink-0">{p}</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${c} rounded-full`} style={{width:p}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </ThreeDCard>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* THREE.JS INTERACTIVE 3D PASS & STAGE SHOWCASE */}
      <section id="pass3d" className="py-24 px-4 sm:px-6 bg-slate-900/90 dark:bg-slate-950/90 text-white relative overflow-hidden border-y border-slate-200 dark:border-slate-800/80 backdrop-blur-xs z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.span {...fadeUp(0)} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-4 py-1.5 rounded-full shadow-lg shadow-cyan-500/10">
              <Box size={14} className="text-cyan-400 animate-spin"/> Powered by Three.js &amp; WebGL
            </motion.span>
            <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black mt-5 mb-4 tracking-tight leading-tight text-white">
              Interactive 3D Event Pass<br/>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">&amp; Stage Orbit Engine</span>
            </motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Experience your event tickets in full 3D space. Drag to spin the pass in 360°, inspect holographic security seals, and view real-time stage orbit lighting.
            </motion.p>
          </div>

          <motion.div {...fadeUp(0.3)} className="w-full">
            <Eventify3DScene />
          </motion.div>
        </div>
      </section>

      {/* STATS & DATA TILES BAR */}
      <section className="bg-brand-blue/90 py-16 px-4 sm:px-6 relative overflow-hidden backdrop-blur-md z-10 border-y border-blue-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {[
            ["50K+","Events Created"],
            ["2M+","Attendees Served"],
            ["98%","Satisfaction Rate"],
            ["40hrs","Time Saved"]
          ].map(([val,label],i)=>(
            <ThreeDCard key={label} depth={20} className="rounded-2xl">
              <motion.div 
                {...fadeUp(i*0.1)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl shadow-blue-950/20 hover:border-white/40 transition-all h-full flex flex-col justify-center"
              >
                <p className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{val}</p>
                <p className="text-blue-100 text-xs sm:text-sm font-semibold mt-1.5">{label}</p>
              </motion.div>
            </ThreeDCard>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-28 px-4 sm:px-6 bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-xs relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.span {...fadeUp(0)} className="inline-block text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-4 py-1.5 rounded-full shadow-sm">Features</motion.span>
            <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black mt-5 mb-4 tracking-tight leading-tight text-slate-900 dark:text-white">Create Amazing Events<br/><span className="text-slate-500 dark:text-slate-400">&amp; Experiences</span></motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">All the tools you need to create memorable events and deliver exceptional experiences.</motion.p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f,i)=>(
              <ThreeDCard key={f.title} depth={30} className="rounded-3xl h-full">
                <motion.div 
                  {...fadeUp(i*0.08)} 
                  className="group p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl hover:border-brand-blue/40 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Sleek Translucent Eventify Badge Icon Box */}
                    <div className={`w-13 h-13 rounded-2xl ${f.badgeStyle} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {f.icon}
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-black text-xl mb-3 group-hover:text-brand-blue transition-colors">{f.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 px-4 sm:px-6 bg-white/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 backdrop-blur-xs relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.span {...fadeUp()} className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/80 border border-violet-300 dark:border-violet-800/60 px-4 py-1.5 rounded-full shadow-sm">How It Works</motion.span>
            <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black mt-5 tracking-tight text-slate-900 dark:text-white leading-tight">Build Amazing Communities Through Events</motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
              Our intuitive platform guides you through creating outstanding events and experiences that bring communities together, from creation to post-event analytics.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Interactive Tabs */}
            <div className="space-y-4 text-left">
              {[
                {
                  title: "Create Your Event",
                  desc: "Set up your event details, create branded registration pages, and configure attendee types (student, professional, VIP) in minutes.",
                },
                {
                  title: "Manage Registrations",
                  desc: "Manage attendee lists, send branded email confirmations, and process digital passes or payments with secure checkout.",
                },
                {
                  title: "Track Activities",
                  desc: "Monitor check-in counts, workshops, and meal logs in real-time with paperless QR code scanning directly at the venue.",
                },
                {
                  title: "Analyze & Optimize",
                  desc: "Extract detailed post-event reports, attendee ratings, engagement metrics, and sales analytics to level up your next project.",
                }
              ].map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <motion.div
                    key={step.title}
                    {...fadeUp(idx * 0.08)}
                    onClick={() => {
                      setActiveStep(idx);
                      setProgress(0);
                    }}
                    className={`cursor-pointer p-6 rounded-2xl transition-all border relative overflow-hidden ${
                      isActive 
                        ? "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-2xl scale-[1.01]" 
                        : "border-slate-200 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/70 hover:shadow-md"
                    }`}
                  >
                    <h3 className={`text-xl font-bold tracking-tight mb-2 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                      {step.title}
                    </h3>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-200 dark:bg-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-blue to-violet-500 transition-all duration-75 ease-linear" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Workspace Mockup with Perspective Tilt & Layered Shadows */}
            <ThreeDCard depth={25} className="rounded-3xl">
              <motion.div 
                ref={workspaceRef}
                onMouseMove={handleWorkspaceMouseMove}
                onMouseLeave={handleWorkspaceMouseLeave}
                {...fadeUp(0.15)}
                style={{
                  transform: `perspective(1200px) rotateX(${workspaceTilt.x}deg) rotateY(${workspaceTilt.y}deg)`,
                  transition: "transform 0.15s ease-out"
                }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-yellow-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
                  <div className="flex-1 mx-4 bg-white dark:bg-slate-950 rounded-lg px-3 py-1 text-xs text-slate-500 font-medium border border-slate-200 dark:border-slate-800/50 shadow-inner">app.eventify.com/workspace</div>
                </div>

                <div className="p-4 sm:p-8 min-h-[320px] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="w-full"
                    >
                      {activeStep === 0 && (
                        <div className="text-left font-semibold space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Tech Innovation Summit — Draft</span>
                            <span className="text-xs bg-brand-blue/20 text-brand-blue px-2.5 py-1 rounded-full font-bold">Draft</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500">Event Type</label>
                              <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 mt-1 text-xs text-slate-900 dark:text-slate-200 font-bold">Conference</div>
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500">Category</label>
                              <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 mt-1 text-xs text-slate-900 dark:text-slate-200 font-bold">Technology</div>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500">Header Image</label>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 sm:p-6 mt-1 text-center bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                              <Compass size={24} className="text-slate-500 mb-2" />
                              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">tech_summit_header.jpg uploaded</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <div className="text-left font-semibold space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Attendee Directory</span>
                            <span className="text-xs bg-brand-green/20 text-brand-green px-2.5 py-1 rounded-full font-bold">2,840 Total</span>
                          </div>
                          <div className="space-y-2.5">
                            {[
                              { name: "John Doe", email: "john@example.com", tier: "VIP", color: "bg-amber-500" },
                              { name: "Sarah Connor", email: "sarah@example.com", tier: "Professional", color: "bg-blue-500" },
                              { name: "Alex Mercer", email: "alex@example.com", tier: "Student", color: "bg-emerald-500" }
                            ].map((user) => (
                              <div key={user.name} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex gap-3 items-center">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-300">{user.name[0]}</div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{user.name}</p>
                                    <p className="text-[10px] text-slate-500">{user.email}</p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black text-white px-2.5 py-1 rounded-full ${user.color} shadow-xs`}>{user.tier}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div className="text-left font-semibold space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Live Activity Feed</span>
                            <span className="w-2.5 h-2.5 bg-brand-green rounded-full animate-ping" />
                          </div>
                          <div className="space-y-3">
                            {[
                              { msg: "Jane Doe checked in to Main Hall", time: "Just now", icon: <CheckCircle2 size={12} className="text-brand-green" /> },
                              { msg: "Alex Smith entered Workshop A", time: "2 min ago", icon: <Zap size={12} className="text-brand-blue" /> },
                              { msg: "Premium lunch pass scanned", time: "5 min ago", icon: <CreditCard size={12} className="text-amber-500" /> }
                            ].map((act, i) => (
                              <div key={i} className="flex gap-3 items-center text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs">{act.icon}</div>
                                <div className="flex-1">
                                  <p className="text-slate-800 dark:text-slate-200 font-bold">{act.msg}</p>
                                  <p className="text-[10px] text-slate-500">{act.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeStep === 3 && (
                        <div className="text-left font-semibold space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Performance Summary</span>
                            <span className="text-xs bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full font-bold">Excellent</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Growth</p>
                              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">+34.8%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Rating</p>
                              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">4.9 / 5.0</p>
                            </div>
                          </div>
                          <div className="h-16 flex items-end gap-1.5 px-2 pb-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                            {[30, 45, 60, 50, 75, 90, 80, 100].map((val, i) => (
                              <div key={i} className="flex-1 bg-gradient-to-t from-brand-blue/40 to-brand-blue rounded-t-sm" style={{ height: `${val}%` }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </ThreeDCard>

          </div>
          <div className="mt-16 text-center space-y-4 px-4 sm:px-0">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-bold">Ready to transform your event management? Get started in minutes.</p>
            <Link href="/portal">
              <button className="bg-brand-blue hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                Create Your First Event
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-28 bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-xs relative z-10 transition-colors">
        <div className="text-center mb-16 px-4 sm:px-6">
          <motion.span {...fadeUp()} className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950 border border-violet-300 dark:border-violet-800/60 px-4 py-1.5 rounded-full shadow-sm">Reviews</motion.span>
          <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black mt-5 tracking-tight leading-tight text-slate-900 dark:text-white">Built for Campus &amp; Community<br/><span className="text-slate-500 dark:text-slate-400">Events</span></motion.h2>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <ThreeDCard key={i} depth={25} className="rounded-3xl h-full">
                <motion.div {...fadeUp(i * 0.08)} className="h-full">
                  <TCard t={t} />
                </motion.div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-28 px-4 sm:px-6 bg-white/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 backdrop-blur-xs relative z-10 transition-colors">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16 px-4 sm:px-6">
            <motion.span {...fadeUp()} className="inline-block text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-4 py-1.5 rounded-full shadow-sm">FAQ</motion.span>
            <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black mt-5 tracking-tight leading-tight text-slate-900 dark:text-white">Got Questions?</motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">Here are answers to common questions about our platform.</motion.p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq,i)=>(
              <ThreeDCard key={i} depth={15} className="rounded-2xl">
                <motion.div 
                  {...fadeUp(i*0.07)}
                  className={`rounded-2xl border cursor-pointer overflow-hidden transition-all duration-300 ${
                    openFaq===i
                      ? "border-brand-blue/60 bg-brand-blue/10 shadow-lg shadow-blue-500/10 -translate-y-0.5"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                  onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <div className="flex items-center justify-between px-5 sm:px-6 py-5">
                    <span className="text-slate-900 dark:text-slate-200 font-bold text-sm md:text-base">{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 shrink-0 ml-3 sm:ml-4 transition-transform duration-300 ${openFaq===i?"rotate-180 text-brand-blue":""}`}/>
                  </div>
                  {openFaq===i && (
                    <div className="px-5 sm:px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-4">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WITH PARALLAX FLOATING DECORATIONS */}
      <section ref={ctaRef} className="py-20 bg-slate-950 overflow-hidden relative z-10">
        <motion.div {...fadeUp()} className="w-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-blue-600 to-brand-green opacity-90"/>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]"/>
          
          {/* Floating Parallax Brand Accent Orbs & UI Fragments */}
          <motion.div 
            style={{ y: orb1Y }}
            className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"
          />
          <motion.div 
            style={{ y: orb2Y }}
            className="absolute bottom-10 right-10 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div 
            style={{ y: iconY }}
            className="hidden lg:flex absolute top-16 right-20 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 items-center justify-center text-white shadow-xl pointer-events-none"
          >
            <Ticket size={28} />
          </motion.div>

          <div className="relative z-10 text-center py-24 px-4 sm:px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border border-white/30 backdrop-blur-md shadow-md">
              <CheckCircle2 size={14}/> Free to get started
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 text-white leading-tight">Start creating amazing<br />events today.</h2>
            <p className="text-white/90 text-base sm:text-lg mb-10 max-w-xl mx-auto font-medium">Streamline your campus conferences, workshops, and meetups with Eventify.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center overflow-visible px-4 sm:px-0">
              <div className="relative inline-block overflow-visible group w-full sm:w-auto">
                <div 
                  className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500 pointer-events-none animate-gradient-x"
                />
                <Link href="/portal" className="relative z-10 block w-full">
                  <button 
                    onMouseEnter={triggerConfetti}
                    className="w-full bg-white text-slate-900 font-black px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-xl"
                  >
                    Create Your First Event
                  </button>
                </Link>

                {/* Confetti Particles Container */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-20">
                  <AnimatePresence>
                    {confetti.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                        animate={{ 
                          opacity: [1, 1, 0.8, 0],
                          scale: [0, p.scale, p.scale, 0],
                          x: p.x, 
                          y: [0, p.y * 0.6, p.y, p.y + 150],
                          rotate: p.rotation
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: p.duration, ease: "easeOut" }}
                        className={`absolute w-2.5 h-2.5 ${p.shape === "circle" ? "rounded-full" : "rounded-sm"}`}
                        style={{ 
                          backgroundColor: p.color,
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <a href="mailto:hello@eventify.com" className="w-full sm:w-auto"><button className="w-full flex items-center justify-center gap-2 border border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/15 transition-all"><Mail size={16}/> Contact Us</button></a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-28 px-4 sm:px-6 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xs relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 px-4 sm:px-6">
            <motion.span {...fadeUp()} className="inline-block text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-4 py-1.5 rounded-full shadow-sm">Contact Us</motion.span>
            <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black mt-5 tracking-tight text-slate-900 dark:text-white leading-tight">Ready to Create Amazing Events?</motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 mt-3 text-base sm:text-lg max-w-xl mx-auto">Send us a message and we'll respond as soon as possible. We are here to help you succeed.</motion.p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6 w-full">
              {[
                {
                  title: "Email Us",
                  val: "hello@eventify.com",
                  href: "mailto:hello@eventify.com",
                  icon: <Mail size={22} className="text-brand-blue" />,
                  bg: "bg-brand-blue/10 border-brand-blue/30"
                },
                {
                  title: "Call Us",
                  val: "+92 (325) 922-3300",
                  href: "tel:+923259223300",
                  icon: <Phone size={22} className="text-brand-green" />,
                  bg: "bg-emerald-500/10 border-emerald-500/30"
                }
              ].map((item, i) => (
                <ThreeDCard key={item.title} depth={20} className="rounded-3xl w-full">
                  <motion.a 
                    href={item.href}
                    {...fadeUp(i * 0.1)}
                    className="block p-7 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:border-brand-blue/40 transition-all group w-full"
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.bg}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1">{item.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed break-words">{item.val}</p>
                      </div>
                    </div>
                  </motion.a>
                </ThreeDCard>
              ))}
            </div>

            {/* Layered Shadow Contact Form Container */}
            <ThreeDCard depth={25} className="lg:col-span-3 rounded-3xl w-full">
              <motion.form 
                {...fadeUp(0.15)}
                onSubmit={(e) => e.preventDefault()}
                className="bg-white dark:bg-slate-900/90 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 w-full"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help you?" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us details about your request..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 font-semibold resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-brand-blue hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </motion.form>
            </ThreeDCard>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 pt-16 pb-10 px-4 sm:px-6 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-brand-blue text-xl font-black italic tracking-tighter flex items-center gap-2">
                <Box size={22} className="text-brand-blue"/> Eventify
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">Smart event management platform that simplifies and automates your event planning from start to finish.</p>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2"><Mail size={14}/> hello@eventify.pk</div>
                <div className="flex items-center gap-2"><Phone size={14}/> +92 (325) 922-3300</div>
                <div className="flex items-center gap-2"><MapPin size={14}/> Karachi, Pakistan</div>
              </div>
            </div>
            {[
              ["Platform", [["Explore Events", "/events"], ["Event Portal", "/portal"], ["Organizer Dashboard", "/dashboard"], ["Features", "#features"]]],
              ["Project", [["How It Works", "#how"], ["Reviews", "#testimonials"], ["FAQ", "#faq"], ["Contact Us", "#contact"]]],
              ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]]
            ].map(([title, links]) => (
              <div key={title} className="space-y-4">
                <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">{title}</h4>
                <ul className="space-y-3">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-slate-600 dark:text-slate-400 text-sm hover:text-brand-blue transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">© 2026 Eventify. Final Year University Project.</p>
            <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}

function TCard({ t }) {
  return (
    <div className="w-full p-7 rounded-3xl bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg hover:border-brand-blue/40 transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex gap-1 mb-4">{Array(5).fill(0).map((_,i)=><Star key={i} size={14} className="fill-amber-400 text-amber-400"/>)}</div>
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">"{t.text}"</p>
      </div>
      <div className="flex items-center gap-3.5 pt-5 border-t border-slate-200 dark:border-slate-800">
        <div className={`w-10 h-10 rounded-full ${t.color || "bg-brand-blue"} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md shadow-black/20`}>
          {t.initials || t.name[0]}
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-bold text-sm">{t.name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  );
}
