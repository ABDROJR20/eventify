"use client";
import { useState, Suspense, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

function AuthContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'attendee' ? 'attendee' : 'organizer';
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    if (searchParams.get('role')) {
      setRole(searchParams.get('role'));
    }
  }, [searchParams]);

  const isAttendee = role === 'attendee';
  
  // Theme configuration based on role
  const theme = {
    color: isAttendee ? 'emerald-500' : 'brand-blue',
    bgClasses: isAttendee ? 'from-emerald-500/80' : 'from-brand-blue/80',
    textClasses: isAttendee ? 'text-emerald-500' : 'text-brand-blue',
    btnClasses: isAttendee ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-brand-blue hover:bg-brand-blue/90 shadow-blue-500/30',
    inputFocus: isAttendee ? 'focus:ring-emerald-500/10 focus:border-emerald-500' : 'focus:ring-brand-blue/10 focus:border-brand-blue',
    title: isAttendee ? "The Joy of" : "The Art of",
    subtitle: isAttendee ? "Experiencing" : "Curating",
    desc: isAttendee 
      ? "Discover incredible events, connect with passionate communities, and create unforgettable memories."
      : "Experience events like never before. From elite summits to underground concerts, architect your rhythm.",
    loginBtnText: isAttendee ? "Login to Events" : "Login to Dashboard",
    linkPath: isAttendee ? "/events" : "/dashboard"
  };

  return (
    <main className="min-h-screen flex bg-white font-sans transition-colors duration-500">
      {/* Left side: Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center p-12 xl:p-20">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={isAttendee ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"} 
            className="w-full h-full object-cover transition-opacity duration-500"
            alt="Crowd"
          />
          <div className={`absolute inset-0 bg-gradient-to-tr ${theme.bgClasses} to-transparent transition-colors duration-500`}></div>
        </div>
        
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-6xl xl:text-7xl font-black mb-6 leading-[0.9] tracking-tighter">
            {theme.title} <br />
            <span className={`${theme.textClasses} italic transition-colors duration-500`}>{theme.subtitle}</span> Moments.
          </h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
            {theme.desc}
          </p>
          
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-slate-950" alt="User" />
              ))}
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-100">
              Join 50k+ {isAttendee ? 'attendees' : 'curators'}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 xl:p-12 bg-slate-50/50">
        <div className="w-full max-w-md">
          {/* Role Toggle Switch */}
          <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-6">
            <button 
              onClick={() => setRole('attendee')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${isAttendee ? 'bg-white shadow-md text-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
            >
              I am an Attendee
            </button>
            <button 
              onClick={() => setRole('organizer')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${!isAttendee ? 'bg-white shadow-md text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
            >
              I am an Organizer
            </button>
          </div>

          <div className="mb-6">
            <h2 className={`${theme.textClasses} text-xl font-black mb-3 tracking-tighter italic transition-colors duration-500`}>Eventify</h2>
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter leading-none">
              {isLogin ? 'Welcome back' : 'Begin Your Journey'}
            </h3>
            <p className="text-slate-500 font-medium text-base">
              {isLogin ? `Log in to your ${role} account.` : 'Already have an account? '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className={`${theme.textClasses} font-black hover:underline transition-colors duration-500`}
              >
                {isLogin ? 'Sign up for free' : 'Sign in here.'}
              </button>
            </p>
          </div>

          <div className="mb-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-4 h-12 bg-white border border-slate-200 rounded-[1.5rem] hover:bg-slate-50 transition-all font-black text-slate-700 shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span className="text-lg tracking-tight">Google</span>
            </Button>
          </div>

          <div className="relative mb-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-slate-50 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Or continue with email</span>
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <AuthInput icon={<User size={20} />} placeholder="Full Name" type="text" focusClass={theme.inputFocus} iconClass={theme.textClasses} />
            )}
            <AuthInput icon={<Mail size={20} />} placeholder="Email Address" type="email" focusClass={theme.inputFocus} iconClass={theme.textClasses} />
            <AuthInput icon={<Lock size={20} />} placeholder="Password" type="password" focusClass={theme.inputFocus} iconClass={theme.textClasses} />
            
            {isLogin && (
              <div className="flex justify-between items-center text-sm font-bold pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-slate-500 hover:text-slate-900 transition-colors">
                  <input type="checkbox" className={`w-5 h-5 rounded-lg border-slate-300 text-${theme.color} focus:ring-${theme.color}/20 transition-all`} />
                  Remember me
                </label>
                <button type="button" className={`text-slate-400 hover:${theme.textClasses} transition-colors`}>Forgot Password?</button>
              </div>
            )}

            <Link href={theme.linkPath} className="block mt-4">
              <Button className={`w-full text-white h-12 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 ${theme.btnClasses}`}>
                {isLogin ? theme.loginBtnText : 'Create Account'} <ArrowRight size={24} />
              </Button>
            </Link>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 font-medium leading-relaxed">
            By continuing, you agree to our <br />
            <Link href="/terms" className={`font-black text-slate-600 cursor-pointer hover:${theme.textClasses} transition-colors`}>Terms of Service</Link> and <Link href="/privacy" className={`font-black text-slate-600 cursor-pointer hover:${theme.textClasses} transition-colors`}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

function AuthInput({ icon, focusClass, iconClass, ...props }) {
  return (
    <div className="relative group">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:${iconClass} transition-colors duration-300 z-10`}>
        {icon}
      </div>
      <Input 
        {...props} 
        className={`w-full h-12 pl-14 pr-6 bg-white border-slate-200 rounded-2xl outline-none focus:ring-4 transition-all font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium text-base border-none ${focusClass}`}
      />
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-brand-blue text-2xl tracking-tighter italic">Eventify...</div>}>
      <AuthContent />
    </Suspense>
  );
}
