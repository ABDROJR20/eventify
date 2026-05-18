"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Scale, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Agreement to Terms", icon: <Scale size={18} /> },
    { id: "section-2", title: "2. User Representations", icon: <CheckCircle2 size={18} /> },
    { id: "section-3", title: "3. Prohibited Activities", icon: <AlertTriangle size={18} /> },
    { id: "section-4", title: "4. Event Creation & Management", icon: <FileText size={18} /> },
    { id: "section-5", title: "5. Modifications", icon: <FileText size={18} /> },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Accounts for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-blue selection:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Premium Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[140px] transition-colors duration-300"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-brand-blue/10 rounded-full blur-[140px] transition-colors duration-300"></div>
      </div>

      {/* Floating Actions */}
      <div className="max-w-6xl mx-auto px-6 pt-10 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue transition-all text-slate-550 group-hover:text-white shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="font-bold text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Banner Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-brand-blue/20">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-500 dark:to-cyan-400 italic font-serif">Service</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
            The rules and guidelines that govern our platform. By using Eventify, you agree to these terms.
          </p>
          {/* <div className="mt-2 inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">
            Effective: October 24, 2026
          </div> */}
        </div>

        {/* 2-Column Professional Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Side: Sticky Navigation Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28 space-y-2 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-850 p-6 rounded-[2rem] shadow-xl dark:shadow-none transition-colors duration-300">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-4 px-3">Table of Contents</h4>
            <nav className="space-y-1">
              {sections.map((sect) => (
                <button
                  key={sect.id}
                  onClick={() => scrollToSection(sect.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 text-left ${
                    activeSection === sect.id
                      ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeSection === sect.id ? "text-white" : "text-brand-blue"}>
                      {sect.icon}
                    </span>
                    <span>{sect.title.split(". ")[1]}</span>
                  </div>
                  <ChevronRight size={14} className={`opacity-60 transition-transform ${activeSection === sect.id ? "translate-x-0.5 text-white" : ""}`} />
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Side: Detailed Content Sections */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-2xl dark:shadow-none transition-colors duration-300">
            <div className="space-y-16">
              
              {/* Section 1 */}
              <section id="section-1" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <Scale size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">1. Agreement to Terms</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Eventify ("we," "us" or "our"), concerning your access to and use of our platform. You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms of Service.
                </p>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">2. User Representations</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium mb-6">
                  By using the Site, you represent and warrant that:
                </p>
                <div className="space-y-4">
                  {[
                    "All registration information you submit will be true, accurate, current, and complete.",
                    "You will maintain the accuracy of such information and promptly update it.",
                    "You have the legal capacity and you agree to comply with these Terms of Service.",
                    "You are not a minor in the jurisdiction in which you reside."
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 transition-colors duration-300">
                      <ShieldCheck size={24} className="text-brand-blue shrink-0" />
                      <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">3. Prohibited Activities</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Systematically retrieving data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us is prohibited.
                </p>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">4. Event Creation & Management</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  Organizers are solely responsible for the events they create, manage, and promote using Eventify. We do not guarantee the quality, safety, or legality of any event. Organizers must ensure their events comply with all local, state, and federal laws and regulations. Eventify reserves the right to remove any event that violates our terms or community guidelines.
                </p>
              </section>

              {/* Section 5 */}
              <section id="section-5" className="pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 scroll-mt-32">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">5. Modifications</h2>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
