# Overlay4S1 Supabase

1. Delete the old **Spotify-Clone** project (dashboard).
2. Create a new project named **Overlay4S1**.
3. Copy Project URL + anon key into `.env.local`.
4. Run `migrations/20260901120000_init.sql` in the SQL editor.
5. Authentication → Providers: enable GitHub (optional) and/or email.
6. Authentication → URL configuration: add `http://localhost:3000/auth/callback`.
