"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { uploadPlayerPhoto } from "@/lib/playerPhotos";
import {
  createPlayer,
  deletePlayer,
  getFamilyId,
  listPlayers,
  updatePlayer,
  type PlayerRow,
} from "@/lib/players";

function placeholderFor(player: PlayerRow): string {
  const hash = player.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `/avatar-placeholder-${(hash % 6) + 1}.svg`;
}

type FormState = {
  name: string;
  points: string;
  photo: File | null;
};

const emptyForm = (): FormState => ({ name: "", points: "0", photo: null });

export default function PlayersPage() {
  const router = useRouter();
  const { ready, isSignedIn, configured } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PlayerRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  const loadRoster = useCallback(async () => {
    if (!configured || !isSignedIn) return;
    try {
      setLoading(true);
      setError(null);
      const fid = await getFamilyId();
      if (!fid) {
        setError("No family linked to your account. Try signing out and back in.");
        setPlayers([]);
        return;
      }
      setFamilyId(fid);
      const rows = await listPlayers(fid);
      if (mountedRef.current) setPlayers(rows);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load players");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [configured, isSignedIn]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!configured) {
      setLoading(false);
      return;
    }
    if (!isSignedIn) {
      router.replace("/login");
      return;
    }
    void loadRoster();
  }, [ready, configured, isSignedIn, router, loadRoster]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setPhotoPreview(null);
    setShowForm(true);
  };

  const openEdit = (player: PlayerRow) => {
    setEditing(player);
    setForm({
      name: player.name,
      points: String(player.points),
      photo: null,
    });
    setPhotoPreview(player.photo_url);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm());
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
  };

  const onPhotoChange = (file: File | null) => {
    setForm((f) => ({ ...f, photo: file }));
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    if (file) setPhotoPreview(URL.createObjectURL(file));
    else if (editing?.photo_url) setPhotoPreview(editing.photo_url);
    else setPhotoPreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!familyId) return;
    const name = form.name.trim();
    if (!name) {
      setError("Name is required");
      return;
    }
    const points = parseInt(form.points, 10);
    if (isNaN(points) || points < 0) {
      setError("Points must be a number ≥ 0");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      let playerId: string;
      if (editing) {
        playerId = editing.id;
        await updatePlayer(playerId, { name, points });
      } else {
        playerId = await createPlayer({ familyId, name, points });
      }

      if (form.photo) {
        const url = await uploadPlayerPhoto(playerId, form.photo);
        if (url) await updatePlayer(playerId, { photo_url: url });
      }

      closeForm();
      await loadRoster();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (player: PlayerRow) => {
    if (!confirm(`Delete ${player.name}?`)) return;
    setError(null);
    try {
      await deletePlayer(player.id);
      await loadRoster();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!configured) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-bold">Players</h1>
        <p className="mt-4 text-neutral-600">
          Supabase is not configured. Add <code>.env.local</code> first.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Back home
        </Link>
      </main>
    );
  }

  if (!ready || loading) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p className="text-neutral-600">Loading players…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[100dvh] max-w-2xl p-6 pb-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Players</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Add roster players with photos for your overlays.
          </p>
        </div>
        <Link href="/" className="shrink-0 text-sm underline">
          Home
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players…"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-neutral-900 px-4 py-2 font-semibold text-white hover:bg-neutral-800"
        >
          Add player
        </button>
      </div>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
        {filtered.length === 0 ? (
          <li className="p-6 text-center text-neutral-500">
            {searchQuery ? "No players match your search." : "No players yet."}
          </li>
        ) : (
          filtered.map((player) => (
            <li
              key={player.id}
              className="flex items-center gap-4 p-4"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={player.photo_url || placeholderFor(player)}
                  alt={player.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{player.name}</p>
                <p className="text-sm text-neutral-500">{player.points} pts</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(player)}
                  className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(player)}
                  className="rounded border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold">
              {editing ? "Edit player" : "Add player"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Points
                <input
                  type="number"
                  min={0}
                  value={form.points}
                  onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Photo (JPEG or PNG)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
              </label>
              {photoPreview && (
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-lg">
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-neutral-900 py-2 font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-lg border border-neutral-300 py-2 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
