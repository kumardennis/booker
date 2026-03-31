-- Remove incorrect FK that points training_id to club_groups.
alter table public.join_training_requests
  drop constraint if exists join_training_requests_group_id_fkey;

-- Ensure training_id references group_trainings.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'join_training_requests_training_id_fkey'
  ) then
    alter table public.join_training_requests
      add constraint join_training_requests_training_id_fkey
      foreign key (training_id)
      references public.group_trainings(id);
  end if;
end $$;
