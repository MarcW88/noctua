'use client'

import { useState } from 'react'
import { Lightbulb, CheckCircle2, XCircle, GitMerge, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { mockOpportunities, mockFindings } from '@/lib/mock-data'
import { severityConfig, initiativeTypeConfig } from '@/lib/utils'
import type { Opportunity } from '@/lib/types'

const opportunityTypeLabels: Record<string, string> = {
  refresh_content: 'Refresh Content',
  build_content: 'Build Content',
  reinforce_authority: 'Reinforce Authority',
  defend_competitor: 'Defend Competitor',
  fix_technical: 'Fix Technical',
  expand_coverage: 'Expand Coverage',
  strengthen_ai: 'Strengthen AI',
}

const scoreColor = (score: number) => {
  if (score >= 4) return '#16a34a'
  if (score >= 3) return 'var(--copper)'
  return 'var(--tweed)'
}

function ScoreDot({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: i <= score ? scoreColor(score) : 'var(--line)' }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: 'var(--tweed)' }}>{label}</span>
    </div>
  )
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const [expanded, setExpanded] = useState(false)
  const relatedFindings = mockFindings.filter(f => opp.finding_ids.includes(f.id))

  const statusConfig = {
    proposed: { label: 'Proposée', color: 'var(--copper)', bg: 'var(--copper-light)' },
    accepted: { label: 'Acceptée', color: '#16a34a', bg: '#dcfce7' },
    rejected: { label: 'Rejetée', color: '#dc2626', bg: '#fee2e2' },
    merged: { label: 'Fusionnée', color: 'var(--petrol)', bg: 'var(--petrol-light)' },
  }

  const st = statusConfig[opp.status]

  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="badge text-xs"
                style={{ background: 'var(--petrol-light)', color: 'var(--petrol-deep)', border: '1px solid var(--wash)' }}
              >
                {opportunityTypeLabels[opp.type] || opp.type}
              </span>
              <span
                className="badge text-xs"
                style={{ background: st.bg, color: st.color, border: 'none' }}
              >
                {st.label}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold leading-snug" style={{ color: 'var(--petrol-deep)' }}>
              {opp.title}
            </h3>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <ScoreDot score={opp.impact_score} label="Impact" />
            <ScoreDot score={opp.effort_score} label="Effort" />
            <ScoreDot score={opp.confidence_score} label="Confiance" />
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--tweed)' }}>
          {opp.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-semibold mb-3"
          style={{ color: 'var(--petrol)' }}
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {relatedFindings.length} finding{relatedFindings.length > 1 ? 's' : ''} associé{relatedFindings.length > 1 ? 's' : ''}
        </button>

        {expanded && (
          <div className="space-y-1.5 mb-4">
            {relatedFindings.map(f => {
              const sev = severityConfig(f.severity)
              return (
                <div key={f.id} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'var(--paper-deep)', border: '1px solid var(--line)' }}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sev.dot}`} />
                  <span className="text-xs font-medium flex-1 line-clamp-1" style={{ color: 'var(--ink)' }}>{f.title}</span>
                  <span className={`badge text-xs ${sev.bg} ${sev.color}`}>{sev.label}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2">
          {opp.status === 'proposed' ? (
            <>
              <button className="btn-primary text-xs flex-1 justify-center">
                <CheckCircle2 size={13} />
                Accepter → Roadmap
              </button>
              <button className="btn-secondary text-xs px-3">
                <GitMerge size={13} />
                Fusionner
              </button>
              <button className="btn-ghost text-xs px-3" style={{ color: '#dc2626' }}>
                <XCircle size={13} />
              </button>
            </>
          ) : opp.status === 'accepted' ? (
            <button className="btn-primary text-xs">
              <ArrowRight size={13} />
              Voir dans la roadmap
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState<'all' | 'proposed' | 'accepted'>('all')

  const filtered = mockOpportunities.filter(o =>
    filter === 'all' ? true : o.status === filter
  )

  const proposed = mockOpportunities.filter(o => o.status === 'proposed').length
  const accepted = mockOpportunities.filter(o => o.status === 'accepted').length

  return (
    <div className="p-8 max-w-[1000px]">
      <div className="mb-6">
        <p className="eyebrow mb-1">Consolidation</p>
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--petrol-deep)' }}>
          Opportunités
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tweed)' }}>
          Regroupements de findings en zones d&apos;action. Acceptez pour créer des initiatives dans la roadmap.
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        {[
          { id: 'all', label: `Toutes (${mockOpportunities.length})` },
          { id: 'proposed', label: `Proposées (${proposed})` },
          { id: 'accepted', label: `Acceptées (${accepted})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
            style={{
              background: filter === f.id ? 'var(--petrol)' : 'var(--paper-cream)',
              color: filter === f.id ? 'var(--paper-cream)' : 'var(--tweed)',
              borderColor: filter === f.id ? 'var(--petrol)' : 'var(--line)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(opp => (
          <OpportunityCard key={opp.id} opp={opp} />
        ))}
      </div>
    </div>
  )
}
