"use client";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminLogin() {
  return (
    <main className="min-h-screen flex bg-slate-950 font-sans text-white">
      {/* Left side: Admin Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-20 border-r border-slate-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px] z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] z-0"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8">
            <ShieldCheck size={36} color="white" />
          </div>
          <h1 className="text-6xl font-black mb-8 leading-[0.9] tracking-tighter">
            Eventify <br />
            <span className="text-brand-blue">Command Center</span>.
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Secure access for platform administrators. Monitor events, manage users, and configure global system settings.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 bg-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-14">
            <h2 className="text-brand-blue text-2xl font-black mb-6 tracking-tighter italic">Eventify Admin</h2>
            <h3 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none">
              System Authorization
            </h3>
            <p className="text-slate-400 font-medium text-lg">
              Enter your administrative credentials to proceed.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <AuthInput icon={<Mail size={20} />} placeholder="Admin Email" type="email" />
            <AuthInput icon={<Lock size={20} />} placeholder="Master Password" type="password" />
            
            <div className="flex justify-between items-center text-sm font-bold pt-2">
              <label className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-white transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-brand-blue focus:ring-brand-blue/20 transition-all" />
                Keep session active
              </label>
            </div>

            <Link href="/admin">
              <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white h-16 rounded-2xl font-black text-xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 mt-8">
                Authenticate <ArrowRight size={24} />
              </Button>
            </Link>
          </form>

          <p className="mt-16 text-center text-xs text-slate-500 font-medium leading-relaxed">
            Unauthorized access is strictly prohibited. <br />
            IP Address logged for security purposes.
          </p>
        </div>
      </div>
    </main>
  );
}

function AuthInput({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue transition-colors duration-300 z-10">
        {icon}
      </div>
      <Input 
        {...props} 
        className="w-full h-16 pl-14 pr-6 bg-slate-800 border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue transition-all font-bold text-white placeholder:text-slate-500 placeholder:font-medium text-lg border"
      />
    </div>
  );
}
