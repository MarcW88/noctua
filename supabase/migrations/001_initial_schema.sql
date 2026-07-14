-- ============================================================
-- Noctua MVP — Initial Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- WORKSPACES
-- ============================================================
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text not null,
  market text not null default 'fr',
  owner_id uuid references auth.users(id) on delete cascade not null,
  gsc_site_url text,
  gsc_connected_at timestamptz,
  bright_data_token text,
  bright_data_dataset_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table workspaces enable row level security;

create policy "Users can manage their own workspaces"
  on workspaces for all
  using (owner_id = auth.uid());

-- ============================================================
-- COMPETITORS
-- ============================================================
create table competitors (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  domain text not null,
  label text,
  created_at timestamptz not null default now()
);

alter table competitors enable row level security;

create policy "Workspace members can manage competitors"
  on competitors for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

-- ============================================================
-- GSC SNAPSHOTS
-- ============================================================
create table gsc_snapshots (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  period_start date not null,
  period_end date not null,
  total_clicks integer,
  total_impressions integer,
  avg_ctr numeric(5,4),
  avg_position numeric(5,2),
  raw_data jsonb,
  synced_at timestamptz not null default now()
);

alter table gsc_snapshots enable row level security;

create policy "Workspace members can view snapshots"
  on gsc_snapshots for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

-- ============================================================
-- GSC QUERIES
-- ============================================================
create table gsc_queries (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  snapshot_id uuid references gsc_snapshots(id) on delete cascade,
  query text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(5,4),
  position numeric(5,2),
  recorded_at date not null
);

alter table gsc_queries enable row level security;

create policy "Workspace members can view queries"
  on gsc_queries for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

create index on gsc_queries (workspace_id, recorded_at desc);

-- ============================================================
-- GSC PAGES
-- ============================================================
create table gsc_pages (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  snapshot_id uuid references gsc_snapshots(id) on delete cascade,
  url text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(5,4),
  position numeric(5,2),
  index_status text,
  canonical_url text,
  robots_indexable boolean,
  recorded_at date not null
);

alter table gsc_pages enable row level security;

create policy "Workspace members can view pages"
  on gsc_pages for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

create index on gsc_pages (workspace_id, recorded_at desc);

-- ============================================================
-- SERP SNAPSHOTS
-- ============================================================
create table serp_snapshots (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  keyword text not null,
  market text not null default 'fr',
  device text not null default 'desktop',
  triggered_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'running', 'done', 'error')),
  raw_results jsonb,
  ai_overview_detected boolean default false,
  ai_overview_snippet text,
  our_position integer,
  our_url text
);

alter table serp_snapshots enable row level security;

create policy "Workspace members can manage serp snapshots"
  on serp_snapshots for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

-- ============================================================
-- FINDINGS
-- ============================================================
create type finding_severity as enum ('critical', 'high', 'medium', 'low', 'info');
create type finding_category as enum ('visibility', 'serp', 'ai_search', 'pages', 'indexation');
create type finding_status as enum ('open', 'acknowledged', 'in_progress', 'resolved', 'dismissed');

create table findings (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  description text not null,
  category finding_category not null,
  severity finding_severity not null default 'medium',
  status finding_status not null default 'open',
  asset_url text,
  metric_label text,
  metric_value numeric,
  evidence jsonb default '[]'::jsonb,
  source text,
  source_ref_id uuid,
  is_dismissed boolean not null default false,
  dismissed_at timestamptz,
  dismissed_by uuid references auth.users(id),
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table findings enable row level security;

create policy "Workspace members can manage findings"
  on findings for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

create index on findings (workspace_id, category, severity);
create index on findings (workspace_id, is_dismissed);

-- ============================================================
-- OPPORTUNITIES
-- ============================================================
create type opportunity_status as enum ('proposed', 'accepted', 'rejected', 'merged');
create type opportunity_type as enum (
  'refresh_content', 'build_content', 'reinforce_authority',
  'defend_competitor', 'fix_technical', 'expand_coverage', 'strengthen_ai'
);

create table opportunities (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  description text not null,
  type opportunity_type not null,
  status opportunity_status not null default 'proposed',
  finding_ids uuid[] not null default '{}',
  impact_score integer not null default 3 check (impact_score between 1 and 5),
  effort_score integer not null default 3 check (effort_score between 1 and 5),
  confidence_score integer not null default 3 check (confidence_score between 1 and 5),
  merged_into_id uuid references opportunities(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table opportunities enable row level security;

create policy "Workspace members can manage opportunities"
  on opportunities for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

-- ============================================================
-- INITIATIVES (ROADMAP)
-- ============================================================
create type initiative_type as enum ('quick_win', 'core_fix', 'strategic', 'experiment', 'maintenance');
create type initiative_horizon as enum ('now', 'next', 'later', 'backlog');
create type initiative_status as enum ('todo', 'in_progress', 'done', 'blocked', 'cancelled');

create table initiatives (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  opportunity_id uuid references opportunities(id),
  title text not null,
  type initiative_type not null default 'strategic',
  horizon initiative_horizon not null default 'backlog',
  status initiative_status not null default 'todo',
  visibility_impact integer not null default 3 check (visibility_impact between 1 and 5),
  effort integer not null default 3 check (effort between 1 and 5),
  confidence integer not null default 3 check (confidence between 1 and 5),
  dependency_score integer not null default 1 check (dependency_score between 1 and 5),
  priority_score numeric(5,2) not null default 5.0,
  owner text,
  why_this_matters text,
  expected_impact text,
  success_metric text,
  start_date date,
  target_date date,
  completed_at timestamptz,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table initiatives enable row level security;

create policy "Workspace members can manage initiatives"
  on initiatives for all
  using (workspace_id in (select id from workspaces where owner_id = auth.uid()));

create index on initiatives (workspace_id, horizon, position);
create index on initiatives (workspace_id, status);

-- ============================================================
-- FUNCTION: update updated_at automatically
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_workspaces_updated_at before update on workspaces
  for each row execute function update_updated_at_column();
create trigger update_findings_updated_at before update on findings
  for each row execute function update_updated_at_column();
create trigger update_opportunities_updated_at before update on opportunities
  for each row execute function update_updated_at_column();
create trigger update_initiatives_updated_at before update on initiatives
  for each row execute function update_updated_at_column();
