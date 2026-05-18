import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans selection:bg-brand-blue selection:text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue transition-all text-slate-400 group-hover:text-white shadow-lg">
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
          <div className="w-20 h-20 bg-brand-blue/20 text-brand-blue rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] border border-brand-blue/20">
            <Shield size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Policy</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Your trust is our top priority. Learn how we collect, protect, and use your data to power unforgettable experiences.
          </p>
          <div className="mt-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-slate-300 tracking-widest uppercase">
            Updated: October 24, 2026
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl space-y-16 text-slate-300 leading-relaxed text-lg font-medium">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <Eye size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">1. Introduction</h2>
            </div>
            <p>
              At Eventify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <Database size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">2. Information We Collect</h2>
            </div>
            <p className="mb-6">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-black mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-blue"></span> Personal Data</h3>
                <p className="text-sm text-slate-400">Personally identifiable information, such as your name, shipping address, email address, and telephone number.</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-black mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-green"></span> Derivative Data</h3>
                <p className="text-sm text-slate-400">Information our servers automatically collect when you access the Site, such as your IP address and browser type.</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-black mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Financial Data</h3>
                <p className="text-sm text-slate-400">Financial information related to your payment method collected when you purchase or order services.</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-black mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Device Data</h3>
                <p className="text-sm text-slate-400">Device information like hardware models and operating systems for mobile applications.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <Shield size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">3. Use of Your Information</h2>
            </div>
            <p className="mb-6">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {['Create and manage your account.', 'Process your transactions securely.', 'Send related information & receipts.', 'Fulfill purchases and orders.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                  </div>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                <Lock size={20} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">4. Disclosure of Information</h2>
            </div>
            <p>
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows: By Law or to Protect Rights, Third-Party Service Providers, Marketing Communications, Interactions with Other Users, and Online Postings.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-6">5. Contact Us</h2>
            <p className="mb-8">
              If you have questions or comments about this Privacy Policy, please contact our dedicated privacy team:
            </p>
            <div className="p-8 bg-slate-950/80 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/20 transition-colors"></div>
              <p className="font-black text-2xl text-white mb-2 relative z-10">Eventify Privacy Team</p>
              <p className="text-brand-blue font-bold mb-4 relative z-10">privacy@eventify.com</p>
              <p className="text-sm text-slate-400 relative z-10">123 Event Street, Tech City, TC 90210</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
