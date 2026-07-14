'use client'

import {
  TrendingDown, TrendingUp, MousePointerClick, Eye, Target,
  AlertTriangle, ArrowRight, Zap, ChevronRight, Clock
} from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockKPIs, mockFindings, mockInitiatives, mockGscTrend } from '@/lib/mock-data'
import { severityConfig, categoryConfig, initiativeTypeConfig, formatNumber, formatPercent } from '@/lib/utils'

// ── KPI tile ─────────────────────────────────────────────────────────────

function KpiTile({ label, value, delta, unit = '%' }: {
  label: string; value: string; delta: number; unit?: string
}) {
  const up = delta > 0
  const isPosition = unit === ''
  const good = isPosition ? delta > 0 : up
  return (
    <div className="bg-white/60 rounded-xl border border-line p-4">
      <p className="text-[11px] font-semibold text-tweed uppercase tracking-wider mb-2">{label}</p>
      <p className="font-display text-2xl font-bold text-ink mb-1">{value}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${good ? 'text-emerald-600' : 'text-red-600'}`}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {delta > 0 ? '+' : ''}{delta.toFixed(1)}{unit} vs 28j
      </span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const kpi = mockKPIs
  const criticals = mockFindings.filter(f => f.severity === 'critical' && !f.is_dismissed)
  const topFinding = criticals[0] ?? mockFindings[0]
  const nowItems = mockInitiatives.filter(i => i.horizon === 'now').sort((a, b) => b.priority_score - a.priority_score)
  const inProgress = mockInitiatives.filter(i => i.status === 'in_progress')

  return (
    <div className="flex flex-col h-screen overflow-auto" style={{ background: 'var(--paper)' }}>

      {/* ── STATUS BANNER ──────────────────────────────────────────────── */}
      <div className="shrink-0 px-8 pt-6 pb-5 border-b border-line" style={{ background: 'var(--paper-cream)' }}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-tweed uppercase tracking-widest mb-1">dogchef.be · 14 juillet 2025</p>
            <h1 className="font-display text-2xl font-bold text-ink mb-2">
              Votre visibilité baisse.{' '}
              <span className="text-copper">{nowItems.length} actions peuvent inverser la tendance.</span>
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {criticals.length} finding{criticals.length !== 1 ? 's' : ''} critique{criticals.length !== 1 ? 's' : ''}
              </span>
              <span className="text-tweed/40">·</span>
              <span className="text-xs text-tweed">{kpi.findings_count} findings actifs</span>
              <span className="text-tweed/40">·</span>
              <span className="text-xs text-tweed">{kpi.roadmap_items} initiatives planifiées</span>
              <span className="text-tweed/40">·</span>
              <span className="text-xs text-petrol font-medium">GSC sync · URL Inspection</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/findings" className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-line bg-white text-xs font-semibold text-tweed hover:text-ink hover:border-tweed/40 transition-all">
              Findings <ArrowRight size={12} />
            </Link>
            <Link href="/roadmap" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              Roadmap <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 space-y-6">

        {/* ── KPI ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          <KpiTile label="Clics (28j)" value={formatNumber(kpi.total_clicks, true)} delta={kpi.clicks_delta} />
          <KpiTile label="Impressions (28j)" value={formatNumber(kpi.total_impressions, true)} delta={kpi.impressions_delta} />
          <KpiTile label="CTR moyen" value={formatPercent(kpi.avg_ctr)} delta={kpi.ctr_delta} unit="pts" />
          <KpiTile label="Position moy." value={kpi.avg_position.toFixed(1)} delta={kpi.position_delta} unit="" />
        </div>

        {/* ── MAIN ROW ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-4">

          {/* Trend chart */}
          <div className="col-span-5 bg-white/60 rounded-xl border border-line p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-ink">Clics — 5 semaines</p>
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                −{Math.abs(kpi.clicks_delta)}% tendance
              </span>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={mockGscTrend} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#526a68" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#526a68" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8b7a64' }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#8b7a64' }} />
                <Tooltip
                  formatter={(v: number) => [formatNumber(v), 'Clics']}
                  contentStyle={{ fontFamily: 'Instrument Sans', fontSize: 11, border: '1px solid rgba(112,91,70,0.18)' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#526a68" fill="url(#clickGrad)" strokeWidth={2} dot={{ r: 2.5, fill: '#526a68' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Critical signal */}
          <div className="col-span-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-red-500" />
                <p className="text-xs font-semibold text-ink">Signal prioritaire</p>
              </div>
              <Link href="/findings" className="text-xs text-petrol font-medium hover:underline">Voir pipeline →</Link>
            </div>
            {topFinding && (() => {
              const sev = severityConfig(topFinding.severity)
              const cat = categoryConfig(topFinding.category)
              return (
                <div className="flex-1 bg-white/70 rounded-xl border-l-4 border-l-red-400 border border-line p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${sev.bg} ${sev.color}`}>{sev.label}</span>
                    <span className="text-[10px] text-tweed">{cat.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-ink leading-snug mb-2">{topFinding.title}</p>
                  <p className="text-xs text-tweed leading-relaxed line-clamp-3">{topFinding.description}</p>
                  {topFinding.metric_value !== undefined && (
                    <p className="text-lg font-bold text-red-600 mt-3">{topFinding.metric_value > 0 ? '+' : ''}{topFinding.metric_value} <span className="text-xs font-normal text-tweed">{topFinding.metric_label}</span></p>
                  )}
                </div>
              )
            })()}
            <div className="grid grid-cols-2 gap-2">
              {mockFindings.filter(f => f.severity === 'critical' || f.severity === 'high').slice(1, 3).map(f => {
                const sev = severityConfig(f.severity)
                return (
                  <div key={f.id} className="bg-white/50 rounded-lg border border-line p-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${sev.bg} ${sev.color} mb-1.5 inline-block`}>{sev.label}</span>
                    <p className="text-xs font-medium text-ink leading-snug line-clamp-2">{f.title}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Now initiatives */}
          <div className="col-span-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-copper" />
                <p className="text-xs font-semibold text-ink">À lancer maintenant</p>
              </div>
              <Link href="/roadmap" className="text-xs text-petrol font-medium hover:underline">Roadmap →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {nowItems.slice(0, 3).map(item => {
                const tc = initiativeTypeConfig(item.type)
                return (
                  <div key={item.id} className="bg-white/70 rounded-lg border border-line p-3 hover:shadow-subtle transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${tc.bg} ${tc.color}`}>{tc.label}</span>
                      <span className="text-[11px] font-bold text-tweed">{item.priority_score.toFixed(1)}</span>
                    </div>
                    <p className="text-xs font-medium text-ink leading-snug mb-1 line-clamp-2">{item.title}</p>
                    <div className="flex items-center gap-2">
                      {item.status === 'in_progress' && (
                        <span className="flex items-center gap-1 text-[10px] text-copper font-semibold">
                          <Clock size={9} /> En cours
                        </span>
                      )}
                      {item.owner && <span className="text-[10px] text-tweed">{item.owner}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── NEXT ACTION STRIP ────────────────────────────────────────── */}
        <div className="rounded-xl border border-line bg-white/40 p-4">
          <p className="text-xs font-semibold text-tweed uppercase tracking-wider mb-3">Parcours recommandé</p>
          <div className="flex items-center gap-2">
            {[
              { step: '1', label: 'Analyser les findings', sub: `${kpi.findings_count} actifs · ${criticals.length} critiques`, href: '/findings', urgent: criticals.length > 0 },
              { step: '2', label: 'Valider les opportunités', sub: `${kpi.opportunities_count} à traiter`, href: '/opportunities', urgent: false },
              { step: '3', label: 'Lancer les initiatives Now', sub: `${nowItems.length} prêtes`, href: '/roadmap', urgent: false },
              { step: '4', label: 'Partager la vue executive', sub: 'Pour le CODIR', href: '/executive', urgent: false },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-2 flex-1">
                <Link href={item.href} className={`flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all hover:shadow-subtle ${item.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-line hover:border-tweed/30'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${item.urgent ? 'bg-red-500 text-white' : 'bg-paper-deep text-tweed'}`}>{item.step}</span>
                    <div>
                      <p className={`text-xs font-semibold ${item.urgent ? 'text-red-700' : 'text-ink'}`}>{item.label}</p>
                      <p className="text-[10px] text-tweed">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-tweed shrink-0" />
                </Link>
                {i < 3 && <ArrowRight size={14} className="text-tweed/30 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
