"use client";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  KeyRound,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "attendee" ? "attendee" : "organizer";
  const isAttendee = role === "attendee";

  // State: step 1 (email), step 2 (otp), step 3 (new password), step 4 (success)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Theme styling based on role/app branding
  const brandColor = isAttendee ? "emerald-500" : "blue-600";
  const btnClasses = isAttendee
    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25 dark:shadow-emerald-500/15"
    : "bg-brand-blue hover:bg-brand-blue/90 shadow-blue-500/25 dark:shadow-blue-500/15";
  const textClasses = isAttendee ? "text-emerald-500" : "text-brand-blue";
  const inputFocus = isAttendee
    ? "focus:ring-emerald-500/15 focus:border-emerald-500 dark:focus:ring-emerald-500/20"
    : "focus:ring-blue-500/15 focus:border-blue-500 dark:focus:ring-blue-500/20";

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send verification code.");
      }

      setSuccessMsg(data.message || "Verification code sent to your email!");
      setStep(2);
      startCooldown();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Cooldown helper for resend
  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setError("Please enter the 6-digit code received on your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired verification code.");
      }

      setSuccessMsg("Code verified! You may now set a new password.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setStep(4);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white dark:bg-slate-950 font-sans transition-colors duration-500 relative">
      {/* Left Side: Visual Experience & Imagery */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center p-12 xl:p-20">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Security & Recovery"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black uppercase tracking-widest text-slate-200 mb-6">
            <ShieldCheck size={16} className="text-emerald-400" />
            Account Security & Protection
          </div>

          <h1 className="text-6xl xl:text-7xl font-black mb-6 leading-[0.95] tracking-tighter">
            Seamless <br />
            <span className={`${textClasses} italic transition-colors duration-500`}>Recovery</span> Portal.
          </h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
            Forgot your key? No worries. Verify your identity with a secure one-time passcode and regain instant access to your events.
          </p>

          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-white">End-to-End Encrypted OTP</p>
              <p className="text-xs text-slate-400 font-medium">Codes expire after 10 minutes for your security.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="w-full max-w-md">
          {/* Header Back Link & Brand */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
            <span className={`text-lg font-black italic tracking-tighter ${textClasses}`}>
              Eventify
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter OTP Code"}
              {step === 3 && "Set New Password"}
              {step === 4 && "All Done!"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
              {step === 1 && "Enter your registered email address to receive a 6-digit verification code."}
              {step === 2 && `We've sent a 6-digit code to ${email}. Check your inbox or spam folder.`}
              {step === 3 && "Choose a strong password with at least 6 characters."}
              {step === 4 && "Your password has been updated. You can now login with your new credentials."}
            </p>
          </div>

          {/* Step Progress Indicators */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-8 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                      step === s
                        ? `bg-${brandColor} text-white shadow-md shadow-${brandColor}/30 scale-105`
                        : step > s
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  <span
                    className={`text-xs font-black hidden sm:inline ${
                      step === s
                        ? "text-slate-900 dark:text-white"
                        : step > s
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {s === 1 ? "Email" : s === 2 ? "Verify" : "Password"}
                  </span>
                  {s < 3 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800 mx-1"></div>}
                </div>
              ))}
            </div>
          )}

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && step !== 4 && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
              <CheckCircle2 size={20} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
                  <Mail size={20} />
                </div>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full h-14 pl-14 pr-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base ${inputFocus}`}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full text-white h-14 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer mt-6 ${btnClasses}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} /> Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification Code <ArrowRight size={22} />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: Enter OTP Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <label className="text-xs uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 block mb-3">
                  6-Digit Verification Code
                </label>
                <div className="relative group max-w-xs mx-auto">
                  <KeyRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500"
                    size={22}
                  />
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    required
                    className="w-full h-16 pl-12 text-center text-3xl font-mono tracking-[0.4em] font-black bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-blue-500/20 text-slate-900 dark:text-white shadow-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className={`w-full text-white h-14 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${btnClasses}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} /> Verifying Code...
                  </>
                ) : (
                  <>
                    Verify & Continue <ArrowRight size={22} />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleSendOtp}
                  className={`${
                    resendCooldown > 0
                      ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                      : "text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  } transition-colors`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
                  <Lock size={20} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={`w-full h-14 pl-14 pr-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base ${inputFocus}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
                  <Lock size={20} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full h-14 pl-14 pr-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base ${inputFocus}`}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full text-white h-14 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer mt-6 ${btnClasses}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} /> Updating Password...
                  </>
                ) : (
                  <>
                    Save New Password <CheckCircle2 size={22} />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* STEP 4: Success State */}
          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-200 dark:border-emerald-500/30 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 size={44} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                Password Reset Successfully!
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                Your account password has been safely updated. You can now use your new password to sign in.
              </p>
              <Button
                onClick={() => router.push("/auth")}
                className={`w-full text-white h-14 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 cursor-pointer ${btnClasses}`}
              >
                Sign In Now <ArrowRight size={22} />
              </Button>
            </div>
          )}

          {/* Footer Navigation */}
          {step !== 4 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-black text-brand-blue text-2xl tracking-tighter italic">
          Eventify...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
