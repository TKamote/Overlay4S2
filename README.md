# Overlay4S2

Single product app (GitHub / Vercel / Supabase). Sold pairs:

| Pack | Name | Look |
|------|------|------|
| `jhayr` | JhayR | Red/blue |
| `anthony` | Anthony | Navy |

## Routes

| URL | Use |
|-----|-----|
| `/` | Sign-in gate → buyer pack hub |
| `/login` | Email sign in |
| `/players/jhayr` or `/players/anthony` | Roster + logos |
| `/overlay/{pack}/{matchId}` | Landscape OBS |
| `/overlay-vertical/{pack}/{matchId}` | Vertical 1080×1920 OBS |

## Setup

See **[SETUP.md](SETUP.md)** (SQL, provision, OBS URLs).

## Local

```bash
npm install
# .env.local already has Supabase keys for this project
npm run dev
```

Without `.env.local`, home lists both pairs as a demo preview.
