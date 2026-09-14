"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/** Completes GitHub (or other OAuth) PKCE redirect. */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setMessage("Supabase is not configured.");
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          return;
        }
      }
      router.replace("/");
    };
    void run();
  }, [router]);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center p-8 text-neutral-600">
      {message}
    </main>
  );
}
