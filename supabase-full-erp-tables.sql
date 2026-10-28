-- ==============================================================================
-- ScaffBuild ERP - Complete Supabase PostgreSQL Tables for:
-- 👑 OWNERS, 🏢 CLIENTS (BUILDERS), and 👷 WORKERS
-- Run in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/broslcfmpukjnfdcyfxx/sql
-- ==============================================================================

-- 1. SITES TABLE (Project sites registered by Clients / Builders)
create table if not exists public.sites (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  location text not null,
  city text default 'Navi Mumbai',
  state text default 'Maharashtra',
  site_engineer text,
  phone text,
  slab_area_sqft numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. INVENTORY TABLE (Equipment managed by Yard Owner)
create table if not exists public.inventory (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  category text not null, -- 'Plates', 'Props', 'Cuplock', 'Spans', 'Jacks'
  hsn_sac text default '997312',
  total_qty integer not null default 0,
  available_qty integer not null default 0,
  on_rent_qty integer not null default 0,
  daily_rent numeric(10,2) not null default 0,
  monthly_rent numeric(10,2) not null default 0,
  weight_kg numeric(8,2) default 0,
  replacement_cost numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- 3. QUOTATIONS & WORK ORDERS TABLE (Client requests -> Owner quotations -> Builder work orders)
create table if not exists public.quotations (
  id uuid default gen_random_uuid() primary key,
  quotation_no text not null unique,
  client_id uuid references public.profiles(id) on delete cascade,
  client_name text not null,
  contact_person text,
  site_id uuid references public.sites(id) on delete set null,
  site_name text not null,
  status text not null default 'requested', -- 'requested', 'quotation_sent', 'work_order_created', 'rejected'
  work_order_no text,
  requested_area_sqft numeric default 0,
  requested_volume_cum numeric default 0,
  items jsonb not null default '[]'::jsonb, -- array of {name, qty, unit, ratePerDay, days, amount}
  transport_freight numeric(10,2) default 0,
  loading_hamali numeric(10,2) default 0,
  taxable_amount numeric(12,2) default 0,
  gst_rate numeric(5,2) default 18,
  gst_amount numeric(12,2) default 0,
  grand_total numeric(12,2) default 0,
  client_notes text,
  owner_reply text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. WORKER DAILY PROGRESS LOGS (Worker submits -> Client verifies & certifies)
create table if not exists public.worker_logs (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.profiles(id) on delete set null,
  worker_name text not null,
  worker_phone text,
  client_id uuid references public.profiles(id) on delete cascade,
  site_id uuid references public.sites(id) on delete set null,
  site_name text not null,
  floor_level text not null,
  work_type text not null, -- 'Slab Shuttering & Staging', 'Cuplock Elevation', 'De-shuttering', etc.
  work_summary text,
  area_completed_sqft numeric default 0,
  volume_completed_cum numeric default 0,
  labor_count integer default 1,
  hours_worked numeric(4,1) default 8.0,
  photo_url text,
  status text not null default 'pending_approval', -- 'pending_approval', 'approved', 'rejected'
  approved_by text,
  approval_timestamp timestamptz,
  approval_comments text,
  created_at timestamptz default now()
);

-- 5. INVOICES TABLE (Owner dual billing: With GST 18% & Without GST Cash)
create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  invoice_no text not null unique,
  billing_type text not null default 'with_gst', -- 'with_gst', 'without_gst'
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_gstin text,
  date date not null default current_date,
  due_date date,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) default 0,
  taxable_amount numeric(12,2) default 0,
  cgst numeric(12,2) default 0,
  sgst numeric(12,2) default 0,
  igst numeric(12,2) default 0,
  grand_total numeric(12,2) default 0,
  irn text, -- 64-character E-Invoice IRN
  ack_no text,
  eway_bill_no text,
  status text not null default 'unpaid', -- 'unpaid', 'paid', 'overdue'
  created_at timestamptz default now()
);

-- 6. CHALLANS TABLE (Material dispatch & returns from yard)
create table if not exists public.challans (
  id uuid default gen_random_uuid() primary key,
  challan_no text not null unique,
  type text not null default 'delivery', -- 'delivery', 'return'
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  site_name text not null,
  date date not null default current_date,
  vehicle_no text,
  driver_name text,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'dispatched',
  created_at timestamptz default now()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL BUSINESS TABLES
-- ==============================================================================
alter table public.sites enable row level security;
alter table public.inventory enable row level security;
alter table public.quotations enable row level security;
alter table public.worker_logs enable row level security;
alter table public.invoices enable row level security;
alter table public.challans enable row level security;

-- Drop old policies to allow safe re-run
drop policy if exists "Sites: Clients manage own sites" on public.sites;
drop policy if exists "Sites: Owners can view all sites" on public.sites;
drop policy if exists "Quotations: Clients see own quotations" on public.quotations;
drop policy if exists "Quotations: Owners see all quotations" on public.quotations;
drop policy if exists "WorkerLogs: Workers see own logs" on public.worker_logs;
drop policy if exists "WorkerLogs: Clients see logs for their sites" on public.worker_logs;
drop policy if exists "WorkerLogs: Owners see all logs" on public.worker_logs;
drop policy if exists "Inventory: Everyone can view items" on public.inventory;
drop policy if exists "Invoices: Clients see own invoices" on public.invoices;
drop policy if exists "Invoices: Owners see all invoices" on public.invoices;

-- SITES POLICIES
create policy "Sites: Clients manage own sites" on public.sites
  for all using (auth.uid() = client_id);

create policy "Sites: Owners can view all sites" on public.sites
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );

-- QUOTATIONS POLICIES
create policy "Quotations: Clients see own quotations" on public.quotations
  for all using (auth.uid() = client_id);

create policy "Quotations: Owners see all quotations" on public.quotations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );

-- WORKER LOGS POLICIES
create policy "WorkerLogs: Workers see own logs" on public.worker_logs
  for all using (auth.uid() = worker_id);

create policy "WorkerLogs: Clients see logs for their sites" on public.worker_logs
  for all using (auth.uid() = client_id);

create policy "WorkerLogs: Owners see all logs" on public.worker_logs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );

-- INVENTORY POLICIES
create policy "Inventory: Everyone can view items" on public.inventory
  for select using (true);

-- INVOICES POLICIES
create policy "Invoices: Clients see own invoices" on public.invoices
  for select using (auth.uid() = client_id);

create policy "Invoices: Owners see all invoices" on public.invoices
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );
