'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  AlertCircle,
  Zap,
  Map,
  PresentationIcon,
  Settings,
  ChevronDown,
  Globe,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { href: '/findings', label: 'Evidence', icon: AlertCircle, badge: 11 },
  { href: '/opportunities', label: 'Initiatives', icon: Zap, badge: 9 },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/executive', label: 'Vue Executive', icon: PresentationIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-60 flex flex-col border-r z-30"
      style={{
        background: 'var(--paper-deep)',
        borderColor: 'var(--line)',
      }}
    >
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--petrol)', color: 'var(--paper-cream)' }}
          >
            N
          </div>
          <div>
            <p className="font-display font-bold text-sm tracking-wider" style={{ color: 'var(--petrol)' }}>
              NOCTUA
            </p>
            <p className="text-xs" style={{ color: 'var(--tweed)' }}>Organic Search Ops</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-paper"
          style={{ color: 'var(--ink)' }}
        >
          <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: 'var(--petrol)' }} />
            <span className="font-medium truncate max-w-[120px]">dogchef.be</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--tweed)' }} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'text-petrol-deep'
                  : 'text-tweed hover:text-ink hover:bg-paper'
              )}
              style={isActive ? {
                background: 'var(--petrol-light)',
                color: 'var(--petrol-deep)',
                border: '1px solid var(--wash)',
              } : {}}
            >
              <span className="flex items-center gap-3">
                <Icon size={16} />
                {label}
              </span>
              {badge && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={isActive
                    ? { background: 'var(--petrol)', color: 'var(--paper-cream)' }
                    : { background: 'var(--copper-light)', color: 'var(--copper)' }
                  }
                >
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: 'var(--line)' }}>
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            pathname === '/settings'
              ? 'text-petrol-deep'
              : 'text-tweed hover:text-ink hover:bg-paper'
          )}
        >
          <Settings size={16} />
          Paramètres
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left text-tweed hover:text-ink hover:bg-paper"
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
