"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { configured, isSignedIn, user, ready } = useAuth();

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-lg flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Overlay4S2 (JhayR)</h1>
      </div>
      <nav className="flex w-full flex-col gap-3">
        {isSignedIn && (
          <Link
            href="/players"
            className="rounded-lg border border-neutral-300 px-6 py-4 text-center font-semibold hover:bg-neutral-50"
          >
            Manage players
          </Link>
        )}
        <Link
          href="/overlay"
          className="rounded-lg bg-neutral-900 px-6 py-4 text-center font-semibold text-white hover:bg-neutral-800"
        >
          Landscape overlay
        </Link>
        <Link
          href="/overlay-vertical"
          className="rounded-lg border border-neutral-300 px-6 py-4 text-center font-semibold hover:bg-neutral-50"
        >
          Vertical overlay (1080×1920)
        </Link>
      </nav>
      {configured ? (
        <div className="w-full text-center text-sm text-neutral-600">
          {!ready ? (
            <p>Checking session…</p>
          ) : isSignedIn ? (
            <p>
              Signed in as {user?.email || user?.user_metadata?.user_name || "buyer"}. OBS
              stays read-only.{" "}
              <button type="button" onClick={signOut} className="underline">
                Sign out
              </button>
            </p>
          ) : (
            <p>
              <Link href="/login" className="font-semibold underline">
                Sign in
              </Link>{" "}
              to control scores. OBS browser sources stay public and read-only.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-neutral-500">
          Scores are local until <code>.env.local</code> has your Supabase URL and anon
          key.
        </p>
      )}
    </main>
  );
}
