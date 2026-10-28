-- ==============================================================================
-- ScaffBuild ERP - Supabase PostgreSQL Schema with Row-Level Security (RLS)
-- Safe to run multiple times (Idempotent script)
-- ==============================================================================

-- 1. Create custom user profiles table linked to Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  role text not null check (role in ('owner', 'client', 'worker')),
  name text,
  phone text,
  company_name text,
  gstin text,
  trade text,
  worker_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row-Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Drop existing policies so script can be safely re-run without Error 42710
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Owner can view all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Public profiles read" on public.profiles;
drop policy if exists "Authenticated profiles read" on public.profiles;

-- 4. Re-create RLS Policies:
-- Only authenticated users can read profiles (prevents anonymous scraping of private contact & GST info)
create policy "Authenticated profiles read"
  on public.profiles for select
  to authenticated
  using ( true );

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ( auth.uid() = id );

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check ( auth.uid() = id );

-- 5. Automatically create a public.profile entry when a new auth.user signs up
-- SECURED: Prevents unauthorized privilege escalation to 'owner' via self-registration
create or replace function public.handle_new_user()
returns trigger as $$
declare
  assigned_role text;
begin
  assigned_role := coalesce(new.raw_user_meta_data->>'role', 'client');
  -- Security guard: Self-signup can only register as 'client' or 'worker'
  if assigned_role not in ('client', 'worker') then
    assigned_role := 'client';
  end if;

  insert into public.profiles (
    id, 
    email, 
    role, 
    name, 
    phone, 
    company_name, 
    gstin, 
    trade,
    worker_code
  )
  values (
    new.id,
    new.email,
    assigned_role,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'gstin',
    new.raw_user_meta_data->>'trade',
    new.raw_user_meta_data->>'workerCode'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, profiles.name),
    phone = coalesce(excluded.phone, profiles.phone),
    company_name = coalesce(excluded.company_name, profiles.company_name),
    gstin = coalesce(excluded.gstin, profiles.gstin),
    trade = coalesce(excluded.trade, profiles.trade),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
