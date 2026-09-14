-- Repair: link existing Auth users to a family so Manage players can create rows.
-- Run once in Supabase SQL Editor after 20260901120000_init.sql if the buyer
-- was created before that migration (trigger never attached a family).

do $$
declare
  fid uuid;
begin
  -- Prefer the family that already owns demo / match data.
  select family_id into fid
  from public.matches
  where id in ('overlay4s1', 'overlay4s1-vertical')
    and family_id is not null
  limit 1;

  if fid is null then
    select family_id into fid
    from public.players
    where family_id is not null
    limit 1;
  end if;

  if fid is null then
    select id into fid from public.families order by created_at asc limit 1;
  end if;

  if fid is null then
    insert into public.families (name) values ('Overlay4S2') returning id into fid;

    insert into public.matches (id, family_id)
    values ('overlay4s1', fid), ('overlay4s1-vertical', fid)
    on conflict (id) do update set family_id = excluded.family_id;

    insert into public.players (family_id, name, points) values
      (fid, 'Alex Rivera', 120),
      (fid, 'Jordan Lee', 105),
      (fid, 'Sam Torres', 98),
      (fid, 'Chris Park', 87);
  else
    insert into public.matches (id, family_id)
    values ('overlay4s1', fid), ('overlay4s1-vertical', fid)
    on conflict (id) do update set family_id = coalesce(public.matches.family_id, excluded.family_id);
  end if;

  -- Attach every Auth user that has no profile or a null family_id.
  insert into public.profiles (id, family_id, display_name)
  select
    u.id,
    fid,
    coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email)
  from auth.users u
  where not exists (select 1 from public.profiles p where p.id = u.id)
  on conflict (id) do nothing;

  update public.profiles
  set family_id = fid
  where family_id is null;
end $$;
