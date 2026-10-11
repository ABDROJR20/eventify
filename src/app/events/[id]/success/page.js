"use client";
import { use, useEffect, useState, useRef, Suspense } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Download, 
  MapPin, 
  Ticket, 
  Mail, 
  Phone, 
  Printer,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_EVENTS } from "@/lib/data";

function SuccessContent({ params }) {
  const unwrappedParams = use(params);
  const searchParams = useSearchParams();
  const eventId = unwrappedParams?.id || '1';
  const event = MOCK_EVENTS.find(e => e.id === parseInt(eventId)) || MOCK_EVENTS[0];

  const [ticketData, setTicketData] = useState({
    name: searchParams.get('name') || 'Registered Attendee',
    email: searchParams.get('email') || 'attendee@example.com',
    phone: searchParams.get('phone') || '',
    tier: searchParams.get('tier') || 'Standard Access',
    amount: searchParams.get('amount') || event.price || 'PKR 49.00',
    code: searchParams.get('code') || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    regId: searchParams.get('regId') || '#ORD-8921'
  });

  const [emailSent, setEmailSent] = useState(false);
  const emailSentRef = useRef(false);

  useEffect(() => {
    let resolvedName = searchParams.get('name') || '';
    let resolvedEmail = searchParams.get('email') || '';
    let resolvedPhone = searchParams.get('phone') || '';
    let resolvedTier = searchParams.get('tier') || 'Standard Access';
    let resolvedAmount = searchParams.get('amount') || event.price || 'PKR 49.00';
    let resolvedCode = searchParams.get('code') || '';
    let resolvedRegId = searchParams.get('regId') || '';

    try {
      const saved = sessionStorage.getItem("eventify_confirmed_ticket");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!resolvedName && parsed.name) resolvedName = parsed.name;
        if (!resolvedEmail && parsed.email) resolvedEmail = parsed.email;
        if (!resolvedPhone && parsed.phone) resolvedPhone = parsed.phone;
        if (!resolvedCode && parsed.ticketCode) resolvedCode = parsed.ticketCode;
        if (parsed.registration) {
          if (!resolvedRegId && parsed.registration.id) resolvedRegId = parsed.registration.id;
          if (parsed.registration.ticketType) resolvedTier = parsed.registration.ticketType;
          if (parsed.registration.amountDisplay) resolvedAmount = parsed.registration.amountDisplay;
        }
      }
    } catch (e) {
      // Ignore
    }

    async function loadFallbackUserAndSendEmail() {
      // 1. Check Stripe session if redirected from Stripe
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        try {
          const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
          const data = await res.json();
          if (data.success && data.session) {
            const meta = data.session.metadata || {};
            if (meta.ticketCode) resolvedCode = meta.ticketCode;
            if (meta.attendeeName) resolvedName = meta.attendeeName;
            if (meta.attendeeEmail) resolvedEmail = meta.attendeeEmail;
            if (meta.attendeePhone) resolvedPhone = meta.attendeePhone;
            if (meta.ticketTier) resolvedTier = meta.ticketTier;
            if (meta.registrationId) resolvedRegId = meta.registrationId;
            if (meta.amountUSD) resolvedAmount = `$${meta.amountUSD} USD (PKR ${meta.originalAmountPKR || 49})`;
            else if (meta.amount) resolvedAmount = `PKR ${Number(meta.amount).toFixed(2)}`;
          }
        } catch (err) {
          // Ignore
        }
      }

      // 2. Auth session check
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (!resolvedName) resolvedName = data.user.name;
          if (!resolvedEmail) resolvedEmail = data.user.email;
        }
      } catch (err) {
        // Not logged in
      }

      const finalName = resolvedName || 'Attendee Member';
      const finalEmail = resolvedEmail || 'attendee@eventify.com';
      const finalCode = resolvedCode || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const finalRegId = resolvedRegId || '#ORD-8921';

      setTicketData({
        name: finalName,
        email: finalEmail,
        phone: resolvedPhone,
        tier: resolvedTier,
        amount: resolvedAmount,
        code: finalCode,
        regId: finalRegId
      });

      // 3. Auto-send email to attendee Gmail with dynamic QR code
      if (finalEmail && !emailSentRef.current) {
        emailSentRef.current = true;
        try {
          const emailRes = await fetch(`/api/events/${eventId}/send-ticket`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: finalEmail,
              name: finalName,
              ticketCode: finalCode,
              ticketType: resolvedTier,
              amount: resolvedAmount,
              regId: finalRegId
            })
          });
          const emailData = await emailRes.json();
          if (emailData.success) {
            setEmailSent(true);
          }
        } catch (e) {
          console.warn("Auto ticket email error:", e);
        }
      }
    }

    loadFallbackUserAndSendEmail();
  }, [searchParams, event, eventId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Website verification landing URL for QR code scan
  const origin = typeof window !== "undefined" && window.location.origin 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || "https://eventify-tawny-one.vercel.app");

  const verifyUrl = `${origin}/verify-ticket?ticket=${encodeURIComponent(ticketData.code)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-950 dark:text-slate-50 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-x-hidden transition-colors duration-300 print:bg-white print:p-0 print:m-0">
      
      {/* Print Specific Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .ticket-print-wrapper {
            box-shadow: none !important;
            border: 2px solid #cbd5e1 !important;
            page-break-inside: avoid !important;
            margin: 0 auto !important;
            max-width: 100% !important;
            width: 100% !important;
            border-radius: 24px !important;
          }
        }
      `}</style>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 print:hidden">
        <ThemeToggle />
      </div>

      {/* Decorative Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none print:hidden" />

      {/* Hero Heading */}
      <div className="w-full max-w-3xl relative z-10 text-center mb-6 sm:mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 print:hidden">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-xl shadow-emerald-500/30 animate-in zoom-in-75 duration-500">
          <CheckCircle2 size={36} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 sm:mb-3">
          You're all set!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base lg:text-lg font-medium max-w-xl mx-auto leading-relaxed">
          Your payment was successful. We have sent your digital ticket with QR pass to{" "}
          <strong className="text-slate-900 dark:text-white font-black underline decoration-brand-blue/50 underline-offset-4">
            {ticketData.email}
          </strong>.
        </p>

        {emailSent && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
            <Check size={14} /> Confirmation email delivered to Gmail
          </div>
        )}
      </div>

      {/* Ticket Pass Container (Fixed width & no clipping) */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/80 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in-95 duration-700 delay-150 relative z-10 ticket-print-wrapper">
        
        {/* Ticket Left Section: Event & Attendee Info */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-dashed border-slate-200 dark:border-slate-800 relative">
          
          {/* Decorative Notch Circles */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full shadow-inner hidden lg:block print:hidden" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full shadow-inner hidden lg:block print:hidden" />

          {/* Badge & Event Title */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-blue-400 font-black uppercase text-[10px] sm:text-xs tracking-widest px-3 py-1 rounded-full">
                Event Pass
              </span>
              <span className="bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-black uppercase text-[10px] sm:text-xs tracking-widest px-3 py-1 rounded-full">
                {ticketData.tier}
              </span>
              <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] sm:text-xs tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck size={12} /> Confirmed
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-1">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
              {event.category} • Paid: <span className="text-indigo-600 dark:text-indigo-400 font-black">{ticketData.amount}</span>
            </p>
          </div>

          {/* Event Quick Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Calendar size={18} className="text-brand-blue" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Date & Time</p>
                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">{event.date}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Location</p>
                <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Attendee Info Card */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border border-brand-blue/20 flex items-center justify-center shrink-0">
              <span className="font-black text-brand-blue dark:text-blue-400 text-xs">
                {ticketData.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'AT'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Registered Attendee</p>
              <p className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate">{ticketData.name}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <Mail size={12} className="shrink-0" /> {ticketData.email}
              </p>
              {ticketData.phone && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                  <Phone size={12} className="shrink-0" /> {ticketData.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Right Section: Dynamic Scannable QR Code */}
        <div className="w-full lg:w-80 bg-slate-50/70 dark:bg-slate-950/70 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center shrink-0">
          
          <div className="bg-white p-3.5 sm:p-4 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200 dark:border-slate-800 mb-4 sm:mb-5 shrink-0 flex items-center justify-center">
            {/* Scannable Live Dynamic QR Code */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center bg-white rounded-2xl overflow-hidden p-1">
              <img 
                src={qrUrl}
                alt="Verified Ticket QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <p className="text-center text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed max-w-60 mb-4">
            Scan with any camera or at the registration desk upon arrival to check in.
          </p>

          <div className="w-full text-center py-2 px-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="font-mono font-black text-brand-blue dark:text-blue-400 tracking-widest text-xs sm:text-sm uppercase">
              {ticketData.code}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Order {ticketData.regId}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 relative z-10 print:hidden w-full max-w-md sm:max-w-none justify-center">
        <Button 
          onClick={handlePrint}
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 h-12 sm:h-14 px-6 sm:px-8 rounded-2xl font-black text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Printer size={18} /> Print / Save Ticket Pass
        </Button>
        <Link href="/events">
          <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 h-12 sm:h-14 px-6 sm:px-8 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 w-full sm:w-auto transition-all hover:scale-105 active:scale-95">
            Browse More Events <ArrowLeft size={18} className="rotate-180" />
          </Button>
        </Link>
      </div>

    </main>
  );
}

export default function SuccessPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-sm font-bold text-slate-500 animate-pulse">Loading Verified Ticket...</div>
      </div>
    }>
      <SuccessContent params={params} />
    </Suspense>
  );
}
