import { supabase } from "@/lib/supabase";

export const PACK_IDS = ["jhayr", "anthony"] as const;
export type PackId = (typeof PACK_IDS)[number];

export const PACK_META: Record<PackId, { name: string; shortName: string }> = {
  jhayr: { name: "JhayR", shortName: "JhayR" },
  anthony: { name: "Anthony", shortName: "Anthony" },
};

export function isPackId(value: string): value is PackId {
  return (PACK_IDS as readonly string[]).includes(value);
}

export type PackGrant = {
  packId: PackId;
  name: string;
  landscapeMatchId: string | null;
  verticalMatchId: string | null;
};

/** Signed-in buyer's granted overlay pairs and OBS match IDs. */
export async function listBuyerGrants(): Promise<PackGrant[]> {
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("family_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  const familyId = profile?.family_id as string | null;
  if (!familyId) return [];

  const { data: packRows, error: packError } = await supabase
    .from("family_packs")
    .select("pack_id")
    .eq("family_id", familyId);
  if (packError) throw packError;

  const packIds = (packRows ?? [])
    .map((row) => row.pack_id as string)
    .filter(isPackId);
  if (packIds.length === 0) return [];

  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("id, pack_id, orientation")
    .eq("family_id", familyId)
    .in("pack_id", packIds);
  if (matchError) throw matchError;

  return packIds.map((packId) => {
    const rows = (matches ?? []).filter((m) => m.pack_id === packId);
    return {
      packId,
      name: PACK_META[packId].name,
      landscapeMatchId:
        (rows.find((m) => m.orientation === "landscape")?.id as string | undefined) ?? null,
      verticalMatchId:
        (rows.find((m) => m.orientation === "vertical")?.id as string | undefined) ?? null,
    };
  });
}

/** Demo grants used when Supabase is not configured (local UI preview). */
export function demoGrants(): PackGrant[] {
  return PACK_IDS.map((packId) => ({
    packId,
    name: PACK_META[packId].name,
    landscapeMatchId: "demo",
    verticalMatchId: "demo",
  }));
}
