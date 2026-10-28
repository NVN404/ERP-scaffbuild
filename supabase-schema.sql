-- ==============================================================================
-- ScaffBuild ERP - Supabase PostgreSQL Schema with Row-Level Security (RLS)
-- Safe to run multiple times (Idempotent script)
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/broslcfmpukjnfdcyfxx/sql
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

-- 4. Re-create RLS Policies (Clean, recursion-free):
create policy "Public profiles read"
  on public.profiles for select
  using ( true );

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- 5. Automatically create a public.profile entry when a new auth.user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
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
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'gstin',
    new.raw_user_meta_data->>'trade',
    new.raw_user_meta_data->>'workerCode'
  )
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role,
    name = excluded.name,
    phone = excluded.phone,
    company_name = excluded.company_name,
    gstin = excluded.gstin,
    trade = excluded.trade,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 6. Insert User: tempory2911@gmail.com / Password: polopolo
-- ==============================================================================
create extension if not exists pgcrypto;

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Check if user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'tempory2911@gmail.com';

  IF v_user_id IS NOT NULL THEN
    -- Update existing user with confirmed email and password 'polopolo'
    UPDATE auth.users
    SET 
      encrypted_password = crypt('polopolo', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', array['email']),
      raw_user_meta_data = jsonb_build_object(
        'role', 'client',
        'name', 'Temporary Client',
        'companyName', 'Temporary Construction Ltd',
        'phone', '+91 98200 99999'
      ),
      updated_at = now()
    WHERE id = v_user_id;
  ELSE
    -- Generate new UUID and insert new user into auth.users
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'tempory2911@gmail.com',
      crypt('polopolo', gen_salt('bf')),
      now(),
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object(
        'role', 'client',
        'name', 'Temporary Client',
        'companyName', 'Temporary Construction Ltd',
        'phone', '+91 98200 99999'
      ),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  END IF;

  -- 2. Insert or update corresponding profile in public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    role,
    name,
    phone,
    company_name,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'tempory2911@gmail.com',
    'client',
    'Temporary Client',
    '+91 98200 99999',
    'Temporary Construction Ltd',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    role = excluded.role,
    name = excluded.name,
    company_name = excluded.company_name,
    phone = excluded.phone,
    updated_at = now();
END $$;
