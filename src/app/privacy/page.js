"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, ChevronRight, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", title: "1. Introduction", icon: <Eye size={18} /> },
    { id: "section-2", title: "2. Information We Collect", icon: <Database size={18} /> },
    { id: "section-3", title: "3. Use of Your Information", icon: <Shield size={18} /> },
    { id: "section-4", title: "4. Disclosure of Information", icon: <Lock size={18} /> },
    { id: "section-5", title: "5. Contact Us", icon: <HelpCircle size={18} /> },
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
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-500 dark:to-cyan-400 italic font-serif">Policy</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Your trust is our top priority. Learn how we collect, protect, and use your data to power unforgettable experiences.
          </p>
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
                    <Eye size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">1. Introduction</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  At Eventify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <Database size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">2. Information We Collect</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium mb-6">
                  We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 transition-colors duration-300">
                    <h3 className="text-slate-900 dark:text-white font-black mb-2 flex items-center gap-2 text-base"><span className="w-2 h-2 rounded-full bg-brand-blue"></span> Personal Data</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Personally identifiable information, such as your name, shipping address, email address, and telephone number.</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 transition-colors duration-300">
                    <h3 className="text-slate-900 dark:text-white font-black mb-2 flex items-center gap-2 text-base"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Derivative Data</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Information our servers automatically collect when you access the Site, such as your IP address and browser type.</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 transition-colors duration-300">
                    <h3 className="text-slate-900 dark:text-white font-black mb-2 flex items-center gap-2 text-base"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Financial Data</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Financial information related to your payment method collected when you purchase or order services.</p>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-850/60 transition-colors duration-300">
                    <h3 className="text-slate-900 dark:text-white font-black mb-2 flex items-center gap-2 text-base"><span className="w-2 h-2 rounded-full bg-amber-550"></span> Device Data</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Device information like hardware models and operating systems for mobile applications.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <Shield size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">3. Use of Your Information</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium mb-6">
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {['Create and manage your account.', 'Process your transactions securely.', 'Send related information & receipts.', 'Fulfill purchases and orders.'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center mt-1 shrink-0">
                        <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                      </div>
                      <span className="text-slate-600 dark:text-slate-350 font-bold text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-brand-blue border border-slate-100 dark:border-slate-800 shrink-0">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">4. Disclosure of Information</h2>
                </div>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  We may share information we have collected about you in certain situations. Your information may be disclosed as follows: By Law or to Protect Rights, Third-Party Service Providers, Marketing Communications, Interactions with Other Users, and Online Postings.
                </p>
              </section>

              {/* Section 5 */}
              <section id="section-5" className="pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 scroll-mt-32">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6">5. Contact Us</h2>
                <p className="text-slate-655 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium mb-8">
                  If you have questions or comments about this Privacy Policy, please contact our dedicated privacy team:
                </p>
                <div className="p-8 bg-slate-50 dark:bg-slate-950/80 rounded-[2rem] border border-slate-200/80 dark:border-slate-850 relative overflow-hidden group transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/15 transition-colors"></div>
                  <p className="font-black text-2xl text-slate-900 dark:text-white mb-1 relative z-10">Eventify Privacy Team</p>
                  <p className="text-brand-blue font-black mb-4 relative z-10 text-lg sm:text-xl hover:underline cursor-pointer">privacy@eventify.com</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 relative z-10 font-black uppercase tracking-widest">123 Event Street, Tech City, TC 90210</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
