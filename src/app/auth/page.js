"use client";
import { useState, Suspense, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, AlertCircle, RefreshCw, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole = searchParams.get("role") === "attendee" ? "attendee" : "organizer";

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(initialRole);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Loading & feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Google Authentication via official Google popup
  const [googleLoading, setGoogleLoading] = useState(false);

  // Load Google Identity Services Script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("role")) {
      setRole(searchParams.get("role"));
    }
  }, [searchParams]);

  const isAttendee = role === "attendee";

  // Theme configuration based on role
  const theme = {
    color: isAttendee ? "emerald-500" : "brand-blue",
    bgClasses: isAttendee ? "from-emerald-500/80" : "from-brand-blue/80",
    textClasses: isAttendee ? "text-emerald-500" : "text-brand-blue",
    btnClasses: isAttendee
      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
      : "bg-brand-blue hover:bg-brand-blue/90 shadow-blue-500/30",
    inputFocus: isAttendee
      ? "focus:ring-emerald-500/10 focus:border-emerald-500"
      : "focus:ring-brand-blue/10 focus:border-brand-blue",
    title: isAttendee ? "The Joy of" : "The Art of",
    subtitle: isAttendee ? "Experiencing" : "Curating",
    desc: isAttendee
      ? "Discover incredible events, connect with passionate communities, and create unforgettable memories."
      : "Experience events like never before. From elite summits to underground concerts, architect your rhythm.",
    loginBtnText: isAttendee ? "Login to Events" : "Login to Dashboard",
    linkPath: isAttendee ? "/events" : "/dashboard",
  };

  // Submit Credentials (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email, password, role }
        : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication failed. Please check your credentials.");
      }

      setSuccess(isLogin ? "Login successful! Redirecting..." : "Account created! Redirecting...");
      setTimeout(() => {
        router.push(theme.linkPath);
      }, 700);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Google Official OAuth Popup
  const handleGoogleSignIn = () => {
    setError("");
    setSuccess("");

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError("Google Client ID not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file.");
      return;
    }

    if (typeof window === "undefined" || !window.google?.accounts?.oauth2) {
      setError("Google authentication service is initializing. Please try again in a few seconds.");
      return;
    }

    setGoogleLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setError(tokenResponse.error_description || "Google sign-in was cancelled.");
            setGoogleLoading(false);
            return;
          }

          try {
            // Fetch profile directly from Google's official userinfo endpoint
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoRes.ok) {
              throw new Error("Unable to fetch user details from Google.");
            }

            const profile = await userInfoRes.json();

            // Establish session with Eventify backend
            const authRes = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                role,
              }),
            });

            const data = await authRes.json();

            if (!authRes.ok || !data.success) {
              throw new Error(data.message || "Google authentication failed on server.");
            }

            setSuccess("Successfully authenticated with Google! Redirecting...");
            setTimeout(() => {
              router.push(theme.linkPath);
            }, 700);
          } catch (err) {
            setError(err.message || "Google authentication failed.");
          } finally {
            setGoogleLoading(false);
          }
        },
        error_callback: (err) => {
          setGoogleLoading(false);
          setError("Failed to open Google login popup. Please check your popup blocker.");
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      setGoogleLoading(false);
      setError(err.message || "Failed to launch Google authentication popup.");
    }
  };

  return (
    <main className="min-h-screen flex bg-white dark:bg-slate-950 font-sans transition-colors duration-500 relative">
      {/* Left side: Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center p-12 xl:p-20">
        <div className="absolute inset-0 opacity-40">
          <img
            src={
              isAttendee
                ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
            }
            className="w-full h-full object-cover transition-opacity duration-500"
            alt="Crowd"
          />
          <div className={`absolute inset-0 bg-linear-to-tr ${theme.bgClasses} to-transparent transition-colors duration-500`}></div>
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
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-slate-950" alt="User" />
              ))}
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-100">
              Join 50k+ {isAttendee ? "attendees" : "curators"}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 xl:p-12 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="w-full max-w-md">
          {/* Role Toggle Switch */}
          <div className="flex bg-slate-200/50 dark:bg-slate-800/80 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole("attendee")}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all cursor-pointer ${
                isAttendee ? "bg-white dark:bg-slate-900 shadow-md text-emerald-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              I am an Attendee
            </button>
            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all cursor-pointer ${
                !isAttendee ? "bg-white dark:bg-slate-900 shadow-md text-brand-blue" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              I am an Organizer
            </button>
          </div>

          <div className="mb-6">
            <h2 className={`${theme.textClasses} text-xl font-black mb-3 tracking-tighter italic transition-colors duration-500`}>
              Eventify
            </h2>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter leading-none">
              {isLogin ? "Welcome back" : "Begin Your Journey"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base">
              {isLogin ? `Log in to your ${role} account.` : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                className={`${theme.textClasses} font-black hover:underline transition-colors duration-500 cursor-pointer`}
              >
                {isLogin ? "Sign up for free" : "Sign in here."}
              </button>
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
              <RefreshCw className="animate-spin shrink-0" size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-4 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all font-black text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer disabled:opacity-70"
            >
              {googleLoading ? (
                <>
                  <RefreshCw className="animate-spin text-slate-600 dark:text-slate-300" size={20} />
                  <span className="text-lg tracking-tight">Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  <span className="text-lg tracking-tight">Continue with Google</span>
                </>
              )}
            </Button>
          </div>

          <div className="relative mb-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <span className="relative bg-slate-50 dark:bg-slate-900/60 px-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Or continue with email
            </span>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {!isLogin && (
              <AuthInput
                icon={<User size={20} />}
                placeholder="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                focusClass={theme.inputFocus}
                iconClass={theme.textClasses}
              />
            )}
            <AuthInput
              icon={<Mail size={20} />}
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              focusClass={theme.inputFocus}
              iconClass={theme.textClasses}
            />
            <AuthInput
              icon={<Lock size={20} />}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              focusClass={theme.inputFocus}
              iconClass={theme.textClasses}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {isLogin && (
              <div className="flex justify-between items-center text-sm font-bold pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                  />
                  Remember me
                </label>
                <Link
                  href="/auth/forgot-password"
                  className={`text-slate-400 hover:${theme.textClasses} transition-colors`}
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full text-white h-12 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer mt-4 ${theme.btnClasses}`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={22} /> Processing...
                </>
              ) : (
                <>
                  {isLogin ? theme.loginBtnText : "Create Account"} <ArrowRight size={24} />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 font-medium leading-relaxed">
            By continuing, you agree to our <br />
            <Link href="/terms" className={`font-black text-slate-600 dark:text-slate-400 cursor-pointer hover:${theme.textClasses} transition-colors`}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={`font-black text-slate-600 dark:text-slate-400 cursor-pointer hover:${theme.textClasses} transition-colors`}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function AuthInput({ icon, focusClass, iconClass, rightElement, ...props }) {
  return (
    <div className="relative group">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:${iconClass} transition-colors duration-300 z-10`}>
        {icon}
      </div>
      <Input
        {...props}
        className={`w-full h-12 pl-14 ${rightElement ? "pr-12" : "pr-6"} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base border-none ${focusClass}`}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-brand-blue text-2xl tracking-tighter italic">
          Eventify...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
