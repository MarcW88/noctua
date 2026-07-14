'use client'

import {
  Zap, ArrowRight, AlertTriangle, TrendingUp, Target,
  ChevronRight, User, Clock, Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { mockInitiatives, mockFindings } from '@/lib/mock-data'
import { initiativeTypeConfig, severityConfig, categoryConfig } from '@/lib/utils'
import type { Initiative, Finding } from '@/lib/types'

// ── Portfolio sections ────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'now',
    label: 'Now',
    question: 'Qu\'est-ce qu\'on lance cette semaine ?',
    color: 'text-copper',
    bg: 'bg-copper-light',
    borderTop: 'border-t-copper',
    borderLeft: 'border-l-2 border-l-copper',
    icon: Zap,
  },
  {
    id: 'next',
    label: 'Next',
    question: 'Qu\'est-ce qu\'on prépare ce trimestre ?',
    color: 'text-petrol-deep',
    bg: 'bg-petrol-light',
    borderTop: 'border-t-petrol',
    borderLeft: 'border-l-2 border-l-petrol',
    icon: TrendingUp,
  },
  {
    id: 'bets',
    label: 'Bets',
    question: 'Quels chantiers structurants valent l\'investissement ?',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    borderTop: 'border-t-purple-400',
    borderLeft: 'border-l-2 border-l-purple-400',
    icon: Target,
  },
  {
    id: 'risks',
    label: 'Risks',
    question: 'Qu\'est-ce qui nous bloque ou nous expose ?',
    color: 'text-red-700',
    bg: 'bg-red-50',
    borderTop: 'border-t-red-400',
    borderLeft: 'border-l-2 border-l-red-400',
    icon: AlertTriangle,
  },
] as const

type SectionId = typeof SECTIONS[number]['id']

// ── Helpers ────────────────────────────────────────────────────────────────

function getSection(i: Initiative): SectionId {
  if (i.horizon === 'now') return 'now'
  if (i.horizon === 'next') return 'next'
  return 'bets'
}

const impactBadge = (score: number) => {
  if (score >= 5) return { label: 'Impact maximal', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  if (score >= 4) return { label: 'Impact fort', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  if (score >= 3) return { label: 'Impact modéré', cls: 'text-amber-700 bg-amber-50 border-amber-200' }
  return { label: 'Impact faible', cls: 'text-tweed bg-paper-deep border-line' }
}

const effortBadge = (score: number) => {
  if (score <= 1) return { label: 'Effort minimal', cls: 'text-emerald-700' }
  if (score <= 2) return { label: 'Effort faible', cls: 'text-emerald-600' }
  if (score <= 3) return { label: 'Effort moyen', cls: 'text-amber-600' }
  return { label: 'Effort élevé', cls: 'text-red-600' }
}

// ── Initiative card ────────────────────────────────────────────────────────

function InitiativeCard({ initiative, borderLeft }: { initiative: Initiative; borderLeft: string }) {
  const tc = initiativeTypeConfig(initiative.type)
  const imp = impactBadge(initiative.visibility_impact)
  const eff = effortBadge(initiative.effort)
  const isActive = initiative.status === 'in_progress'

  return (
    <div className={`bg-white rounded-xl border border-line ${borderLeft} p-4 hover:shadow-subtle transition-all group`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${tc.bg} ${tc.color}`}>{tc.label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${imp.cls}`}>{imp.label}</span>
          {isActive && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-copper">
              <Clock size={9} /> En cours
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold text-tweed shrink-0">{initiative.priority_score.toFixed(1)}</span>
      </div>

      <p className="text-sm font-semibold text-ink leading-snug mb-1.5">{initiative.title}</p>
      <p className="text-xs text-tweed leading-relaxed line-clamp-2 mb-3">{initiative.why_this_matters}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {initiative.owner && (
            <span className="flex items-center gap-1 text-[11px] text-tweed">
              <User size={10} /> {initiative.owner}
            </span>
          )}
          <span className={`text-[11px] font-medium ${eff.cls}`}>{eff.label}</span>
        </div>
        <Link href="/roadmap" className="flex items-center gap-1 text-[11px] font-semibold text-petrol opacity-0 group-hover:opacity-100 transition-opacity">
          Roadmap <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  )
}

// ── Risk card ──────────────────────────────────────────────────────────────

function RiskCard({ finding }: { finding: Finding }) {
  const sev = severityConfig(finding.severity)
  const cat = categoryConfig(finding.category)
  return (
    <div className="bg-white rounded-xl border border-line border-l-2 border-l-red-400 p-4 hover:shadow-subtle transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${sev.bg} ${sev.color}`}>{sev.label}</span>
        <span className="text-[10px] text-tweed">{cat.label}</span>
        <span className="text-[10px] text-red-600 font-medium ml-auto">Sans initiative planifiée</span>
      </div>
      <p className="text-sm font-semibold text-ink leading-snug mb-1">{finding.title}</p>
      {finding.metric_value !== undefined && (
        <p className="text-xs font-bold text-red-600">{finding.metric_value > 0 ? '+' : ''}{finding.metric_value} {finding.metric_label}</p>
      )}
      <div className="mt-3">
        <Link href="/findings" className="flex items-center gap-1 text-[11px] font-semibold text-petrol hover:underline">
          <Lightbulb size={11} /> Créer une initiative <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function InitiativesPage() {
  const nowItems = mockInitiatives.filter(i => getSection(i) === 'now')
  const nextItems = mockInitiatives.filter(i => getSection(i) === 'next')
  const betsItems = mockInitiatives.filter(i => getSection(i) === 'bets')
  const risks = mockFindings.filter(f =>
    (f.severity === 'critical' || f.severity === 'high') &&
    !f.is_dismissed &&
    !['f10', 'f11', 'f2', 'f9', 'f8', 'f1'].includes(f.id)
  )

  const sections = [
    { conf: SECTIONS[0], items: nowItems, type: 'initiative' as const },
    { conf: SECTIONS[1], items: nextItems, type: 'initiative' as const },
    { conf: SECTIONS[2], items: betsItems, type: 'initiative' as const },
    { conf: SECTIONS[3], items: risks, type: 'risk' as const },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--paper)' }}>

      {/* Header */}
      <div className="shrink-0 border-b border-line px-8 pt-6 pb-4" style={{ background: 'var(--paper-cream)' }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold text-tweed uppercase tracking-widest mb-0.5">Portefeuille de décisions</p>
            <h1 className="font-display text-2xl font-bold text-ink">Initiatives</h1>
            <p className="text-xs text-tweed mt-1">
              {mockInitiatives.length} initiatives · {nowItems.length} à lancer maintenant · {risks.length} risques non adressés
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/findings" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line bg-white text-xs font-semibold text-tweed hover:text-ink transition-all">
              Evidence <ArrowRight size={12} />
            </Link>
            <Link href="/roadmap" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              Roadmap <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Section summary strip */}
        <div className="flex gap-3 mt-4">
          {sections.map(({ conf, items }) => {
            const Icon = conf.icon
            return (
              <div key={conf.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${conf.bg} ${
                conf.id === 'now' ? 'border-copper/25' :
                conf.id === 'next' ? 'border-wash' :
                conf.id === 'bets' ? 'border-purple-200' : 'border-red-200'
              }`}>
                <Icon size={12} className={conf.color} />
                <span className={`text-[11px] font-semibold ${conf.color}`}>{conf.label}</span>
                <span className={`text-[11px] font-bold ${conf.color}`}>{items.length}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4-quadrant portfolio */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-5 h-full">
          {sections.map(({ conf, items, type }) => {
            const Icon = conf.icon
            return (
              <div key={conf.id} className="flex flex-col">
                {/* Section header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon size={14} className={conf.color} />
                      <h2 className={`text-sm font-bold ${conf.color}`}>{conf.label}</h2>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${conf.color} ${conf.bg}`}>{items.length}</span>
                    </div>
                    <p className="text-xs text-tweed ml-5">{conf.question}</p>
                  </div>
                </div>

                {/* Cards column */}
                <div className={`flex-1 rounded-xl border-t-4 ${conf.borderTop} bg-white/30 border border-line p-3 flex flex-col gap-2.5 overflow-y-auto`}>
                  {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-xs text-tweed/30">—</span>
                    </div>
                  ) : type === 'initiative' ? (
                    (items as Initiative[]).map(i => (
                      <InitiativeCard key={i.id} initiative={i} borderLeft={conf.borderLeft} />
                    ))
                  ) : (
                    (items as Finding[]).map(f => (
                      <RiskCard key={f.id} finding={f} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
