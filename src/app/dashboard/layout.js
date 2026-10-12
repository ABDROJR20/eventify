"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function verifyOrganizerAccess() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.authenticated || !data.user) {
          // User is not logged in -> Redirect to organizer login with return URL
          if (isMounted) {
            router.replace("/auth?role=organizer&redirect=/dashboard");
          }
          return;
        }

        // Attendee account detected -> strictly block from Organizer Dashboard!
        if (data.user.role === "attendee") {
          if (isMounted) {
            setUnauthorizedMessage("Attendee accounts are not permitted in the Organizer Panel.");
            setTimeout(() => {
              router.replace("/events");
            }, 1800);
          }
          return;
        }

        // Verified as organizer or admin
        if (isMounted) {
          setAuthorized(true);
          setChecking(false);
        }
      } catch (err) {
        if (isMounted) {
          router.replace("/auth?role=organizer&redirect=/dashboard");
        }
      }
    }

    verifyOrganizerAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (unauthorizedMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Organizer Access Only
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            {unauthorizedMessage}
          </p>
          <p className="text-xs text-slate-500 animate-pulse">
            Redirecting you to Events catalog...
          </p>
        </div>
      </div>
    );
  }

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Verifying Organizer Credentials...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
