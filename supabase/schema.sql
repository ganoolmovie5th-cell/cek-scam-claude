-- ============================================================
-- cek-scam.id — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── TABLE: scam_reports ──────────────────────────────────────────
create table if not exists public.scam_reports (
  id               uuid default uuid_generate_v4() primary key,
  created_at       timestamptz default now() not null,
  scam_type        text not null,
  target_name      text not null,
  platform         text not null,
  description      text not null,
  loss_amount      bigint,
  reporter_contact text,
  anonymous        boolean default true,
  status           text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  risk_level       text default 'DANGER' check (risk_level in ('DANGER', 'WARNING', 'SAFE')),
  votes            integer default 0
);

-- ── TABLE: url_checks (with VirusTotal fields) ───────────────────
create table if not exists public.url_checks (
  id              uuid default uuid_generate_v4() primary key,
  created_at      timestamptz default now() not null,
  url             text not null unique,
  result          text not null check (result in ('SAFE', 'WARNING', 'DANGER')),
  reasons         text[] default '{}',
  check_count     integer default 1,
  -- VirusTotal fields
  vt_stats        jsonb,
  vt_detections   jsonb,
  vt_categories   text[],
  vt_permalink    text,
  total_engines   integer
);

-- ── RLS ──────────────────────────────────────────────────────────
alter table public.scam_reports enable row level security;
alter table public.url_checks   enable row level security;

-- scam_reports policies
create policy "Anyone can submit reports"
  on public.scam_reports for insert with check (true);

create policy "Public can read verified reports"
  on public.scam_reports for select using (status = 'verified');

-- url_checks policies
create policy "Anyone can read url checks"
  on public.url_checks for select using (true);

create policy "Service role can insert url checks"
  on public.url_checks for insert with check (true);

create policy "Service role can update url checks"
  on public.url_checks for update using (true);

-- ── INDEXES ──────────────────────────────────────────────────────
create index if not exists idx_scam_reports_status  on public.scam_reports(status);
create index if not exists idx_scam_reports_type    on public.scam_reports(scam_type);
create index if not exists idx_scam_reports_created on public.scam_reports(created_at desc);
create index if not exists idx_url_checks_url       on public.url_checks(url);
create index if not exists idx_url_checks_result    on public.url_checks(result);
