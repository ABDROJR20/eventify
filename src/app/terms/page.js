"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Scale,
  ChevronRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Agreement to Terms", icon: <Scale size={18} /> },
    { id: "section-2", title: "2. User Representations", icon: <CheckCircle2 size={18} /> },
    { id: "section-3", title: "3. Prohibited Activities", icon: <AlertTriangle size={18} /> },
    { id: "section-4", title: "4. Event Creation & Hosting", icon: <FileText size={18} /> },
    { id: "section-5", title: "5. Modifications & Updates", icon: <Sparkles size={18} /> },
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
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-cyan-500/10 dark:bg-blue-600/15 rounded-full blur-[140px]"></div>
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
              href="/privacy"
              className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors hidden sm:inline-block"
            >
              Privacy Policy
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border border-brand-blue/20 text-brand-blue text-xs font-black uppercase tracking-widest mb-6">
          <Calendar size={14} /> Last Updated: September 2026
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">
          Terms of{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue via-blue-500 to-cyan-400 italic">
            Service
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Please review the legal terms and guidelines governing the use of the Eventify event management platform.
        </p>
      </section>

      {/* Main 2-Column Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Sticky Table of Contents */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 space-y-3 bg-white dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl dark:shadow-none transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Contents Navigation
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                {sections.length} Sections
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
              <p className="text-xs text-slate-400 font-medium">Need legal clarification?</p>
              <a
                href="mailto:legal@eventify.com"
                className="text-xs font-black text-brand-blue hover:underline mt-1 inline-block"
              >
                legal@eventify.com
              </a>
            </div>
          </aside>

          {/* Right: Rich Content Panels */}
          <div className="flex-1 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl dark:shadow-none space-y-16">
            
            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center border border-brand-blue/20 shrink-0">
                  <Scale size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 01</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    1. Agreement to Terms
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Eventify (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the Eventify application, website, and related services. By accessing or using Eventify, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 02</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    2. User Representations
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium mb-6">
                By creating an account or using Eventify as an attendee or event organizer, you represent and warrant that:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "All registration information submitted is accurate, true, and kept up-to-date.",
                  "You have the legal capacity to enter into and abide by these Terms of Service.",
                  "You will not access the platform through automated scripts or unauthorized bots.",
                  "Your use of Eventify will not violate any applicable regional, national, or international law.",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-4"
                  >
                    <ShieldCheck size={20} className="text-brand-blue shrink-0 mt-0.5" />
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 03</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    3. Prohibited Activities
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium mb-4">
                You may not access or use Eventify for any purpose other than that for which we make the platform available. Prohibited activities include, but are not limited to:
              </p>
              <div className="space-y-3">
                {[
                  "Systematically retrieving data or user directories to create scraping tools without permission.",
                  "Attempting to impersonate another user, organizer, or administrator.",
                  "Uploading malicious code, spam, fraudulent events, or disruptive assets.",
                  "Using the service to sell fraudulent tickets or counterfeit event merchandise.",
                ].map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-sm font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-brand-blue flex items-center justify-center border border-blue-500/20 shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 04</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    4. Event Creation & Hosting
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
                Organizers are solely responsible for the description, scheduling, venue safety, ticketing policies, and compliance of their events. Eventify acts as a facilitator and platform provider, and does not own or guarantee the physical execution of third-party hosted events.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="pt-8 border-t border-slate-200 dark:border-slate-800 scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500 flex items-center justify-center border border-cyan-500/20 shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section 05</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    5. Modifications & Updates
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
                We reserve the right to modify or replace these Terms of Service at any time. Continued use of Eventify after any such changes constitutes your binding acceptance of the updated terms.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
