'use client'

import { useState } from 'react'
import {
  AlertTriangle, Globe, Sparkles, FileText, SearchX, TrendingDown,
  ChevronRight, ArrowRight, X, Lightbulb, MapPin, Play, CheckCircle2
} from 'lucide-react'
import { mockFindings } from '@/lib/mock-data'
import { severityConfig, categoryConfig } from '@/lib/utils'
import type { Finding, FindingCategory } from '@/lib/types'

// Pipeline stages
const STAGES: { id: string; label: string; sublabel: string; color: string; bg: string; border: string }[] = [
  { id: 'detected',  label: 'Détecté',   sublabel: 'Findings ouverts',       color: 'text-red-700',    bg: 'bg-red-50',      border: 'border-t-red-400' },
  { id: 'suggested', label: 'Suggéré',   sublabel: 'Initiative proposée',    color: 'text-amber-700',  bg: 'bg-amber-50',    border: 'border-t-amber-400' },
  { id: 'planned',   label: 'Planifié',  sublabel: 'Dans la roadmap',        color: 'text-petrol-deep', bg: 'bg-petrol-light', border: 'border-t-petrol' },
  { id: 'active',    label: 'En cours',  sublabel: 'Initiative active',      color: 'text-copper',     bg: 'bg-copper-light', border: 'border-t-copper' },
  { id: 'resolved',  label: 'Résolu',    sublabel: 'Impact mesuré',          color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-t-emerald-500' },
]

// Assign mock findings to stages (based on their finding IDs linked to opportunities/initiatives)
function getStage(finding: Finding): string {
  if (finding.is_dismissed) return 'resolved'
  if (['f10', 'f11'].includes(finding.id)) return 'active'    // linked to in-progress initiative
  if (['f2', 'f9', 'f8', 'f1'].includes(finding.id)) return 'planned'
  if (['f6', 'f7', 'f4', 'f5'].includes(finding.id)) return 'suggested'
  return 'detected'
}

const CATEGORY_TABS: { id: FindingCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'visibility', label: 'Visibilité' },
  { id: 'serp', label: 'SERP' },
  { id: 'ai_search', label: 'AI Search' },
  { id: 'pages', label: 'Pages' },
  { id: 'indexation', label: 'Indexation' },
]

// ── Finding card (compact, used in pipeline columns) ───────────────────

function FindingCard({ finding, onSelect, isSelected }: {
  finding: Finding; onSelect: (f: Finding | null) => void; isSelected: boolean
}) {
  const sev = severityConfig(finding.severity)
  const cat = categoryConfig(finding.category)
  return (
    <button
      onClick={() => onSelect(isSelected ? null : finding)}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? 'bg-white border-copper shadow-card'
          : 'bg-white/60 border-line hover:bg-white hover:shadow-subtle'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${sev.bg} ${sev.color}`}>
          {sev.label}
        </span>
        <span className="text-[10px] text-tweed shrink-0">{cat.label}</span>
      </div>
      <p className="text-xs font-medium text-ink leading-snug line-clamp-2">{finding.title}</p>
      {finding.metric_value !== undefined && finding.metric_label && (
        <p className={`text-xs font-bold mt-1 ${finding.metric_value < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {finding.metric_value > 0 ? '+' : ''}{finding.metric_value} {finding.metric_label}
        </p>
      )}
    </button>
  )
}

// ── Detail panel ─────────────────────────────────────────────────────────

function DetailPanel({ finding, onClose }: { finding: Finding; onClose: () => void }) {
  const sev = severityConfig(finding.severity)
  const cat = categoryConfig(finding.category)
  const stage = getStage(finding)
  const stageConf = STAGES.find(s => s.id === stage)!

  return (
    <div className="w-[380px] shrink-0 border-l border-line flex flex-col overflow-y-auto" style={{ background: 'var(--paper-cream)' }}>
      <div className="p-5 border-b border-line">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${sev.bg} ${sev.color}`}>{sev.label}</span>
              <span className="text-[11px] text-tweed">{cat.label}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${stageConf.color} ${stageConf.bg}`}>{stageConf.label}</span>
            </div>
            <h2 className="font-display text-base font-semibold text-ink leading-snug">{finding.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-paper-deep text-tweed hover:text-ink transition-colors shrink-0">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        <div>
          <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-1.5">Description</p>
          <p className="text-sm text-ink/80 leading-relaxed">{finding.description}</p>
        </div>

        {finding.asset_url && (
          <div>
            <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-1.5">Asset</p>
            <span className="text-xs font-mono px-2 py-1 rounded bg-paper-deep text-petrol">{finding.asset_url}</span>
          </div>
        )}

        {finding.evidence && finding.evidence.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-2">Preuves</p>
            <div className="space-y-1.5">
              {finding.evidence.map(ev => (
                <div key={ev.id} className="flex justify-between items-center px-3 py-2 rounded-lg bg-paper-deep border border-line">
                  <span className="text-xs text-tweed">{ev.label}</span>
                  <span className="text-xs font-bold text-ink">{ev.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-2">Pipeline</p>
          <div className="flex items-center gap-1">
            {STAGES.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <span className={`text-[10px] px-2 py-1 rounded font-medium ${s.id === stage ? `${s.color} ${s.bg}` : 'text-tweed/50 bg-paper-deep'}`}>
                  {s.label}
                </span>
                {i < STAGES.length - 1 && <ArrowRight size={10} className="text-tweed/30 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-line space-y-2">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <Lightbulb size={14} />
          Créer une opportunité
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-tweed border border-line hover:bg-paper-deep transition-colors">
          Ignorer ce finding
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FindingsPage() {
  const [categoryFilter, setCategoryFilter] = useState<FindingCategory | 'all'>('all')
  const [selected, setSelected] = useState<Finding | null>(null)

  const filtered = categoryFilter === 'all'
    ? mockFindings
    : mockFindings.filter(f => f.category === categoryFilter)

  const activeCount = mockFindings.filter(f => !f.is_dismissed).length
  const criticalCount = mockFindings.filter(f => f.severity === 'critical').length

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <div className="shrink-0 border-b border-line px-8 pt-6 pb-4" style={{ background: 'var(--paper-cream)' }}>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold text-tweed uppercase tracking-widest mb-0.5">Pipeline d'analyse</p>
            <h1 className="font-display text-2xl font-bold text-ink">Findings</h1>
            <p className="text-xs text-tweed mt-1">
              <span className="font-semibold text-red-600">{criticalCount} critiques</span>
              {' · '}{activeCount} actifs · Détection GSC + SERP + URL Inspection
            </p>
          </div>
          {/* Category filter pills */}
          <div className="flex gap-1.5 flex-wrap justify-end">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  categoryFilter === tab.id
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-white text-tweed border-line hover:border-tweed/50 hover:text-ink'
                }`}
              >
                {tab.label}
                {tab.id !== 'all' && (
                  <span className="ml-1.5 opacity-60">
                    {mockFindings.filter(f => f.category === tab.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline stage counters */}
        <div className="flex gap-2">
          {STAGES.map((stage, i) => {
            const count = filtered.filter(f => getStage(f) === stage.id).length
            return (
              <div key={stage.id} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${stage.bg} ${
                  stage.id === 'detected' ? 'border-red-200' :
                  stage.id === 'suggested' ? 'border-amber-200' :
                  stage.id === 'planned' ? 'border-wash' :
                  stage.id === 'active' ? 'border-copper/25' : 'border-emerald-200'
                }`}>
                  <span className={`text-[11px] font-semibold ${stage.color}`}>{stage.label}</span>
                  <span className={`text-[11px] font-bold ${stage.color}`}>{count}</span>
                </div>
                {i < STAGES.length - 1 && <ArrowRight size={12} className="text-tweed/40 shrink-0" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pipeline board */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-5 gap-3 h-full">
            {STAGES.map(stage => {
              const items = filtered.filter(f => getStage(f) === stage.id)
              return (
                <div key={stage.id} className="flex flex-col">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <p className={`text-xs font-semibold ${stage.color}`}>{stage.label}</p>
                      <p className="text-[10px] text-tweed">{stage.sublabel}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.color} ${stage.bg}`}>
                      {items.length}
                    </span>
                  </div>
                  <div className={`flex-1 rounded-xl border-t-4 ${stage.border} bg-white/40 border border-line p-2.5 flex flex-col gap-2 overflow-y-auto`}>
                    {items.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-xs text-tweed/30">—</span>
                      </div>
                    ) : (
                      items.map(f => (
                        <FindingCard
                          key={f.id}
                          finding={f}
                          onSelect={setSelected}
                          isSelected={selected?.id === f.id}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selected && <DetailPanel finding={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}
