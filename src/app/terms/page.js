import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Scale } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all text-slate-400 group-hover:text-white shadow-lg">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold text-slate-400 group-hover:text-white transition-colors hidden sm:block">Back to Home</span>
          </Link>
          <Link href="/">
            <h1 className="text-white text-2xl font-black italic tracking-tighter">Eventify</h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-500/20">
            <FileText size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 italic">Service</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            The rules and guidelines that govern our platform. By using Eventify, you agree to these terms.
          </p>
          <div className="mt-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-slate-300 tracking-widest uppercase">
            Effective: October 24, 2026
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl space-y-16 text-slate-300 leading-relaxed text-lg font-medium">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <Scale size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">1. Agreement to Terms</h2>
            </div>
            <p>
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Eventify ("we," "us" or "our"), concerning your access to and use of our platform. You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms of Service.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">2. User Representations</h2>
            </div>
            <p className="mb-6">By using the Site, you represent and warrant that:</p>
            <div className="space-y-4">
              {[
                "All registration information you submit will be true, accurate, current, and complete.",
                "You will maintain the accuracy of such information and promptly update it.",
                "You have the legal capacity and you agree to comply with these Terms of Service.",
                "You are not a minor in the jurisdiction in which you reside."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                  <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
                  <p className="text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-emerald-500/20 bg-emerald-500/10">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">3. Prohibited Activities</h2>
            </div>
            <p>
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Systematically retrieving data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us is prohibited.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <FileText size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">4. Event Creation & Management</h2>
            </div>
            <p>
              Organizers are solely responsible for the events they create, manage, and promote using Eventify. We do not guarantee the quality, safety, or legality of any event. Organizers must ensure their events comply with all local, state, and federal laws and regulations. Eventify reserves the right to remove any event that violates our terms or community guidelines.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">5. Modifications</h2>
            <p>
              We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
