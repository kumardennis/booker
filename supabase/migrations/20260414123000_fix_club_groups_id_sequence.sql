select setval(
  pg_get_serial_sequence('public.club_groups', 'id'),
  coalesce((select max(id) from public.club_groups), 1),
  coalesce((select max(id) is not null from public.club_groups), false)
);