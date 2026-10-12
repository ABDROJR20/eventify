"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip verification on the admin login page
    if (pathname === "/admin/login") {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    let isMounted = true;

    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.authenticated || data.user?.role !== "admin") {
          if (isMounted) {
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          }
          return;
        }

        if (isMounted) {
          setAuthorized(true);
          setChecking(false);
        }
      } catch {
        if (isMounted) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    }

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
