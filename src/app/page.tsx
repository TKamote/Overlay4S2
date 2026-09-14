"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { demoGrants, listBuyerGrants, type PackGrant } from "@/lib/packs";

export default function Home() {
  const router = useRouter();
  const { configured, isSignedIn, user, ready } = useAuth();
  const [grants, setGrants] = useState<PackGrant[]>([]);
  const [grantsError, setGrantsError] = useState<string | null>(null);
  const [grantsReady, setGrantsReady] = useState(!configured);

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  useEffect(() => {
    if (!configured) {
      setGrants(demoGrants());
      setGrantsReady(true);
      return;
    }
    if (!ready) return;
    if (!isSignedIn) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    setGrantsReady(false);
    listBuyerGrants()
      .then((rows) => {
        if (!cancelled) {
          setGrants(rows);
          setGrantsError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setGrants([]);
          setGrantsError(err instanceof Error ? err.message : "Failed to load overlays");
        }
      })
      .finally(() => {
        if (!cancelled) setGrantsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [configured, isSignedIn, ready, router]);

  if (configured && ready && !isSignedIn) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center p-8 text-neutral-600">
        Redirecting to sign in…
      </main>
    );
  }

  const hubTitle =
    !configured
      ? "Overlay4S2"
      : grants.length === 1
        ? grants[0].name
        : "Overlay4S2";

  const showPicker = configured && isSignedIn && grants.length > 1;
  const visibleGrants = !configured
    ? grants
    : showPicker
      ? grants
      : grants.length === 1
        ? grants
        : [];

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-lg flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{hubTitle}</h1>
        {showPicker && (
          <p className="mt-2 text-sm text-neutral-600">Choose an overlay pair</p>
        )}
        {!configured && (
          <p className="mt-2 text-sm text-neutral-500">Local demo — both pairs</p>
        )}
      </div>

      <nav className="flex w-full flex-col gap-6">
        {configured && isSignedIn && grantsReady && grants.length === 0 && !grantsError && (
          <p className="text-center text-sm text-neutral-600">
            Your login is not linked to an overlay pack yet. Ask the admin to run{" "}
            <code>provision_buyer</code> and <code>link_buyer_email</code>.
          </p>
        )}
        {grantsError && (
          <p className="text-center text-sm text-red-600">{grantsError}</p>
        )}
        {(!configured || (isSignedIn && grantsReady)) &&
          visibleGrants.map((grant) => (
            <PackLinks
              key={grant.packId}
              grant={grant}
              showManage={Boolean(configured && isSignedIn)}
              showHeading={showPicker || !configured}
            />
          ))}
      </nav>

      {configured && isSignedIn && (
        <div className="w-full text-center text-sm text-neutral-600">
          {!ready || !grantsReady ? (
            <p>Checking session…</p>
          ) : (
            <p>
              Signed in as {user?.email || "buyer"}.{" "}
              <button type="button" onClick={signOut} className="underline">
                Sign out
              </button>
            </p>
          )}
        </div>
      )}

      {!configured && (
        <p className="text-center text-sm text-neutral-500">
          Add <code>.env.local</code> with your Supabase URL and anon key for live data.
        </p>
      )}
    </main>
  );
}

function PackLinks({
  grant,
  showManage,
  showHeading,
}: {
  grant: PackGrant;
  showManage: boolean;
  showHeading: boolean;
}) {
  const land = grant.landscapeMatchId;
  const vert = grant.verticalMatchId;
  return (
    <section className="flex flex-col gap-3">
      {showHeading && (
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {grant.name}
        </h2>
      )}
      {showManage && (
        <Link
          href={`/players/${grant.packId}`}
          className="rounded-lg border border-neutral-300 px-6 py-4 text-center font-semibold hover:bg-neutral-50"
        >
          Manage players
        </Link>
      )}
      {land ? (
        <Link
          href={`/overlay/${grant.packId}/${land}`}
          className="rounded-lg bg-neutral-900 px-6 py-4 text-center font-semibold text-white hover:bg-neutral-800"
        >
          Landscape overlay
        </Link>
      ) : (
        <p className="text-center text-sm text-neutral-500">No landscape match yet.</p>
      )}
      {vert ? (
        <Link
          href={`/overlay-vertical/${grant.packId}/${vert}`}
          className="rounded-lg border border-neutral-300 px-6 py-4 text-center font-semibold hover:bg-neutral-50"
        >
          Vertical overlay (1080×1920)
        </Link>
      ) : (
        <p className="text-center text-sm text-neutral-500">No vertical match yet.</p>
      )}
    </section>
  );
}
