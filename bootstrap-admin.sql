-- 1) Create your own user first from Supabase Dashboard > Authentication > Users > Add user.
-- 2) Copy that user's UUID, then replace the value below and run this SQL.
insert into public.admin_users (user_id)
values ('PASTE-YOUR-AUTH-USER-UUID-HERE')
on conflict (user_id) do nothing;
