"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Ticket, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Sparkles,
  QrCode,
  Check,
  Building,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

function VerifyTicketContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTicketCode = searchParams.get("ticket") || searchParams.get("code") || "";
  const [inputCode, setInputCode] = useState(urlTicketCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [checkInError, setCheckInError] = useState("");

  const performVerification = async (codeToVerify) => {
    const code = (codeToVerify !== undefined ? codeToVerify : inputCode).trim();
    if (!code) {
      setErrorMsg("Please enter the Ticket Code shown on your pass.");
      return;
    }

    setErrorMsg("");
    setCheckInError("");
    setIsVerifying(true);

    try {
      const res = await fetch(`/api/verify-ticket?code=${encodeURIComponent(code)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.valid) {
        throw new Error(data.message || "Invalid ticket code. Access denied.");
      }

      setTicketDetails(data);
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMsg(err.message || "Could not verify this ticket code.");
      setTicketDetails(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    performVerification(inputCode);
  };

  // If user lands with pre-filled code in URL from QR scan, auto-fill and auto-verify it
  useEffect(() => {
    if (urlTicketCode) {
      setInputCode(urlTicketCode);
      performVerification(urlTicketCode);
    }
  }, [urlTicketCode]);

  const handleCheckIn = async () => {
    if (!ticketDetails?.registration?.ticketCode) return;
    setIsCheckingIn(true);
    setCheckInError("");

    try {
      const res = await fetch("/api/verify-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketCode: ticketDetails.registration.ticketCode,
          action: "check-in",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCheckInError(data.message || "Check-in failed.");
      } else {
        setCheckInSuccess(true);
        setTicketDetails((prev) => ({
          ...prev,
          registration: {
            ...prev.registration,
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
            status: "Checked In",
          },
        }));
      }
    } catch (err) {
      setCheckInError("Check-in error: " + err.message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/events">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 h-9 w-9">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <Link href="/">
            <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tighter italic cursor-pointer">Eventify</h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={14} /> Official Verification Portal
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-auto">
        
        {!ticketDetails ? (
          /* Step 1: Security Passcode Gate Screen */
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in-95 duration-500 text-center">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-blue/20 text-brand-blue dark:text-blue-400">
              <Lock size={36} />
            </div>

            <Badge className="bg-brand-blue/10 text-brand-blue dark:bg-blue-950/40 dark:text-blue-400 border-none px-3.5 py-1 text-[11px] font-black uppercase tracking-wider mb-2">
              Passcode Protected
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Verify Event Pass
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed mb-6">
              Privacy aur safety ke liye, please apne ticket ka <strong className="text-brand-blue font-black">Ticket Order Code</strong> (e.g. <span className="font-mono font-black text-brand-blue">EVT-XXXXX</span>) enter karein takay aapki attendee details unlock ho sakein.
            </p>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold mb-5 flex items-center justify-center gap-2 animate-in shake">
                <XCircle size={16} className="shrink-0" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4 max-w-sm mx-auto">
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  type="text"
                  required
                  placeholder="e.g. EVT-GX6JT"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="pl-11 pr-4 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono font-black text-center text-lg uppercase tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isVerifying}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-black text-base h-14 rounded-2xl shadow-xl shadow-brand-blue/25 transition-all disabled:opacity-60"
              >
                {isVerifying ? "Verifying Pass..." : "Unlock & View Details"}
              </Button>
            </form>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-6">
              Official Event Pass Security System &bull; Powered by Eventify
            </p>
          </div>
        ) : (
          /* Step 2: Unlocked Verified Attendee & Event Details Card */
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Top Verification Status Banner */}
            {ticketDetails.canCheckIn ? (
              <div className="bg-emerald-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg leading-tight">Organizer Gate Portal</h3>
                    <p className="text-xs text-emerald-100 font-bold">
                      {ticketDetails.staffRole || (ticketDetails.organizerName ? `Organizer: ${ticketDetails.organizerName}` : "Authorized Event Staff")} &bull; Check-in Controls Enabled
                    </p>
                  </div>
                </div>
                <Badge className="bg-white text-emerald-700 border-none font-black text-xs px-3 py-1 uppercase tracking-wider">
                  {ticketDetails.staffRole || "Gate Staff"}
                </Badge>
              </div>
            ) : (
              <div className="bg-brand-blue text-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-brand-blue/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg leading-tight">Attendee Verified Pass</h3>
                    <p className="text-xs text-blue-100 font-bold">Official Digital Ticket &bull; View Only</p>
                  </div>
                </div>
                <Badge className="bg-white text-brand-blue border-none font-black text-xs px-3 py-1 uppercase tracking-wider">
                  {ticketDetails.registration.ticketType}
                </Badge>
              </div>
            )}

            {/* Ticket Pass Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              
              {/* Event Header */}
              <div className="p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-brand-blue/10 text-brand-blue dark:bg-blue-950/40 dark:text-blue-400 border-none text-[10px] font-black uppercase tracking-wider">
                    {ticketDetails.event.category}
                  </Badge>
                  <span className="font-mono font-black text-brand-blue dark:text-blue-400 text-sm">
                    {ticketDetails.registration.ticketCode}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {ticketDetails.event.title}
                </h2>
              </div>

              {/* Event Logistics */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Date & Time</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{ticketDetails.event.date}</p>
                      <p className="text-xs text-slate-500 font-medium">{ticketDetails.event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Venue Location</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{ticketDetails.event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Attendee Details Card */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendee Information</span>
                    <span className="font-mono text-xs font-bold text-slate-400">{ticketDetails.registration.id}</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center font-black text-brand-blue dark:text-blue-400 text-sm border border-brand-blue/20 shrink-0">
                      {ticketDetails.registration.customerName?.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase() || "AT"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900 dark:text-white text-base truncate">
                        {ticketDetails.registration.customerName}
                      </p>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} className="shrink-0" /> {ticketDetails.registration.customerEmail}
                      </p>
                      {ticketDetails.registration.customerPhone && (
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                          <Phone size={12} className="shrink-0" /> {ticketDetails.registration.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Access Tier</span>
                      <span className="font-black text-slate-900 dark:text-white">{ticketDetails.registration.ticketType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Fee Paid</span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400">{ticketDetails.registration.amountDisplay}</span>
                    </div>
                  </div>
                </div>

                {/* Check-In Action Section */}
                <div className="pt-2">
                  {ticketDetails.registration.checkedIn ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-2.5 font-black text-sm">
                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        <div>
                          <span>Checked In at Venue Entrance</span>
                          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium">
                            This ticket has already been used and admitted.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white dark:bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {ticketDetails.registration.checkedInAt ? new Date(ticketDetails.registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Verified"}
                      </span>
                    </div>
                  ) : ticketDetails.canCheckIn ? (
                    /* Only Valid Organizer or Admin can check in */
                    <div className="space-y-3">
                      {checkInError && (
                        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold flex items-center gap-2">
                          <XCircle size={16} className="shrink-0" /> {checkInError}
                        </div>
                      )}

                      <Button 
                        onClick={handleCheckIn}
                        disabled={isCheckingIn}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base h-14 rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <CheckCircle2 size={20} />
                        {isCheckingIn ? "Validating Check-in..." : "Check In Attendee at Venue Desk"}
                      </Button>
                      <p className="text-[11px] text-center text-slate-400 font-bold">
                        Organizer Gate Control: Marking check-in confirms entrance and prevents pass re-use.
                      </p>
                    </div>
                  ) : (
                    /* Read-Only Mode for Attendees & Non-Organizers */
                    <div className="bg-slate-100/90 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                        <ShieldCheck size={14} /> Entry Pass Status: Valid (Not Checked In)
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        Entrance check-in is restricted to the event organizer at the gate.
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                        Apna digital pass ya physical QR code entrance security / organizer ko dikhayein takay wo gate par aapka check-in verify kar sakein.
                      </p>
                      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/60">
                        <Link 
                          href={`/auth?role=organizer&redirect=/verify-ticket?ticket=${encodeURIComponent(ticketDetails.registration.ticketCode)}`}
                          className="text-xs font-black text-brand-blue dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Lock size={12} /> Are you the event organizer? Log in to enable gate check-in
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => { setTicketDetails(null); setInputCode(""); }}
                    className="w-full h-11 rounded-xl text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Verify Another Pass
                  </Button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function VerifyTicketPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-sm font-bold text-slate-500 animate-pulse">Loading Verification Portal...</div>
      </div>
    }>
      <VerifyTicketContent />
    </Suspense>
  );
}
