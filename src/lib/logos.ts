import { supabase } from "@/lib/supabase";
import { getFamilyId } from "@/lib/players";

const BUCKET = "overlay-logos";

export type LogoRow = {
  id: string;
  family_id: string;
  name: string;
  logo_url: string;
  created_at?: string;
};

export async function listLogos(familyId: string): Promise<LogoRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("logos")
    .select("id, family_id, name, logo_url, created_at")
    .eq("family_id", familyId)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data as LogoRow[]) ?? [];
}

export async function uploadOverlayLogo(file: File, name: string): Promise<LogoRow> {
  if (!supabase) throw new Error("Supabase not configured");
  const familyId = await getFamilyId();
  if (!familyId) throw new Error("No family linked to your account");

  const ext = file.name.split(".").pop() || "png";
  const path = `${familyId}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const logoUrl = pub.publicUrl;

  const { data, error } = await supabase
    .from("logos")
    .insert({
      family_id: familyId,
      name: name.trim() || file.name,
      logo_url: logoUrl,
    })
    .select("id, family_id, name, logo_url, created_at")
    .single();

  if (error) throw error;
  return data as LogoRow;
}

export async function deleteLogo(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("logos").delete().eq("id", id);
  if (error) throw error;
}

export async function setMatchLogo(
  matchId: string,
  slot: 1 | 2,
  logoUrl: string
): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const patch = slot === 1 ? { logo1_url: logoUrl } : { logo2_url: logoUrl };
  const { error } = await supabase
    .from("matches")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", matchId);
  if (error) throw error;
}
