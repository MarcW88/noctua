'use client'

import { useState } from 'react'
import { AlertTriangle, Globe, Sparkles, FileText, SearchX, TrendingDown, ChevronRight, LinkIcon, X } from 'lucide-react'
import { mockFindings } from '@/lib/mock-data'
import { severityConfig, categoryConfig } from '@/lib/utils'
import type { Finding, FindingCategory } from '@/lib/types'

const tabs: { id: FindingCategory; label: string; icon: React.ElementType }[] = [
  { id: 'visibility', label: 'Visibilité', icon: TrendingDown },
  { id: 'serp', label: 'SERP', icon: Globe },
  { id: 'ai_search', label: 'AI Search', icon: Sparkles },
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'indexation', label: 'Indexation', icon: SearchX },
]

function FindingRow({ finding, onSelect }: { finding: Finding; onSelect: (f: Finding) => void }) {
  const sev = severityConfig(finding.severity)
  return (
    <div
      className="px-5 py-4 flex items-start gap-4 border-b hover:bg-paper-deep cursor-pointer transition-colors"
      style={{ borderColor: 'var(--line)' }}
      onClick={() => onSelect(finding)}
    >
      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug mb-1" style={{ color: 'var(--ink)' }}>
          {finding.title}
        </p>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--tweed)' }}>
          {finding.description}
        </p>
        {finding.asset_url && (
          <div className="flex items-center gap-1 mt-1.5">
            <LinkIcon size={10} style={{ color: 'var(--petrol)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--petrol)' }}>{finding.asset_url}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className={`badge ${sev.bg} ${sev.color}`}>{sev.label}</span>
        {finding.metric_value !== undefined && finding.metric_label && (
          <span className="text-xs font-bold" style={{ color: finding.metric_value < 0 ? '#dc2626' : 'var(--petrol)' }}>
            {finding.metric_value > 0 ? '+' : ''}{finding.metric_value} {finding.metric_label}
          </span>
        )}
        <ChevronRight size={14} style={{ color: 'var(--tweed)' }} />
      </div>
    </div>
  )
}

function FindingPanel({ finding, onClose }: { finding: Finding; onClose: () => void }) {
  const sev = severityConfig(finding.severity)
  const cat = categoryConfig(finding.category)

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] border-l shadow-card-hover z-40 flex flex-col overflow-y-auto"
      style={{ background: 'var(--paper-cream)', borderColor: 'var(--line)' }}>
      <div className="px-6 py-5 border-b flex items-start justify-between" style={{ borderColor: 'var(--line)' }}>
        <div>
          <p className="eyebrow mb-1">{cat.label}</p>
          <span className={`badge ${sev.bg} ${sev.color}`}>{sev.label}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-paper-deep">
          <X size={18} style={{ color: 'var(--tweed)' }} />
        </button>
      </div>
      <div className="px-6 py-5 space-y-5 flex-1">
        <h2 className="font-display text-xl font-bold leading-snug" style={{ color: 'var(--petrol-deep)' }}>
          {finding.title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--tweed)' }}>
          {finding.description}
        </p>
        {finding.asset_url && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--tweed)' }}>Asset concerné</p>
            <span className="text-sm font-mono px-2 py-1 rounded" style={{ background: 'var(--paper-deep)', color: 'var(--petrol)' }}>
              {finding.asset_url}
            </span>
          </div>
        )}
        {finding.evidence && finding.evidence.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--tweed)' }}>Preuves</p>
            <div className="space-y-2">
              {finding.evidence.map(ev => (
                <div key={ev.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: 'var(--paper-deep)', border: '1px solid var(--line)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--tweed)' }}>{ev.label}</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{ev.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--tweed)' }}>
            Action recommandée
          </p>
          <button
            className="btn-primary w-full justify-center text-sm"
          >
            Créer une opportunité →
          </button>
          <button
            className="btn-secondary w-full justify-center text-sm mt-2"
          >
            Ignorer ce finding
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FindingsPage() {
  const [activeTab, setActiveTab] = useState<FindingCategory>('visibility')
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)

  const filtered = mockFindings.filter(f => f.category === activeTab && !f.is_dismissed)
  const countByCategory = (cat: FindingCategory) => mockFindings.filter(f => f.category === cat && !f.is_dismissed).length

  return (
    <div className="flex min-h-screen relative">
      <div className={`flex-1 p-8 transition-all ${selectedFinding ? 'mr-[480px]' : ''}`}>
        <div className="mb-6">
          <p className="eyebrow mb-1">Analyse</p>
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--petrol-deep)' }}>
            Findings
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tweed)' }}>
            {mockFindings.filter(f => !f.is_dismissed).length} findings actifs · Détection automatique GSC + SERP + URL Inspection
          </p>
        </div>

        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--line)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const count = countByCategory(tab.id)
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px"
                style={{
                  borderColor: isActive ? 'var(--petrol)' : 'transparent',
                  color: isActive ? 'var(--petrol-deep)' : 'var(--tweed)',
                }}
              >
                <Icon size={14} />
                {tab.label}
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'var(--petrol)' : 'var(--copper-light)',
                    color: isActive ? 'var(--paper-cream)' : 'var(--copper)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--petrol)' }}>
                Aucun finding dans cette catégorie
              </p>
              <p className="text-sm" style={{ color: 'var(--tweed)' }}>
                Lancez une synchronisation GSC ou un snapshot SERP pour générer des findings.
              </p>
            </div>
          ) : (
            filtered.map(f => (
              <FindingRow
                key={f.id}
                finding={f}
                onSelect={setSelectedFinding}
              />
            ))
          )}
        </div>
      </div>

      {selectedFinding && (
        <FindingPanel
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      )}
    </div>
  )
}
