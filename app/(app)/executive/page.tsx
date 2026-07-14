'use client'

import { AlertTriangle, TrendingUp, Zap, Target, ArrowUpRight, Download } from 'lucide-react'
import { mockKPIs, mockInitiatives, mockOpportunities, mockFindings } from '@/lib/mock-data'
import { initiativeTypeConfig, horizonConfig } from '@/lib/utils'

function RiskCard({ title, description, level }: { title: string; description: string; level: 'critical' | 'high' | 'medium' }) {
  const colors = {
    critical: { bg: '#fee2e2', border: '#fca5a5', dot: '#dc2626', label: 'Critique' },
    high: { bg: '#fff7ed', border: '#fed7aa', dot: '#ea580c', label: 'Haute' },
    medium: { bg: '#fefce8', border: '#fde68a', dot: '#ca8a04', label: 'Moyenne' },
  }
  const c = colors[level]
  return (
    <div className="p-4 rounded-lg border" style={{ background: c.bg, borderColor: c.border }}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: c.dot }}>{c.label}</span>
      </div>
      <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>{title}</h4>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--tweed)' }}>{description}</p>
    </div>
  )
}

function ImpactRow({ label, value, description, horizon }: {
  label: string; value: string; description: string; horizon: string
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--tweed)' }}>{description}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-sm" style={{ color: 'var(--petrol)' }}>{value}</p>
        <p className="text-xs" style={{ color: 'var(--tweed)' }}>{horizon}</p>
      </div>
    </div>
  )
}

export default function ExecutivePage() {
  const nowItems = mockInitiatives.filter(i => i.horizon === 'now')
  const quickWins = mockInitiatives.filter(i => i.type === 'quick_win')
  const strategicItems = mockInitiatives.filter(i => i.type === 'strategic')
  const criticalFindings = mockFindings.filter(f => f.severity === 'critical' || f.severity === 'high')
  const acceptedOpps = mockOpportunities.filter(o => o.status === 'accepted')

  return (
    <div className="p-8 max-w-[1000px]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Synthèse C-Level</p>
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--petrol-deep)' }}>
            Vue Executive
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tweed)' }}>
            dogchef.be · Juillet 2025 · Données GSC + SERP
          </p>
        </div>
        <button className="btn-secondary text-sm">
          <Download size={14} />
          Exporter
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Clics (28j)', value: '14 820', delta: '-12%', icon: TrendingUp, color: '#dc2626' },
          { label: 'Findings prioritaires', value: '11', delta: `dont ${criticalFindings.length} critiques`, icon: AlertTriangle, color: 'var(--copper)' },
          { label: 'Opportunités prêtes', value: String(acceptedOpps.length), delta: 'acceptées', icon: Target, color: 'var(--petrol)' },
          { label: 'Actions Now', value: String(nowItems.length), delta: `dont ${nowItems.filter(i => i.status === 'in_progress').length} en cours`, icon: Zap, color: '#16a34a' },
        ].map(kpi => (
          <div key={kpi.label} className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--tweed)' }}>{kpi.label}</p>
              <kpi.icon size={14} style={{ color: kpi.color }} />
            </div>
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>{kpi.value}</p>
            <p className="text-xs font-medium" style={{ color: kpi.color }}>{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} style={{ color: 'var(--copper)' }} />
            <h2 className="font-display text-lg font-bold" style={{ color: 'var(--petrol-deep)' }}>
              Risques de l&apos;inaction
            </h2>
          </div>
          <div className="space-y-3">
            <RiskCard
              level="critical"
              title="Canonical cassé sur /chien-age"
              description="Page stratégique non indexée. Chaque semaine sans fix est du trafic potentiel définitivement perdu."
            />
            <RiskCard
              level="high"
              title="Absence totale dans les AI Overviews"
              description="Les concurrents sont déjà cités. L'absence dans l'AI Search devient structurelle sans action rapide sur le contenu."
            />
            <RiskCard
              level="high"
              title="DogFood.be domine 78% du top 3"
              description="Sans renforcement des pages produit, l'écart de visibilité va continuer à se creuser trimestriellement."
            />
            <RiskCard
              level="medium"
              title="Chute de -34% sur le cluster blog canin"
              description="Tendance non corrigée qui peut s'étendre aux autres clusters éditoriaux dans les 60 jours."
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: '#16a34a' }} />
            <h2 className="font-display text-lg font-bold" style={{ color: 'var(--petrol-deep)' }}>
              Impact attendu — initiatives Now
            </h2>
          </div>
          <div className="card p-4">
            <ImpactRow
              label="Fix canonical /chien-age"
              value="+120 clics/mois"
              description="Indexation attendue 2–4 semaines"
              horizon="Now · Effort faible"
            />
            <ImpactRow
              label="Optimisation CTR pages blog"
              value="+200–400 clics/mois"
              description="Amélioration titres et métas"
              horizon="Now · Effort faible"
            />
            <ImpactRow
              label="Fix maillage interne"
              value="3 pages indexées"
              description="Crawl des pages orphelines"
              horizon="Now · Effort moyen"
            />
            <ImpactRow
              label="Cluster nutrition senior"
              value="+500–1200 clics/mois"
              description="Horizon 4–6 mois"
              horizon="Next · Effort élevé"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} style={{ color: 'var(--petrol)' }} />
          <h2 className="font-display text-lg font-bold" style={{ color: 'var(--petrol-deep)' }}>
            Répartition des initiatives par type
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Quick Wins', count: quickWins.length, desc: 'Gains rapides, effort faible', color: '#16a34a', bg: '#dcfce7' },
            { label: 'Core Fixes', count: mockInitiatives.filter(i => i.type === 'core_fix').length, desc: 'Correctifs structurels', color: '#ea580c', bg: '#fff7ed' },
            { label: 'Strategic', count: strategicItems.length, desc: 'Chantiers long terme', color: 'var(--petrol)', bg: 'var(--petrol-light)' },
            { label: 'Experiments', count: mockInitiatives.filter(i => i.type === 'experiment').length, desc: 'Tests ciblés', color: '#7c3aed', bg: '#ede9fe' },
          ].map(item => (
            <div key={item.label} className="card p-4 text-center">
              <p className="font-display text-4xl font-bold mb-1" style={{ color: item.color }}>{item.count}</p>
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--ink)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--tweed)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: 'var(--copper)' }} />
          <h2 className="font-display text-lg font-bold" style={{ color: 'var(--petrol-deep)' }}>
            Initiatives prioritaires Now
          </h2>
        </div>
        <div className="card divide-y" style={{ borderColor: 'var(--line)' }}>
          {nowItems.map(item => {
            const typeConf = initiativeTypeConfig(item.type)
            return (
              <div key={item.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs ${typeConf.bg} ${typeConf.color}`}>{typeConf.label}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--tweed)' }}>{item.owner}</span>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{item.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--tweed)' }}>{item.expected_impact}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lg" style={{ color: 'var(--petrol)' }}>{item.priority_score.toFixed(0)}</p>
                  <p className="text-xs" style={{ color: 'var(--tweed)' }}>score</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
