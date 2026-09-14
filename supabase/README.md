# Overlay4S2 Supabase

Use the **existing** Overlay4S2 Supabase project (`.env.local` / Vercel). Do not create a second project.

## Migrations (SQL Editor)

1. `20260901120000_init.sql` — if starting fresh  
2. `20260914200000_logos.sql` — logos  
3. `20260914223000_packs.sql` — **JhayR / Anthony packs** (required)

## Provision buyers

```sql
select * from public.provision_buyer('JhayR', 'jhayr');
select * from public.provision_buyer('Anthony', 'anthony');
select public.link_buyer_email('buyer@email.com', 'FAMILY_ID');
```

See [SETUP.md](../SETUP.md) for full copy-paste onboarding and OBS URL templates.
