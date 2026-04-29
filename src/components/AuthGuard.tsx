"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { LuminaLogo } from "./ui/LuminaLogo";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth state changes (e.g., if user signs out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading || !authenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center">
          <div className="scale-150 mb-8">
            <div className="relative">
              <LuminaLogo />
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay rounded-full blur-sm animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-white/60">
            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
            Authenticating
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
