# Overlay4S2 setup (copy-paste)

Product folder: **Overlay4S2** only. Use the **existing** Supabase project already wired in `.env.local` / Vercel.  
**Do not create another Supabase project.**

Packs:

| Pack id | Buyer name | UI |
|---------|------------|-----|
| `jhayr` | JhayR | Red/blue |
| `anthony` | Anthony | Navy |

---

## 1. SQL (existing Supabase → SQL Editor)

Run in order if not already applied:

1. `supabase/migrations/20260901120000_init.sql` (skip if tables already exist)
2. `supabase/migrations/20260914200000_logos.sql` (skip if logos already exist)
3. **`supabase/migrations/20260914223000_packs.sql`** ← run this for JhayR / Anthony packs

That migration:

- Creates packs `jhayr` + `anthony`
- Tags existing Overlay4S2 match/player/logo rows as **jhayr**
- Adds `provision_buyer`, `grant_pack`, `link_buyer_email`, `get_overlay_bootstrap`

---

## 2. Auth

- Authentication → Providers: **Email** on
- Disable public sign-up if you only create buyers in the dashboard
- URL config: Site URL = your Vercel URL; Redirect = `https://YOUR-APP.vercel.app/auth/callback`

---

## 3. Provision a buyer

```sql
-- JhayR pair
select * from public.provision_buyer('JhayR', 'jhayr');

-- Anthony pair (separate family)
select * from public.provision_buyer('Anthony', 'anthony');
```

Copy the returned `family_id` and match ids.

Create the Auth user (Authentication → Users → email + password), then:

```sql
select public.link_buyer_email('buyer@email.com', 'FAMILY_ID_HERE');
```

Same login, second pack:

```sql
select * from public.grant_pack('FAMILY_ID_HERE', 'anthony');
```

---

## 4. OBS URL templates

After provision, use the returned match ids:

- Landscape: `https://YOUR-APP.vercel.app/overlay/jhayr/{landscape_match_id}`
- Vertical: `https://YOUR-APP.vercel.app/overlay-vertical/jhayr/{vertical_match_id}`
- Manage: `https://YOUR-APP.vercel.app/players/jhayr`

Anthony:

- `.../overlay/anthony/{landscape_match_id}`
- `.../overlay-vertical/anthony/{vertical_match_id}`
- `.../players/anthony`

Legacy JhayR (old fixed ids, still work if those match rows exist):

- `https://YOUR-APP.vercel.app/overlay`
- `https://YOUR-APP.vercel.app/overlay-vertical`

Controller site: buyer opens `/` → redirected to **Sign in** → then only their pack hub.

---

## 5. Vercel

Env vars on the Overlay4S2 project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy after pushing.
