'use client'

import { useState } from 'react'
import { Map, LayoutGrid, Calendar, Plus, User, ChevronRight } from 'lucide-react'
import { mockInitiatives } from '@/lib/mock-data'
import { initiativeTypeConfig, horizonConfig, effortLabel, impactLabel } from '@/lib/utils'
import type { Initiative, RoadmapHorizon } from '@/lib/types'

const columns: { id: RoadmapHorizon; label: string; description: string }[] = [
  { id: 'now', label: 'Now', description: 'En cours ce trimestre' },
  { id: 'next', label: 'Next', description: 'Prochain trimestre' },
  { id: 'later', label: 'Later', description: 'Horizons suivants' },
  { id: 'backlog', label: 'Backlog', description: 'Non planifié' },
]

function PriorityBar({ score }: { score: number }) {
  const pct = Math.round((score / 10) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: 'var(--petrol)' }}
        />
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color: 'var(--petrol)' }}>
        {score.toFixed(0)}
      </span>
    </div>
  )
}

function InitiativeCard({ item }: { item: Initiative }) {
  const typeConf = initiativeTypeConfig(item.type)
  const statusLabel = item.status === 'in_progress' ? 'En cours' : item.status === 'done' ? 'Terminé' : item.status === 'blocked' ? 'Bloqué' : 'À faire'
  const statusColor = item.status === 'in_progress' ? 'var(--petrol)' : item.status === 'done' ? '#16a34a' : item.status === 'blocked' ? '#dc2626' : 'var(--tweed)'

  return (
    <div
      className="card p-4 space-y-3 cursor-pointer hover:shadow-card-hover transition-all"
      style={{ borderLeft: `3px solid ${item.status === 'in_progress' ? 'var(--petrol)' : item.status === 'done' ? '#16a34a' : 'var(--line)'}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`badge text-xs ${typeConf.bg} ${typeConf.color}`}>{typeConf.label}</span>
        <span className="text-xs font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
      </div>

      <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--ink)' }}>
        {item.title}
      </h3>

      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--tweed)' }}>
        {item.why_this_matters}
      </p>

      <PriorityBar score={item.priority_score} />

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <span className="text-xs" style={{ color: 'var(--tweed)' }}>
            Impact <span className="font-semibold" style={{ color: 'var(--ink)' }}>{item.visibility_impact}/5</span>
          </span>
          <span className="text-xs" style={{ color: 'var(--tweed)' }}>
            Effort <span className="font-semibold" style={{ color: 'var(--ink)' }}>{item.effort}/5</span>
          </span>
        </div>
        {item.owner && (
          <div className="flex items-center gap-1">
            <User size={10} style={{ color: 'var(--tweed)' }} />
            <span className="text-xs" style={{ color: 'var(--tweed)' }}>{item.owner}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function BoardView() {
  return (
    <div className="grid grid-cols-4 gap-5">
      {columns.map(col => {
        const items = mockInitiatives.filter(i => i.horizon === col.id)
        const hConf = horizonConfig(col.id)
        return (
          <div key={col.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: col.id === 'now' ? 'var(--copper)' : col.id === 'next' ? 'var(--petrol)' : 'var(--tweed)' }}
                  />
                  <h3 className="font-display font-bold text-base" style={{ color: 'var(--petrol-deep)' }}>{col.label}</h3>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: hConf.bg, color: hConf.color, border: `1px solid ${hConf.border === 'border-line' ? 'var(--line)' : 'var(--wash)'}` }}
                  >
                    {items.length}
                  </span>
                </div>
                <p className="text-xs ml-4.5 mt-0.5" style={{ color: 'var(--tweed)' }}>{col.description}</p>
              </div>
              <button className="p-1 rounded hover:bg-paper-deep" title="Ajouter une initiative">
                <Plus size={14} style={{ color: 'var(--tweed)' }} />
              </button>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <InitiativeCard key={item.id} item={item} />
              ))}
              {items.length === 0 && (
                <div
                  className="py-8 text-center rounded-lg border-2 border-dashed"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--tweed)' }}>Aucune initiative</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TimelineView() {
  const sorted = [...mockInitiatives].sort((a, b) => b.priority_score - a.priority_score)

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b grid grid-cols-12 text-xs font-bold uppercase tracking-wider"
        style={{ borderColor: 'var(--line)', color: 'var(--tweed)', background: 'var(--paper-deep)' }}>
        <span className="col-span-5">Initiative</span>
        <span className="col-span-2">Type</span>
        <span className="col-span-1 text-center">Impact</span>
        <span className="col-span-1 text-center">Effort</span>
        <span className="col-span-1 text-center">Score</span>
        <span className="col-span-1 text-center">Horizon</span>
        <span className="col-span-1 text-center">Statut</span>
      </div>
      {sorted.map(item => {
        const typeConf = initiativeTypeConfig(item.type)
        const hConf = horizonConfig(item.horizon)
        const statusLabel = item.status === 'in_progress' ? 'En cours' : item.status === 'done' ? 'Terminé' : 'À faire'
        const statusColor = item.status === 'in_progress' ? 'var(--petrol)' : item.status === 'done' ? '#16a34a' : 'var(--tweed)'
        return (
          <div key={item.id} className="px-5 py-3.5 border-b grid grid-cols-12 items-center hover:bg-paper-deep transition-colors"
            style={{ borderColor: 'var(--line)' }}>
            <div className="col-span-5">
              <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ink)' }}>{item.title}</p>
              {item.owner && <p className="text-xs mt-0.5" style={{ color: 'var(--tweed)' }}>{item.owner}</p>}
            </div>
            <span className={`col-span-2 badge text-xs w-fit ${typeConf.bg} ${typeConf.color}`}>{typeConf.label}</span>
            <span className="col-span-1 text-center text-sm font-bold" style={{ color: 'var(--petrol)' }}>{item.visibility_impact}/5</span>
            <span className="col-span-1 text-center text-sm font-bold" style={{ color: 'var(--tweed)' }}>{item.effort}/5</span>
            <span className="col-span-1 text-center">
              <span className="text-sm font-bold" style={{ color: 'var(--petrol-deep)' }}>{item.priority_score.toFixed(1)}</span>
            </span>
            <span className="col-span-1 text-center">
              <span className={`badge text-xs ${hConf.bg} ${hConf.color}`}>{hConf.label}</span>
            </span>
            <span className="col-span-1 text-center text-xs font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function RoadmapPage() {
  const [view, setView] = useState<'board' | 'timeline'>('board')

  const nowCount = mockInitiatives.filter(i => i.horizon === 'now').length
  const nextCount = mockInitiatives.filter(i => i.horizon === 'next').length
  const inProgressCount = mockInitiatives.filter(i => i.status === 'in_progress').length

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="eyebrow mb-1">Planification</p>
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--petrol-deep)' }}>
            Roadmap
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tweed)' }}>
            {mockInitiatives.length} initiatives · {inProgressCount} en cours · {nowCount} planifiées Now · {nextCount} planifiées Next
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
            <button
              onClick={() => setView('board')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                background: view === 'board' ? 'var(--petrol)' : 'var(--paper-cream)',
                color: view === 'board' ? 'var(--paper-cream)' : 'var(--tweed)',
              }}
            >
              <LayoutGrid size={13} />
              Board
            </button>
            <button
              onClick={() => setView('timeline')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                background: view === 'timeline' ? 'var(--petrol)' : 'var(--paper-cream)',
                color: view === 'timeline' ? 'var(--paper-cream)' : 'var(--tweed)',
              }}
            >
              <Calendar size={13} />
              Timeline
            </button>
          </div>
          <button className="btn-primary text-sm">
            <Plus size={14} />
            Ajouter
          </button>
        </div>
      </div>

      {view === 'board' ? <BoardView /> : <TimelineView />}
    </div>
  )
}
