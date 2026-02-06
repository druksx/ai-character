create or replace function update_conversation_timestamp()
returns trigger as $$
begin
  update conversations
  set updated_at = now()
  where id = NEW.conversation_id;
  return NEW;
end;
$$ language plpgsql;

create trigger on_message_inserted
  after insert on messages
  for each row
  execute function update_conversation_timestamp();

create or replace function update_recipe_stats()
returns trigger as $$
begin
  insert into recipe_stats (cuisine, recipe_count, updated_at)
  values (NEW.cuisine, 1, now())
  on conflict (cuisine)
  do update set
    recipe_count = recipe_stats.recipe_count + 1,
    updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger on_recipe_saved
  after insert on saved_recipes
  for each row
  execute function update_recipe_stats();

create or replace function get_popular_categories(limit_count int default 5)
returns table (cuisine text, recipe_count int) as $$
begin
  return query
    select rs.cuisine, rs.recipe_count
    from recipe_stats rs
    order by rs.recipe_count desc
    limit limit_count;
end;
$$ language plpgsql;
