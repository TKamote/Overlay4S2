"use client";

import { useCallback, useEffect, useState } from "react";
import type { Logo } from "@/components/LogoSelectionModal";
import { listLogos, setMatchLogo, type LogoRow } from "@/lib/logos";
import { getFamilyId } from "@/lib/players";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

function toLogo(row: LogoRow): Logo {
  return { id: row.id, name: row.name, logoURL: row.logo_url };
}

/** Left/right logo slots for one match + family logo library. */
export function useOverlayLogos(matchId: string) {
  const { ready, isSignedIn, configured } = useAuth();
  const [logo1URL, setLogo1URL] = useState("");
  const [logo2URL, setLogo2URL] = useState("");
  const [logos, setLogos] = useState<Logo[]>([]);
  const [showLogo1Modal, setShowLogo1Modal] = useState(false);
  const [showLogo2Modal, setShowLogo2Modal] = useState(false);

  const refreshLibrary = useCallback(async () => {
    if (!configured || !supabase) return;
    const familyId = await getFamilyId();
    if (!familyId) {
      setLogos([]);
      return;
    }
    try {
      const rows = await listLogos(familyId);
      setLogos(rows.map(toLogo));
    } catch (err) {
      console.error("Failed to load logos", err);
    }
  }, [configured]);

  useEffect(() => {
    if (!supabase || !ready) return;
    const client = supabase;
    let cancelled = false;

    const load = async () => {
      const { data: match } = await client
        .from("matches")
        .select("logo1_url, logo2_url")
        .eq("id", matchId)
        .maybeSingle();
      if (cancelled || !match) return;
      setLogo1URL(match.logo1_url ? String(match.logo1_url) : "");
      setLogo2URL(match.logo2_url ? String(match.logo2_url) : "");
    };

    void load();
    void refreshLibrary();

    const channel = client
      .channel(`logos:${matchId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches", filter: `id=eq.${matchId}` },
        (payload) => {
          const row = payload.new as { logo1_url?: string | null; logo2_url?: string | null };
          if (!row) return;
          setLogo1URL(row.logo1_url ? String(row.logo1_url) : "");
          setLogo2URL(row.logo2_url ? String(row.logo2_url) : "");
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "logos" },
        () => {
          void refreshLibrary();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void client.removeChannel(channel);
    };
  }, [matchId, ready, refreshLibrary]);

  const handleSelectLogo = useCallback(
    (slot: 1 | 2, logo: Logo) => {
      const url = logo.logoURL || "";
      if (slot === 1) setLogo1URL(url);
      else setLogo2URL(url);
      if (!isSignedIn) return;
      void setMatchLogo(matchId, slot, url).catch(console.error);
    },
    [isSignedIn, matchId]
  );

  const handleClearLogo = useCallback(
    (slot: 1 | 2) => {
      if (slot === 1) setLogo1URL("");
      else setLogo2URL("");
      if (!isSignedIn) return;
      void setMatchLogo(matchId, slot, "").catch(console.error);
    },
    [isSignedIn, matchId]
  );

  return {
    logo1URL,
    logo2URL,
    logos,
    showLogo1Modal,
    showLogo2Modal,
    setShowLogo1Modal,
    setShowLogo2Modal,
    handleSelectLogo,
    handleClearLogo,
    refreshLibrary,
  };
}
