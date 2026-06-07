"use client";
import { use } from "react";
import { ArrowLeft, Calendar, CheckCircle2, Download, MapPin, QrCode, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";

export default function SuccessPage({ params }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams?.id || '1';
  const event = MOCK_EVENTS.find(e => e.id === parseInt(eventId)) || MOCK_EVENTS[0];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">You're all set!</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
          Your payment was successful. We have automatically sent your digital ticket with the QR code to your registered <span className="font-bold text-slate-700 dark:text-slate-300">email</span> and <span className="font-bold text-slate-700 dark:text-slate-300">mobile number</span>.
        </p>
      </div>

      {/* Ticket Container */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/80 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-700 delay-150 relative z-10">
        
        {/* Ticket Details */}
        <div className="flex-1 p-8 sm:p-10 border-b md:border-b-0 md:border-r border-dashed border-slate-300 dark:border-slate-700 relative">
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full shadow-inner hidden md:block"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full shadow-inner hidden md:block"></div>
          
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full shadow-inner block md:hidden"></div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full shadow-inner block md:hidden"></div>

          <div className="mb-8">
            <span className="inline-block bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-blue-400 font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full mb-4">Event Ticket</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-2">{event.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{event.category}</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Date & Time</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{event.date} • {event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Location</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Attendee</p>
            <p className="font-black text-slate-900 dark:text-white text-lg">John Doe</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">john@example.com • +1 (555) 000-0000</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-950/50 p-8 sm:p-10 flex flex-col items-center justify-center relative">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-lg shadow-slate-200 dark:shadow-none mb-6 border border-slate-100 dark:border-slate-700">
            {/* Real QR Code */}
            <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-xl p-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Eventify-Ticket-${event.id}-JohnDoe`}
                alt="Ticket QR Code"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>
          
          <p className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Show this QR code at the registration desk upon arrival to check-in.
          </p>

          <p className="font-mono font-black text-slate-400 dark:text-slate-500 tracking-widest text-sm uppercase">#{event.title.split(' ').map(w => w[0]).join('')}{event.id}-892</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 relative z-10">
        <Button className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 h-14 px-8 rounded-2xl font-black text-sm shadow-sm flex items-center gap-2">
          <Download size={18} /> Download PDF Ticket
        </Button>
        <Link href="/events">
          <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 h-14 px-8 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center gap-2">
            Go to My Events Page <ArrowLeft size={18} className="rotate-180" />
          </Button>
        </Link>
      </div>

    </main>
  );
}
