"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  ChevronRight,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Overview & Commitment", icon: <Eye size={18} /> },
    { id: "section-2", title: "2. Data We Collect", icon: <Database size={18} /> },
    { id: "section-3", title: "3. How We Use Data", icon: <Shield size={18} /> },
    { id: "section-4", title: "4. Sharing & Protection", icon: <Lock size={18} /> },
    { id: "section-5", title: "5. Contact & Data Rights", icon: <HelpCircle size={18} /> },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-blue selection:text-white relative overflow-hidden transition-colors duration-500">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-brand-blue/10 dark:bg-brand-blue/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-[140px]"></div>
      </div>

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue text-slate-600 dark:text-slate-300 group-hover:text-white transition-all shadow-xs">
              <ArrowLeft size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">Back to</span>
              <span className="font-black text-sm text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">Eventify Home</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors hidden sm:inline-block"
            >
              Terms of Service
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
          <Calendar size={14} /> Last Updated: September 2026
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">
          Privacy{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue via-emerald-500 to-teal-400 italic">
            Policy
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Your privacy and trust are our highest priorities. Learn how Eventify collects, protects, and handles your information.
        </p>
      </section>

      {/* Main 2-Column Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Sticky Table of Contents */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 space-y-3 bg-white dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl dark:shadow-none transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Policy Sections
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {sections.length} Topics
              </span>
            </div>

            <nav className="space-y-1.5 pt-1">
              {sections.map((sect) => {
                const isActive = activeSection === sect.id;
                return (
                  <button
                    key={sect.id}
                    onClick={() => scrollToSection(sect.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-brand-blue text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-white" : "text-brand-blue"}>
                        {sect.icon}
                      </span>
                      <span className="truncate">{sect.title}</span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`transition-transform shrink-0 ${
                        isActive ? "translate-x-0.5 text-white opacity-100" : "opacity-40"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-medium">Questions about your data?</p>
              <a
                href="mailto:privacy@eventify.com"
                className="text-xs font-black text-brand-blue hover:underline mt-1 inline-block"
              >
                privacy@eventify.com
              </a>
            </div>
          </aside>

          {/* Right: Rich Content Panels */}
          <div className="flex-1 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl dark:shadow-none space-y-16">
            
            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center border border-brand-blue/20 shrink-0">
                  <Eye size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 01</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    1. Overview & Commitment
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
                At Eventify, we are dedicated to safeguarding the privacy and security of our users. This Privacy Policy details how we handle information collected through our web application, mobile interfaces, ticketing portals, and organizer dashboards.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Database size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 02</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    2. Data We Collect
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium mb-6">
                We gather information in a transparent manner to deliver seamless ticketing and organizer experiences:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Account & Profile Data",
                    desc: "Your name, email address, profile picture, and role credentials when signing up or using Google OAuth.",
                  },
                  {
                    title: "Event & Ticket Bookings",
                    desc: "Event registrations, ticket quantities, check-in status, and transaction histories.",
                  },
                  {
                    title: "Technical & Device Logs",
                    desc: "Browser types, operating systems, IP addresses, and performance telemetry for reliability.",
                  },
                  {
                    title: "Security & Verification",
                    desc: "One-Time Passcode (OTP) requests and session tokens ensuring end-to-end account protection.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 mb-2 font-black text-slate-900 dark:text-white text-base">
                      <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                      <span>{item.title}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500 flex items-center justify-center border border-cyan-500/20 shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 03</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    3. How We Use Data
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium mb-6">
                Your data enables us to power real-time booking, attendee management, and notifications:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Facilitating seamless event registration and ticket issuance.",
                  "Authenticating organizers and attendee dashboards securely.",
                  "Sending booking confirmations, event updates, and OTP codes.",
                  "Preventing fraudulent registrations and unauthorized access.",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-500/20 shrink-0">
                  <Lock size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 04</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    4. Sharing & Protection
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
                We never sell your personal data to third parties. Information is only shared with verified organizers for events you actively register for, or when required by governing law. All passwords and sensitive credentials are encrypted using industry-standard hashing algorithms.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="pt-8 border-t border-slate-200 dark:border-slate-800 scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center border border-brand-blue/20 shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 05</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    5. Contact & Data Rights
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium mb-8">
                You have the right to request access, correction, or deletion of your personal account data at any time. For privacy inquiries:
              </p>

              <div className="p-8 bg-slate-50 dark:bg-slate-950/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/15 transition-colors"></div>
                <p className="font-black text-2xl text-slate-900 dark:text-white mb-1 relative z-10">Eventify Privacy & Security Office</p>
                <div className="flex flex-wrap gap-6 mt-4 relative z-10">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Mail size={16} className="text-brand-blue" />
                    <a href="mailto:privacy@eventify.com" className="hover:text-brand-blue transition-colors">privacy@eventify.com</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <MapPin size={16} className="text-emerald-500" />
                    <span>Innovation Way, Suite 400</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
