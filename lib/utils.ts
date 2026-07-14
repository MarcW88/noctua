import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FindingCategory, FindingSeverity, InitiativeType, RoadmapHorizon } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number, compact = false): string {
  if (compact && n >= 1000) {
    return new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
  }
  return new Intl.NumberFormat('fr-FR').format(n)
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}

export function formatDelta(delta: number, unit = ''): string {
  const sign = delta >= 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}${unit}`
}

export function severityConfig(severity: FindingSeverity) {
  const map: Record<FindingSeverity, { label: string; color: string; bg: string; dot: string }> = {
    critical: { label: 'Critique', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
    high:     { label: 'Haute',    color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
    medium:   { label: 'Moyenne',  color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
    low:      { label: 'Faible',   color: 'text-petrol', bg: 'bg-petrol-light border-wash', dot: 'bg-petrol' },
    info:     { label: 'Info',     color: 'text-tweed', bg: 'bg-paper-deep border-line', dot: 'bg-tweed' },
  }
  return map[severity]
}

export function categoryConfig(category: FindingCategory) {
  const map: Record<FindingCategory, { label: string; icon: string }> = {
    visibility: { label: 'Visibilité',   icon: 'TrendingDown' },
    serp:       { label: 'SERP',         icon: 'Globe' },
    ai_search:  { label: 'AI Search',    icon: 'Sparkles' },
    pages:      { label: 'Pages',        icon: 'FileText' },
    indexation: { label: 'Indexation',   icon: 'SearchX' },
    technical:  { label: 'Technique',    icon: 'Settings' },
    content:    { label: 'Contenu',      icon: 'FileText' },
    commerce:   { label: 'Commerce',     icon: 'ShoppingBag' },
  }
  return map[category]
}

export function initiativeTypeConfig(type: InitiativeType) {
  const map: Record<InitiativeType, { label: string; color: string; bg: string }> = {
    quick_win:  { label: 'Quick win',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    core_fix:   { label: 'Core fix',   color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
    strategic:  { label: 'Strategic',  color: 'text-petrol-deep', bg: 'bg-petrol-light border-wash' },
    experiment: { label: 'Experiment', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  }
  return map[type]
}

export function horizonConfig(horizon: RoadmapHorizon) {
  const map: Record<RoadmapHorizon, { label: string; color: string; bg: string; border: string }> = {
    backlog: { label: 'Backlog', color: 'text-tweed', bg: 'bg-paper-deep', border: 'border-line' },
    now:     { label: 'Now',     color: 'text-copper', bg: 'bg-copper-light', border: 'border-copper' },
    next:    { label: 'Next',    color: 'text-petrol-deep', bg: 'bg-petrol-light', border: 'border-wash' },
    later:   { label: 'Later',  color: 'text-tweed-deep', bg: 'bg-paper-deep', border: 'border-line' },
  }
  return map[horizon]
}

export function effortLabel(score: number): string {
  if (score <= 2) return 'Faible'
  if (score <= 3) return 'Moyen'
  return 'Élevé'
}

export function impactLabel(score: number): string {
  if (score >= 4) return 'Élevé'
  if (score >= 3) return 'Moyen'
  return 'Faible'
}
