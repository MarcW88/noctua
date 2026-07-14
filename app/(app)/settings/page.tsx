'use client'

import { useState } from 'react'
import { Globe, Database, Users, Plug, CheckCircle, AlertCircle, ExternalLink, ChevronRight } from 'lucide-react'

const tabs = [
  { id: 'workspace', label: 'Workspace', icon: Globe },
  { id: 'sources', label: 'Sources de données', icon: Database },
  { id: 'competitors', label: 'Concurrents', icon: Users },
  { id: 'integrations', label: 'Intégrations', icon: Plug },
]

function ConnectionStatus({ connected, label }: { connected: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <CheckCircle size={14} style={{ color: '#16a34a' }} />
      ) : (
        <AlertCircle size={14} style={{ color: 'var(--copper)' }} />
      )}
      <span className="text-xs font-medium" style={{ color: connected ? '#16a34a' : 'var(--copper)' }}>
        {label}
      </span>
    </div>
  )
}

function WorkspaceTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--ink)' }}>Informations du workspace</h3>
        <div className="card p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--tweed)' }}>
              Nom du workspace
            </label>
            <input
              type="text"
              defaultValue="DogChef SEO"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--tweed)' }}>
              Domaine principal
            </label>
            <input
              type="text"
              defaultValue="dogchef.be"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--tweed)' }}>
              Marché principal
            </label>
            <select
              defaultValue="be"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none bg-paper"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <option value="be">Belgique 🇧🇪</option>
              <option value="fr">France 🇫🇷</option>
              <option value="nl">Pays-Bas 🇳🇱</option>
            </select>
          </div>
          <button className="btn-primary text-sm">Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

function SourcesTab() {
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
              Google Search Console
            </h3>
            <p className="text-xs" style={{ color: 'var(--tweed)' }}>
              Connectez votre propriété GSC pour importer les données Search Analytics et URL Inspection.
            </p>
          </div>
          <ConnectionStatus connected={false} label="Non connecté" />
        </div>
        <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
          <button className="btn-primary text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Connecter avec Google
          </button>
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
            className="btn-ghost text-sm">
            Ouvrir GSC <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
              Bright Data SERP
            </h3>
            <p className="text-xs" style={{ color: 'var(--tweed)' }}>
              API pour les snapshots SERP et la détection des AI Overviews.
            </p>
          </div>
          <ConnectionStatus connected={false} label="Non configuré" />
        </div>
        <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--tweed)' }}>
              API Token Bright Data
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none font-mono"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--tweed)' }}>
              Dataset ID
            </label>
            <input
              type="text"
              placeholder="gd_..."
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none font-mono"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>
          <button className="btn-primary text-sm">Enregistrer et tester</button>
        </div>
      </div>
    </div>
  )
}

function CompetitorsTab() {
  const competitors = ['dogfood.be', 'animalerie.be', 'pets-at-home.be']
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
          Concurrents suivis
        </h3>
        <p className="text-xs mb-4" style={{ color: 'var(--tweed)' }}>
          Les snapshots SERP compareront votre visibilité vs ces domaines.
        </p>
        <div className="space-y-2 mb-4">
          {competitors.map(comp => (
            <div key={comp} className="flex items-center justify-between px-4 py-2.5 rounded-lg border"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2">
                <Globe size={13} style={{ color: 'var(--petrol)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{comp}</span>
              </div>
              <button className="text-xs font-medium" style={{ color: '#dc2626' }}>Supprimer</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="nouveau-concurrent.be"
            className="flex-1 px-4 py-2.5 rounded-lg border text-sm outline-none"
            style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
          />
          <button className="btn-primary text-sm">Ajouter</button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('workspace')

  const tabContent: Record<string, React.ReactNode> = {
    workspace: <WorkspaceTab />,
    sources: <SourcesTab />,
    competitors: <CompetitorsTab />,
    integrations: (
      <div className="card p-8 text-center">
        <p className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--petrol)' }}>
          Intégrations à venir
        </p>
        <p className="text-sm" style={{ color: 'var(--tweed)' }}>
          Notion, Slack, Jira — disponible dans une prochaine version.
        </p>
      </div>
    ),
  }

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-6">
        <p className="eyebrow mb-1">Configuration</p>
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--petrol-deep)' }}>
          Paramètres
        </h1>
      </div>

      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--line)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px"
              style={{
                borderColor: activeTab === tab.id ? 'var(--petrol)' : 'transparent',
                color: activeTab === tab.id ? 'var(--petrol-deep)' : 'var(--tweed)',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabContent[activeTab]}
    </div>
  )
}
