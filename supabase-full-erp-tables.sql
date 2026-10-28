-- ==============================================================================
-- ScaffBuild ERP - Complete Supabase PostgreSQL Tables for:
-- 👑 OWNERS, 🏢 CLIENTS (BUILDERS), and 👷 WORKERS
-- Production Ready & Fully Indexed Schema with Row-Level Security (RLS)
-- ==============================================================================

-- 1. SITES TABLE (Project sites registered by Clients / Builders)
create table if not exists public.sites (
  id uuid default gen_random_uuid() primary key,
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  location text not null,
  city text default 'Navi Mumbai',
  state text default 'Maharashtra',
  site_engineer text,
  phone text,
  slab_area_sqft numeric default 0,
  active boolean default true,
  created_at timestamptz default now() not null
);

-- 2. INVENTORY TABLE (Equipment managed by Yard Owner)
-- Supports alphanumeric product codes (e.g., 'SH-PL-900600', 'PR-2035') and UUIDs
create table if not exists public.inventory (
  id text primary key,
  name text not null,
  category text not null, -- 'Shuttering Plates', 'Telescopic Props', 'Cuplock System', 'Spans & Beams', 'Jacks & Accessories'
  hsn text default '73084000',
  unit text default 'Pcs',
  weight_kg numeric(8,2) default 0,
  total_stock integer not null default 0 check (total_stock >= 0),
  on_rent integer not null default 0 check (on_rent >= 0),
  under_repair integer not null default 0 check (under_repair >= 0),
  daily_rent numeric(10,2) not null default 0,
  monthly_rent numeric(10,2) not null default 0,
  replacement_cost numeric(10,2) default 0,
  location text default 'Yard 1',
  created_at timestamptz default now() not null,
  constraint check_stock_limit check (on_rent + under_repair <= total_stock)
);

-- 3. QUOTATIONS & WORK ORDERS TABLE
create table if not exists public.quotations (
  id text primary key default ('QUOT-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  quotation_no text not null unique,
  client_id uuid not null references public.profiles(id) on delete cascade,
  client_name text not null,
  contact_person text,
  site_id uuid references public.sites(id) on delete set null,
  site_name text not null,
  status text not null default 'requested' check (status in ('requested', 'quotation_sent', 'work_order_created', 'rejected')),
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
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. WORKER DAILY PROGRESS LOGS (Worker submits -> Client verifies & certifies)
create table if not exists public.worker_logs (
  id text primary key default ('WLOG-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
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
  status text not null default 'pending_approval' check (status in ('pending_approval', 'approved', 'rejected')),
  approved_by text,
  approval_timestamp timestamptz,
  approval_comments text,
  created_at timestamptz default now() not null
);

-- 5. INVOICES TABLE (Owner dual billing: With GST 18% & Without GST Cash)
create table if not exists public.invoices (
  id text primary key default ('INV-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  invoice_no text not null unique,
  billing_type text not null default 'with_gst' check (billing_type in ('with_gst', 'without_gst')),
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  trade_name text,
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
  status text not null default 'unpaid' check (status in ('unpaid', 'paid', 'overdue')),
  created_at timestamptz default now() not null
);

-- 6. CHALLANS TABLE (Material dispatch & returns from yard)
create table if not exists public.challans (
  id text primary key default ('DC-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  challan_no text not null unique,
  type text not null default 'outward' check (type in ('outward', 'inward', 'delivery', 'return')),
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  site_id uuid references public.sites(id) on delete set null,
  site_name text not null,
  date date not null default current_date,
  return_date date,
  vehicle_no text,
  driver_name text,
  driver_phone text,
  total_weight_kg numeric(10,2) default 0,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'returned', 'partial_return', 'dispatched')),
  remarks text,
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- PERFORMANCE INDEXES (Essential for scaling to 100+ concurrent users)
-- ==============================================================================
create index if not exists idx_sites_client on public.sites(client_id);
create index if not exists idx_sites_active on public.sites(active);
create index if not exists idx_inventory_category on public.inventory(category);
create index if not exists idx_quotations_client on public.quotations(client_id);
create index if not exists idx_quotations_status on public.quotations(status);
create index if not exists idx_worker_logs_worker on public.worker_logs(worker_id);
create index if not exists idx_worker_logs_client on public.worker_logs(client_id);
create index if not exists idx_worker_logs_status on public.worker_logs(status);
create index if not exists idx_invoices_client on public.invoices(client_id);
create index if not exists idx_invoices_date on public.invoices(date desc);
create index if not exists idx_challans_client on public.challans(client_id);
create index if not exists idx_challans_status on public.challans(status);
create index if not exists idx_challans_date on public.challans(date desc);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR ALL BUSINESS TABLES
-- ==============================================================================
alter table public.sites enable row level security;
alter table public.inventory enable row level security;
alter table public.quotations enable row level security;
alter table public.worker_logs enable row level security;
alter table public.invoices enable row level security;
alter table public.challans enable row level security;

-- Drop old policies to allow safe re-run
drop policy if exists "Sites: Clients manage own sites" on public.sites;
drop policy if exists "Sites: Owners manage all sites" on public.sites;
drop policy if exists "Sites: Authenticated users view active sites" on public.sites;

drop policy if exists "Inventory: Everyone can view items" on public.inventory;
drop policy if exists "Inventory: Owners manage inventory" on public.inventory;

drop policy if exists "Quotations: Clients see own quotations" on public.quotations;
drop policy if exists "Quotations: Clients create quotations" on public.quotations;
drop policy if exists "Quotations: Owners see all quotations" on public.quotations;

drop policy if exists "WorkerLogs: Workers see own logs" on public.worker_logs;
drop policy if exists "WorkerLogs: Workers insert own logs" on public.worker_logs;
drop policy if exists "WorkerLogs: Clients see logs for their sites" on public.worker_logs;
drop policy if exists "WorkerLogs: Clients approve logs for their sites" on public.worker_logs;
drop policy if exists "WorkerLogs: Owners see all logs" on public.worker_logs;

drop policy if exists "Invoices: Clients see own invoices" on public.invoices;
drop policy if exists "Invoices: Owners see all invoices" on public.invoices;

drop policy if exists "Challans: Clients see own challans" on public.challans;
drop policy if exists "Challans: Owners manage all challans" on public.challans;

-- 1. SITES POLICIES
create policy "Sites: Clients manage own sites" on public.sites
  for all to authenticated
  using (auth.uid() = client_id);

create policy "Sites: Authenticated users view active sites" on public.sites
  for select to authenticated
  using (active = true);

create policy "Sites: Owners manage all sites" on public.sites
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- 2. INVENTORY POLICIES
create policy "Inventory: Everyone can view items" on public.inventory
  for select to authenticated
  using (true);

create policy "Inventory: Owners manage inventory" on public.inventory
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- 3. QUOTATIONS POLICIES
create policy "Quotations: Clients see own quotations" on public.quotations
  for select to authenticated
  using (auth.uid() = client_id);

create policy "Quotations: Clients create quotations" on public.quotations
  for insert to authenticated
  with check (auth.uid() = client_id);

create policy "Quotations: Owners see all quotations" on public.quotations
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- 4. WORKER LOGS POLICIES
create policy "WorkerLogs: Workers see own logs" on public.worker_logs
  for select to authenticated
  using (auth.uid() = worker_id);

create policy "WorkerLogs: Workers insert own logs" on public.worker_logs
  for insert to authenticated
  with check (auth.uid() = worker_id);

create policy "WorkerLogs: Clients see logs for their sites" on public.worker_logs
  for select to authenticated
  using (auth.uid() = client_id);

create policy "WorkerLogs: Clients approve logs for their sites" on public.worker_logs
  for update to authenticated
  using (auth.uid() = client_id);

create policy "WorkerLogs: Owners see all logs" on public.worker_logs
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- 5. INVOICES POLICIES
create policy "Invoices: Clients see own invoices" on public.invoices
  for select to authenticated
  using (auth.uid() = client_id);

create policy "Invoices: Owners see all invoices" on public.invoices
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- 6. CHALLANS POLICIES
create policy "Challans: Clients see own challans" on public.challans
  for select to authenticated
  using (auth.uid() = client_id);

create policy "Challans: Owners manage all challans" on public.challans
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- ==============================================================================
-- SEQUENTIAL NUMBERING GENERATOR (Complies with Indian CGST Rule 46)
-- ==============================================================================
create sequence if not exists public.seq_invoice_no start 101;
create sequence if not exists public.seq_challan_no start 101;
create sequence if not exists public.seq_quotation_no start 101;

create or replace function public.get_next_invoice_number(p_prefix text default 'SB')
returns text as $$
begin
  return p_prefix || '/26-27/' || lpad(nextval('public.seq_invoice_no')::text, 4, '0');
end;
$$ language plpgsql;

create or replace function public.get_next_challan_number(p_prefix text default 'DC')
returns text as $$
begin
  return p_prefix || '/26/' || lpad(nextval('public.seq_challan_no')::text, 4, '0');
end;
$$ language plpgsql;

-- ==============================================================================
-- ATOMIC CHALLAN DISPATCH RPC (Prevents Race Conditions & Negative Inventory)
-- ==============================================================================
create or replace function public.dispatch_challan(
  p_challan_no text,
  p_client_id uuid,
  p_client_name text,
  p_site_id uuid,
  p_site_name text,
  p_vehicle_no text,
  p_driver_name text,
  p_driver_phone text,
  p_total_weight_kg numeric,
  p_items jsonb,
  p_remarks text default null
) returns text as $$
declare
  v_item record;
  v_challan_id text;
begin
  -- 1. Validate and lock inventory stock atomically
  for v_item in select * from jsonb_to_recordset(p_items) as x(itemId text, quantity int) loop
    update public.inventory
    set on_rent = on_rent + v_item.quantity
    where id = v_item.itemId 
      and (total_stock - on_rent - under_repair) >= v_item.quantity;
      
    if not found then
      raise exception 'Stock shortfall: Insufficient available inventory for item code %', v_item.itemId;
    end if;
  end loop;

  -- 2. Insert outward challan
  insert into public.challans (
    challan_no, type, client_id, client_name, site_id, site_name, 
    vehicle_no, driver_name, driver_phone, total_weight_kg, items, status, remarks
  ) values (
    p_challan_no, 'outward', p_client_id, p_client_name, p_site_id, p_site_name,
    p_vehicle_no, p_driver_name, p_driver_phone, p_total_weight_kg, p_items, 'active', p_remarks
  ) returning id into v_challan_id;

  return v_challan_id;
end;
$$ language plpgsql security definer;
