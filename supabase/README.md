# Overlay4S2 Supabase

1. Create a Supabase project (or reuse the one for this overlay).
2. Copy Project URL + anon key into `.env.local` (and Vercel env vars).
3. Run `migrations/20260901120000_init.sql` in the SQL editor.
4. Authentication → Providers: enable **Email**.
5. Authentication → URL configuration: add `http://localhost:3000/auth/callback` and your Vercel `/auth/callback` URL.
6. Create the buyer user under Authentication → Users (email + password).

## If Manage players cannot create players

Overlays can still show seeded demo players (public read), while Manage players needs your Auth user linked to a `family_id`.

This happens when the buyer user was created **before** the init SQL ran.

1. Run `migrations/20260914120000_repair_profiles.sql` in the SQL editor.
2. Sign out and sign in again.
3. Open **Manage players** — you should see the demo roster for your family.
4. Add a new player; it should save and appear in the landscape/vertical player pickers.

## Verify checklist

- [ ] Init SQL succeeded
- [ ] Repair SQL succeeded (if needed)
- [ ] Signed out / signed in
- [ ] Manage players lists demo names (or your family roster)
- [ ] New player saves without a red error
- [ ] New player appears when selecting a player on `/overlay` or `/overlay-vertical`
