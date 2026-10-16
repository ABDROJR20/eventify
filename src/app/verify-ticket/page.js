"use client";
import { useState, useEffect, useRef, Suspense } from "react";
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
  QrCode,
  Camera,
  CameraOff,
  RefreshCw,
  UploadCloud,
  Check,
  AlertTriangle,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

function playBeep(isSuccess = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isSuccess) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(160, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
}

function extractTicketCode(raw) {
  if (!raw) return "";
  const trimmed = String(raw).trim();

  // 1. If QR contains full URL (e.g. https://.../verify-ticket?ticket=EVT-XXXXX)
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const parsed = new URL(trimmed);
      const codeFromUrl = parsed.searchParams.get("ticket") || parsed.searchParams.get("code");
      if (codeFromUrl) return codeFromUrl.toUpperCase();
    }
  } catch (e) {}

  // 2. If it contains Eventify ticket format EVT-XXXXX
  const evtMatch = trimmed.match(/EVT-[A-Z0-9]+/i);
  if (evtMatch) return evtMatch[0].toUpperCase();

  // 3. Fallback to clean upper string
  return trimmed.toUpperCase();
}

function VerifyTicketContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTicketCode = searchParams.get("ticket") || searchParams.get("code") || "";
  const [activeTab, setActiveTab] = useState("scan"); // "scan" | "manual"
  const [inputCode, setInputCode] = useState(urlTicketCode);

  // Verification & Check-In States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [checkInError, setCheckInError] = useState("");

  // Current Logged-in Staff/User State
  const [currentUser, setCurrentUser] = useState(null);

  // Scanner States
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerScriptLoaded, setScannerScriptLoaded] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const html5QrCodeRef = useRef(null);

  // Fetch current user session to determine staff role
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamically load html5-qrcode library from CDN
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Html5Qrcode) {
        setScannerScriptLoaded(true);
      } else {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
        script.async = true;
        script.onload = () => {
          setScannerScriptLoaded(true);
        };
        script.onerror = () => {
          setScannerError("Camera QR scanner library failed to load. Please use manual code entry.");
        };
        document.body.appendChild(script);
      }
    }
  }, []);

  // Core Ticket Verification Function
  const performVerification = async (codeToVerify) => {
    const raw = (codeToVerify !== undefined ? codeToVerify : inputCode).trim();
    const cleanCode = extractTicketCode(raw);

    if (!cleanCode) {
      setErrorMsg("Please enter or scan a valid Ticket Code.");
      return;
    }

    setErrorMsg("");
    setCheckInError("");
    setCheckInSuccess(false);
    setIsVerifying(true);

    try {
      const res = await fetch(`/api/verify-ticket?code=${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.valid) {
        playBeep(false);
        throw new Error(data.message || `Invalid ticket code (${cleanCode}). Access denied.`);
      }

      playBeep(true);
      if (navigator.vibrate) navigator.vibrate(100);
      setTicketDetails(data);
      setInputCode(cleanCode);

      // Stop scanner when ticket is found
      stopScanner();
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMsg(err.message || "Could not verify this ticket code.");
      setTicketDetails(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = (e) => {
    if (e) e.preventDefault();
    performVerification(inputCode);
  };

  // If page loads with pre-filled ticket in URL, verify automatically
  useEffect(() => {
    if (urlTicketCode) {
      setInputCode(urlTicketCode);
      setActiveTab("manual");
      performVerification(urlTicketCode);
    }
  }, [urlTicketCode]);

  // Start Live Camera QR Scanner
  const startScanner = async () => {
    setScannerError("");

    if (!window.Html5Qrcode) {
      setScannerError("Initializing camera engine... Please wait 2 seconds and try again.");
      return;
    }

    try {
      const readerElement = document.getElementById("qr-reader");
      if (!readerElement) return;

      // Stop any existing instance
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {}
      }

      const qrScanner = new window.Html5Qrcode("qr-reader");
      html5QrCodeRef.current = qrScanner;

      // Discover cameras
      const devices = await window.Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        const backCamera = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
        const chosenId = backCamera ? backCamera.id : devices[0].id;
        setSelectedCameraId(chosenId);

        const config = {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await qrScanner.start(
          chosenId,
          config,
          (decodedText) => {
            // Success QR Code Detected!
            const extracted = extractTicketCode(decodedText);
            if (extracted) {
              performVerification(extracted);
            }
          },
          () => {
            // Scanning in progress (silent)
          }
        );

        setScannerActive(true);
      } else {
        setScannerError("No camera found on this device. Please use manual ticket code entry.");
      }
    } catch (err) {
      console.error("Scanner start error:", err);
      setScannerError(err.message || "Unable to access device camera. Please grant camera permissions in your browser.");
      setScannerActive(false);
    }
  };

  // Stop Camera Scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current && scannerActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (e) {}
    }
    setScannerActive(false);
  };

  // Switch between front/back cameras
  const handleSwitchCamera = async (cameraId) => {
    setSelectedCameraId(cameraId);
    if (html5QrCodeRef.current && scannerActive) {
      try {
        await html5QrCodeRef.current.stop();
        const config = { fps: 15, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
        await html5QrCodeRef.current.start(
          cameraId,
          config,
          (decodedText) => {
            const extracted = extractTicketCode(decodedText);
            if (extracted) performVerification(extracted);
          },
          () => {}
        );
      } catch (err) {
        console.error("Camera switch error:", err);
      }
    }
  };

  // Handle image file upload for QR decode fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !window.Html5Qrcode) return;

    try {
      setIsVerifying(true);
      setErrorMsg("");
      const qrScanner = new window.Html5Qrcode("qr-file-reader");
      const decodedText = await qrScanner.scanFile(file, true);
      const extracted = extractTicketCode(decodedText);
      if (extracted) {
        performVerification(extracted);
      } else {
        throw new Error("No recognizable Eventify QR code found in this image.");
      }
    } catch (err) {
      setErrorMsg("Failed to read QR image. Please try a clearer picture or enter the code manually.");
      setIsVerifying(false);
    }
  };

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Handle Venue Check-in
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
        playBeep(false);
        setCheckInError(data.message || "Check-in failed.");
      } else {
        playBeep(true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
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
      playBeep(false);
      setCheckInError("Check-in error: " + err.message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Reset to verify next pass in line
  const handleVerifyAnother = () => {
    setTicketDetails(null);
    setInputCode("");
    setErrorMsg("");
    setCheckInError("");
    setCheckInSuccess(false);
    if (activeTab === "scan") {
      setTimeout(() => {
        startScanner();
      }, 200);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Hidden container for file-based QR decoding */}
      <div id="qr-file-reader" style={{ display: "none" }}></div>

      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 flex justify-between items-center shadow-sm sticky top-0 z-50">
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

        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-xs">
                {currentUser.name || currentUser.email} ({currentUser.role === "admin" ? "Admin" : "Authorized Gate Staff"})
              </span>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <Lock size={12} /> Staff Log In
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-auto">
        
        {!ticketDetails ? (
          /* STEP 1: SCANNER & CODE INPUT SCREEN */
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in-95 duration-500 text-center">
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue dark:bg-blue-950/40 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
                <ShieldCheck size={14} /> Gate Scanner Desk
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Verify & Check In Passes
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed mb-6">
              Scan the attendee's digital/printed QR code directly or enter their unique ticket code manually to admit them at the venue gate.
            </p>

            {/* TAB SWITCHER */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-6 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("scan");
                  setErrorMsg("");
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === "scan"
                    ? "bg-white dark:bg-slate-900 text-brand-blue shadow-md"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Camera size={16} /> Scan QR Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("manual");
                  stopScanner();
                  setErrorMsg("");
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === "manual"
                    ? "bg-white dark:bg-slate-900 text-brand-blue shadow-md"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <KeyRound size={16} /> Enter Code Manually
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold mb-5 flex items-center justify-center gap-2 animate-in shake">
                <XCircle size={16} className="shrink-0" /> {errorMsg}
              </div>
            )}

            {/* TAB 1: CAMERA QR SCANNER */}
            {activeTab === "scan" && (
              <div className="space-y-4">
                
                {/* Camera Viewfinder Box */}
                <div className="relative mx-auto max-w-sm w-full aspect-square bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center">
                  
                  {/* html5-qrcode video container */}
                  <div id="qr-reader" className="w-full h-full flex items-center justify-center"></div>

                  {/* Laser Scanning Animation Beam (only while active) */}
                  {scannerActive && (
                    <>
                      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-brand-blue shadow-[0_0_15px_#2563eb] animate-pulse pointer-events-none z-10"></div>
                      <div className="absolute inset-8 border-2 border-dashed border-brand-blue/50 rounded-2xl pointer-events-none z-10 flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-300/80 bg-slate-950/80 px-2.5 py-1 rounded-full">
                          Align QR Code Here
                        </span>
                      </div>
                    </>
                  )}

                  {/* Idle / Inactive Overlay */}
                  {!scannerActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 z-20">
                      <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 text-brand-blue flex items-center justify-center mb-3">
                        <QrCode size={32} />
                      </div>
                      <p className="text-sm font-black text-white mb-1">
                        Camera Scanner Ready
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mb-4">
                        Click below to open the camera and scan the attendee's QR code.
                      </p>
                      <Button
                        type="button"
                        onClick={startScanner}
                        disabled={isVerifying}
                        className="bg-brand-blue hover:bg-blue-600 text-white font-black text-sm h-11 px-6 rounded-xl shadow-lg cursor-pointer"
                      >
                        <Camera size={16} className="mr-2" /> Start Camera Scanner
                      </Button>
                    </div>
                  )}
                </div>

                {/* Scanner Controls (when active) */}
                {scannerActive && (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={stopScanner}
                      className="rounded-xl font-bold text-xs border-slate-200 dark:border-slate-800"
                    >
                      <CameraOff size={14} className="mr-1.5" /> Stop Camera
                    </Button>

                    {cameras.length > 1 && (
                      <select
                        value={selectedCameraId}
                        onChange={(e) => handleSwitchCamera(e.target.value)}
                        className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                      >
                        {cameras.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label || `Camera ${c.id.substring(0, 5)}`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Scanner Error */}
                {scannerError && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-medium">
                    {scannerError}
                  </div>
                )}

                {/* Fallback Photo Upload Option */}
                <div className="pt-2 text-center">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-blue cursor-pointer transition-colors">
                    <UploadCloud size={14} />
                    <span>Or select QR code image from gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>
            )}

            {/* TAB 2: MANUAL TICKET CODE INPUT */}
            {activeTab === "manual" && (
              <form onSubmit={handleManualVerify} className="space-y-4 max-w-sm mx-auto">
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
                  className="w-full bg-brand-blue hover:bg-blue-600 text-white font-black text-base h-14 rounded-2xl shadow-xl shadow-brand-blue/25 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={18} /> Verifying Pass...
                    </>
                  ) : (
                    "Verify & Unlock Pass"
                  )}
                </Button>
              </form>
            )}

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-6">
              Official Event Pass Security System &bull; Powered by Eventify
            </p>
          </div>
        ) : (
          /* STEP 2: VERIFIED ATTENDEE & CHECK-IN ACTION CARD */
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500">
            
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
                      {ticketDetails.staffRole || (ticketDetails.organizerName ? `Organizer: ${ticketDetails.organizerName}` : "Authorized Event Staff")} &bull; Check-in Controls Active
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
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Fee Status</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {ticketDetails.registration.amountDisplay} (Paid)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Check-In Action Section */}
                <div className="pt-2">
                  {ticketDetails.registration.checkedIn ? (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-800 dark:text-rose-300">
                      <div className="flex items-center gap-2.5 font-black text-sm">
                        <AlertTriangle size={22} className="text-rose-600 shrink-0" />
                        <div>
                          <span>Already Checked In at Venue Entrance</span>
                          <p className="text-[11px] text-rose-700/80 dark:text-rose-400 font-medium">
                            This pass has already been used and admitted. Duplicate entry warning!
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white dark:bg-rose-900/60 px-3 py-1 rounded-xl border border-rose-200 dark:border-rose-800 shrink-0">
                        {ticketDetails.registration.checkedInAt ? new Date(ticketDetails.registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Admitted"}
                      </span>
                    </div>
                  ) : ticketDetails.canCheckIn ? (
                    /* Only Valid Organizer or Assigned Gate Staff can check in */
                    <div className="space-y-3">
                      {checkInError && (
                        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold flex items-center gap-2">
                          <XCircle size={16} className="shrink-0" /> {checkInError}
                        </div>
                      )}

                      {checkInSuccess && (
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm font-black flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          <span>Attendee Admitted & Check-In Confirmed!</span>
                        </div>
                      )}

                      {!checkInSuccess && (
                        <Button 
                          onClick={handleCheckIn}
                          disabled={isCheckingIn}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base h-14 rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                          <CheckCircle2 size={20} />
                          {isCheckingIn ? "Validating Check-in..." : "Admit & Check In Attendee"}
                        </Button>
                      )}
                    </div>
                  ) : (
                    /* Read-Only Mode for Attendees & Non-Staff */
                    <div className="bg-slate-100/90 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                        <ShieldCheck size={14} /> Entry Pass Status: Valid (Not Checked In)
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        Entrance check-in is restricted to the event organizer or assigned gate staff.
                      </p>
                      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/60">
                        <Link 
                          href={`/auth?role=organizer&redirect=/verify-ticket?ticket=${encodeURIComponent(ticketDetails.registration.ticketCode)}`}
                          className="text-xs font-black text-brand-blue dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Lock size={12} /> Assigned Staff? Log in here to enable gate check-in
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset Button to verify next attendee in line */}
                <div className="pt-2">
                  <Button 
                    variant="outline"
                    onClick={handleVerifyAnother}
                    className="w-full h-12 rounded-xl text-sm font-black border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Scan Next Pass / Verify Another Attendee →
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
        <div className="text-sm font-bold text-slate-500 animate-pulse">Loading Verification Desk...</div>
      </div>
    }>
      <VerifyTicketContent />
    </Suspense>
  );
}
