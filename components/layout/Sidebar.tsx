'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, AlertCircle, Zap, Map, PresentationIcon,
  Settings, ChevronDown, Globe, LogOut, Globe2, FileText, ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  disabled?: boolean
  soon?: boolean
}

type NavSection = {
  label: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    label: 'Pilotage',
    items: [
      { href: '/dashboard',     label: 'Command Center', icon: LayoutDashboard },
      { href: '/opportunities', label: 'Initiatives',    icon: Zap,            badge: 9 },
      { href: '/roadmap',       label: 'Roadmap',        icon: Map },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { href: '/findings', label: 'Evidence',  icon: AlertCircle, badge: 11 },
      { href: '/site',     label: 'Site',      icon: Globe2,      soon: true, disabled: true },
      { href: '/content',  label: 'Content',   icon: FileText,    soon: true, disabled: true },
      { href: '/commerce', label: 'Commerce',  icon: ShoppingBag, soon: true, disabled: true },
    ],
  },
  {
    label: 'Partage',
    items: [
      { href: '/executive', label: 'Vue Executive', icon: PresentationIcon },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-60 flex flex-col border-r z-30"
      style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--petrol)', color: 'var(--paper-cream)' }}>
            N
          </div>
          <div>
            <p className="font-display font-bold text-sm tracking-wider" style={{ color: 'var(--petrol)' }}>NOCTUA</p>
            <p className="text-xs" style={{ color: 'var(--tweed)' }}>Organic Search Ops</p>
          </div>
        </div>
      </div>

      {/* Workspace picker */}
      <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-paper" style={{ color: 'var(--ink)' }}>
          <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: 'var(--petrol)' }} />
            <span className="font-medium truncate max-w-[120px]">dogchef.be</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--tweed)' }} />
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {NAV.map((section, si) => (
          <div key={section.label} className={si > 0 ? 'mt-4' : ''}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--tweed)', opacity: 0.5 }}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, badge, disabled, soon }) => {
                const isActive = !disabled && (pathname === href || pathname.startsWith(href + '/'))
                if (disabled) {
                  return (
                    <div key={href} className="flex items-center justify-between px-3 py-2 rounded-lg opacity-35 cursor-default select-none">
                      <span className="flex items-center gap-3 text-sm font-medium" style={{ color: 'var(--tweed)' }}>
                        <Icon size={16} />
                        {label}
                      </span>
                      {soon && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide"
                          style={{ background: 'var(--line)', color: 'var(--tweed)' }}>
                          SOON
                        </span>
                      )}
                    </div>
                  )
                }
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive ? 'text-petrol-deep' : 'text-tweed hover:text-ink hover:bg-paper'
                    )}
                    style={isActive ? { background: 'var(--petrol-light)', color: 'var(--petrol-deep)', border: '1px solid var(--wash)' } : {}}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} />
                      {label}
                    </span>
                    {badge && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={isActive
                          ? { background: 'var(--petrol)', color: 'var(--paper-cream)' }
                          : { background: 'var(--copper-light)', color: 'var(--copper)' }
                        }>
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: 'var(--line)' }}>
        <Link href="/settings"
          className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            pathname === '/settings' ? 'text-petrol-deep' : 'text-tweed hover:text-ink hover:bg-paper'
          )}>
          <Settings size={16} />
          Paramètres
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left text-tweed hover:text-ink hover:bg-paper transition-all"
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}>
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
