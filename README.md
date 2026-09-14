# Overlay4S1

A **sellable** stream overlay based on **Creator Overlay 4** from psgb-creator: red/blue folded score bar, player photos, and a pool ball rack.

This is a **standalone project**. It does not use Firebase. Backend is **Supabase**.

## Routes

| URL | Use in OBS |
|-----|------------|
| `/` | Home — sign in, links to overlays |
| `/login` | Buyer sign in (GitHub or email) |
| `/players` | Add / edit roster players with photos (signed in) |
| `/overlay` | Landscape browser source (read-only in OBS) |
| `/overlay-vertical` | Portrait **1080 × 1920** browser source |

Sign in on `/login` in a normal browser, then open an overlay in that same browser to control scores. OBS has no session, so it only displays Realtime updates.

## Run locally

```bash
npm install
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `.env.local`, overlays still work with **local-only** demo state.

## Database

Apply [supabase/migrations/20260901120000_init.sql](supabase/migrations/20260901120000_init.sql) in the Supabase SQL editor after creating the project.

That creates families, profiles, players, matches, public photo bucket `player-photos`, RLS, and Realtime on `matches` / `players`. The first signed-in user gets a family, demo players, and match rows `overlay4s1` and `overlay4s1-vertical`.

Enable **GitHub** under Authentication → Providers if you want GitHub login (same account you used for the dashboard). Email/password works without that.

## Keyboard shortcuts

Q/A E/D scores, 1–9 balls, Delete reset balls, double-R reset scores — only when signed in.

## Folder location

```
/Users/davidv.onquit/GitHubCodes/OverlayForSale/Overlay4S1
```
