export type FindingCategory = 'visibility' | 'serp' | 'ai_search' | 'pages' | 'indexation'
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type OpportunityType = 'refresh_content' | 'build_content' | 'reinforce_authority' | 'defend_competitor' | 'fix_technical' | 'expand_coverage' | 'strengthen_ai'
export type InitiativeType = 'quick_win' | 'core_fix' | 'strategic' | 'experiment'
export type RoadmapHorizon = 'backlog' | 'now' | 'next' | 'later'
export type RoadmapStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

export interface Workspace {
  id: string
  name: string
  slug: string
  created_at: string
  owner_id: string
}

export interface Site {
  id: string
  workspace_id: string
  domain: string
  name: string
  country: string
  language: string
  created_at: string
}

export interface Competitor {
  id: string
  site_id: string
  domain: string
  name: string
}

export interface Finding {
  id: string
  site_id: string
  category: FindingCategory
  severity: FindingSeverity
  title: string
  description: string
  asset_url?: string
  asset_type?: 'query' | 'page' | 'topic' | 'domain'
  metric_value?: number
  metric_label?: string
  metric_delta?: number
  evidence?: FindingEvidence[]
  opportunity_id?: string
  created_at: string
  is_dismissed: boolean
}

export interface FindingEvidence {
  id: string
  finding_id: string
  source: 'gsc' | 'serp' | 'ai_overview' | 'url_inspection' | 'manual'
  label: string
  value: string | number
  date?: string
}

export interface Opportunity {
  id: string
  site_id: string
  type: OpportunityType
  title: string
  description: string
  status: 'proposed' | 'accepted' | 'rejected' | 'merged'
  finding_ids: string[]
  impact_score: number
  effort_score: number
  confidence_score: number
  created_at: string
}

export interface Initiative {
  id: string
  workspace_id: string
  opportunity_id?: string
  type: InitiativeType
  title: string
  description: string
  why_this_matters: string
  expected_impact: string
  horizon: RoadmapHorizon
  status: RoadmapStatus
  visibility_impact: number
  business_impact: number
  effort: number
  confidence: number
  dependency_level: number
  priority_score: number
  owner?: string
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Roadmap {
  id: string
  workspace_id: string
  name: string
  quarter?: string
  items: Initiative[]
}

export interface GscQueryDaily {
  id: string
  site_id: string
  date: string
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  country?: string
  device?: string
}

export interface SerpSnapshot {
  id: string
  site_id: string
  query: string
  captured_at: string
  country: string
  results: SerpResult[]
  has_ai_overview: boolean
  ai_overview_snippet?: string
  ai_sources?: string[]
}

export interface SerpResult {
  position: number
  url: string
  domain: string
  title: string
  snippet: string
}

export interface DashboardKPIs {
  total_clicks: number
  clicks_delta: number
  total_impressions: number
  impressions_delta: number
  avg_ctr: number
  ctr_delta: number
  avg_position: number
  position_delta: number
  findings_count: number
  critical_findings: number
  opportunities_count: number
  roadmap_items: number
}
