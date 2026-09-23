"use client";
import { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepActive, setKeepActive] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter administrative email and master password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Administrative authorization failed");
      }

      router.push("/admin");
    } catch (err) {
      setError(err.message || "Failed to authorize");
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/" className="text-brand-blue text-2xl font-black mb-6 tracking-tighter italic block hover:underline">
              Eventify Admin
            </Link>
            <h3 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none">
              System Authorization
            </h3>
            <p className="text-slate-400 font-medium text-lg">
              Enter your administrative credentials to proceed.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AuthInput
              icon={<Mail size={20} />}
              placeholder="Admin Email (e.g. admin@eventify.com)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInput
              icon={<Lock size={20} />}
              placeholder="Master Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-between items-center text-sm font-bold pt-2">
              <label className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={keepActive}
                  onChange={(e) => setKeepActive(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-brand-blue focus:ring-brand-blue/20 transition-all cursor-pointer"
                />
                Keep session active
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white h-16 rounded-2xl font-black text-xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 mt-8 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={24} /> Authorizing...
                </>
              ) : (
                <>
                  Authenticate <ArrowRight size={24} />
                </>
              )}
            </Button>
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
