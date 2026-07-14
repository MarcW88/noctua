'use client'

import {
  TrendingDown, TrendingUp, MousePointerClick, Eye, Target, AlertTriangle, Lightbulb, Map, ArrowRight, Zap
} from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockKPIs, mockFindings, mockInitiatives, mockGscTrend } from '@/lib/mock-data'
import { severityConfig, categoryConfig, initiativeTypeConfig, horizonConfig, formatNumber, formatPercent } from '@/lib/utils'

function DeltaBadge({ value, unit = '' }: { value: number; unit?: string }) {
  const isPositive = value > 0
  const isNeutral = value === 0
  const Icon = isPositive ? TrendingUp : TrendingDown
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold"
      style={{ color: isNeutral ? 'var(--tweed)' : isPositive ? '#16a34a' : '#dc2626' }}
    >
      <Icon size={12} />
      {value > 0 ? '+' : ''}{value.toFixed(1)}{unit}
    </span>
  )
}

function KpiCard({ label, value, delta, deltaUnit, icon: Icon, color }: {
  label: string; value: string; delta: number; deltaUnit?: string; icon: React.ElementType; color: string
}) {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--tweed)' }}>{label}</p>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{value}</p>
        <DeltaBadge value={delta} unit={deltaUnit} />
        <span className="text-xs ml-1" style={{ color: 'var(--tweed)' }}>vs 28j</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const kpi = mockKPIs
  const topFindings = mockFindings.slice(0, 4)
  const nowItems = mockInitiatives.filter(i => i.horizon === 'now')

  return (
    <div className="p-8 max-w-[1200px]">
      <div className="mb-8">
        <p className="eyebrow mb-1">Overview</p>
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--petrol-deep)' }}>
          dogchef.be
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tweed)' }}>
          Dernière mise à jour : 14 juillet 2025 · GSC sync · 11 findings actifs
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Clics (28j)"
          value={formatNumber(kpi.total_clicks, true)}
          delta={kpi.clicks_delta}
          deltaUnit="%"
          icon={MousePointerClick}
          color="var(--petrol)"
        />
        <KpiCard
          label="Impressions (28j)"
          value={formatNumber(kpi.total_impressions, true)}
          delta={kpi.impressions_delta}
          deltaUnit="%"
          icon={Eye}
          color="var(--copper)"
        />
        <KpiCard
          label="CTR moyen"
          value={formatPercent(kpi.avg_ctr)}
          delta={kpi.ctr_delta}
          deltaUnit="pts"
          icon={Target}
          color="var(--petrol)"
        />
        <KpiCard
          label="Position moy."
          value={kpi.avg_position.toFixed(1)}
          delta={kpi.position_delta}
          deltaUnit=""
          icon={TrendingDown}
          color="#dc2626"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Clics — 5 dernières semaines</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={mockGscTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--petrol)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--petrol)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--tweed)' }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--tweed)' }} />
              <Tooltip
                formatter={(v: number) => [formatNumber(v), 'Clics']}
                labelFormatter={l => `Semaine du ${l}`}
                contentStyle={{ fontFamily: 'Instrument Sans', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="clicks" stroke="var(--petrol)" fill="url(#clickGrad)" strokeWidth={2} dot={{ r: 3, fill: 'var(--petrol)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 flex flex-col justify-between">
          <p className="font-semibold text-sm mb-4" style={{ color: 'var(--ink)' }}>Statut plateforme</p>
          <div className="space-y-3">
            {[
              { label: 'Findings actifs', value: kpi.findings_count, color: 'var(--ink)' },
              { label: 'Critiques', value: kpi.critical_findings, color: '#dc2626' },
              { label: 'Opportunités', value: kpi.opportunities_count, color: 'var(--copper)' },
              { label: 'Items roadmap', value: kpi.roadmap_items, color: 'var(--petrol)' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--tweed)' }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          <Link href="/findings" className="mt-4 btn-secondary text-xs justify-center">
            Voir tous les findings <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} style={{ color: 'var(--copper)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Top Findings</h2>
            </div>
            <Link href="/findings" className="text-xs font-medium" style={{ color: 'var(--petrol)' }}>
              Voir tout →
            </Link>
          </div>
          <div className="card divide-y" style={{ borderColor: 'var(--line)' }}>
            {topFindings.map(f => {
              const sev = severityConfig(f.severity)
              const cat = categoryConfig(f.category)
              return (
                <div key={f.id} className="px-4 py-3 flex items-start gap-3 hover:bg-paper-deep transition-colors">
                  <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--ink)' }}>{f.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: 'var(--tweed)' }}>{cat.label}</span>
                      <span className={`badge text-xs ${sev.bg} ${sev.color}`}>{sev.label}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={15} style={{ color: 'var(--copper)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>En cours — Now</h2>
            </div>
            <Link href="/roadmap" className="text-xs font-medium" style={{ color: 'var(--petrol)' }}>
              Voir roadmap →
            </Link>
          </div>
          <div className="card divide-y" style={{ borderColor: 'var(--line)' }}>
            {nowItems.map(item => {
              const typeConf = initiativeTypeConfig(item.type)
              const horizConf = horizonConfig(item.horizon)
              return (
                <div key={item.id} className="px-4 py-3 flex items-start gap-3 hover:bg-paper-deep transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--ink)' }}>{item.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`badge ${typeConf.bg} ${typeConf.color}`}>{typeConf.label}</span>
                      <span className="text-xs" style={{ color: 'var(--tweed)' }}>
                        Impact {item.visibility_impact}/5 · Effort {item.effort}/5
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: item.status === 'in_progress' ? 'var(--petrol-light)' : 'var(--paper-deep)',
                      color: item.status === 'in_progress' ? 'var(--petrol-deep)' : 'var(--tweed)',
                    }}
                  >
                    {item.status === 'in_progress' ? 'En cours' : 'À faire'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
