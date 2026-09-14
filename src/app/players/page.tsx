"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { listBuyerGrants } from "@/lib/packs";

/** Send the buyer to the first pack they were granted. */
export default function PlayersIndexPage() {
  const router = useRouter();
  const { ready, isSignedIn, configured } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!configured || !isSignedIn) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    listBuyerGrants()
      .then((grants) => {
        if (cancelled) return;
        if (grants[0]) router.replace(`/players/${grants[0].packId}`);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [configured, isSignedIn, ready, router]);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <p className="text-neutral-600">Opening your player list…</p>
      <Link href="/" className="mt-4 inline-block text-sm underline">
        Home
      </Link>
    </main>
  );
}
