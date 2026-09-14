"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured || !supabase) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-4 p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-neutral-600">
          Supabase is not configured. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code> and add the project URL and anon key.
        </p>
        <Link href="/" className="text-sm underline">
          Back home
        </Link>
      </main>
    );
  }

  const signInWithGitHub = async () => {
    if (!supabase) return;
    setError(null);
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  };

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setInfo("Check your email to confirm, or sign in if confirmation is off.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Buyer sign in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          OBS stays read-only. Sign in here, then open an overlay in this browser to
          control scores.
        </p>
      </div>

      <button
        type="button"
        onClick={signInWithGitHub}
        className="rounded-lg bg-neutral-900 px-4 py-3 font-semibold text-white hover:bg-neutral-800"
      >
        Continue with GitHub
      </button>

      <div className="text-center text-sm text-neutral-400">or email</div>

      <form onSubmit={submitEmail} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg border border-neutral-900 px-4 py-3 font-semibold disabled:opacity-50"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        className="text-sm text-neutral-500 underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>

      <Link href="/" className="text-sm underline">
        Back home
      </Link>
    </main>
  );
}
