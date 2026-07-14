'use client'

import { useState } from 'react'
import {
  AlertTriangle, Zap, TrendingUp, Target, X, User,
  LayoutGrid, CalendarDays, ChevronRight
} from 'lucide-react'
import type { Initiative, InitiativeType, RoadmapHorizon } from '@/lib/types'
import { mockInitiatives } from '@/lib/mock-data'
import { initiativeTypeConfig, effortLabel, impactLabel } from '@/lib/utils'

// ── Config ──────────────────────────────────────────────────────────────────

const LANES: { id: InitiativeType; label: string; color: string; bg: string; border: string }[] = [
  { id: 'core_fix',   label: 'Fondation Technique', color: 'text-orange-700',  bg: 'bg-orange-50',    border: 'border-l-orange-400' },
  { id: 'quick_win',  label: 'Quick Wins',           color: 'text-emerald-700', bg: 'bg-emerald-50',   border: 'border-l-emerald-400' },
  { id: 'strategic',  label: 'Stratégie Contenu',    color: 'text-petrol-deep', bg: 'bg-petrol-light', border: 'border-l-petrol' },
  { id: 'experiment', label: 'Expérimentation',       color: 'text-purple-700',  bg: 'bg-purple-50',    border: 'border-l-purple-400' },
]

const HORIZONS: { id: RoadmapHorizon; label: string; sublabel: string; topAccent: string }[] = [
  { id: 'now',     label: 'Maintenant', sublabel: '0–30 jours', topAccent: 'border-t-copper' },
  { id: 'next',    label: 'Prochain',   sublabel: '1–3 mois',   topAccent: 'border-t-petrol' },
  { id: 'later',   label: 'Plus tard',  sublabel: '3–6 mois',   topAccent: 'border-t-tweed' },
  { id: 'backlog', label: 'Backlog',    sublabel: 'À planifier', topAccent: 'border-t-line' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  if (status === 'in_progress') return <span className="w-2 h-2 rounded-full bg-copper shrink-0 inline-block" />
  if (status === 'done')        return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block" />
  if (status === 'blocked')     return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" />
  return <span className="w-2 h-2 rounded-full border border-tweed/40 shrink-0 inline-block" />
}

// ── Initiative chip (compact card for grid/board) ────────────────────────

function InitiativeChip({
  initiative, onClick, isSelected,
}: { initiative: Initiative; onClick: () => void; isSelected: boolean }) {
  const tc = initiativeTypeConfig(initiative.type)
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
        isSelected
          ? 'bg-white border-copper shadow-card'
          : 'bg-white/60 border-line hover:bg-white hover:border-tweed/40 hover:shadow-subtle'
      }`}
    >
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <StatusDot status={initiative.status} />
          <span className="text-xs font-medium text-ink leading-snug line-clamp-2">{initiative.title}</span>
        </div>
        <span className="text-[11px] font-bold text-tweed shrink-0 ml-1">{initiative.priority_score.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${tc.bg} ${tc.color}`}>
          {tc.label}
        </span>
        {initiative.owner && <span className="text-[10px] text-tweed truncate">{initiative.owner}</span>}
      </div>
    </button>
  )
}

// ── Timeline view (lanes × horizons grid) ───────────────────────────────

function TimelineView({ initiatives, onSelect, selected }: {
  initiatives: Initiative[]; onSelect: (i: Initiative | null) => void; selected: Initiative | null
}) {
  return (
    <div className="p-6 overflow-x-auto">
      <div style={{ minWidth: 860 }}>
        {/* Column headers */}
        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '160px repeat(4, 1fr)' }}>
          <div />
          {HORIZONS.map(h => (
            <div key={h.id} className="text-center px-2 py-2">
              <p className="text-sm font-semibold text-ink">{h.label}</p>
              <p className="text-xs text-tweed">{h.sublabel}</p>
            </div>
          ))}
        </div>
        {/* Lane rows */}
        {LANES.map(lane => {
          const laneItems = initiatives.filter(i => i.type === lane.id)
          return (
            <div key={lane.id} className="grid gap-2 mb-2" style={{ gridTemplateColumns: '160px repeat(4, 1fr)' }}>
              {/* Lane label */}
              <div className={`flex flex-col justify-center px-3 py-3 rounded-lg border-l-4 ${lane.border} ${lane.bg}`}>
                <span className={`text-xs font-semibold ${lane.color} leading-tight`}>{lane.label}</span>
                <span className="text-[10px] text-tweed mt-0.5">{laneItems.length} initiative{laneItems.length !== 1 ? 's' : ''}</span>
              </div>
              {/* Horizon cells */}
              {HORIZONS.map(h => {
                const cell = laneItems.filter(i => i.horizon === h.id)
                return (
                  <div key={h.id} className={`min-h-[90px] p-2 rounded-lg border border-line bg-white/30 flex flex-col gap-1.5`}>
                    {cell.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-xs text-tweed/30">—</span>
                      </div>
                    ) : (
                      cell.map(item => (
                        <InitiativeChip
                          key={item.id}
                          initiative={item}
                          onClick={() => onSelect(selected?.id === item.id ? null : item)}
                          isSelected={selected?.id === item.id}
                        />
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Board view (simple columns) ──────────────────────────────────────────

function BoardView({ initiatives, onSelect, selected }: {
  initiatives: Initiative[]; onSelect: (i: Initiative | null) => void; selected: Initiative | null
}) {
  return (
    <div className="p-6 grid grid-cols-4 gap-4" style={{ minHeight: 'calc(100vh - 220px)' }}>
      {HORIZONS.map(h => {
        const items = initiatives.filter(i => i.horizon === h.id).sort((a, b) => b.priority_score - a.priority_score)
        return (
          <div key={h.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-ink">{h.label}</p>
                <p className="text-xs text-tweed">{h.sublabel}</p>
              </div>
              <span className="text-xs font-bold text-tweed bg-paper-deep rounded-full w-6 h-6 flex items-center justify-center">
                {items.length}
              </span>
            </div>
            <div className={`flex-1 rounded-xl border-t-4 ${h.topAccent} bg-white/50 border border-line p-3 flex flex-col gap-2 overflow-y-auto`}>
              {items.map(item => (
                <InitiativeChip
                  key={item.id}
                  initiative={item}
                  onClick={() => onSelect(selected?.id === item.id ? null : item)}
                  isSelected={selected?.id === item.id}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Detail drawer ────────────────────────────────────────────────────────

function DrawerPanel({ initiative, onClose }: { initiative: Initiative; onClose: () => void }) {
  const tc = initiativeTypeConfig(initiative.type)

  function ScoreBar({ value, color }: { value: number; color: string }) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-paper-deep rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 5) * 100}%` }} />
        </div>
        <span className="text-xs font-medium text-ink w-3 text-right">{value}</span>
      </div>
    )
  }

  return (
    <div className="w-[380px] shrink-0 border-l border-line flex flex-col overflow-y-auto" style={{ background: 'var(--paper-cream)' }}>
      {/* Header */}
      <div className="p-5 border-b border-line">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${tc.bg} ${tc.color}`}>{tc.label}</span>
              <span className="text-[11px] font-mono text-tweed">Score {initiative.priority_score.toFixed(1)}</span>
            </div>
            <h2 className="font-display text-base text-ink font-semibold leading-snug">{initiative.title}</h2>
            {initiative.owner && (
              <div className="flex items-center gap-1.5 mt-2">
                <User size={11} className="text-tweed" />
                <span className="text-xs text-tweed">{initiative.owner}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-paper-deep text-tweed hover:text-ink transition-colors shrink-0 mt-0.5">
            <X size={15} />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <span className="text-[11px] px-2 py-1 rounded-md bg-paper-deep text-ink font-medium capitalize flex items-center gap-1">
            <StatusDot status={initiative.status} />
            {initiative.status.replace('_', ' ')}
          </span>
          <span className="text-[11px] px-2 py-1 rounded-md bg-paper-deep text-tweed capitalize">
            {initiative.horizon === 'now' ? 'Maintenant' :
             initiative.horizon === 'next' ? 'Prochain' :
             initiative.horizon === 'later' ? 'Plus tard' : 'Backlog'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        <div>
          <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-1.5">Pourquoi c'est important</p>
          <p className="text-sm text-ink/80 leading-relaxed">{initiative.why_this_matters}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-1.5">Impact attendu</p>
          <p className="text-sm text-ink/80 leading-relaxed">{initiative.expected_impact}</p>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-tweed uppercase tracking-wider mb-3">Évaluation</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-tweed">Impact visibilité</span>
                <span className="text-xs text-tweed">{impactLabel(initiative.visibility_impact)}</span>
              </div>
              <ScoreBar value={initiative.visibility_impact} color="bg-copper" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-tweed">Effort</span>
                <span className="text-xs text-tweed">{effortLabel(initiative.effort)}</span>
              </div>
              <ScoreBar value={initiative.effort} color="bg-petrol" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-tweed">Confiance</span>
                <span className="text-xs text-tweed">{initiative.confidence}/5</span>
              </div>
              <ScoreBar value={initiative.confidence} color="bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 border-t border-line">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          Modifier l'initiative
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [view, setView] = useState<'timeline' | 'board'>('timeline')
  const [selected, setSelected] = useState<Initiative | null>(null)

  const nowItems = mockInitiatives.filter(i => i.horizon === 'now')
  const inProgress = mockInitiatives.filter(i => i.status === 'in_progress')

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--paper)' }}>
      {/* ── COCKPIT BAR ─────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-line px-8 pt-6 pb-4" style={{ background: 'var(--paper-cream)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold text-tweed uppercase tracking-widest mb-0.5">Pilotage stratégique</p>
            <h1 className="font-display text-2xl font-bold text-ink">Roadmap</h1>
          </div>
          <div className="flex gap-1 bg-paper-deep rounded-lg p-1">
            <button
              onClick={() => setView('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === 'timeline' ? 'bg-white text-ink shadow-subtle' : 'text-tweed hover:text-ink'
              }`}
            >
              <CalendarDays size={13} /> Timeline
            </button>
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === 'board' ? 'bg-white text-ink shadow-subtle' : 'text-tweed hover:text-ink'
              }`}
            >
              <LayoutGrid size={13} /> Board
            </button>
          </div>
        </div>

        {/* Cockpit signals */}
        <div className="grid grid-cols-4 gap-3">
          <div className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 border border-copper/25 bg-copper-light">
            <Zap size={15} className="text-copper mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-copper uppercase tracking-wider">À lancer maintenant</p>
              <p className="text-sm font-semibold text-ink mt-0.5">{nowItems.length} initiatives prêtes</p>
              <p className="text-[11px] text-tweed">Score moy. {nowItems.length ? (nowItems.reduce((a, i) => a + i.priority_score, 0) / nowItems.length).toFixed(1) : '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 border border-petrol/20 bg-petrol-light">
            <TrendingUp size={15} className="text-petrol mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-petrol-deep uppercase tracking-wider">En cours</p>
              <p className="text-sm font-semibold text-ink mt-0.5">{inProgress.length} initiative{inProgress.length !== 1 ? 's' : ''}</p>
              <p className="text-[11px] text-tweed">{inProgress[0]?.owner ?? 'Aucun owner'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 border border-red-200 bg-red-50">
            <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Risque si inaction</p>
              <p className="text-sm font-semibold text-ink mt-0.5">−34% clics blog canin</p>
              <p className="text-[11px] text-tweed">Continue à baisser</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 border border-purple-200 bg-purple-50">
            <Target size={15} className="text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-purple-700 uppercase tracking-wider">Opportunité AI Search</p>
              <p className="text-sm font-semibold text-ink mt-0.5">Contenu E-E-A-T citatoire</p>
              <p className="text-[11px] text-tweed">Impact fort · Planifié Next</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {view === 'timeline'
            ? <TimelineView initiatives={mockInitiatives} onSelect={setSelected} selected={selected} />
            : <BoardView initiatives={mockInitiatives} onSelect={setSelected} selected={selected} />
          }
        </div>
        {selected && <DrawerPanel initiative={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}
