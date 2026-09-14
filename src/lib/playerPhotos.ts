import { supabase } from "@/lib/supabase";

const BUCKET = "player-photos";

/** Upload a player photo and return its public CDN URL for OBS. */
export async function uploadPlayerPhoto(playerId: string, file: File): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${playerId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) {
    console.error("Photo upload failed", error);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
